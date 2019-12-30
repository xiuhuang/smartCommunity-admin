import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import Router from 'umi/router';
import ResidentList from './components/residentList';
import CarList from './components/carList';

const { TabPane } = Tabs;

interface ResidentFileProps {
  location: any;
}

class ResidentFile extends Component<ResidentFileProps> {
  state = {
    activeKey: '1',
  };

  componentDidMount() {
    const { location } = this.props;
    const { k } = location.query;
    if (k) {
      this.setState({
        activeKey: k,
      });
    }
  }

  tabsChange = (key: string) => {
    Router.replace(`/da/residentFile?k=${key}`);
    this.setState({
      activeKey: key,
    });
  };

  renderTitle = () => {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="居民信息" key="1" />
        <TabPane tab="社区车辆" key="2" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          {activeKey === '1' && <ResidentList />}
          {activeKey === '2' && <CarList />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ResidentFile;
