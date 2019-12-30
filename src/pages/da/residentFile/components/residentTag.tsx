import React, { Component } from 'react';
import { Modal, Button, Input, Icon, Form, message } from 'antd';
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

interface ResidentTagProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  residentFile?: StateType;
  visible: boolean;
  handleVisible: () => void;
  getResidentList: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    residentFile,
    loading,
  }: {
    residentFile: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    residentFile,
    loading: loading.models.residentFile,
  }),
)
class ResidentTag extends Component<ResidentTagProps> {
  state = {
    isEdit: false,
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

  handleVisible = () => {
    const { handleVisible } = this.props;
    this.setState({
      isEdit: false,
    });
    handleVisible();
  };

  save = () => {
    const { form, dispatch, handleVisible, getResidentList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.info('请输入所有的类型名称');
        return;
      }
      const params = renderFieldsValue(fieldsValue);
      if (dispatch) {
        dispatch({
          type: 'residentFile/submitResidentTag',
          payload: {
            tags: [...params],
            type: '0',
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              getResidentList();
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
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter((key: any) => key.id !== k.id),
    });
  };

  renderFormItems = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      residentFile,
    } = this.props;
    const { isEdit } = this.state;
    const residentTagList =
      residentFile && residentFile.residentTagList ? residentFile.residentTagList : [];
    let formItems = [];

    getFieldDecorator('keys', { initialValue: residentTagList.length > 0 ? residentTagList : [] });
    const keys = getFieldValue('keys');

    if (isEdit) {
      formItems = keys.map((k: any, index: number) => (
        <tr key={k.id}>
          <td>
            {getFieldDecorator(`values[${k.id}][id]`, {
              initialValue: keys[index].id,
            })(<Input style={{ display: 'none' }} />)}

            {getFieldDecorator(`values[${k.id}][tagId]`, {
              initialValue: keys[index].tagId,
            })(<Input style={{ display: 'none' }} />)}

            {getFieldDecorator(`values[${k.id}][tagName]`, {
              initialValue: keys[index].tagName,
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
      if (residentTagList.length === 0) {
        return (
          <tr>
            <td colSpan={2}>暂无数据</td>
          </tr>
        );
      }
      formItems = residentTagList.map((item: any) => (
        <tr key={item.tagId}>
          <td>{item.tagName}</td>
          <td>{item.remark}</td>
        </tr>
      ));
    }
    return formItems;
  };

  render() {
    const { visible } = this.props;
    const { isEdit } = this.state;

    return (
      <Modal
        visible={visible}
        title="居民标签管理"
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
        </Form>
      </Modal>
    );
  }
}

export default Form.create<ResidentTagProps>()(ResidentTag);
