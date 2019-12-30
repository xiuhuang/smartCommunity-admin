import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Row, Col, Form, DatePicker, Input, Table, Modal, message, Card, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface RecordProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  affairsReport: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

/* eslint react/no-multi-comp:0 */
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
class Report extends Component<RecordProps> {
  state = {
    activeKey: '1',
    selectedRows: [],
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '车牌号',
      dataIndex: 'title',
      render: (text: string, record: any) => <a>{text}</a>,
    },
    {
      title: '车辆分类',
      dataIndex: 'name',
    },
    {
      title: '缴费费用（元）',
      dataIndex: 'no',
    },
    {
      title: '卡类型',
      dataIndex: '',
    },
    {
      title: '入场时间',
      dataIndex: 'createTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '出场时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '收费人/单位',
      dataIndex: 'phone',
    },
    {
      title: '缴费时间',
      dataIndex: 'time',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '收据单号',
      dataIndex: 'status',
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
        ...this.formValues,
        ...this.pagination,
      },
    });
  };

  remove = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (selectedRows.length === 0) {
      message.info('请勾选您要删除的数据');
      return;
    }
    Modal.confirm({
      title: '温馨提示',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.name).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '删除',
      onOk: () => {
        dispatch({
          type: 'affairsReport/remove',
          payload: {
            ids: selectedRows.map((row: any) => row.id),
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              this.setState({
                selectedRows: [],
              });
              this.pagination.current = 1;
              this.getData();
            }
          },
        });
      },
    });
  };

  search = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.time && fieldsValue.time.length > 0) {
        fieldsValue.time = `${fieldsValue.time[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.time[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.time = undefined;
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.formValues = values;
      this.pagination.current = 1;
      this.getData();
    });
  };

  rowOnChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({
      selectedRows,
    });
  };

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row type="flex" justify="space-between">
          <Col span={5}>
            <FormItem label="选择时间段" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('time')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  onChange={() => setTimeout(this.search)}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入姓名、身份证"
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderTitle = () => {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey}>
        <TabPane tab="停车费缴纳记录" key="1" />
      </Tabs>
    );
  };

  render() {
    const {
      loading,
      affairsReport: { data },
    } = this.props;

    const { selectedRows, activeKey } = this.state;

    const { pagination } = this;

    const paginationProps = {
      total: data.total,
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelection = {
      selectedRowKeys: selectedRows.map((row: any) => row.id),
      onChange: this.rowOnChange,
    };

    return (
      <PageHeaderWrapper>
        <Card className="contentCart titleTabs" bordered={false} title={this.renderTitle()}>
          <div className="formBox">{this.renderForm()}</div>
          {activeKey === '1' && (
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
                rowSelection={rowSelection}
                pagination={paginationProps}
                onChange={this.paginationOnChange}
              />
            </div>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<RecordProps>()(Report);
