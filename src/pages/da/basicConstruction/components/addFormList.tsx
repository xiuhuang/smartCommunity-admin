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

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
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
class ServeFormList extends Component<FormListProps> {
  state = {};

  submit() {
    const { form, dispatch, getData, handleVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
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

  render() {
    const { form, handleVisible } = this.props;
    // const { visible } = this.state
    return (
      <Form className="form12">
        <FormItem label="社区服务建设名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入社区服务建设名称' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="服务设施类型" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择服务设施类型' }],
          })(
            <Select placeholder="请选择服务设施类型">
              <Option value="1">基础通用型设施建筑</Option>
              <Option value="2">公共停车场（库）</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="负责人" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('pic', {
            rules: [{ max: 100, message: '最多只能输入100个字符' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="联系方式" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('contactTel', {
            rules: [{ max: 100, message: '最多只能输入100个字符' }, { validator: checkPhone }],
          })(<Input maxLength={11} />)}
        </FormItem>
        <FormItem label="地址" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('address', {
            rules: [
              { required: true, message: '请输入地址' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="经纬度坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('coordinate', {
            rules: [
              { required: true, message: '请输入经纬度坐标' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input placeholder="格式:(134 N, 45 E )" />)}
        </FormItem>
        <FormItem label="停车位" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('carPark', {
            rules: [{ max: 100, message: '最多只能输入100个字符' }],
          })(<Input placeholder="只有停车库、露天停车场等设施类型需要填" />)}
        </FormItem>
        <FormItem label="服务时间" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('serviceTime', {
            rules: [{ max: 100, message: '最多只能输入100个字符' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="服务范围描述" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('remark', {
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
  }
}

export default Form.create<FormListProps>()(ServeFormList);
