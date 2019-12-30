import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Table, Badge, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../../model';
import MoitoringModal from './moitoringModal';

// const FormItem = Form.Item;
// const { Option } = Select;

interface MoitoringListProps extends FormComponentProps {
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
class MoitoringList extends Component<MoitoringListProps> {
  state = {
    selectedRows: [],
    visible: false,
  };

  moitoringId: any = null;

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '监控点名称',
      dataIndex: 'monitorPointName',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '区域名称',
      dataIndex: 'areaName',
    },
    {
      title: '监控点编码',
      dataIndex: 'monitorPointCode',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '经纬度',
      dataIndex: 'coordinate',
    },
    {
      title: '出入类型',
      dataIndex: 'accessType',
      render: (text: string) => {
        if (text === '0') {
          return <span>出</span>;
        }
        if (text === '1') {
          return <span>入</span>;
        }
        return <span>--</span>;
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
        type: 'basicFacility/fetchMoitoring',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  goDetail = (record: any) => {
    this.moitoringId = record.monitorPointId;
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

  addMoitoring = () => {
    this.moitoringId = null;
    this.handleModalVisible(true);
  };

  removeMoitoring = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的监控点');
      return;
    }
    Modal.confirm({
      title: '删除监控点',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.monitorPointName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'basicFacility/removeMoitoring',
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
    } = this.props;
    return (
      <Form layout="inline">
        <Row>
          <Col span={24}>
            <div className="searchBox textRight">
              {getFieldDecorator('monitorPointName')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="请输入监控点名称"
                />,
              )}
              <Button onClick={this.search} className="defBtn">
                搜索
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { loading, basicFacility } = this.props;
    const { selectedRows, visible } = this.state;
    const { pagination } = this;

    const data = basicFacility
      ? basicFacility.moitoringData
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

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addMoitoring}>
                添加监控点
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeMoitoring}>
                  删除
                </Button>
              </Badge>
            </Col>
            <Col span={8}>{this.renderForm()}</Col>
          </Row>
        </div>
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
        <MoitoringModal
          moitoringId={this.moitoringId}
          visible={visible}
          handleVisible={this.handleModalVisible}
          getData={this.getData}
        />
      </div>
    );
  }
}

export default Form.create<MoitoringListProps>()(MoitoringList);
