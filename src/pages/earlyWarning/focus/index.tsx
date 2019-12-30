import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import PersonList from './components/personList';
import CarList from './components/carList';

const { TabPane } = Tabs;

class Focus extends Component {
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
        <TabPane tab="重点关注人员" key="1" />
        <TabPane tab="重点关注车辆" key="2" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;

    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          {activeKey === '1' && <PersonList />}
          {activeKey === '2' && <CarList />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Focus;
