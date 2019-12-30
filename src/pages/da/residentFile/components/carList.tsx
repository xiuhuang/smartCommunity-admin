import React, { Component } from 'react';
import { Row, Col, Button, Form, Select, Input, Table, Badge, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
// import moment from 'moment';
import Router from 'umi/router';
import { StateType } from '../model';
import { downloadExcelForPost } from '@/utils/utils';
import CarTag from './carTag';

const FormItem = Form.Item;
const { Option } = Select;

interface CarListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  residentFile?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    residentFile,
    loading,
  }: {
    residentFile: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    residentFile,
    loading: loading.models.residentFile,
  }),
)
class CarList extends Component<CarListProps> {
  state = {
    selectedRows: [],
    tagVisible: false,
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '车牌号',
      dataIndex: 'lpCode',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '车主',
      dataIndex: 'residentName',
    },
    {
      title: '停车卡号',
      dataIndex: 'pcCode',
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: '卡类型',
      dataIndex: 'pcType',
      render: (text: string) => {
        let typeText = '--';
        if (text === 'month') {
          typeText = '月租卡';
        } else if (text === 'times') {
          typeText = '次卡';
        }
        return <span>{typeText}</span>;
      },
    },
    {
      title: '停车卡有效期',
      dataIndex: 'pcExpireDate',
      // render: (time: any) => <span>{time ? moment(time).format('YYYY-MM-DD') : '--'}</span>,
    },
    {
      title: '停车卡状态',
      dataIndex: 'pcStatus',
      render: (text: string) => {
        let newText = '';
        if (text === '1') {
          newText = '正常';
        } else if (text === '0') {
          newText = '到期';
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
        type: 'residentFile/fetchCarList',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  goDetail = (record: any) => {
    if (record.ownType === '1') {
      Router.push(`/da/residentFile/carDetailForUnit?carId=${record.carId}`);
    } else {
      Router.push(
        `/da/residentFile/carDetail?carId=${record.carId}&residentId=${record.residentId}`,
      );
    }
  };

  search = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.formValues = values;
      this.pagination.current = 1;
      this.getData();
    });
  };

  exportExcle = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/exportCarData',
        payload: {
          ...this.formValues,
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          downloadExcelForPost(res, '社区车辆档案.xlsx');
        },
      });
    }
  };

  removeCar = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的车辆');
      return;
    }
    Modal.confirm({
      title: '删除车辆',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.lpCode).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'residentFile/removeCar',
            payload: {
              ids: selectedRows.map((item: any) => item.carId),
            },
            callback: (res: any) => {
              if (res.code === '200') {
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

  handleCarTag = (flag?: boolean) => {
    this.setState({
      tagVisible: !!flag,
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

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem
              label="停车卡状态"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('pcStatus')(
                <Select placeholder="请选择停车卡状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="1">正常</Option>
                  <Option value="0">到期</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="卡类型"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('pcType')(
                <Select placeholder="请选择卡类型" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="month">月租卡</Option>
                  <Option value="times">次卡</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            {/* <FormItem
              label="重点关注"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('focus')(
                <Select placeholder="请选择重点关注">
                  <Option value="0">不限</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>,
              )}
            </FormItem> */}
          </Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('lpCodeOrPerson')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入车牌号、车主"
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { loading, residentFile } = this.props;
    const { selectedRows, tagVisible } = this.state;
    const { pagination } = this;

    const data = residentFile
      ? residentFile.carList
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
      selectedRowKeys: selectedRows.map((row: any) => row.carId),
      onChange: this.rowOnChange,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn" onClick={this.removeCar}>
                  删除车辆
                </Button>
              </Badge>
              <Button className="greenBtn btnStyle" onClick={() => this.handleCarTag(true)}>
                车辆标签管理
              </Button>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="transparentBtn" type="primary" onClick={this.exportExcle}>
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
            rowKey="carId"
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
        <CarTag visible={tagVisible} handleVisible={this.handleCarTag} />
      </div>
    );
  }
}

export default Form.create<CarListProps>()(CarList);
