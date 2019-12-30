import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs, Icon } from 'antd';
import ResidentInfo from './components/residentEdit/residentInfo';
import CarInfo from './components/residentEdit/carInfo';

const { TabPane } = Tabs;

interface ResidentFileProps {
  location: any;
}

class ResidentFile extends Component<ResidentFileProps> {
  state = {
    activeKey: '1',
    isShowCarInfo: false,
  };

  componentDidMount() {
    const {
      location: { query },
    } = this.props;
    if (query.tabs) {
      this.setState({
        activeKey: query.tabs,
      });
    }
    if (query.id) {
      this.setState({
        isShowCarInfo: true,
      });
    }
  }

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderTitle = () => {
    const { activeKey, isShowCarInfo } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="居民基础信息" key="1" />
        {isShowCarInfo && <TabPane tab="居民车辆信息" key="2" />}
      </Tabs>
    );
  };

  render() {
    const { activeKey, isShowCarInfo } = this.state;
    const {
      location: { query },
    } = this.props;
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card
          className="contentCart titleTabs bodyNoPadding"
          bordered={false}
          title={this.renderTitle()}
        >
          <div className="formBox">
            {/* <div style={{ display: activeKey === '1' ? 'block' : 'none' }}> */}
            {activeKey === '1' && <ResidentInfo id={query.id} />}
            {/* </div> */}
            {/* <div style={{ display: activeKey === '2' && isShowCarInfo ? 'block' : 'none' }}> */}
            {activeKey === '2' && isShowCarInfo && <CarInfo residentId={query.id} />}
            {/* </div> */}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ResidentFile;
