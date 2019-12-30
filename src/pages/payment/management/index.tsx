import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Select,
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
import Router from 'umi/router';
import { StateType } from './model';
import AddFormList from './components/addFormList';
import SettingFormList from './components/settingFormList';

const FormItem = Form.Item;
const { Option } = Select;
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
    visible: false,
    settingVisible: false,
    activeKey: '1',
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '户主',
      dataIndex: 'title',
    },
    {
      title: '住户号',
      dataIndex: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '物业费缴纳情况',
      dataIndex: 'status',
      render: (text: number) => <span>已缴纳</span>,
    },
    {
      title: '缴纳时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'type',
      render: (text: string, record: any) => (
        <Button className="btnStyle greenBtn" onClick={() => this.routerToDetail(record)}>
          查看缴费详情
        </Button>
      ),
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

  routerToDetail = (record: any) => {
    Router.push(`/payment/management/detail/${record.id}`);
  };

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'affairsReport/fetch',
      payload: {
        ...this.formValues,
        // ...this.pagination,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
      },
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  handleSettingVisible = (flag?: boolean) => {
    this.setState({
      settingVisible: !!flag,
    });
  };

  showAddModel = () => {
    this.handleVisible(true);
  };

  showSettingModel = () => {
    this.handleSettingVisible(true);
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
      if (fieldsValue.time) {
        fieldsValue.time = `${momentTime(fieldsValue.time[0])} ~ ${momentTime(
          fieldsValue.time[1],
        )}`;
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
                  placeholder="请选择楼栋信息"
                  onChange={() => setTimeout(this.search)}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="物业费缴纳情况"
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
          <Col span={5}></Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入姓名、身份证号"
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

  renderBtnList() {
    return (
      <Row className="topBtn">
        <Col span={16}>
          <Button className="darkGreenBtn btnStyle" onClick={() => this.showAddModel()}>
            添加物业费记录
          </Button>
          <Button className="orangeBtn btnStyle" onClick={() => this.showSettingModel()}>
            物业费用设置
          </Button>
          <Button className="blueBtn btnStyle">模版下载</Button>
          <Button className="greenBtn btnStyle">批量导入</Button>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Button className="transparentBtn">数据导出</Button>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      loading,
      affairsReport: { data },
    } = this.props;

    const { selectedRows, visible, settingVisible } = this.state;

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

    const formListProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      handleSettingVisible: this.handleSettingVisible,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false} className="contentCart titleTabs" title={this.renderTitle()}>
          {this.renderBtnList()}
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
        <Modal
          title="添加物业费记录"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <AddFormList {...formListProps} />
        </Modal>

        <Modal
          title="物业费费用设置"
          visible={settingVisible}
          onCancel={() => this.handleSettingVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <SettingFormList {...formListProps} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<RecordProps>()(Report);
