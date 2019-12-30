import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Table, Badge, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import { downloadExcelForPost } from '@/utils/utils';
import DetailModal from './detailModal';

interface RegistrationListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  organization?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    organization,
    loading,
  }: {
    organization: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    organization,
    loading: loading.models.organization,
  }),
)
class RegistrationList extends Component<RegistrationListProps> {
  state = {
    selectedRows: [],
    detailVisible: false,
    record: {},
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  userId = null;

  columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      render: (text: string, record: any) => <a onClick={() => this.showDetail(record)}>{text}</a>,
    },
    {
      title: '职业',
      dataIndex: 'post',
    },
    {
      title: '联系方式',
      dataIndex: 'phonenumber',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      // render: (text: any) => (
      //   <span>{text ? text.map((item: any) => item.deptName).join(',') : '--'}</span>
      // ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'organization/fetch',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          // isSysUser: '1',
        },
      });
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

  exportData = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      if (dispatch) {
        dispatch({
          type: 'organization/exportData',
          payload: {
            ...values,
            pageNum: 1,
            pageSize: 2000,
          },
          callback: (res: any) => {
            downloadExcelForPost(res, '社区组织管理人员.xlsx');
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

  showDetail = (record: any) => {
    this.userId = record.userId;
    this.setState({
      record,
    });
    this.handelDetailVisible(true);
  };

  handelDetailVisible = (flag: boolean) => {
    this.setState({
      detailVisible: !!flag,
    });
  };

  addMember = () => {
    this.userId = null;
    this.handelDetailVisible(true);
  };

  handleCancel = () => {
    this.setState({
      detailVisible: false,
    });
  };

  removeMember = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的人员');
      return;
    }
    Modal.confirm({
      title: '删除人员',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.userName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'organization/remove',
            payload: {
              ids: selectedRows.map((item: any) => item.userId),
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
        <Row type="flex" justify="space-between">
          <Col span={5}></Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入关键字"
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
    const { loading, organization } = this.props;
    const { selectedRows, detailVisible, record } = this.state;
    const { pagination } = this;

    const data = organization
      ? organization.data
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
      selectedRowKeys: selectedRows.map((row: any) => row.userId),
      onChange: this.rowOnChange,
    };

    const detailModalProps = {
      userId: this.userId,
      handleCancel: this.handleCancel,
      record,
      visible: detailVisible,
      getData: this.getData,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addMember}>
                添加社区管理人员
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeMember}>
                  删除社区管理人员
                </Button>
              </Badge>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="transparentBtn" type="primary" onClick={this.exportData}>
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
            rowKey="userId"
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
        <DetailModal {...detailModalProps} />
      </div>
    );
  }
}

export default Form.create<RegistrationListProps>()(RegistrationList);
