import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';

const FormItem = Form.Item;

interface FormModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  roleInfo?: any;
  // roleName?: any;
  // remark?: any;
  visible: boolean;
  handleVisible: () => void;
  getData: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    role,
    loading,
  }: {
    role: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    role,
    loading: loading.models.role,
  }),
)
class FormModal extends Component<FormModalProps> {
  state = {};

  handleOk = () => {
    const { form, dispatch, roleInfo, handleVisible, getData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (roleInfo && roleInfo.roleId) {
        fieldsValue.roleId = roleInfo.roleId;
      }
      if (err) return;
      if (roleInfo && roleInfo.roleId) {
        if (dispatch) {
          dispatch({
            type: 'role/editRole',
            payload: {
              ...fieldsValue,
            },
            callback: (res: any) => {
              if (res.code === '200') {
                handleVisible();
                getData();
              }
            },
          });
        }
      } else if (dispatch) {
        dispatch({
          type: 'role/addRole',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              handleVisible();
              getData();
            }
          },
        });
      }
    });
  };

  render() {
    const {
      visible,
      handleVisible,
      form: { getFieldDecorator },
      roleInfo,
    } = this.props;
    return (
      <Modal
        visible={visible}
        title={roleInfo && roleInfo.roleId ? '编辑角色' : '添加角色'}
        okText="提交"
        cancelText="取消"
        onOk={this.handleOk}
        width={750}
        onCancel={() => handleVisible()}
        destroyOnClose
      >
        <Form className="form12">
          <Row>
            <Col span={24}>
              <FormItem label="角色名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('roleName', {
                  initialValue: (roleInfo && roleInfo.roleName) || null,
                  rules: [{ required: true, whitespace: true, message: '请输入角色名称' }],
                })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="角色说明" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('remark', {
                  initialValue: (roleInfo && roleInfo.remark) || null,
                  rules: [{ required: false, whitespace: true, message: '请输入角色说明' }],
                })(<Input.TextArea rows={4} placeholder="请输入角色说明" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FormModalProps>()(FormModal);
