import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';

const FormItem = Form.Item;

interface FacilityInfoModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  facilityId?: string;
  visible: boolean;
  handleVisible: () => void;
  daSearch?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    daSearch,
    loading,
  }: {
    daSearch: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    daSearch,
    loading: loading.models.daSearch,
  }),
)
class FacilityInfoModal extends Component<FacilityInfoModalProps> {
  state = {
    detail: {
      id: null,
      deviceId: null,
      deviceName: null,
      deviceCode: null,
      deviceTypeName: null,
      deviceGroupName: null,
      maintenanceMan: null,
      phone: null,
      address: null,
      coordinate: null,
      channelNumber: null,
      ip: null,
      port: null,
      loginName: null,
      passwd: null,
      deviceBrandName: null,
      remark: null,
    },
  };

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible && nextProps.facilityId) {
      this.getDetail(nextProps.facilityId);
    } else if (!visible && nextProps.visible) {
      this.setState({
        detail: {},
      });
    }
  }

  getDetail = (id: string) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'daSearch/getFacilityDetail',
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

  render() {
    const { visible, handleVisible } = this.props;
    const { detail } = this.state;

    return (
      <Modal
        visible={visible}
        title="社区设备信息"
        okText="提交"
        cancelText="取消"
        width={600}
        onCancel={() => handleVisible()}
        onOk={() => handleVisible()}
        destroyOnClose
      >
        <Form className="form12 formdetail12">
          <FormItem label="社区设备名称" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.deviceName || '--'}
          </FormItem>
          <FormItem label="设备编号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.deviceCode || '--'}
          </FormItem>

          <FormItem label="设备类型" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.deviceTypeName || '--'}
          </FormItem>

          <FormItem label="设备分组" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.deviceGroupName || '--'}
          </FormItem>

          <FormItem label="负责人" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.maintenanceMan || '--'}
          </FormItem>

          <FormItem label="联系方式" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.phone || '--'}
          </FormItem>

          <FormItem label="地址" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.address || '--'}
          </FormItem>

          <FormItem label="经纬度坐标" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.coordinate || '--'}
          </FormItem>

          <FormItem label="通道号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.channelNumber || '--'}
          </FormItem>

          <FormItem label="IP地址" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.ip || '--'}
          </FormItem>

          <FormItem label="端口号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.port || '--'}
          </FormItem>

          <FormItem label="登陆号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.loginName || '--'}
          </FormItem>

          <FormItem label="密码" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.passwd || '--'}
          </FormItem>

          <FormItem label="设备类型品牌" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.deviceBrandName || '--'}
          </FormItem>

          <FormItem label="备注" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            {detail.remark || '--'}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FacilityInfoModalProps>()(FacilityInfoModal);
