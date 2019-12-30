import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormComponentProps } from 'antd/es/form';
import { Tabs, Row, Col, Form, Icon } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import Router from 'umi/router';
import { StateType } from './model';
import BasicInfo from './components/detail/basicInfo';
import Relation from './components/detail/relation';
import InstitutionRecord from './components/detail/institutionRecord';
import CarRecord from './components/detail/carRecord';
import InstitutionChart from './components/detail/institutionChart';
import CarChart from './components/detail/carChart';
import MemberTable from './components/detail/memberTable';
import CarTable from './components/detail/carTable';
import UploadImg from '@/components/UploadImg';
import styles from './styles.less';

const { TabPane } = Tabs;

interface DetailProps extends FormComponentProps {
  loading?: any;
  dispatch?: Dispatch<any>;
  institutionData?: StateType;
  location: any;
  match: any;
}

@connect(
  ({
    institutionData,
    loading,
  }: {
    institutionData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    institutionData,
    loading: loading.models.institutionData,
  }),
)
class ResidentDetail extends Component<DetailProps> {
  state = {
    activeKey: '1',
    contActiveKey: '1',
    detailData: {
      companyName: '',
      busLic: '',
      legalPerson: '',
      legalPhone: '',
      legalIdentityCard: '',
      operatorPeriod: '',
      legelAddress: '',
      busLicPictureUrl: '',
      housePurpose: '',
      houseType: '',
      houseArea: '',
      proPapersNum: '',
      proPhone: '',
      proPerson: '',
      proType: '',
      address: '',
    },
  };

  componentWillMount() {
    this.getDetailData();
    const { match } = this.props;
    this.setState({
      contActiveKey: match.params.urlContActiveKey,
    });
  }

  getDetailData = () => {
    const { match, dispatch } = this.props;
    const parms = {
      companyId: match.params.companyId,
    };
    if (dispatch) {
      dispatch({
        type: 'institution/getDetailData',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              detailData: res.data,
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

  contTabsChange = (key: string) => {
    this.setState({
      contActiveKey: key,
    });
    const { match } = this.props;
    const { companyId } = match.params;
    Router.replace(`/da/Institution/detail/${companyId}/${key}`);
  };

  render() {
    const { activeKey, contActiveKey, detailData } = this.state;
    const { match } = this.props;
    const showDetailData = {
      detailData,
      companyId: match.params.companyId,
    };
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
                  {detailData ? (
                    <UploadImg
                      className="uploadLargeImg"
                      text="添加法人照片"
                      maxLength="1"
                      uploadType="idCard"
                      disabled
                      value={detailData.busLicPictureUrl}
                    />
                  ) : null}
                  <p>单位名称：{detailData.companyName}</p>
                  <p>法人：{detailData.legalPerson}</p>
                  <p>联系方式：{detailData.legalPhone}</p>
                </div>
                <div className={styles.detailRight}>
                  <Tabs activeKey={activeKey} onChange={this.tabsChange}>
                    <TabPane tab="单位基础信息" key="1" />
                    <TabPane tab="单位血缘图谱" key="2" />
                  </Tabs>
                  {activeKey === '1' && <BasicInfo {...showDetailData} />}
                  {activeKey === '2' && <Relation />}
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Col span={24}>
              <div className={styles.tabsBox}>
                <Tabs activeKey={contActiveKey} onChange={this.contTabsChange}>
                  <TabPane tab="单位成员" key="1" />
                  <TabPane tab="单位车辆" key="2" />
                </Tabs>
                {contActiveKey === '1' && <MemberTable {...showDetailData} />}
                {contActiveKey === '2' && <CarTable {...showDetailData} />}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Col span={12} style={{ paddingRight: 6 }}>
              <InstitutionRecord />
            </Col>
            <Col span={12} style={{ paddingLeft: 6 }}>
              <InstitutionChart />
            </Col>
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Col span={12} style={{ paddingRight: 6 }}>
              <CarRecord />
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

export default Form.create<DetailProps>()(ResidentDetail);
