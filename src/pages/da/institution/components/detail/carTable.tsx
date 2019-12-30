import React, { Component } from 'react';
import { Button, Row, Col, Badge, Form, Select, Table, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import Router from 'umi/router';
import { StateType } from '../../model';
import styles from '../../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface CarTableProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  institution?: StateType;
  detailData: any;
  companyId: any;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    institution,
    loading,
  }: {
    institution: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    institution,
    loading: loading.models.institution,
  }),
)
class CarTable extends Component<CarTableProps> {
  state = {
    selectedRows: [],
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {
    companyId: '',
  };

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
          typeText = '月卡';
        } else if (text === 'times') {
          typeText = '次卡';
        }
        return <span>{typeText}</span>;
      },
    },
    {
      title: '停车卡有效期',
      dataIndex: 'pcExpireDate',
      // render: (time: any) => <span>{moment(time).format('YYYY-MM-DD')}</span>,
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
    {
      title: '操作',
      render: (text: number, record: any) => (
        <Button type="primary" className="greenBtn btnStyle" onClick={() => this.goEditCar(record)}>
          修改
        </Button>
      ),
    },
  ];

  componentDidMount() {
    // const { form } = this.props;
    // form.onValuesChange = this.onValuesChange;
    this.getData();
  }

  getData = () => {
    const { dispatch, companyId } = this.props;
    if (dispatch) {
      dispatch({
        type: 'institution/fetchCarList',
        payload: {
          ...this.formValues,
          companyId,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  goDetail = (record: any) => {
    Router.push(`/da/institution/carDetail?carId=${record.carId}`);
  };

  goAddCar = () => {
    const { detailData } = this.props;
    Router.push(`/da/Institution/addCarInfo?companyId=${detailData.companyId}`);
  };

  goEditCar = (record: any) => {
    const { detailData } = this.props;
    Router.push(
      `/da/Institution/addCarInfo?companyId=${detailData.companyId}&carId=${record.carId}`,
    );
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
          您确定要删除车牌号为<a>{selectedRows.map((row: any) => row.lpCode).join('、')}</a>
          的车辆吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'institution/removeCar',
            payload: {
              ids: selectedRows.map((row: any) => row.carId),
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
          <Col span={8}>
            <FormItem
              label="停车卡状态"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('pcStatus')(
                <Select placeholder="请选择停车卡状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="0">到期</Option>
                  <Option value="1">正常</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              label="卡类型"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('pcType')(
                <Select placeholder="请选择卡类型" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="month">月卡</Option>
                  <Option value="times">次卡</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          {/* <Col span={8}>
            <div className="searchBox textRight">
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col> */}
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, institution } = this.props;

    const data = institution
      ? institution.carData
      : {
          total: 0,
          data: [],
        };

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
      selectedRowKeys: selectedRows.map((row: any) => row.carId),
      onChange: this.rowOnChange,
    };

    return (
      <div className={styles.memberTable}>
        <div className="contentCart noShadow">
          <div className={styles.mbtBtnBox}>
            <Button className="orangeBtn" onClick={this.goAddCar}>
              添加单位车辆
            </Button>
            <Badge count={selectedRows.length}>
              <Button className="blueBtn" onClick={this.remove}>
                删除车辆
              </Button>
            </Badge>
          </div>
          <div className="formBox">{this.renderForm()}</div>
          <div className="tableBox" style={{ marginTop: 10 }}>
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
        </div>
      </div>
    );
  }
}

export default Form.create<CarTableProps>()(CarTable);
