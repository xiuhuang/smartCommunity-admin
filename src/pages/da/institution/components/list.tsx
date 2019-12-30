import React, { Component } from 'react';
import { Button, Row, Col, Badge, Form, Table, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import Router from 'umi/router';
import moment from 'moment';
import { downloadExcelForPost } from '@/utils/utils';
import { StateType } from '../model';

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface InstitutionProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  institution?: StateType;
}

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
class Institution extends Component<InstitutionProps> {
  state = {
    selectedRows: [],
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '经营者姓名/法人',
      dataIndex: 'legalPerson',
    },
    {
      title: '联系方式',
      dataIndex: 'legalPhone',
    },
    {
      title: '使用房屋地址',
      dataIndex: 'address',
    },
    {
      title: '房屋所有权人',
      dataIndex: 'proPerson',
    },
    {
      title: '操作',
      render: (text: number, record: any) => (
        <span className="topBtn noMargin">
          <Button className="greenBtn" onClick={() => this.goEditInstitution(record)}>
            修改
          </Button>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'institution/fetch',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  goDetail = (record: any) => {
    Router.push(`/da/Institution/detail/${record.companyId}/1`);
  };

  goEditInstitution = (record: any) => {
    Router.push(`/da/Institution/edit/${record.companyId}`);
  };

  goAddInstitution = (record: any) => {
    Router.push('/da/Institution/add');
  };

  remove = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (selectedRows.length === 0) {
      message.info('请勾选您要删除的单位');
      return;
    }
    Modal.confirm({
      title: '温馨提示',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.companyName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'institution/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.companyId),
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

  exportExcle = () => {
    // exportFile('/api/smart/basecompanyinfo/v1/export');
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'institution/exportFile',
        payload: {},
        callback: (res: any) => {
          downloadExcelForPost(res, '社区实有单位档案.xlsx');
        },
      });
    }
  };

  renderTitle() {
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12} className="topBtn noMargin">
          <Button type="primary" className="orangeBtn" onClick={this.goAddInstitution}>
            添加单位
          </Button>
          <Badge count={selectedRows.length}>
            <Button type="primary" className="blueBtn" onClick={this.remove}>
              删除单位
            </Button>
          </Badge>
        </Col>
        <Col span={12} className="topRight">
          <Button type="primary" onClick={this.exportExcle}>
            数据导出
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { loading, institution } = this.props;

    const { selectedRows } = this.state;

    const { pagination } = this;
    const data =
      institution && institution.data
        ? institution.data
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
      selectedRowKeys: selectedRows.map((row: any) => row.companyId),
      onChange: this.rowOnChange,
    };

    return (
      <div>
        {this.renderTitle()}
        <div className="tableBox">
          <Table
            columns={this.columns}
            dataSource={data.data}
            bordered
            rowKey="companyId"
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
    );
  }
}

export default Form.create<InstitutionProps>()(Institution);
