import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Row, Col, Icon } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from './model';
import BasicInfo from './components/residentDetail/basicInfo';
import HouseInfo from './components/residentDetail/houseInfo';
import Relation from './components/residentDetail/relation';
import CarInfo from './components/residentDetail/carInfo';
import AccessRecord from './components/residentDetail/accessRecord';
import AccessRecordForCar from './components/carDetail/accessRecord';
import ResidentChart from './components/residentDetail/residentChart';
import CarChart from './components/carDetail/carChart';
import styles from './styles.less';

const { TabPane } = Tabs;

interface ResidentDetailProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  location: any;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    residentFile,
    loading,
  }: {
    residentFile: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    residentFile,
    loading: loading.models.residentFile,
  }),
)
class ResidentDetail extends Component<ResidentDetailProps> {
  state = {
    activeKey: '1',
    baseInfo: {
      pictureUrl: '',
      residentName: '',
      houseName: '',
    },
    carInfo: [],
    houseInfo: [],
    houseRelationInfo: {},
  };

  houseId: any = null;

  residentId: any = null;

  componentDidMount() {
    const { location } = this.props;
    this.residentId = location.query.residentId;
    this.getDetail();
  }

  getDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'residentFile/fetchDetail',
      payload: {
        residentId: this.residentId,
      },
      callback: (res: any) => {
        if (res.code === '200') {
          this.setState({
            baseInfo: res.data.baseInfo,
            carInfo: res.data.carInfo,
            houseInfo: res.data.houseInfo,
            houseRelationInfo: res.data.houseRelationInfo,
          });
        }
      },
    });
  };

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  render() {
    const { activeKey, baseInfo, carInfo, houseInfo, houseRelationInfo } = this.state;

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <div>
          <Row style={{ marginBottom: 12 }}>
            <Col span={24}>
              <div className={styles.detailBox}>
                <div className={styles.detailLeft}>
                  <div className={styles.leftImg}>
                    <img src={baseInfo.pictureUrl ? baseInfo.pictureUrl : '/touxiang.png'} alt="" />
                  </div>
                  <h4>姓名：{baseInfo.residentName}</h4>
                  <p>住户号：{baseInfo.houseName}</p>
                </div>
                <div className={styles.detailRight}>
                  <Tabs activeKey={activeKey} onChange={this.tabsChange}>
                    <TabPane tab="居民基础信息" key="1" />
                    <TabPane tab="房屋信息" key="2" />
                    <TabPane tab="居民家庭成员" key="3" />
                    <TabPane tab="居民车辆信息" key="4" />
                  </Tabs>
                  <div className={styles.tableBox2}>
                    {activeKey === '1' && <BasicInfo basicInfo={baseInfo} />}
                    {activeKey === '2' && <HouseInfo houseInfo={houseInfo} />}
                    {activeKey === '3' && <Relation data={houseRelationInfo} />}
                    {activeKey === '4' && <CarInfo carInfo={carInfo} />}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Col span={12} style={{ paddingRight: 6 }}>
              <AccessRecord />
            </Col>
            <Col span={12} style={{ paddingLeft: 6 }}>
              <ResidentChart />
            </Col>
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Col span={12} style={{ paddingRight: 6 }}>
              <AccessRecordForCar />
            </Col>
            <Col span={12} style={{ paddingLeft: 6 }}>
              <CarChart />
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ResidentDetail;
