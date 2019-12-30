import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { checkPhone } from '@/utils/validator';
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
  facilityId?: string;
  visible: boolean;
  handleVisible: () => void;
  getData: () => void;
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
      deviceId: null,
      deviceName: null,
      deviceCode: null,
      deviceTypeId: null,
      deviceGroupId: null,
      maintenanceMan: null,
      phone: null,
      address: null,
      coordinate: null,
      channelNumber: null,
      ip: null,
      port: null,
      loginName: null,
      passwd: null,
      deviceBrandId: null,
      remark: null,
    },
  };

  componentDidMount() {
    this.getDeviceTypeList();
    this.getDeciceGroupList();
    this.getDeviceBrandList();
  }

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible && nextProps.facilityId) {
      this.getDetail(nextProps.facilityId);
    } else if (!visible && nextProps.visible) {
      this.setState({
        detail: {
          id: null,
          deviceId: null,
          deviceName: null,
          deviceCode: null,
          deviceTypeId: null,
          deviceGroupId: null,
          maintenanceMan: null,
          phone: null,
          address: null,
          coordinate: null,
          channelNumber: null,
          ip: null,
          port: null,
          loginName: null,
          passwd: null,
          deviceBrandId: null,
          remark: null,
        },
      });
    }
  }

  getDetail = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/getFacilityDetail',
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

  getDeciceGroupList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchFacilityTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
    }
  };

  getDeviceBrandList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchBrandAll',
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
      if (detail.deviceId) {
        fieldsValue.id = detail.id;
        fieldsValue.deviceId = detail.deviceId;
      }
      fieldsValue.deviceTypeId = getSelectValue(fieldsValue.deviceTypeId);
      fieldsValue.deviceGroupId = getSelectValue(fieldsValue.deviceGroupId);
      fieldsValue.deviceBrandId = getSelectValue(fieldsValue.deviceBrandId);
      if (dispatch) {
        dispatch({
          type: 'basicFacility/saveFacilityForm',
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
      facilityId,
      form: { getFieldDecorator },
      basicFacility,
    } = this.props;
    const { detail } = this.state;
    const deviceTypeList = basicFacility ? basicFacility.typeBrandTagList : [];
    const deviceGroupList = basicFacility ? basicFacility.facilityTagList : [];
    const brandAll = basicFacility ? basicFacility.brandAll : [];

    return (
      <Modal
        visible={visible}
        title={facilityId ? '编辑社区设备信息' : '添加社区设备信息'}
        okText="提交"
        cancelText="取消"
        width={600}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        destroyOnClose
      >
        <Form className="form12">
          <FormItem label="社区设备名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceName', {
              rules: [{ required: true, whitespace: true, message: '请输入设备名称' }],
              initialValue: detail.deviceName,
            })(<Input placeholder="请输入设备名称" />)}
          </FormItem>
          <FormItem label="设备编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceCode', {
              rules: [{ required: true, whitespace: true, message: '请输入设备编号' }],
              initialValue: detail.deviceCode,
            })(<Input placeholder="请输入设备编号" />)}
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

          <FormItem label="设备分组" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceGroupId', {
              rules: [{ required: false, message: '请输入设备分组' }],
              initialValue: detail.deviceGroupId || [],
            })(
              <Select placeholder="请输入设备分组">
                {deviceGroupList &&
                  deviceGroupList.map((item: any) => (
                    <Option value={item.deviceGroupId} key={item.id}>
                      {item.deviceGroupName}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="负责人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('maintenanceMan', {
              rules: [{ required: false, whitespace: true, message: '请输入负责人' }],
              initialValue: detail.maintenanceMan,
            })(<Input placeholder="请输入负责人" />)}
          </FormItem>

          <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('phone', {
              rules: [
                { required: false, whitespace: true, message: '请输入联系方式' },
                { validator: checkPhone },
              ],
              initialValue: detail.phone,
            })(<Input placeholder="请输入联系方式" maxLength={11} />)}
          </FormItem>

          <FormItem label="地址" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('address', {
              rules: [{ required: true, whitespace: true, message: '请输入联系地址' }],
              initialValue: detail.address,
            })(<Input placeholder="请输入联系地址" />)}
          </FormItem>

          <FormItem label="经纬度坐标" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('coordinate', {
              rules: [{ required: false, whitespace: true, message: '请输入经纬度坐标' }],
              initialValue: detail.coordinate,
            })(<Input placeholder="请输入经纬度坐标" />)}
          </FormItem>

          <FormItem label="通道号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('channelNumber', {
              rules: [{ required: false, whitespace: true, message: '请输入通道号' }],
              initialValue: detail.channelNumber,
            })(<Input placeholder="请输入通道号" />)}
          </FormItem>

          <FormItem label="IP地址" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('ip', {
              rules: [{ required: false, whitespace: true, message: '请输入IP地址' }],
              initialValue: detail.ip,
            })(<Input placeholder="请输入IP地址" />)}
          </FormItem>

          <FormItem label="端口号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('port', {
              rules: [{ required: false, whitespace: true, message: '请输入端口号' }],
              initialValue: detail.port,
            })(<Input placeholder="请输入端口号" />)}
          </FormItem>

          <FormItem label="登陆号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('loginName', {
              rules: [{ required: false, whitespace: true, message: '请输入登陆号' }],
              initialValue: detail.loginName,
            })(<Input placeholder="请输入登陆号" />)}
          </FormItem>

          <FormItem label="密码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('passwd', {
              rules: [{ required: false, whitespace: true, message: '请输入密码' }],
              initialValue: detail.passwd,
            })(<Input placeholder="请输入密码" />)}
          </FormItem>

          <FormItem label="设备类型品牌" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceBrandId', {
              rules: [{ required: false, message: '请选择设备类型品牌' }],
              initialValue: detail.deviceBrandId || [],
            })(
              <Select placeholder="请选择设备类型品牌">
                {brandAll &&
                  brandAll.map((item: any) => (
                    <Option value={item.deviceBrandId} key={item.deviceBrandId}>
                      {item.deviceBrandName}
                    </Option>
                  ))}
              </Select>,
            )}
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
