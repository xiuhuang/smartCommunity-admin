import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../styles.less';

const FormItem = Form.Item;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  getData: () => void;
  handleVisible: () => void;
  handleSettingVisible: () => void;
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
    const { form, dispatch, getData, handleSettingVisible } = this.props;
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
              handleSettingVisible();
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
      handleSettingVisible,
    } = this.props;

    return (
      <Form className={`${styles.formBox} form12`}>
        <h4>物业费收费标准</h4>
        <Row justify="space-between">
          <Col span={20}></Col>
          <Col span={4}>
            <Button className="orangeBtn btnStyle">修改</Button>
          </Col>
        </Row>
        <FormItem label="缴费标准" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入缴费标准!',
              },
            ],
          })(<Input placeholder="请输入缴费标准" />)}
        </FormItem>
        <FormItem label="收款账号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入收款账号!',
              },
            ],
          })(<Input placeholder="请输入收款账号" />)}
        </FormItem>
        <FormItem label="账单汇总日期" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入账单汇总日期!',
              },
            ],
          })(<Input placeholder="请输入账单汇总日期" />)}
        </FormItem>
        <h4>物业费优惠策略</h4>
        <FormItem label="优惠时间段" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: '请选择优惠时间段!',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} showTime placeholder="请选择预约时间" />)}
        </FormItem>
        <FormItem label="优惠费率（%）" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('image')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('judgment')(<Input.TextArea rows={4} placeholder="请输入处理意见" />)}
        </FormItem>
        <Row>
          <Col span={6}></Col>
          <Col span={14}>
            <Button onClick={() => handleSettingVisible()}>取消</Button>
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
