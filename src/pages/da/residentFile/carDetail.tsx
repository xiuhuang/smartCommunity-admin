import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Row, Col, Icon } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from './model';
import BasicInfo from './components/carDetail/basicInfo';
import CarInfo from './components/carDetail/carInfo';
import AccessRecordForCar from './components/carDetail/accessRecord';
import CarChart from './components/carDetail/carChart';
import styles from './styles.less';

const { TabPane } = Tabs;

interface CarDetailProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  residentFile?: StateType;
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
class CarDetail extends Component<CarDetailProps> {
  state = {
    activeKey: '1',
    carInfo: {},
    residentInfo: {
      baseInfo: {},
      houseInfo: {},
    },
    baseInfo: {
      pictureUrl: '',
      residentName: '',
      houseName: '',
    },
    // houseInfo: {
    //   houseAddress: '',
    // },
  };

  carId: any = null;

  residentId: any = null;

  componentDidMount() {
    const { location } = this.props;
    this.carId = location.query.carId;
    this.residentId = location.query.residentId;
    this.getResidentInfo();
    this.getCardInfo();
  }

  getResidentInfo = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/getResidentInfoById',
        payload: {
          residentId: this.residentId,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              residentInfo: res.data,
              baseInfo: res.data.baseInfo,
              // houseInfo: res.data.houseInfo,
            });
          }
        },
      });
    }
  };

  getCardInfo = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/getCarInfoById',
        payload: {
          carId: this.carId,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              carInfo: res.data,
            });
          }
        },
      });
    }
  };

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  render() {
    const { activeKey, residentInfo, carInfo, baseInfo } = this.state;

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <div>
          <Row style={{ marginBottom: 12 }}>
            <Col span={24}>
              <div className={`${styles.detailBox} ${styles.carDetailBox}`}>
                <div className={styles.detailLeft}>
                  <div className={styles.leftImg}>
                    <img src={baseInfo.pictureUrl || '/touxiang.png'} alt="" />
                  </div>
                  <h4>姓名：{baseInfo.residentName || '--'}</h4>
                  <p>住户号：{baseInfo.houseName || '--'}</p>
                </div>
                <div className={styles.detailRight}>
                  <Tabs activeKey={activeKey} onChange={this.tabsChange}>
                    <TabPane tab="车主基础信息" key="1" />
                    <TabPane tab="车辆信息" key="2" />
                  </Tabs>
                  {activeKey === '1' && <BasicInfo residentInfo={residentInfo} />}
                  {activeKey === '2' && <CarInfo carInfo={carInfo} baseInfo={baseInfo} />}
                </div>
              </div>
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

export default CarDetail;
