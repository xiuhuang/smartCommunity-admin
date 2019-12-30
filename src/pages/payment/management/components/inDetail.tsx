import React, { Component } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { checkPhone } from '@/utils/validator';
import { StateType } from '../model';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  getData: () => void;
  handleVisible: () => void;
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
  };

  handleIsEdit = (flag?: boolean) => {
    this.setState({
      isEdit: !flag,
    });
  };

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
      record,
    } = this.props;

    const { isEdit } = this.state;
    let clumnCon;

    if (!isEdit) {
      clumnCon = (
        <Form className={styles.formBox}>
          <FormItem label="缴费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('title')(<div>{record.title}</div>)}
          </FormItem>

          <FormItem label="住房号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('name')(<div>{record.name}</div>)}
          </FormItem>

          <FormItem label="户主" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('phone')(<div>{record.remark}</div>)}
          </FormItem>

          <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.status}</div>)}
          </FormItem>
          <FormItem label="预）缴费月份" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.updateTime}</div>)}
          </FormItem>
          <FormItem label="支付金额（元）" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.id}</div>)}
          </FormItem>
          <FormItem label="支付方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.content}</div>)}
          </FormItem>
          <FormItem label="收据单号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.createTime}</div>)}
          </FormItem>
          <FormItem label="收费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.remark}</div>)}
          </FormItem>
          <FormItem label="缴费时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.remark}</div>)}
          </FormItem>
          <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no')(<div>{record.remark}</div>)}
          </FormItem>
        </Form>
      );
    } else {
      clumnCon = (
        <Form className={styles.formBox}>
          <FormItem label="缴费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('title')(<Input placeholder="请输入标题" />)}
          </FormItem>
          <FormItem label="住房号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem label="户主" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('createTime')(<Input placeholder="请输入联系电话" />)}
          </FormItem>
          <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('no', {
              rules: [{ validator: checkPhone }],
            })(<Input placeholder="请输入住户号" maxLength={11} />)}
          </FormItem>
          <FormItem label="（预）缴费月份" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('month')(
              <DatePicker style={{ width: '100%' }} showTime placeholder="请选择预约时间" />,
            )}
          </FormItem>
          <FormItem label="支付金额（元）" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('payment')(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="支付方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('type')(<Input placeholder="请输入备注" />)}
          </FormItem>
          <FormItem label="收据单号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('order')(<Input placeholder="请输入备注" />)}
          </FormItem>
          <FormItem label="收费人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('user')(<Input placeholder="请输入备注" />)}
          </FormItem>
          <FormItem label="缴费时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('time')(<Input placeholder="请输入备注" />)}
          </FormItem>
          <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark')(<Input placeholder="请输入处理意见" />)}
          </FormItem>
        </Form>
      );
    }

    return (
      <div>
        <div className={styles.resTagBtnBox}>
          {!isEdit ? (
            <Row>
              <Col span={18}></Col>
              <Col span={6}>
                <Button type="primary" onClick={() => this.handleIsEdit()}>
                  修改
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={18}></Col>
              <Col span={6}>
                <Button onClick={() => handleVisible()}>取消</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.submit()}>
                  保存
                </Button>
              </Col>
            </Row>
          )}
        </div>
        {clumnCon}
      </div>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
