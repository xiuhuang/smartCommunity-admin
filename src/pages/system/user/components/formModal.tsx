import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Select, Switch, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { pubkey } from '@/utils/utils';
import { StateType } from '../model';

const { JSEncrypt } = require('jsencrypt');

const FormItem = Form.Item;
const { Option } = Select;

interface FormModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  userId?: string;
  visible: boolean;
  handleVisible: () => void;
  getData: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    systemUser,
    loading,
  }: {
    systemUser: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    systemUser,
    loading: loading.models.systemUser,
  }),
)
class FormModal extends Component<FormModalProps> {
  state = {
    userList: [],
    rolesList: [],
    detail: {
      userId: null,
      loginName: null,
      passWord: null,
      roleList: [],
      status: null,
      isAllowAppLogin: null,
      remark: null,
    },
  };

  componentDidMount() {
    this.getRolesList();
    this.getUserList();
  }

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (nextProps.userId && !visible && nextProps.visible) {
      this.getUserInfo(nextProps.userId);
      this.getUserList(true);
    } else if (!nextProps.userId && !visible && nextProps.visible) {
      this.setState({
        detail: {},
      });
      this.getUserList();
    }
  }

  getUserInfo = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'systemUser/getUserInfo',
        payload: {
          id,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              detail: res.data,
            });
          }
        },
      });
    }
  };

  getUserList = (flag?: boolean) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'systemUser/getUserList',
        payload: {
          isSysUser: flag ? '1' : '0',
          pageNum: 1,
          pageSize: 1000,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              userList: res.data,
            });
          }
        },
      });
    }
  };

  getRolesList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'systemUser/getRoles',
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              rolesList: res.data,
            });
          }
        },
      });
    }
  };

  getRoleNameById = (roleId: string) => {
    const { rolesList } = this.state;
    let name = '';
    rolesList.forEach((role: any) => {
      if (role.roleId === roleId) {
        name = role.roleName;
      }
    });
    return name;
  };

  submit = () => {
    const { form, dispatch, handleVisible, getData, userId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (userId) {
        fieldsValue.userId = userId;
      }
      fieldsValue.isSysUser = '1';
      fieldsValue.status = fieldsValue.status ? '0' : '1';
      fieldsValue.isAllowAppLogin = fieldsValue.isAllowAppLogin ? '1' : '0';
      fieldsValue.roleList = fieldsValue.roleIds.map((roleId: string) => ({
        roleId,
        roleName: this.getRoleNameById(roleId),
      }));
      fieldsValue.roleIds = undefined;
      if (fieldsValue.passWord) {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubkey);
        fieldsValue.passWord = encrypt.encrypt(fieldsValue.passWord);
      }
      if (dispatch) {
        dispatch({
          type: 'systemUser/saveDetail',
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
  };

  render() {
    const {
      visible,
      handleVisible,
      form: { getFieldDecorator },
      userId,
    } = this.props;

    const { rolesList, detail, userList } = this.state;

    return (
      <Modal
        visible={visible}
        title={userId ? '编辑用户' : '添加用户'}
        okText="提交"
        cancelText="取消"
        width={750}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        destroyOnClose
      >
        <Form className="form12">
          <Row>
            <Col span={24}>
              <FormItem label="姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('userId', {
                  rules: [{ required: true, message: '请输入姓名' }],
                  initialValue: detail.userId,
                })(
                  <Select placeholder="请输入姓名" disabled={!!userId}>
                    {userList &&
                      userList.map((user: any) => (
                        <Option value={user.userId} key={user.userId}>
                          {user.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="设置登录账号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('loginName', {
                  rules: [{ required: true, whitespace: true, message: '请输入登录账号' }],
                  initialValue: detail.loginName,
                })(<Input placeholder="请输入登录账号" disabled={!!userId} />)}
              </FormItem>
            </Col>
            {!userId && (
              <Col span={24}>
                <FormItem label="登录密码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('passWord', {
                    rules: [{ required: true, whitespace: true, message: '请输入登录密码' }],
                    initialValue: detail.passWord,
                  })(<Input type="passWord" placeholder="请输入登录密码" />)}
                </FormItem>
              </Col>
            )}
            <Col span={24}>
              <FormItem label="管理角色" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('roleIds', {
                  rules: [{ required: false, message: '请选择管理角色' }],
                  initialValue: detail.roleList
                    ? detail.roleList.map((role: any) => role.roleId)
                    : [],
                })(
                  <Select placeholder="请选择管理角色" mode="multiple" showArrow>
                    {rolesList &&
                      rolesList.map((role: any) => (
                        <Option value={role.roleId} key={role.roleId}>
                          {role.roleName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="用户状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('status', {
                  rules: [{ required: false, message: '请选择用户状态' }],
                  initialValue: detail.status === '0',
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开启" unCheckedChildren="停用" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="App登录权限" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('isAllowAppLogin', {
                  rules: [{ required: false, message: '请选择用户说明' }],
                  valuePropName: 'checked',
                  initialValue: detail.isAllowAppLogin === '1',
                })(<Switch checkedChildren="开启" unCheckedChildren="关停" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('remark', {
                  rules: [{ required: false, whitespace: true, message: '请输入备注' }],
                  initialValue: detail.remark,
                })(<Input.TextArea rows={4} placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FormModalProps>()(FormModal);
