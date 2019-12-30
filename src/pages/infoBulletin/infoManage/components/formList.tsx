import React, { Component } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  // DatePicker,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  getData: () => void;
  handleVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    affairsComplaint,
    loading,
  }: {
    affairsComplaint: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    affairsComplaint,
    loading: loading.models.affairsComplaint,
  }),
)
class FormList extends Component<FormListProps> {
  state = {};

  submit() {
    const { form, dispatch, getData, handleVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.time) {
        fieldsValue.time = moment(fieldsValue.time).format('YYYY-MM-DD HH:mm:ss');
      }
      if (dispatch) {
        dispatch({
          type: 'affairsComplaint/editReport',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              handleVisible();
              getData();
            }
          },
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleVisible,
    } = this.props;

    return (
      <Form className={styles.formBox}>
        <FormItem label="投诉标题" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('title')(<Input placeholder="请输入投诉标题" />)}
        </FormItem>

        <FormItem label="姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
        </FormItem>

        <FormItem label="联系电话" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('phone')(<Input placeholder="请输入联系电话" />)}
        </FormItem>

        <FormItem label="住户号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('no')(<Input placeholder="请输入住户号" />)}
        </FormItem>

        <FormItem label="图片" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('image')(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('remark')(<Input.TextArea rows={4} placeholder="请输入备注" />)}
        </FormItem>

        <FormItem label="投诉内容" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('content')(<Input.TextArea rows={4} placeholder="请输入投诉内容" />)}
        </FormItem>

        <FormItem label="处理状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('status')(
            <Select placeholder="请选择处理状态">
              <Option value="1">待处理</Option>
              <Option value="2">已处理</Option>
            </Select>,
          )}
        </FormItem>

        <FormItem label="处理意见" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('judgment')(<Input.TextArea rows={4} placeholder="请输入处理意见" />)}
        </FormItem>

        <Row>
          <Col span={6}></Col>
          <Col span={14}>
            <Button onClick={() => handleVisible()}>取消</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.submit()}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
