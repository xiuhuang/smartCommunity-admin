import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Row, Col, Form, Table, Modal, Icon } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';
import { Dispatch } from 'redux';
import styles from './styles.less';
import { StateType } from './model';
import InDetail from './components/inDetail';

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface ManagementDetailProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  affairsReport: StateType;
}

@connect(
  ({
    affairsReport,
    loading,
  }: {
    affairsReport: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    affairsReport,
    loading: loading.models.affairsReport,
  }),
)
class ManagementDetail extends Component<ManagementDetailProps> {
  state = {
    visible: false,
    record: {},
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '缴费人',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '（预）缴费月份',
      dataIndex: 'name',
    },
    {
      title: '金额（元）',
      dataIndex: 'payment',
    },
    {
      title: '收费人',
      dataIndex: 'phone',
    },
    {
      title: '缴费方式',
      dataIndex: 'method',
      render: (text: number) => <span>已缴纳</span>,
    },
    {
      title: '缴纳时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '备注',
      dataIndex: 'status',
      render: (text: string, record: any) => <span>备注</span>,
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'affairsReport/fetch',
      payload: {
        ...this.pagination,
      },
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  showDrawer = (record: any) => {
    this.setState({
      record,
    });
    this.handleVisible(true);
  };

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  renderTitle = () => (
    <Row>
      <Col span={20}></Col>
      <Col span={4} className="">
        <Button type="primary" className="transparentBtn">
          数据导出
        </Button>
      </Col>
    </Row>
  );

  render() {
    const {
      loading,
      affairsReport: { data },
    } = this.props;
    const { pagination } = this;

    const paginationProps = {
      total: data.total,
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const { visible, record } = this.state;

    const formListProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      record,
    };

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card bordered={false} className="contentCart" title={this.renderTitle()}>
          <div className={styles.payInfo}>
            <Row type="flex" justify="center" className="payDetail">
              <Col span={8}>
                <span>
                  住户号：<span className="detailText">A区20栋1单元201室</span>
                </span>
              </Col>
              <Col span={8}>
                <span>
                  户主：<span className="detailText">王楠那</span>
                </span>
              </Col>
              <Col span={8}>
                <span>
                  联系方式：<span className="detailText">13909893245</span>
                </span>
              </Col>
            </Row>
          </div>
          <div className="tableBox">
            <Table
              columns={this.columns}
              dataSource={data.data}
              bordered
              rowKey="id"
              loading={loading}
              size="middle"
              locale={{
                emptyText: '暂无数据',
              }}
              pagination={paginationProps}
              onChange={this.paginationOnChange}
            />
          </div>
        </Card>
        <Modal
          title="物业费详情"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <InDetail {...formListProps} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<ManagementDetailProps>()(ManagementDetail);
