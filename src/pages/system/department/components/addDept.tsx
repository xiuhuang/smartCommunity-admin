import React, { Component } from 'react';
import { Button, Row, Col, Form, message, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '../model';
import { checkOrderNum } from '@/utils/validator';

const FormItem = Form.Item;
interface DeptProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  handleCancel: () => void;
  getTreeData: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    department,
    loading,
  }: {
    department: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    department,
    loading: loading.models.department,
  }),
)
class FormList extends Component<DeptProps> {
  state = {};

  handleVisible = (flag?: boolean) => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  submitPartment() {
    const { form, dispatch, handleCancel, getTreeData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'department/add',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              handleCancel();
              getTreeData();
            }
          },
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    return (
      <Form className="form12">
        <FormItem label="部门名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('deptName', {
            rules: [{ required: true, message: '请输入部门名称' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="部门经理/总监" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('leader', {
            rules: [{ required: true, message: '请输入部门经理/总监' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('orderNum', {
            rules: [
              {
                validator: checkOrderNum,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('remark', {})(<Input />)}
        </FormItem>
        <Row>
          <Col span={16}></Col>
          <Col span={6}>
            <Button
              onClick={() => {
                this.handleVisible();
              }}
            >
              取消
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.submitPartment()}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create<DeptProps>()(FormList);
