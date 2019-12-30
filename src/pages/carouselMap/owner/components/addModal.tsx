import React, { Component } from 'react';
import { Form, Input, Modal, message, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import UploadImg from '@/components/UploadImg';
import { checkOrderNum } from '@/utils/validator';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface AddModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  bannerId?: string;
  position: string;
  visible: boolean;
  getData: () => void;
  handleVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    carouselMap,
    loading,
  }: {
    carouselMap: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    carouselMap,
    loading: loading.models.carouselMap,
  }),
)
class AddModal extends Component<AddModalProps> {
  state = {
    detail: {
      title: null,
      bannerId: null,
      directUrl: null,
      pictureUrl: '',
      position: null,
      sort: null,
      status: null,
    },
  };

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible && nextProps.bannerId) {
      this.getDetail(nextProps.bannerId);
    } else if (!visible && nextProps.visible) {
      this.setState({
        detail: {},
      });
    }
  }

  getDetail = (bannerId: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'carouselMap/getDetail',
        payload: {
          bannerId,
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

  submit() {
    const { form, dispatch, getData, handleVisible, position } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.position = position;
      if (dispatch) {
        dispatch({
          type: 'carouselMap/editCarousel',
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
    const { detail } = this.state;
    const {
      form: { getFieldDecorator },
      handleVisible,
      visible,
      bannerId,
    } = this.props;

    return (
      <Modal
        title={bannerId ? '编辑轮播图' : '新增轮播图'}
        width={700}
        visible={visible}
        okText="提交"
        cancelText="取消"
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        destroyOnClose
      >
        <Form className={`${styles.formBox} form12`}>
          {getFieldDecorator('bannerId', {
            initialValue: detail.bannerId,
          })(<Input style={{ display: 'none' }} />)}

          <FormItem label="标题" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: detail.title,
            })(<Input placeholder="请输入标题" />)}
          </FormItem>

          <FormItem label="轮播图" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('pictureUrl', {
              rules: [{ required: true, message: '请上传轮播图' }],
              initialValue: detail.pictureUrl,
            })(<UploadImg text="轮播图" maxLength={1} />)}
          </FormItem>

          <FormItem label="URL地址" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('directUrl', {
              rules: [{ required: true, message: '请输入URL地址' }],
              initialValue: detail.directUrl,
            })(<Input placeholder="请输入URL地址" />)}
          </FormItem>

          <FormItem label="排序号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('sort', {
              rules: [{ validator: checkOrderNum }, { max: 100, message: '最多只能输入100个字符' }],
              initialValue: detail.sort,
            })(<Input placeholder="请输入排序号" />)}
          </FormItem>

          <FormItem label="上架状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('status', {
              rules: [{ required: false, message: '请选择上架状态' }],
              initialValue: detail.status,
            })(
              <Select placeholder="请选择上架状态">
                <Option value="0">下架</Option>
                <Option value="1">上架</Option>
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<AddModalProps>()(AddModal);
