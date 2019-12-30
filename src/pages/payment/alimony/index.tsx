import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Input,
  Table,
  Modal,
  message,
  Cascader,
  Tabs,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
// import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;
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
    selectedRows: [],
    activeKey: '1',
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '缴费人',
      dataIndex: 'title',
      render: (text: string, record: any) => <a>{text}</a>,
    },
    {
      title: '住户号',
      dataIndex: 'name',
    },
    {
      title: '金额（元）',
      dataIndex: 'no',
    },
    {
      title: '缴费方式',
      dataIndex: 'phone',
    },
    {
      title: '缴费类型',
      dataIndex: '',
    },
    {
      title: '收费人/单位',
      dataIndex: 'time',
    },
    {
      title: '缴纳时间',
      dataIndex: 'createTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '收据单号',
      dataIndex: 'status',
    },
  ];

  options = [
    {
      value: 'A区',
      label: 'A区',
      children: [
        {
          value: '20栋',
          label: '20栋',
          children: [
            {
              value: '1单元',
              label: '1单元',
              children: [
                {
                  value: '101室',
                  label: '101室',
                },
                {
                  value: '102室',
                  label: '102室',
                },
                {
                  value: '103室',
                  label: '103室',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      value: 'B区',
      label: 'B区',
      children: [
        {
          value: '23栋',
          label: '23栋',
          children: [
            {
              value: '5单元',
              label: '5单元',
              children: [
                {
                  value: '201室',
                  label: '201室',
                },
                {
                  value: '202室',
                  label: '202室',
                },
                {
                  value: '303室',
                  label: '303室',
                },
              ],
            },
          ],
        },
      ],
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
        <Row>
          <Col span={5}>
            <Form className="chooseTime">
              <FormItem label="选择时间" labelCol={{ span: 3 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('time')(
                  <RangePicker
                    onChange={() => setTimeout(this.search)}
                    placeholder={['开始时间', '结束时间']}
                  />,
                )}
              </FormItem>
            </Form>
          </Col>
          <Col span={5} className="cascaderBox">
            <FormItem
              label="居民楼栋"
              style={{ width: '100%' }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
            >
              {getFieldDecorator('building')(
                <Cascader
                  className="cascader"
                  options={this.options}
                  placeholder="请选择居民楼栋"
                  onChange={() => setTimeout(this.search)}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="处理状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('status')(
                <Select placeholder="请选择处理状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="1">待处理</Option>
                  <Option value="2">已处理</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 200 }}
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

  renderTitle() {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey}>
        <TabPane tab="停车费缴纳记录" key="1" />
      </Tabs>
    );
  }

  render() {
    const {
      loading,
      affairsReport: { data },
    } = this.props;

    const { selectedRows } = this.state;

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
        <Card bordered={false} className="contentCart titleTabs" title={this.renderTitle()}>
          <Row className="topBtn">
            <Col span={16}></Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="transparentBtn" type="primary">
                数据导出
              </Button>
            </Col>
          </Row>
          <div className="formBox">{this.renderForm()}</div>
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<RecordProps>()(Report);
