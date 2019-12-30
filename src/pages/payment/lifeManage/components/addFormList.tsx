import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import House from '@/components/form/house';
import { StateType } from '../model';
import styles from '../styles.less';

const FormItem = Form.Item;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  getData: () => void;
  handleVisible: () => void;
  record: any;
  accountType: any;
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
    houseLevels: [],
  };

  componentWillMount() {
    this.getTableDetail();
  }

  getTableDetail = () => {
    const { dispatch, record } = this.props;

    const parms = {
      accountId: record.accountId,
    };
    if (record.accountId) {
      if (dispatch) {
        dispatch({
          type: 'lifeManage/getDetail',
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
    }
  };

  submit() {
    const { form, dispatch, getData, handleVisible, accountType, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      const houseLen = fieldsValue.houseInfo.length;
      if (fieldsValue.houseInfo[houseLen - 1].level !== 'H') {
        message.info('请输入正确的住户号');
        return;
      }
      fieldsValue.id = record.id;
      fieldsValue.houseId = fieldsValue.houseInfo[houseLen - 1].levelId;
      fieldsValue.houseFullName = fieldsValue.houseInfo.map((item: any) => item.name).join('/');
      fieldsValue.accountType = accountType;
      fieldsValue.houseInfo = undefined;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'lifeManage/addAcount',
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

    const { houseLevels } = this.state;

    return (
      <Form className={`${styles.formBox} form12`}>
        <FormItem label="户主名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('residentName', {
            initialValue: record.residentName,
            rules: [
              {
                required: true,
                message: '请输入户主名称!',
              },
            ],
          })(<Input placeholder="请输入户主名称" />)}
        </FormItem>

        <FormItem label="住户号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('houseInfo', {
            initialValue: houseLevels,
            rules: [
              {
                required: true,
                message: '请选择住户号!',
              },
            ],
          })(<House placeholder="请选择住户号" />)}
        </FormItem>
        <FormItem label="收费单位" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('paymentUnit', {
            initialValue: record.paymentUnit,
            rules: [
              {
                required: true,
                message: '请输入收费单位!',
              },
            ],
          })(<Input placeholder="请输入收费单位" />)}
        </FormItem>
        <FormItem label="客户编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('accountNumber', {
            initialValue: record.accountNumber,
            rules: [
              {
                required: true,
                message: '请输入客户编号!',
              },
            ],
          })(<Input placeholder="请输入客户编号" />)}
        </FormItem>
        <Row>
          <Col span={15}></Col>
          <Col span={9}>
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
