import React, { Component } from 'react';
import { Button, Row, Col, Form, message, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '../model';
import { checkOrderNum } from '@/utils/validator';

const FormItem = Form.Item;
interface DepartProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  selectedNodes: any;
  edithandleCancel: () => void;
  initGetTreeData: () => void;
  upTableDate: (updateParms: any) => void;
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
class EditFormList extends Component<DepartProps> {
  state = {};

  editSubmit() {
    const {
      form,
      dispatch,
      selectedNodes,
      upTableDate,
      edithandleCancel,
      initGetTreeData,
    } = this.props;
    const { deptId } = selectedNodes;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.deptId = deptId;
      const updateParms = {
        deptId,
      };
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'department/edit',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              upTableDate(updateParms);
              edithandleCancel();
              initGetTreeData();
            }
          },
        });
      }
    });
  }

  render() {
    const { form, selectedNodes, edithandleCancel } = this.props;
    return (
      <Form className="form12">
        <FormItem label="部门名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('deptName', {
            initialValue: selectedNodes ? selectedNodes.deptName : null,
            rules: [{ required: true, message: '请输入部门名称' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="部门经理/总监" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('leader', {
            initialValue: selectedNodes ? selectedNodes.leader : null,
            rules: [{ required: true, message: '请输入部门经理/总监' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('orderNum', {
            initialValue: selectedNodes ? selectedNodes.orderNum : null,
            rules: [
              {
                validator: checkOrderNum,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('remark', {
            initialValue: selectedNodes ? selectedNodes.remark : null,
          })(<Input />)}
        </FormItem>
        <Row>
          <Col span={16}></Col>
          <Col span={6}>
            <Button
              onClick={() => {
                edithandleCancel();
              }}
            >
              取消
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.editSubmit()}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create<DepartProps>()(EditFormList);
