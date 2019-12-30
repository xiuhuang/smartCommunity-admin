import React, { Component } from 'react';
import { Button, Row, Col, Form, Input, message, Spin } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
// import Router from 'umi/router';
import { pubkey } from '@/utils/utils';
import styles from '../style.less';
import { checkPassword, checkNewPassword, checkConfirmPassword } from '@/utils/validator';
import { StateType } from '../model';

const FormItem = Form.Item;
const { JSEncrypt } = require('jsencrypt');

interface ResetPwdProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
}

@connect(
  ({
    resetPwd,
    loading,
  }: {
    resetPwd: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    resetPwd,
    loading: loading.models.resetPwd,
  }),
)
class ResetPwd extends Component<ResetPwdProps> {
  state = {};

  goLogin = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  submit = (e: any) => {
    const { form, dispatch } = this.props;
    const encrypt = new JSEncrypt();

    e.preventDefault();
    encrypt.setPublicKey(pubkey);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.newPassword !== fieldsValue.confirmPassword) {
        message.info('新密码和确认密码必须一致');
        return;
      }

      fieldsValue.oldPassword = encrypt.encrypt(fieldsValue.oldPassword);
      fieldsValue.newPassword = encrypt.encrypt(fieldsValue.newPassword);
      fieldsValue.confirmPassword = encrypt.encrypt(fieldsValue.confirmPassword);
      if (dispatch) {
        dispatch({
          type: 'resetPwd/resetPwd',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              // Router.push('/resetPwd/vote');
              this.goLogin();
            }
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      loading,
    } = this.props;
    return (
      <div className={styles.vote}>
        <Spin spinning={!!loading}>
          <Form className={styles.formWarp}>
            <FormItem label="原密码" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入原密码',
                  },
                  {
                    validator: checkPassword,
                  },
                ],
              })(<Input placeholder="请输入原密码" maxLength={18} type="password" />)}
            </FormItem>
            <FormItem label="新密码" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入新密码',
                  },
                  {
                    validator: (rule, value, callback) =>
                      checkNewPassword(rule, value, callback, getFieldValue('oldPassword')),
                  },
                ],
              })(<Input placeholder="请输入新密码" maxLength={18} type="password" />)}
            </FormItem>
            <FormItem label="确认密码" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '再次输入新密码',
                  },
                  {
                    validator: (rule, value, callback) =>
                      checkConfirmPassword(rule, value, callback, getFieldValue('newPassword')),
                  },
                ],
              })(<Input placeholder="再次输入新密码" maxLength={18} type="password" />)}
            </FormItem>
            <Row>
              <Col span={6}></Col>
              <Col span={10}>
                <Button className={styles.submitBtn} type="primary" onClick={this.submit}>
                  确 定 修 改
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}
export default Form.create<ResetPwdProps>()(ResetPwd);
