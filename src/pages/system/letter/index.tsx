import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import Router from 'umi/router';
import List from './components/list';

const { TabPane } = Tabs;
interface LetterProps {
  location: any;
}
class Letter extends Component<LetterProps> {
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
    Router.replace(`/system/letter?k=${key}`);
    this.setState({
      activeKey: key,
    });
  };

  renderTitle = () => {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="全部" key="1" />
        <TabPane tab="报警提醒" key="2" />
        <TabPane tab="认证审核" key="3" />
        <TabPane tab="居民事务" key="4" />
        <TabPane tab="活动消息" key="5" />
        <TabPane tab="审核消息" key="6" />
        <TabPane tab="物业消息" key="7" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          {activeKey === '1' && <List templateType="" />}
          {activeKey === '2' && <List templateType="0" />}
          {activeKey === '3' && <List templateType="1" />}
          {activeKey === '4' && <List templateType="2" />}
          {activeKey === '5' && <List templateType="3" />}
          {activeKey === '6' && <List templateType="4" />}
          {activeKey === '7' && <List templateType="5" />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Letter;
