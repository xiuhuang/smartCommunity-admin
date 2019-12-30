import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../../model';

const FormItem = Form.Item;
const { Option } = Select;
const getSelectValue = (value: any) => {
  if (value) {
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }
    if (Array.isArray(value)) {
      return undefined;
    }
    return value;
  }
  return undefined;
};

interface FacilityInfoModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  brandId?: string;
  visible: boolean;
  getData: () => void;
  handleVisible: () => void;
  basicFacility?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    basicFacility,
    loading,
  }: {
    basicFacility: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicFacility,
    loading: loading.models.basicFacility,
  }),
)
class FacilityInfoModal extends Component<FacilityInfoModalProps> {
  state = {
    detail: {
      id: null,
      deviceBrandId: null,
      deviceBrandName: null,
      deviceBrandCode: null,
      manufacturers: null,
      deviceTypeId: null,
      decodeMode: null,
      remark: null,
    },
  };

  componentDidMount() {
    this.getDeviceTypeList();
  }

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible && nextProps.brandId) {
      this.getDetail(nextProps.brandId);
    } else if (!visible && nextProps.visible) {
      this.setState({
        detail: {
          id: null,
          deviceBrandId: null,
          deviceBrandName: null,
          deviceBrandCode: null,
          manufacturers: null,
          deviceTypeId: null,
          decodeMode: null,
          remark: null,
        },
      });
    }
  }

  getDetail = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/getTypeBrandDetail',
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

  getDeviceTypeList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchTypeBrandTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
    }
  };

  submit = () => {
    const { form, getData, dispatch, handleVisible } = this.props;
    const { detail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (detail.deviceBrandId) {
        fieldsValue.id = detail.id;
        fieldsValue.deviceBrandId = detail.deviceBrandId;
      }
      fieldsValue.deviceTypeId = getSelectValue(fieldsValue.deviceTypeId);
      if (dispatch) {
        dispatch({
          type: 'basicFacility/saveTypeBrandForm',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              getData();
              handleVisible();
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
      brandId,
      form: { getFieldDecorator },
      basicFacility,
    } = this.props;
    const deviceTypeList = basicFacility ? basicFacility.typeBrandTagList : [];
    const { detail } = this.state;
    return (
      <Modal
        visible={visible}
        title={brandId ? '编辑设备品牌' : '添加设备品牌'}
        okText="提交"
        cancelText="取消"
        width={600}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        destroyOnClose
      >
        <Form className="form12">
          <FormItem label="设备品牌名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceBrandName', {
              rules: [{ required: true, whitespace: true, message: '请输入设备品牌名称' }],
              initialValue: detail.deviceBrandName,
            })(<Input placeholder="请输入设备品牌名称" />)}
          </FormItem>
          <FormItem label="品牌编码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceBrandCode', {
              rules: [{ required: true, whitespace: true, message: '请输入品牌编码' }],
              initialValue: detail.deviceBrandCode,
            })(<Input placeholder="请输入品牌编码" />)}
          </FormItem>

          <FormItem label="生产厂商" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('manufacturers', {
              rules: [{ required: false, whitespace: true, message: '请输入生产厂商' }],
              initialValue: detail.manufacturers,
            })(<Input placeholder="请输入生产厂商" />)}
          </FormItem>

          <FormItem label="设备类型" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceTypeId', {
              rules: [{ required: false, message: '请输入设备类型' }],
              initialValue: detail.deviceTypeId || [],
            })(
              <Select placeholder="请输入设备类型">
                {deviceTypeList &&
                  deviceTypeList.map((item: any) => (
                    <Option value={item.deviceTypeId} key={item.deviceTypeId}>
                      {item.deviceTypeName}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="解码方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('decodeMode', {
              rules: [{ required: false, whitespace: true, message: '请输入解码方式' }],
              initialValue: detail.decodeMode,
            })(<Input placeholder="请输入解码方式" />)}
          </FormItem>

          <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark', {
              rules: [{ required: false, whitespace: true, message: '请输入备注' }],
              initialValue: detail.remark,
            })(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FacilityInfoModalProps>()(FacilityInfoModal);
