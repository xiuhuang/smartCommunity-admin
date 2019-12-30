import React, { Component } from 'react';
import { Form, Select, Input, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../../model';
import styles from '../../styles.less';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;
const { Option } = Select;

interface MemberFromModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  visible: boolean;
  companyId?: any;
  record: any;
  match?: any;
  institution?: any;
  getData: () => void;
  handleVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    institution,
    loading,
  }: {
    institution: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    institution,
    loading: loading.models.institution,
  }),
)
class MemberFromModal extends Component<MemberFromModalProps> {
  state = {};

  submit() {
    const { form, dispatch, getData, handleVisible, record, companyId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (record.memberId) {
        fieldsValue.memberId = record.memberId;
      }
      fieldsValue.companyId = companyId;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'institution/editReport',
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
      visible,
      record,
    } = this.props;

    return (
      <Modal
        title={record.memberId ? '编辑单位成员信息' : '添加单位成员信息'}
        visible={visible}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        okText="提交"
        cancelText="取消"
        width={700}
        destroyOnClose
      >
        <Form className={`${styles.formBox} form12`}>
          <FormItem label="成员名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('memberName', {
              initialValue: record.memberName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入成员名称',
                },
              ],
            })(<Input placeholder="请输入成员名称" />)}
          </FormItem>

          <FormItem label="性别" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('sex', {
              initialValue: record.sex !== '2' ? record.sex : null,
            })(
              <Select placeholder="请选择处理状态">
                <Option value="0">男</Option>
                <Option value="1">女</Option>
              </Select>,
            )}
          </FormItem>

          <FormItem label="联系电话" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('contactPhone', {
              initialValue: record.contactPhone,
            })(<Input placeholder="请输入联系电话" />)}
          </FormItem>

          <FormItem label="身份证号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('idCard', {
              initialValue: record.idCard,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入身份证号',
                },
              ],
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>

          <FormItem label="上传头像" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('pictureUrl', {
              initialValue: record.pictureUrl,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请上传头像',
                },
              ],
            })(
              <UploadImg
                className="btnUpload"
                text="选择图片"
                maxLength="1"
                uploadType="idCard"
                // initialValue={record.pictureUrl}
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<MemberFromModalProps>()(MemberFromModal);
