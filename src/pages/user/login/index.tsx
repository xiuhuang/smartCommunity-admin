import { Icon, Form, Input, Button } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
// import JSEncrypt from 'jsencrypt';
import { pubkey } from '@/utils/utils';
import { ConnectState } from '@/models/connect';
import styles from './style.less';

const FormItem = Form.Item;
const { JSEncrypt } = require('jsencrypt');

interface LoginProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
}

@connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component<LoginProps> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state = {};

  onKeyUpFunc(e: any) {
    if (e.keyCode === 13) {
      this.handleLogin();
    }
  }

  handleLogin = () => {
    const { form, dispatch } = this.props;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubkey);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.passWord = encrypt.encrypt(fieldsValue.passWord);
      fieldsValue.osType = '1';
      dispatch({
        type: 'login/login',
        payload: fieldsValue,
      });
    });
  };

  render() {
    const { form } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.loginFrame}>
          <div className={styles.loginFrameIn}>
            <div className={styles.loginTitle}>用户登录</div>
            <Form onSubmit={this.handleLogin}>
              <FormItem>
                {form.getFieldDecorator('loginName', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input
                    placeholder="请输入用户名"
                    size="large"
                    prefix={<Icon type="user" style={{ color: '#4aabfe' }} />}
                    onKeyUp={e => this.onKeyUpFunc(e)}
                  />,
                )}
              </FormItem>
              <FormItem>
                {form.getFieldDecorator('passWord', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input
                    placeholder="请输入密码"
                    size="large"
                    type="password"
                    prefix={<Icon type="lock" style={{ color: '#4aabfe' }} />}
                    onKeyUp={e => this.onKeyUpFunc(e)}
                  />,
                )}
              </FormItem>
              <Button className={styles.submitBtn} type="primary" onClick={this.handleLogin}>
                登录
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create<LoginProps>()(Login);
