import React, { Component } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../styles.less';

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
    affairsReport,
    loading,
  }: {
    affairsReport: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    affairsReport,
    loading: loading.models.affairsReport,
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
          type: 'affairsReport/editReport',
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
      <Form className={`${styles.formBox} form12`}>
        <FormItem label="缴费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入缴费人!',
              },
            ],
          })(<Input placeholder="请输入标题" />)}
        </FormItem>

        <FormItem label="住房号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入住房号!',
              },
            ],
          })(<Input placeholder="请输入住房号" />)}
        </FormItem>
        <FormItem label="户主" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('phone')(<Input placeholder="请输入联系电话" />)}
        </FormItem>
        <FormItem label="联系电话" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('phone')(<Input placeholder="请输入联系电话" />)}
        </FormItem>

        <FormItem label="房屋面积" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('no')(<Input placeholder="请输入住户号" />)}
        </FormItem>
        <FormItem label="物业费收费标准" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('no')(<Input placeholder="请输入住户号" />)}
        </FormItem>

        <FormItem label="（预）缴费月份" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: '请选择缴费月份!',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} showTime placeholder="请选择预约时间" />)}
        </FormItem>

        <FormItem label="支付金额（元）" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('image', {
            rules: [
              {
                required: true,
                message: '请输入支付金额!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="支付方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('image', {
            rules: [
              {
                required: true,
                message: '请选择支付方式!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="收据单号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('remark', {
            rules: [
              {
                required: true,
                message: '请输入收据单号!',
              },
            ],
          })(<Input placeholder="请输入备注" />)}
        </FormItem>
        <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
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
