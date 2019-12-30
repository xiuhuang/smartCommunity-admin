import React, { Component } from 'react';
import { Form, message, Input, Modal, DatePicker, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import moment from 'moment';
import { StateType } from '../model';
import DepartMent from '@/components/form/department';
import { checkPhone, checkID } from '@/utils/validator';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  handleCancel: () => void;
  getData: () => void;
  // record: any;
  visible: boolean;
  // : boolean;
  userId: any;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    organization,
    loading,
  }: {
    organization: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    organization,
    loading: loading.models.organization,
  }),
)
class FormList extends Component<FormListProps> {
  state = {
    detail: {
      userId: null,
      userName: null,
      birth: '',
      idCard: null,
      sex: null,
      phonenumber: null,
      initiationDate: '',
      workTime: null,
      deptList: [],
      deptName: null,
      post: null,
      address: null,
      education: null,
      poc: null,
      remark: null,
    },
  };

  componentDidMount() {
    const { userId } = this.props;
    if (userId) {
      this.getUserInfo(userId);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (nextProps.userId && !visible && nextProps.visible) {
      this.getUserInfo(nextProps.userId);
    } else if (!nextProps.userId && !visible && nextProps.visible) {
      this.setState({
        detail: {},
      });
    }
  }

  getUserInfo = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'organization/getUserInfo',
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

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  submit() {
    const { form, dispatch, getData } = this.props;
    const { detail } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.birth) {
        fieldsValue.birth = fieldsValue.birth.format('YYYY-MM-DD');
      }
      if (fieldsValue.initiationDate) {
        fieldsValue.initiationDate = fieldsValue.initiationDate.format('YYYY-MM-DD');
      }
      if (detail.userId) {
        fieldsValue.userId = detail.userId;
      }
      if (dispatch) {
        dispatch({
          type: 'organization/saveDetail',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              this.handleCancel();
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
      // record,
      visible,
      userId,
    } = this.props;

    const { detail } = this.state;

    const clumnCon = (
      <div className="submitFormBox">
        <Form className={`${styles.formListBox} form12`}>
          <FormItem label="姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入姓名',
                },
              ],
              initialValue: detail.userName,
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem label="出生年月" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('birth', {
              rules: [
                {
                  required: true,
                  message: '请输入出生年月',
                },
              ],
              initialValue: detail.birth ? moment(detail.birth) : null,
            })(
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                placeholder="请输入出生年月"
              />,
            )}
          </FormItem>
          <FormItem label="身份证号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('idCard', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入身份证号',
                },
                {
                  validator: checkID,
                },
              ],
              initialValue: detail.idCard,
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem label="性别" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('sex', {
              rules: [
                {
                  required: true,
                  message: '请选择性别',
                },
              ],
              initialValue: detail.sex,
            })(
              <Select placeholder="请选择性别">
                <Option value="0">男</Option>
                <Option value="1">女</Option>
                <Option value="2">未知</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('phonenumber', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入联系方式',
                },
                { validator: checkPhone },
              ],
              initialValue: detail.phonenumber,
            })(<Input placeholder="请输入联系方式" maxLength={11} />)}
          </FormItem>
          <FormItem label="入职时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('initiationDate', {
              rules: [
                {
                  required: true,
                  message: '请输入入职时间',
                },
              ],
              initialValue: detail.initiationDate ? moment(detail.initiationDate) : null,
            })(
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                placeholder="请输入入职时间"
              />,
            )}
          </FormItem>
          <FormItem label="入职前工龄" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('workTime', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入入职前工龄',
                },
              ],
              initialValue: detail.workTime,
            })(<Input placeholder="请输入入职前工龄" />)}
          </FormItem>
          <FormItem label="部门" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deptList', {
              rules: [
                {
                  required: true,
                  message: '请选择部门',
                },
              ],
              initialValue: detail.deptList,
            })(<DepartMent placeholder="请选择部门" />)}
          </FormItem>
          <FormItem label="职业" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('post', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入职业',
                },
              ],
              initialValue: detail.post,
            })(<Input placeholder="请输入职业" />)}
          </FormItem>
          <FormItem label="住址" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('address', {
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: '请输入住址',
                },
              ],
              initialValue: detail.address,
            })(<Input placeholder="住址" />)}
          </FormItem>
          <FormItem label="文化程度" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('education', {
              rules: [
                {
                  required: false,
                  message: '请选择文化程度',
                },
              ],
              initialValue: detail.education,
            })(
              <Select placeholder="请选择文化程度">
                <Option value="1">小学</Option>
                <Option value="2">初中</Option>
                <Option value="3">高中</Option>
                <Option value="4">大学</Option>
                <Option value="5">硕士</Option>
                <Option value="6">博士</Option>
                <Option value="7">博士后</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="政治面貌" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('poc', {
              rules: [
                {
                  required: false,
                  message: '请选择政治面貌',
                },
              ],
              initialValue: detail.poc,
            })(
              <Select placeholder="请选择政治面貌">
                <Option value="1">共青团员</Option>
                <Option value="2">党员</Option>
                <Option value="3">未知</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: '请输入备注',
                },
              ],
              initialValue: detail.remark,
            })(<Input.TextArea rows={4} placeholder="请输入备注" />)}
          </FormItem>
        </Form>
      </div>
    );
    return (
      <Modal
        width={680}
        title={userId ? '编辑社区成员信息' : '新增社区成员信息'}
        visible={visible}
        onCancel={() => this.handleCancel()}
        destroyOnClose
        onOk={() => this.submit()}
      >
        <div className={styles.resTagBtnBox}>{clumnCon}</div>
      </Modal>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
