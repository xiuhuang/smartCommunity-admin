import React, { Component } from 'react';
import { Row, Col, Button, Form, Select, Input, Table, Badge, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../../model';
import FacilityTag from './tag';
import { downloadExcelForPost } from '@/utils/utils';
import QRcodeModal from '@/components/qrcodeModal';
import BatchQrcodeModal from '@/components/qrcodeModal/batch';
import FacilityInfoModal from './facilityInfoModal';

// const QRcode = require('qrcode.react');

const FormItem = Form.Item;
const { Option } = Select;

interface FacilityListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  basicFacility?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    basicFacility,
    loading,
  }: {
    basicFacility: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicFacility,
    loading: loading.models.basicFacility,
  }),
)
class FacilityList extends Component<FacilityListProps> {
  state = {
    selectedRows: [],
    tagVisible: false,
    visible: false,
    dlQrcodeVisible: false,
  };

  facilityId: any = null;

  batchQrcodeData: any = [];

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '社区设备名称',
      dataIndex: 'deviceName',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '负责人/检修人',
      dataIndex: 'maintenanceMan',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceTypeName',
    },
    {
      title: '设备分组',
      dataIndex: 'deviceGroupName',
    },
    {
      title: '设备地址',
      dataIndex: 'address',
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      render: (text: string) => {
        let newText = '';
        if (text === '0') {
          newText = '未连接';
        } else if (text === '1') {
          newText = '正常';
        } else if (text === '2') {
          newText = '异常';
        } else if (text === '3') {
          newText = '网络不良';
        }
        return <span>{newText}</span>;
      },
    },
    {
      title: '二维码',
      render: (text: number, record: any) => (
        <QRcodeModal value="https://www.baidu.com" title={record.deviceName} />
      ),
    },
  ];

  componentDidMount() {
    this.getData();
    this.getDeviceTypeList();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchFacility',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  getDeviceTypeList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchTypeBrandTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
    }
  };

  goDetail = (record: any) => {
    this.facilityId = record.deviceId;
    this.handleModalVisible(true);
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

  handleFacilityTag = (flag?: boolean) => {
    this.setState({
      tagVisible: !!flag,
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
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

  addFacility = () => {
    this.facilityId = null;
    // Router.push('/da/basicFacility/addFacility');
    this.handleModalVisible(true);
  };

  removeFacility = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的设备设施');
      return;
    }
    Modal.confirm({
      title: '删除设备设施',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.deviceName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'basicFacility/removeFacility',
            payload: {
              ids: selectedRows.map((item: any) => item.id),
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

  renderForm = () => {
    const {
      form: { getFieldDecorator },
      basicFacility,
    } = this.props;
    const deviceTypeList = basicFacility ? basicFacility.typeBrandTagList : [];
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem
              label="设备类型:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('deviceTypeId')(
                <Select
                  placeholder="请选择设备类型:"
                  mode="multiple"
                  showArrow
                  onChange={() => setTimeout(this.search)}
                >
                  {deviceTypeList &&
                    deviceTypeList.map((item: any) => (
                      <Option value={item.deviceTypeId} key={item.deviceTypeId}>
                        {item.deviceTypeName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="设备状态:"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择设备状态:"
                  showArrow
                  onChange={() => setTimeout(this.search)}
                >
                  <Option value="">不限</Option>
                  <Option value="0">未连接</Option>
                  <Option value="1">正常</Option>
                  <Option value="2">异常</Option>
                  <Option value="3">网络不良</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}></Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('deviceName')(
                <Input
                  style={{ width: 220 }}
                  placeholder="请输入社区设备名称"
                  onPressEnter={() => setTimeout(this.search)}
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  exportExcle = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/exportFile',
        payload: {},
        callback: (res: any) => {
          downloadExcelForPost(res, '社区设备设施.xlsx');
        },
      });
    }
  };

  handleQrcodeVisible = (flag?: boolean) => {
    this.setState({
      dlQrcodeVisible: !!flag,
    });
  };

  downLoadQrcode = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      message.info('请勾选你要下载的二维码的社区设备');
      return;
    }
    this.batchQrcodeData = selectedRows.map((item: any) => ({
      title: item.deviceName,
      value: 'https://www.baidu.com',
    }));
    this.handleQrcodeVisible(true);
  };

  render() {
    const { loading, basicFacility } = this.props;
    const { selectedRows, tagVisible, visible, dlQrcodeVisible } = this.state;
    const { pagination } = this;

    const data = basicFacility
      ? basicFacility.facilityData
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

    const batchProps = {
      visible: dlQrcodeVisible,
      handleVisible: this.handleQrcodeVisible,
      data: this.batchQrcodeData,
      zipTitle: '社区设备二维码',
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addFacility}>
                添加社区设备信息
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeFacility}>
                  删除
                </Button>
              </Badge>
              <Button className="greenBtn btnStyle" onClick={() => this.handleFacilityTag(true)}>
                编辑设备分组
              </Button>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="transparentBtn" onClick={this.downLoadQrcode}>
                批量下载二维码
              </Button>
              <Button className="transparentBtn" onClick={this.exportExcle}>
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
          />
        </div>
        <FacilityInfoModal
          facilityId={this.facilityId}
          visible={visible}
          handleVisible={this.handleModalVisible}
          getData={this.getData}
        />
        <FacilityTag visible={tagVisible} handleVisible={this.handleFacilityTag} />
        <BatchQrcodeModal {...batchProps} />
      </div>
    );
  }
}

export default Form.create<FacilityListProps>()(FacilityList);
