import React, { Component } from 'react';
import { Modal, Button, Input, Icon, Form, message, Spin } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../../model';
import styles from '../../styles.less';

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

interface FacilityTagProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  basicFacility?: StateType;
  visible: boolean;
  handleVisible: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    basicFacility,
    loading,
  }: {
    basicFacility: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicFacility,
    loading: loading.models.basicFacility,
  }),
)
class FacilityTag extends Component<FacilityTagProps> {
  state = {
    isEdit: false,
  };

  componentWillMount() {
    this.getFacilityList();
  }

  resetKeys = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['keys']);
  };

  getFacilityList = (isResetKeys?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchTypeBrandTag',
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
        message.info('请输入所有的类型名称');
        return;
      }
      const params = renderFieldsValue(fieldsValue);
      if (dispatch) {
        dispatch({
          type: 'basicFacility/submitTypeBrandTag',
          payload: {
            deviceTypeObjs: [...params],
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              this.getFacilityList();
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
    const { form, dispatch } = this.props;
    if (k.deviceTypeId) {
      Modal.confirm({
        title: '删除设备类型',
        content: (
          <div>
            您确定要删除设备类型：<a>{k.deviceTypeName}</a>
          </div>
        ),
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          if (dispatch) {
            dispatch({
              type: 'basicFacility/removeTypeBrandTag',
              payload: {
                id: k.id,
                deviceTypeId: k.deviceTypeId,
              },
              callback: (res: any) => {
                if (res.code === '200') {
                  message.success(res.message);
                  this.getFacilityList(true);
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
      basicFacility,
    } = this.props;
    const { isEdit } = this.state;
    const typeBrandTagList =
      basicFacility && basicFacility.typeBrandTagList ? basicFacility.typeBrandTagList : [];
    let formItems = [];

    getFieldDecorator('keys', {
      initialValue: typeBrandTagList.length > 0 ? typeBrandTagList : [],
    });
    const keys = getFieldValue('keys');

    if (isEdit) {
      formItems = keys.map((k: any, index: number) => (
        <tr key={k.id}>
          <td>
            {getFieldDecorator(`values[${k.id}][id]`, {
              initialValue: keys[index].id,
            })(<Input style={{ display: 'none' }} />)}
            {getFieldDecorator(`values[${k.id}][deviceTypeId]`, {
              initialValue: keys[index].deviceTypeId,
            })(<Input style={{ display: 'none' }} />)}

            {getFieldDecorator(`values[${k.id}][deviceTypeName]`, {
              initialValue: keys[index].deviceTypeName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入类型名称',
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
      formItems = typeBrandTagList.map((item: any) => (
        <tr key={item.id}>
          <td>{item.deviceTypeName}</td>
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
        title="设备类型管理"
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
                    <th>类型名称</th>
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

export default Form.create<FacilityTagProps>()(FacilityTag);
