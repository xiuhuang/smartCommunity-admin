import React, { Component } from 'react';
import { Form, Select, Input, message, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import { checkPhone } from '@/utils/validator';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface InfoFormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  record?: any;
  isEdit?: any;
  getData: () => void;
  handleVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    basicInfo,
    loading,
  }: {
    basicInfo: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicInfo,
    loading: loading.models.basicInfo,
  }),
)
class InfoFormList extends Component<InfoFormListProps> {
  state = {};

  submit() {
    const { form, dispatch, getData, handleVisible, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.id = record.id;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'basicInfo/addServeData',
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

  renderFormItems = () => {
    const { form, isEdit, record, handleVisible } = this.props;
    let formItems;
    if (isEdit) {
      formItems = (
        <Form className={`${styles.editFormList} form12`}>
          <FormItem label="社区服务建设名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('name', {
              initialValue: record.name,
              rules: [
                { required: true, message: '请输入社区服务建设名称' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="服务设施类型" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('type', {
              initialValue: record.type,
              rules: [{ required: true, message: '服务设施类型' }],
            })(
              <Select placeholder="请选择服务设施类型">
                <Option value="1">基础通用型设施建筑</Option>
                <Option value="2">公共停车场（库）</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="负责人" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('pic', {
              initialValue: record.pic,
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="联系方式" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('contactTel', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }, { validator: checkPhone }],
              initialValue: record.contactTel,
            })(<Input maxLength={11} />)}
          </FormItem>
          <FormItem label="地址" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('address', {
              rules: [
                { required: true, message: '请输入地址' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
              initialValue: record.address,
            })(<Input />)}
          </FormItem>
          <FormItem label="经纬度坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('coordinate', {
              rules: [
                { required: true, message: '请输入经纬度坐标' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
              initialValue: record.coordinate,
            })(<Input placeholder="格式:(134 N, 45 E )" />)}
          </FormItem>
          <FormItem label="停车位" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('carPark', {
              initialValue: record.carPark,
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input placeholder="只有停车库、露天停车场等设施类型需要填" />)}
          </FormItem>
          <FormItem label="服务时间" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('serviceTime', {
              initialValue: record.serviceTime,
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="服务范围描述" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('remark', {
              initialValue: record.remark,
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <Row className={styles.footerBtn}>
            <Col span={16}></Col>
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
    } else {
      formItems = (
        <Form className={`${styles.infoFormList} form12`}>
          <FormItem label="社区服务建设名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.name}</span>
          </FormItem>
          <FormItem label="服务设施类型" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>
              {record.type && record.type === '2' ? '公共停车场（库）' : '基础通用型设施建筑'}
            </span>
          </FormItem>
          <FormItem label="负责人" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.pic}</span>
          </FormItem>
          <FormItem label="联系方式" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.contactTel}</span>
          </FormItem>
          <FormItem label="地址" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.address}</span>
          </FormItem>
          <FormItem label="经纬度坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.coordinate}</span>
          </FormItem>
          <FormItem label="停车位" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.carPark ? record.carPark : '暂无'}</span>
          </FormItem>
          <FormItem label="服务时间" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.serviceTime}</span>
          </FormItem>
          <FormItem label="服务范围描述" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            <span>{record.remark}</span>Î
          </FormItem>
        </Form>
      );
    }
    return formItems;
  };

  render() {
    // const { visible } = this.state
    return <div>{this.renderFormItems()}</div>;
  }
}

export default Form.create<InfoFormListProps>()(InfoFormList);
