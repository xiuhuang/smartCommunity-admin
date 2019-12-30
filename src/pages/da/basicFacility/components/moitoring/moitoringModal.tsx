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
  moitoringId?: string;
  visible: boolean;
  getData: () => void;
  handleVisible: () => void;
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
    deviceList: [],
    detail: {
      id: null,
      monitorPointId: null,
      monitorPointName: null,
      monitorPointCode: null,
      areaName: null,
      areaCode: null,
      deviceInfoId: null,
      typeBrandNo: null,
      ip: null,
      coordinate: null,
      accessType: null,
    },
  };

  componentDidMount() {
    this.getDeviceList();
  }

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible && nextProps.moitoringId) {
      this.getDetail(nextProps.moitoringId);
    } else if (!visible && nextProps.visible) {
      this.setState({
        detail: {
          id: null,
          monitorPointId: null,
          monitorPointName: null,
          monitorPointCode: null,
          areaName: null,
          areaCode: null,
          deviceInfoId: null,
          typeBrandNo: null,
          ip: null,
          coordinate: null,
          accessType: null,
        },
      });
    }
  }

  getDetail = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/getMoitoringDetail',
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

  getDeviceList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchFacilityAll',
        payload: {
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              deviceList: res.data,
            });
          }
        },
      });
    }
  };

  submit = () => {
    const { detail } = this.state;
    const { form, getData, dispatch, handleVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (detail.monitorPointId) {
        fieldsValue.id = detail.id;
        fieldsValue.monitorPointId = detail.monitorPointId;
      }
      fieldsValue.deviceInfoId = getSelectValue(fieldsValue.deviceInfoId);
      fieldsValue.accessType = getSelectValue(fieldsValue.accessType);
      if (dispatch) {
        dispatch({
          type: 'basicFacility/saveMoitoringForm',
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
      moitoringId,
      form: { getFieldDecorator },
    } = this.props;
    const { deviceList, detail } = this.state;

    return (
      <Modal
        visible={visible}
        title={moitoringId ? '编辑监控点' : '添加监控点'}
        okText="提交"
        cancelText="取消"
        width={600}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        destroyOnClose
      >
        <Form className="form12">
          <FormItem label="监控点名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('monitorPointName', {
              rules: [{ required: true, whitespace: true, message: '请输入监控点名称' }],
              initialValue: detail.monitorPointName,
            })(<Input placeholder="请输入监控点名称" />)}
          </FormItem>
          <FormItem label="监控点编码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('monitorPointCode', {
              rules: [{ required: true, whitespace: true, message: '请输入监控点编码' }],
              initialValue: detail.monitorPointCode,
            })(<Input placeholder="请输入监控点编码" />)}
          </FormItem>

          <FormItem label="区域名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('areaName', {
              rules: [{ required: false, whitespace: true, message: '请输入区域名称' }],
              initialValue: detail.areaName,
            })(<Input placeholder="请输入区域名称" />)}
          </FormItem>

          <FormItem label="区域编码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('areaCode', {
              rules: [{ required: false, whitespace: true, message: '请输入区域编码' }],
              initialValue: detail.areaCode,
            })(<Input placeholder="请输入区域编码" />)}
          </FormItem>

          <FormItem label="设备名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('deviceInfoId', {
              rules: [{ required: false, message: '请输入设备名称' }],
              initialValue: detail.deviceInfoId || [],
            })(
              <Select placeholder="请输入设备类型">
                {deviceList &&
                  deviceList.map((item: any) => (
                    <Option value={item.deviceId} key={item.deviceId}>
                      {item.deviceName}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="设备编码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('typeBrandNo', {
              rules: [{ required: false, whitespace: true, message: '请输入设备编码' }],
              initialValue: detail.typeBrandNo,
            })(<Input placeholder="请输入设备编码" />)}
          </FormItem>

          <FormItem label="IP地址" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('ip', {
              rules: [{ required: false, whitespace: true, message: '请输入IP地址' }],
              initialValue: detail.ip,
            })(<Input placeholder="请输入IP地址" />)}
          </FormItem>

          <FormItem label="经纬度" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('coordinate', {
              rules: [{ required: false, whitespace: true, message: '请输入经纬度' }],
              initialValue: detail.coordinate,
            })(<Input placeholder="请输入经纬度" />)}
          </FormItem>

          <FormItem label="出入类型" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('accessType', {
              rules: [{ required: false, message: '请选择出入类型' }],
              initialValue: detail.accessType || [],
            })(
              <Select placeholder="请选择出入类型">
                <Option value="">暂无</Option>
                <Option value="0">出</Option>
                <Option value="1">入</Option>
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FacilityInfoModalProps>()(FacilityInfoModal);
