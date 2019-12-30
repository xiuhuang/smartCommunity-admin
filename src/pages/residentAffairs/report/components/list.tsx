import React, { Component } from 'react';
import {
  Button,
  Row,
  Col,
  Badge,
  Form,
  Select,
  DatePicker,
  Input,
  Table,
  Modal,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
// import moment from 'moment';
import { StateType } from '../model';
import { downloadExcelForPost } from '@/utils/utils';
import EditReportModal from './editReportModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface RecordProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  affairsReport?: StateType;
}

// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

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
  };

  repairId = null;

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '事务类型',
      dataIndex: 'repairTypeName',
    },
    {
      title: '提请人',
      dataIndex: 'residentName',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentDate',
    },
    {
      title: '受理时间',
      dataIndex: 'updateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string) => {
        let newText = '';
        if (text === 'WaitSolve') {
          newText = '待处理';
        } else if (text === 'ReSolved') {
          newText = '已处理';
        } else if (text === 'PreSovle') {
          newText = '待处理';
        } else if (text === 'Cancel') {
          newText = '撤销';
        }
        return <span>{newText}</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'affairsReport/fetch',
        payload: {
          ...this.formValues,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.current,
        },
      });
    }
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  showDrawer = (record: any) => {
    // console.log(record);
    this.repairId = record.repairId;
    this.handleVisible(true);
  };

  remove = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    let isAllProcess = true;
    if (selectedRows.length === 0) {
      message.info('请勾选您要删除的居民报事');
      return;
    }
    selectedRows.forEach((item: any) => {
      if (item.status === 'WaitSolve') {
        isAllProcess = false;
      }
    });
    if (!isAllProcess) {
      message.info('未受理的居民报事不能直接删除，请重新勾选');
      return;
    }
    Modal.confirm({
      title: '温馨提示',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.title).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '删除',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'affairsReport/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.repairId),
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
        }
      },
    });
  };

  search = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.applyTimeScope && fieldsValue.applyTimeScope.length > 0) {
        fieldsValue.applyTimeScope = `${fieldsValue.applyTimeScope[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.applyTimeScope[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.applyTimeScope = undefined;
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

  exportData = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.applyTimeScope && fieldsValue.applyTimeScope.length > 0) {
        fieldsValue.applyTimeScope = `${fieldsValue.applyTimeScope[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.applyTimeScope[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.applyTimeScope = undefined;
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      if (dispatch) {
        dispatch({
          type: 'affairsReport/exportData',
          payload: {
            ...values,
            pageNum: 1,
            pageSize: 2000,
          },
          callback: (res: any) => {
            downloadExcelForPost(res, '居民报事.xlsx');
          },
        });
      }
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
          <Col span={7}>
            <FormItem label="申请时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('applyTimeScope')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  onChange={() => setTimeout(this.search)}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem
              label="处理状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('status')(
                <Select placeholder="请选择处理状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="WaitSolve">待处理</Option>
                  <Option value="ReSolved">已处理</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入姓名或者标题等"
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, affairsReport } = this.props;

    const { selectedRows, visible } = this.state;

    const { pagination } = this;
    const data = affairsReport
      ? affairsReport.data
      : {
          total: 0,
          data: [],
        };
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

    const addReportModalProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      visible,
      repairId: this.repairId,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn" onClick={this.remove}>
                  删除
                </Button>
              </Badge>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="transparentBtn" onClick={this.exportData}>
                数据导出
              </Button>
            </Col>
          </Row>
        </div>
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
            scroll={{ x: true }}
          />
        </div>
        <EditReportModal {...addReportModalProps} />
      </div>
    );
  }
}

export default Form.create<RecordProps>()(Report);
