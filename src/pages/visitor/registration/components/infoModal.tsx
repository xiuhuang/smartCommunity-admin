import React, { Component } from 'react';
import { Modal, Row, Col, Spin } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import styles from '../styles.less';

interface InfoModalProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  recordId: string;
  visible: boolean;
  handleVisible: () => void;
  getData: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    visitorRegistration,
    loading,
  }: {
    visitorRegistration: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    visitorRegistration,
    loading: loading.models.visitorRegistration,
  }),
)
class InfoModal extends Component<InfoModalProps> {
  state = {
    detail: {
      appointmentId: 0,
      communityId: 2019000123003,
      headIcon: null,
      houseName: null,
      leaveDate: null,
      realLeaveDate: null,
      realVisitDate: null,
      realVisitorNum: null,
      remark: null,
      respondents: null,
      visitReason: null,
      visitStatus: null,
      visitorCompany: null,
      visitorIdCard: null,
      visitorLpCode: null,
      visitorName: null,
      visitorPhone: null,
      visitorSex: null,
    },
  };

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible) {
      this.getDetail(nextProps.recordId);
    }
  }

  getDetail = (id: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'visitorRegistration/getDetail',
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
    const { visible, handleVisible, loading } = this.props;
    const { detail } = this.state;
    return (
      <Modal
        visible={visible}
        title="访客信息"
        okText="提交"
        cancelText="取消"
        width={680}
        onCancel={() => handleVisible()}
        footer={null}
        className={styles.infoModalBox}
      >
        <Spin spinning={loading}>
          <Row>
            <Col span={8}>访客姓名：</Col>
            <Col span={14}>{detail.visitorName || '--'}</Col>
            <Col span={2}>
              <img src={detail.headIcon || '/touxiang.png'} alt="" />
            </Col>
          </Row>
          <Row>
            <Col span={8}>性别：</Col>
            <Col span={14}>
              {detail.visitorSex === '0' && '男'}
              {detail.visitorSex === '1' && '女'}
              {detail.visitorSex === '2' && '未知'}
              {!detail.visitorSex && '--'}
            </Col>
          </Row>
          <Row>
            <Col span={8}>身份证号：</Col>
            <Col span={14}>{detail.visitorIdCard || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>联系方式：</Col>
            <Col span={14}>{detail.visitorPhone || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>车牌号码：</Col>
            <Col span={14}>{detail.visitorLpCode || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>所属单位：</Col>
            <Col span={14}>{detail.visitorCompany || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>被访对象：</Col>
            <Col span={14}>{detail.respondents || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>被访对象房屋地址：</Col>
            <Col span={14}>{detail.houseName || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>预计离开时间：</Col>
            <Col span={14}>{detail.leaveDate || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>访问人数：</Col>
            <Col span={14}>{detail.realVisitorNum || '1'}</Col>
          </Row>
          <Row>
            <Col span={8}>来访事由：</Col>
            <Col span={14}>{detail.visitReason || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>登记时间：</Col>
            <Col span={14}>{detail.realVisitDate || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>实际签离时间：</Col>
            <Col span={14}>{detail.realLeaveDate || '--'}</Col>
          </Row>
          <Row>
            <Col span={8}>状态：</Col>
            <Col span={14}>
              {detail.visitStatus === '1' && '来访中'}
              {detail.visitStatus === '2' && '已签离'}
              {detail.visitStatus === '3' && '自动签离'}
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

export default InfoModal;
