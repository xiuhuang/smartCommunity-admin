import React, { Component } from 'react';
import { Modal, Button, Input, Icon, Form, message, Spin } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import styles from '../styles.less';

const renderFieldsValue = (fieldsValue: any) => {
  if (!fieldsValue || !fieldsValue.values) {
    return [];
  }
  const { values } = fieldsValue;
  const keys = Object.keys(values);
  const newValue = keys.map((id: string) => {
    const value = values[id];
    if (id.indexOf('f2e_') === 0) {
      value.id = undefined;
    }
    return value;
  });
  return newValue;
};

interface CauseTagProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  reservation?: StateType;
  visible: boolean;
  handleVisible: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    reservation,
    loading,
  }: {
    reservation: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    reservation,
    loading: loading.models.reservation,
  }),
)
class CauseTag extends Component<CauseTagProps> {
  state = {
    isEdit: false,
  };

  componentWillMount() {
    this.getCauseList();
  }

  resetKeys = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['keys']);
  };

  getCauseList = (isResetKeys?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'reservation/fetchCauseTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
        callback: (res: any) => {
          if (res.code === '200' && isResetKeys) {
            this.resetKeys();
          }
        },
      });
    }
  };

  handleIsEdit = (flag?: boolean) => {
    const { form } = this.props;
    if (flag) {
      form.resetFields();
    }
    this.setState({
      isEdit: !!flag,
    });
  };

  save = () => {
    const { form, dispatch, handleVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.info('请输入所有的分组名称');
        return;
      }
      const params = renderFieldsValue(fieldsValue);
      if (dispatch) {
        dispatch({
          type: 'reservation/submitCauseTag',
          payload: params,
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              this.getCauseList();
              this.setState({
                isEdit: false,
              });
              handleVisible();
            }
          },
        });
      }
    });
  };

  addTag = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const newKeys = [
      {
        id: `f2e_${Math.floor(Math.random() * 100000)}`,
      },
    ];
    form.setFieldsValue({
      keys: [...keys, ...newKeys],
    });
  };

  removeTag = (k: any) => {
    const { dispatch, form } = this.props;

    if (k.vrId) {
      Modal.confirm({
        title: '删除来访事由',
        content: (
          <div>
            您确定要删除来访事由：<a>{k.vrName}</a>
          </div>
        ),
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          if (dispatch) {
            dispatch({
              type: 'reservation/removeCauseTag',
              payload: {
                ids: [k.vrId],
              },
              callback: (res: any) => {
                if (res.code === '200') {
                  message.success(res.message);
                  this.getCauseList(true);
                }
              },
            });
          }
        },
      });
    } else {
      const keys = form.getFieldValue('keys');
      form.setFieldsValue({
        keys: keys.filter((key: any) => key.id !== k.id),
      });
    }
  };

  renderFormItems = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      reservation,
    } = this.props;
    const { isEdit } = this.state;
    const causeTagList = reservation && reservation.causeTagList ? reservation.causeTagList : [];
    let formItems = [];

    getFieldDecorator('keys', { initialValue: causeTagList.length > 0 ? causeTagList : [] });
    const keys = getFieldValue('keys');

    if (isEdit) {
      formItems = keys.map((k: any, index: number) => (
        <tr key={k.id}>
          <td>
            {getFieldDecorator(`values[${k.id}][id]`, {
              initialValue: keys[index].id,
            })(<Input style={{ display: 'none' }} />)}

            {getFieldDecorator(`values[${k.id}][vrId]`, {
              initialValue: keys[index].vrId,
            })(<Input style={{ display: 'none' }} />)}

            {getFieldDecorator(`values[${k.id}][vrName]`, {
              initialValue: keys[index].vrName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入分组名称',
                },
              ],
            })(<Input />)}
          </td>
          <td>
            {getFieldDecorator(`values[${k.id}][remark]`, {
              initialValue: keys[index].remark,
              rules: [
                {
                  whitespace: true,
                  message: '请输入备注',
                },
              ],
            })(<Input />)}
            <span className={styles.closeIcon} onClick={() => this.removeTag(k)}>
              <Icon type="close" />
            </span>
          </td>
        </tr>
      ));
    } else {
      formItems = causeTagList.map((item: any) => (
        <tr key={item.id}>
          <td>{item.vrName}</td>
          <td>{item.remark}</td>
        </tr>
      ));
    }
    return formItems;
  };

  handleVisible = () => {
    const { handleVisible } = this.props;
    this.setState({
      isEdit: false,
    });
    handleVisible();
  };

  render() {
    const { visible, loading } = this.props;
    const { isEdit } = this.state;

    return (
      <Modal
        visible={visible}
        title="编辑来访事由"
        width={600}
        okText="提交"
        cancelText="取消"
        onCancel={() => this.handleVisible()}
        className={styles.residentTagModal}
        footer={null}
      >
        <div className={styles.resTagBtnBox}>
          {!isEdit && (
            <Button type="primary" onClick={() => this.handleIsEdit(true)}>
              编辑
            </Button>
          )}
          {isEdit && <Button onClick={() => this.handleIsEdit()}>取消</Button>}
          {isEdit && (
            <Button type="primary" onClick={this.save}>
              保存
            </Button>
          )}
        </div>
        <Form>
          <Spin spinning={loading}>
            <div className={styles.resTagCon}>
              <table className={styles.resigdentTagTable}>
                <thead>
                  <tr>
                    <th>来访事由名称</th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>{this.renderFormItems()}</tbody>
              </table>
              <div className={styles.plusBtnBox}>
                {isEdit && (
                  <Button onClick={this.addTag}>
                    <Icon type="plus" />
                  </Button>
                )}
              </div>
            </div>
          </Spin>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<CauseTagProps>()(CauseTag);
