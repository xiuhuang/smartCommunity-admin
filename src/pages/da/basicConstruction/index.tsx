import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import BuildingsInfo from './components/buildingsInfo';
import ServeInfo from './components/serve';
import { StateType } from './model';
import styles from './styles.less';

const { TabPane } = Tabs;

interface ConstructionProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  basicInfo: StateType;
}

@connect(
  ({
    basicInfo,
    loading,
  }: {
    basicInfo: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicInfo,
    loading: loading.models.basicInfo,
  }),
)
class Construction extends Component<ConstructionProps> {
  state = {
    activeKey: '1',
  };

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderTitle = () => {
    // const { basicInfo } = this.props;
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="居民房栋信息" key="1" />
        <TabPane tab="社区服务建设" key="2" />
      </Tabs>
    );
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          <div className={styles.basicInfo}>
            {activeKey === '1' && <BuildingsInfo />}
            {activeKey === '2' && <ServeInfo />}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Construction;
