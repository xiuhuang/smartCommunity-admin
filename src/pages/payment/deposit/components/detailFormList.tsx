import React, { Component } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import House from '@/components/form/house';
import { StateType } from '../model';
import { checkPhone } from '@/utils/validator';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  getData: () => void;
  handleDetailVisible: () => void;
  record: any;
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
  state = {
    isEdit: false,
    houseLevels: [],
  };

  componentWillMount() {
    this.getTableDetail();
  }

  getTableDetail = () => {
    const { dispatch, record } = this.props;

    const parms = {
      depositId: record.depositId,
    };
    if (dispatch) {
      dispatch({
        type: 'deposit/depositDetail',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              houseLevels: res.data.houseLevels,
            });
          }
        },
      });
    }
  };

  handleIsEdit = (flag?: boolean) => {
    this.setState({
      isEdit: !flag,
    });
  };

  submit() {
    const { form, dispatch, getData, handleDetailVisible, record } = this.props;
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
        fieldsValue.depositId = record.depositId;
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
              handleDetailVisible();
              getData();
            }
          },
        });
      }
    });
  }

  backPay() {
    const { dispatch, getData, handleDetailVisible, record } = this.props;

    const parms = {
      depositId: record.depositId,
    };
    if (dispatch) {
      dispatch({
        type: 'deposit/refund',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
            handleDetailVisible();
            getData();
          }
        },
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleDetailVisible,
      record,
    } = this.props;

    const { isEdit, houseLevels } = this.state;

    let clumnCon;
    if (!isEdit) {
      clumnCon = (
        <Form className={`${styles.formBox} form12`}>
          <FormItem label="缴费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('title')(<div>{record.payerName}</div>)}
          </FormItem>
          <FormItem label="住房号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('houseFullName')(<div>{record.houseFullName}</div>)}
          </FormItem>
          <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('contactPhone')(<div>{record.contactPhone}</div>)}
          </FormItem>
          <FormItem label="押金金额（元）" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('paymentAmount')(
              <div>{record.paymentAmount ? record.paymentAmount : '--'}</div>,
            )}
          </FormItem>
          <FormItem label="支付方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('collectMode')(<div>{record.collectMode}</div>)}
          </FormItem>
          <FormItem label="收据单号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('receiptNum')(<div>{record.receiptNum}</div>)}
          </FormItem>
          <FormItem label="收费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('collectPerson')(
              <div>{record.collectPerson ? record.collectPerson : '--'}</div>,
            )}
          </FormItem>
          <FormItem label="押金状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('status')(<div>{record.status === '0' ? '未退还' : '已退还'}</div>)}
          </FormItem>
          <FormItem label="退款人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('refundPerson')(<div>{record.refundPerson}</div>)}
          </FormItem>
          <FormItem label="缴费时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('chargeDate')(<div>{record.chargeDate}</div>)}
          </FormItem>
          <FormItem label="押金说明" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark')(<div>{record.remark}</div>)}
          </FormItem>
        </Form>
      );
    } else {
      clumnCon = (
        <Form className={`${styles.formBox} form12`}>
          <FormItem label="缴费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('payerName', {
              initialValue: record.payerName,
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
              initialValue: houseLevels || [],
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
              initialValue: record.contactPhone,
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
              initialValue: record.paymentAmount,
              rules: [
                {
                  required: true,
                  message: '请输入押金金额（元）',
                },
              ],
            })(<Input placeholder="请输入押金金额（元）" />)}
          </FormItem>
          <FormItem label="支付方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('collectMode', {
              initialValue: record.collectMode,
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
              initialValue: record.receiptNum,
              rules: [
                {
                  required: true,
                  message: '请输入收据单号',
                },
              ],
            })(<Input placeholder="请输入收据单号" />)}
          </FormItem>
          <FormItem label="收费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('collectPerson', {
              initialValue: record.collectPerson,
            })(<Input placeholder="请输入收费人" />)}
          </FormItem>
          <FormItem label="退款人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('refundPerson', {
              initialValue: record.refundPerson,
            })(<Input placeholder="退款人" />)}
          </FormItem>
          <FormItem label="缴费时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('chargeDate', {
              initialValue: record.chargeDate ? moment(record.chargeDate) : null,
            })(<DatePicker placeholder="请输入备注" />)}
          </FormItem>
          <FormItem label="押金说明" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark', {
              initialValue: record.payerName,
            })(<Input placeholder="请输入处理意见" />)}
          </FormItem>
        </Form>
      );
    }

    let btnCon;
    if (!isEdit && record.status === '0') {
      btnCon = (
        <Row>
          <Col span={16}></Col>
          <Col span={3} className="topBtn">
            <Button type="primary" onClick={() => this.handleIsEdit()}>
              修改
            </Button>
          </Col>
          <Col span={3} className="topBtn">
            <Button className="orangeBtn btnStyle" onClick={() => this.backPay()}>
              退还押金
            </Button>
          </Col>
        </Row>
      );
    } else if (isEdit && record.status === '0') {
      btnCon = (
        <Row>
          <Col span={18}></Col>
          <Col span={6}>
            <Button onClick={() => handleDetailVisible()}>取消</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.submit()}>
              保存
            </Button>
          </Col>
        </Row>
      );
    }

    return (
      <div>
        <div className={styles.resTagBtnBox}>{btnCon}</div>
        {clumnCon}
      </div>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
