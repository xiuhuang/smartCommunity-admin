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
  // Cascader,
  Tabs,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import FormList from './components/formList';
import House from '@/components/form/house';
import { downloadExcelForPost } from '@/utils/utils';
import DetailFormList from './components/detailFormList';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

interface RecordProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  deposit: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    deposit,
    loading,
  }: {
    deposit: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    deposit,
    loading: loading.models.deposit,
  }),
)
class Report extends Component<RecordProps> {
  state = {
    selectedRows: [],
    visible: false,
    detailVisible: false,
    record: {},
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
      dataIndex: 'payerName',
      render: (text: string, record: any) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '住户号',
      dataIndex: 'houseFullName',
    },
    {
      title: '押金金额（元）',
      dataIndex: 'paymentAmount',
    },
    {
      title: '缴费方式',
      dataIndex: 'collectMode',
      render: (text: string, record: any) => {
        if (text === '1') {
          return <span>现金</span>;
        }
        if (text === '2') {
          return <span>支付宝</span>;
        }
        return <span>银联</span>;
      },
    },
    {
      title: '收费人',
      dataIndex: 'collectPerson',
    },
    {
      title: '缴纳时间',
      dataIndex: 'createTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '收据单号',
      dataIndex: 'receiptNum',
    },
    {
      title: '押金状态',
      dataIndex: 'status',
      render: (text: string, record: any) => {
        if (text === '0') {
          return <span>未退还</span>;
        }
        return <span>已退还</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deposit/getData',
      payload: {
        ...this.formValues,
        // ...this.pagination,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
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
      if (fieldsValue.houseInfo && fieldsValue.houseInfo.length > 0) {
        const houseLen = fieldsValue.houseInfo.length;
        if (fieldsValue.houseInfo[houseLen - 1].level !== 'H') {
          message.info('请输入正确的住户号');
          return;
        }
        fieldsValue.houseId = fieldsValue.houseInfo[houseLen - 1].levelId;
        fieldsValue.houseFullName = fieldsValue.houseInfo.map((item: any) => item.name).join('/');
      }
      fieldsValue.houseInfo = undefined;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.formValues = values;
      this.pagination.current = 1;
      this.getData();
    });
  };

  exportData = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.houseInfo && fieldsValue.houseInfo.length > 0) {
        const houseLen = fieldsValue.houseInfo.length;
        fieldsValue.houseId = fieldsValue.houseInfo[houseLen - 1].levelId;
        fieldsValue.houseFullName = fieldsValue.houseInfo.map((item: any) => item.name).join('/');
      }
      fieldsValue.houseInfo = undefined;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'deposit/exportData',
        payload: {
          ...values,
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          downloadExcelForPost(res, '押金缴纳记录.xlsx');
        },
      });
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

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  handleDetailVisible = (flag?: boolean) => {
    this.setState({
      detailVisible: !!flag,
    });
  };

  addDeposit = () => {
    this.handleVisible(true);
  };

  showDrawer = (record: any) => {
    this.setState({
      record,
    });
    this.handleDetailVisible(true);
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
              {getFieldDecorator('houseInfo')(
                <House placeholder="请选择楼栋" onChange={() => setTimeout(this.search)} />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="押金状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('status')(
                <Select placeholder="请选择处理状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="0">未退还</Option>
                  <Option value="1">已退还</Option>
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
          <Button className="orangeBtn btnStyle" onClick={this.addDeposit}>
            添加缴纳押金记录
          </Button>
          <Button className="blueBtn btnStyle">模版下载</Button>
          <Button className="greenBtn btnStyle">批量导入</Button>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Button className="transparentBtn" onClick={this.exportData}>
            数据导出
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      loading,
      deposit: { data },
    } = this.props;

    const { selectedRows, visible, detailVisible, record } = this.state;

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
    };

    const detailFormListProps = {
      handleDetailVisible: this.handleDetailVisible,
      getData: this.getData,
      record,
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
          title="添加缴纳押金记录"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <FormList {...formListProps} />
        </Modal>
        <Modal
          title="押金详情"
          visible={detailVisible}
          onCancel={() => this.handleDetailVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <DetailFormList {...detailFormListProps} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<RecordProps>()(Report);
