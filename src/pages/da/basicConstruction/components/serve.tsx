import React, { Component } from 'react';
import { Button, Row, Col, Form, Table, Modal, message, Badge } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
// import moment from 'moment';
import { StateType } from '../model';
import ServeFormList from './addFormList';
import InfoFormList from './infoFormList';
import { downloadExcelForPost } from '@/utils/utils';
import QRcodeModal from '@/components/qrcodeModal';
import BatchQrcodeModal from '@/components/qrcodeModal/batch';

import styles from '../styles.less';

// const QRcode = require('qrcode.react');

// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');
interface BuildingsInfoProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  basicInfo?: StateType;
}

@connect(
  ({
    basicInfo,
    loading,
  }: {
    basicInfo: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicInfo,
    loading: loading.models.basicInfo,
  }),
)
class ServeInfo extends Component<BuildingsInfoProps> {
  state = {
    selectedRows: [],
    addVisible: false,
    infoVisible: false,
    isEdit: false,
    record: {},
    dlQrcodeVisible: false,
  };

  batchQrcodeData: any = [];

  pagination = {
    current: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '社区服务建设名称',
      dataIndex: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => this.showInfoModel(record)}>{text}</a>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'pic',
    },
    {
      title: '联系方式',
      dataIndex: 'contactTel',
    },
    {
      title: '服务时间',
      dataIndex: 'serviceTime',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },

    {
      title: '二维码',
      dataIndex: 'qrCodeUrl',
      render: (text: string, record: any) => (
        <QRcodeModal value="https://www.baidu.com" title={record.name} />
      ),
    },
  ];

  componentWillMount() {
    this.getData();
  }

  onSelect = (selectedKeys: any, info: any) => {
    console.log('selected', selectedKeys, info);
  };

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicInfo/getServeList',
        payload: {
          // ...this.pagination,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  rowOnChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({
      selectedRows,
    });
  };

  showInfoModel = (record: any) => {
    this.setState({
      infoVisible: true,
      record,
      isEdit: false,
    });
  };

  showAddModal = () => {
    this.setState({
      addVisible: true,
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      addVisible: !!flag,
      infoVisible: !!flag,
      isEdit: false,
    });
  };

  handleCancel = () => {
    this.setState({
      addVisible: false,
      infoVisible: false,
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
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'basicInfo/removeServeItem',
            payload: selectedRows.map((row: any) => row.id),
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

  handleIsEdit = (flag?: boolean) => {
    this.setState({
      isEdit: !!flag,
    });
  };

  exportExcle = () => {
    // exportFile('/api/web/serviceBuildInfo/v1/export');
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicInfo/exportData',
        payload: {
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          downloadExcelForPost(res, '社区服务建设.xlsx');
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
      message.info('请勾选你要下载的二维码的社区服务建设');
      return;
    }
    this.batchQrcodeData = selectedRows.map((item: any) => ({
      title: item.name,
      value: 'https://www.baidu.com',
    }));
    this.handleQrcodeVisible(true);
  };

  render() {
    const { loading, basicInfo } = this.props;
    const { selectedRows, isEdit, dlQrcodeVisible } = this.state;
    const { pagination } = this;
    // const { serveList } = basicInfo

    const serveList = basicInfo
      ? basicInfo.serveList
      : {
          total: 0,
          data: [],
        };
    const paginationProps = {
      total: serveList.total,
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelection = {
      selectedRowKeys: selectedRows.map((row: any) => row.id),
      onChange: this.rowOnChange,
    };
    const { addVisible, infoVisible } = this.state;

    const formListProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      record: this.state.record,
      isEdit: this.state.isEdit,
    };

    const batchProps = {
      visible: dlQrcodeVisible,
      handleVisible: this.handleQrcodeVisible,
      data: this.batchQrcodeData,
      zipTitle: '社区服务建设二维码',
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="greenBtn btnStyle" onClick={this.showAddModal}>
                添加社区服务建设信息
              </Button>
              <Badge count={selectedRows.length}>
                <Button onClick={this.remove} className="blueBtn">
                  删除
                </Button>
              </Badge>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="orangeBtn btnStyle" onClick={this.downLoadQrcode}>
                批量下载二维码
              </Button>
              <Button className="transparentBtn" type="primary" onClick={this.exportExcle}>
                数据导出
              </Button>
            </Col>
          </Row>
        </div>
        <div className="tableBox">
          <Table
            columns={this.columns}
            dataSource={serveList.data}
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
        <Modal
          width={680}
          title="添加社区服务建设信息"
          visible={addVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <ServeFormList {...formListProps} />
        </Modal>

        <Modal
          width={680}
          title="社区服务建设信息"
          visible={infoVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={styles.resTagBtnBox}>
            {!isEdit ? (
              <Button type="primary" onClick={() => this.handleIsEdit(true)}>
                编辑
              </Button>
            ) : null}
          </div>
          <InfoFormList {...formListProps} />
        </Modal>
        <BatchQrcodeModal {...batchProps} />
      </div>
    );
  }
}

export default Form.create<BuildingsInfoProps>()(ServeInfo);
