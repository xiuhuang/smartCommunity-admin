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
import moment from 'moment';
import { StateType } from '../model';
import { downloadExcelForPost } from '@/utils/utils';
import FormList from './formList';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface VehicleProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  vehicle?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

@connect(
  ({
    vehicle,
    loading,
  }: {
    vehicle: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    vehicle,
    loading: loading.models.vehicle,
  }),
)
class Vehicle extends Component<VehicleProps> {
  state = {
    selectedRows: [],
    visible: false,
    record: '',
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '姓名',
      dataIndex: 'cusName',
      render: (text: string, record: any) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '联系方式',
      dataIndex: 'cusPhone',
    },
    {
      title: '住户号',
      dataIndex: 'houseFullName',
    },
    {
      title: '车牌号码',
      dataIndex: 'lpCode',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '审核人',
      dataIndex: 'operatorName',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      render: (text: string) => {
        if (text === '0') {
          text = '待审批';
        } else if (text === '1') {
          text = '审批通过';
        } else if (text === '2') {
          text = '审批拒绝';
        } else if (text === '3') {
          text = '取消认证';
        }
        return <span>{text}</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'vehicle/getDate',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
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
    this.setState({
      record,
    });
    this.handleVisible(true);
  };

  rowOnChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({
      selectedRows,
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
          您确定要删除<a>{selectedRows.map((row: any) => row.cusName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'vehicle/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.auditId),
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
      if (fieldsValue.applyTime && fieldsValue.applyTime.length > 0) {
        fieldsValue.applyTime = `${fieldsValue.applyTime[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.applyTime[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.applyTime = undefined;
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

  export = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.applyTime && fieldsValue.applyTime.length > 0) {
        fieldsValue.applyTime = `${fieldsValue.applyTime[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.applyTime[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.applyTime = undefined;
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.formValues = values;
      if (dispatch) {
        dispatch({
          type: 'vehicle/exportResult',
          payload: {
            ...this.formValues,
            pageNum: 1,
            pageSize: 2000,
          },
          callback: (res: any) => {
            downloadExcelForPost(res, '车辆认证.xlsx');
          },
        });
      }
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row>
          <Col span={7}>
            <FormItem label="申请时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('applyTime')(
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
              {getFieldDecorator('auditStatus')(
                <Select placeholder="请选择处理状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="0">待审批</Option>
                  <Option value="1">审批通过</Option>
                  <Option value="2">审批拒绝</Option>
                  <Option value="3">取消认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <div className="searchBox textRight">
              {getFieldDecorator('queryKey')(
                <Input
                  style={{ width: 220 }}
                  placeholder="输入姓名或联系方式"
                  onPressEnter={() => setTimeout(this.search)}
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
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12}>
          <Badge count={selectedRows.length}>
            <Button type="primary" className="blueBtn" onClick={this.remove}>
              删除
            </Button>
          </Badge>
        </Col>
        <Col span={12} className="topRight">
          <Button type="primary" onClick={this.export}>
            数据导出
          </Button>
        </Col>
      </Row>
    );
  }

  render = () => {
    const { loading, vehicle } = this.props;

    const { selectedRows, visible, record } = this.state;
    const data =
      vehicle && vehicle.data
        ? vehicle.data
        : {
            total: 0,
            data: [],
          };
    const rowSelection = {
      selectedRowKeys: selectedRows.map((row: any) => row.id),
      onChange: this.rowOnChange,
    };
    const { pagination } = this;

    const paginationProps = {
      total: data.total,
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const formListProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      record,
    };

    return (
      <div>
        <div>
          <div className="topBtn">{this.renderTitle()}</div>
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
        </div>
        <Modal
          title="认证资料"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <FormList {...formListProps} />
        </Modal>
      </div>
    );
  };
}
export default Form.create<VehicleProps>()(Vehicle);
