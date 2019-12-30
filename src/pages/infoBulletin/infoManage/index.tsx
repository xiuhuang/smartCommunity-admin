import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import List from './components/list';

const { TabPane } = Tabs;

class InfoManage extends Component {
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
        <TabPane tab="资讯管理" key="1" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          {activeKey === '1' && <List />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InfoManage;
