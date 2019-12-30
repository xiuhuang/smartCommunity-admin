import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import FacilityList from './components/facility/list';
import TypeBrandList from './components/typeBrand/list';
import MoitoringList from './components/moitoring/list';

const { TabPane } = Tabs;

class BasicFacility extends Component {
  state = {
    activeKey: '1',
  };

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderTitle = () => {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="社区设备设施" key="1" />
        <TabPane tab="设施类型品牌管理" key="2" />
        <TabPane tab="监控点管理" key="3" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;

    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          {activeKey === '1' && <FacilityList />}
          {activeKey === '2' && <TypeBrandList />}
          {activeKey === '3' && <MoitoringList />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicFacility;
