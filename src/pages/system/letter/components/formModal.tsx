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
  roleId?: string;
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

  render() {
    const {
      visible,
      handleVisible,
      form: { getFieldDecorator },
      roleId,
    } = this.props;

    return (
      <Modal
        visible={visible}
        title={roleId ? '编辑角色' : '添加角色'}
        okText="提交"
        cancelText="取消"
        width={750}
        onCancel={() => handleVisible()}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem label="角色名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('facilityName', {
                  rules: [{ required: true, whitespace: true, message: '请输入角色名称' }],
                })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="角色说明" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('facilityType1', {
                  rules: [{ required: false, whitespace: true, message: '请选择角色说明' }],
                })(<Input.TextArea rows={4} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FormModalProps>()(FormModal);
