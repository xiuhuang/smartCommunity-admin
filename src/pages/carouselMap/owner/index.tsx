import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import List from './components/list';

const { TabPane } = Tabs;

interface CarouseMapProps {
  location: any;
}

class CarouseMap extends Component<CarouseMapProps> {
  state = {
    activeKey: '1',
  };

  position = '1';

  componentWillMount() {
    const { location } = this.props;
    if (location.pathname === '/carouselMap/owner') {
      this.position = '2';
    } else {
      this.position = '1';
    }
  }

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderTitle = () => {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab={this.position === '1' ? '业主APP' : '物业APP'} key="1" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          {activeKey === '1' && <List position={this.position} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CarouseMap;
