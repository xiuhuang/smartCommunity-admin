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
  // Drawer,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import { downloadExcelForPost } from '@/utils/utils';
import EditModal from './editModal';
// import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface RecordProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  affairsComplaint?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    affairsComplaint,
    loading,
  }: {
    affairsComplaint: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    affairsComplaint,
    loading: loading.models.affairsComplaint,
  }),
)
class Report extends Component<RecordProps> {
  state = {
    selectedRows: [],
    visible: false,
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  complaintId = null;

  formValues = {};

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '姓名',
      dataIndex: 'residentName',
    },
    {
      title: '住户号',
      dataIndex: 'houseName',
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    // {
    //   title: '预约时间',
    //   dataIndex: 'updateTime',
    //   render: (text: number) => <span>{momentTime(text)}</span>,
    // },
    {
      title: '受理时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{text ? momentTime(text) : '--'}</span>,
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
        type: 'affairsComplaint/fetch',
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
    this.complaintId = record.complaintId;
    this.handleVisible(true);
  };

  remove = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (selectedRows.length === 0) {
      message.info('请勾选您要删除的居民投诉');
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
            type: 'affairsComplaint/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.complaintId),
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
          type: 'affairsComplaint/exportData',
          payload: {
            ...values,
            pageNum: 1,
            pageSize: 2000,
          },
          callback: (res: any) => {
            downloadExcelForPost(res, '居民投诉.xlsx');
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
    const { loading, affairsComplaint } = this.props;

    const { selectedRows, visible } = this.state;
    const data = affairsComplaint
      ? affairsComplaint.data
      : {
          total: 0,
          data: [],
        };
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

    const editModalProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      visible,
      complaintId: this.complaintId,
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
        <EditModal {...editModalProps} />
      </div>
    );
  }
}

export default Form.create<RecordProps>()(Report);
