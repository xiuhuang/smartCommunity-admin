import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Row, Col, Icon } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
// import CarBasicInfo from './components/detail/carBasicInfo';
import CarInfo from './components/detail/carInfo';
import AccessRecordForCar from './components/detail/accessRecord';
import CarChart from './components/detail/carChart';
import { StateType } from './model';
import styles from './styles.less';

const { TabPane } = Tabs;

interface UnitCarDetailProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  institution?: StateType;
  location: any;
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
class UnitCarDetail extends Component<UnitCarDetailProps> {
  state = {
    activeKey: '1',
    carInfo: {
      busLicPictureUrl: '',
      residentName: '',
      legalPhone: '',
    },
  };

  carId: any = null;

  componentDidMount() {
    this.getCardInfo();
  }

  getCardInfo = () => {
    const { dispatch, location } = this.props;
    this.carId = location.query.carId;
    if (dispatch) {
      dispatch({
        type: 'institution/getCarInfoDetail',
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
    const { activeKey, carInfo } = this.state;

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
                    <img src={carInfo.busLicPictureUrl || '/touxiang.png'} alt="" />
                  </div>
                  <h4>车主：{carInfo.residentName || '--'}</h4>
                  <h4>联系方式：{carInfo.legalPhone || '--'}</h4>
                </div>
                <div className={styles.detailRight}>
                  <Tabs activeKey={activeKey} onChange={this.tabsChange}>
                    <TabPane tab="车辆信息" key="1" />
                  </Tabs>
                  {activeKey === '1' && <CarInfo carInfo={carInfo} />}
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

export default UnitCarDetail;
