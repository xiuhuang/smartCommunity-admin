import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from './model';
import Water from './components/water';
import Gas from './components/gas';
import Electricity from './components/electricity';
import styles from './styles.less';

const { TabPane } = Tabs;

interface RecordProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  lifeManage: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    lifeManage,
    loading,
  }: {
    lifeManage: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    lifeManage,
    loading: loading.models.lifeManage,
  }),
)
class Report extends Component<RecordProps> {
  state = {
    activeKey: '1',
  };

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderTitle() {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="居民水费缴纳账号" key="1" />
        <TabPane tab="居民电费缴纳账号" key="2" />
        <TabPane tab="居民燃气费缴纳账号" key="3" />
      </Tabs>
    );
  }

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          <div className={styles.basicInfo}>
            {activeKey === '1' && <Water />}
            {activeKey === '2' && <Electricity />}
            {activeKey === '3' && <Gas />}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<RecordProps>()(Report);
