import React, { Component } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../styles.less';
import { checkPhone } from '@/utils/validator';
import House from '@/components/form/house';

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
      if (fieldsValue.houseInfo && fieldsValue.houseInfo.length > 0) {
        const houseLen = fieldsValue.houseInfo.length;
        if (fieldsValue.houseInfo[houseLen - 1].level !== 'H') {
          message.info('请输入正确的住户号');
          return;
        }
        fieldsValue.houseId = fieldsValue.houseInfo[houseLen - 1].levelId;
        fieldsValue.houseFullName = fieldsValue.houseInfo.map((item: any) => item.name).join('/');
        fieldsValue.houseInfo = undefined;
      }
      fieldsValue.chargeDate = moment(fieldsValue.chargeDate).format('YYYY-MM-DD HH:mm:ss');
      if (dispatch) {
        dispatch({
          type: 'deposit/saveOrEdit',
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
      <Form className="submitFormBox form12">
        <FormItem label="缴费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('payerName', {
            rules: [
              {
                required: true,
                message: '请输入缴费人',
              },
            ],
          })(<Input placeholder="请输入缴费人" />)}
        </FormItem>
        <FormItem label="住房号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('houseInfo', {
            rules: [
              {
                required: true,
                message: '请选择住房号',
              },
            ],
          })(<House placeholder="请选择住房号" />)}
        </FormItem>

        <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('contactPhone', {
            rules: [
              {
                required: true,
                message: '请输入联系方式',
              },
              { validator: checkPhone },
            ],
          })(<Input placeholder="请输入联系方式" maxLength={11} />)}
        </FormItem>
        <FormItem label="押金金额（元）" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('paymentAmount', {
            rules: [
              {
                required: true,
                message: '请输入支付金额（元）',
              },
            ],
          })(<Input placeholder="请输入支付金额（元）" />)}
        </FormItem>
        <FormItem label="支付方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('collectMode', {
            rules: [
              {
                required: true,
                message: '请选择支付方式',
              },
            ],
          })(
            <Select placeholder="请选择支付方式">
              <Option value="1">现金</Option>
              <Option value="2">支付宝</Option>
              <Option value="3">银联</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="收据单号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('receiptNum', {
            rules: [
              {
                required: true,
                message: '请输入收据单号',
              },
            ],
          })(<Input placeholder="请输入收据单号" />)}
        </FormItem>

        <FormItem label="缴费时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('chargeDate')(
            <DatePicker style={{ width: '100%' }} placeholder="请选择缴费时间" />,
          )}
        </FormItem>
        <FormItem label="押金说明" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('remark')(<Input.TextArea rows={4} placeholder="请输入押金说明" />)}
        </FormItem>
        <Row className={styles.submitRow}>
          <Col span={18}></Col>
          <Col span={6}>
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
