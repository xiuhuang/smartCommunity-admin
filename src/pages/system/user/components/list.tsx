import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Table, Badge, message, Modal, Switch } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import DepartMent from '@/components/form/department';
import FormModal from './formModal';

const FormItem = Form.Item;

interface SystemUserListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  systemUser?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    systemUser,
    loading,
  }: {
    systemUser: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    systemUser,
    loading: loading.models.systemUser,
  }),
)
class SystemUserList extends Component<SystemUserListProps> {
  state = {
    selectedRows: [],
    visible: false,
  };

  userId: any = null;

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      render: (text: string, record: any) => <a onClick={() => this.edit(record)}>{text}</a>,
    },
    {
      title: '登陆账号',
      dataIndex: 'loginName',
    },
    {
      title: '联系电话',
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
      title: '用户角色',
      dataIndex: 'roleName',
      // render: (text: any) => (
      //   <span>{text ? text.map((item: any) => item.deptName).join(',') : '--'}</span>
      // ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string, record: any) => (
        <Switch
          checkedChildren="开启"
          unCheckedChildren="停用"
          checked={text === '0'}
          onChange={(checked: boolean) => this.changStatus(checked, record)}
        />
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
        type: 'systemUser/fetch',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          isSysUser: '1',
        },
      });
    }
  };

  changStatus = (checked: boolean, record: any) => {
    const { dispatch } = this.props;
    if (dispatch && record && record.userId) {
      dispatch({
        type: 'systemUser/changeStatus',
        payload: {
          userId: record.userId,
          status: checked ? '0' : '1',
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
          }
        },
      });
    }
  };

  edit = (record: any) => {
    this.userId = record.userId;
    this.handleVisible(true);
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

  handleVisible = (flag?: boolean) => {
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

  addUser = () => {
    this.userId = null;
    this.handleVisible(true);
  };

  removeUser = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的用户');
      return;
    }
    Modal.confirm({
      title: '删除用户',
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
            type: 'systemUser/remove',
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
        <Row>
          <Col span={5}>
            <FormItem
              label="选择部门"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('deptId')(
                <DepartMent
                  placeholder="请选择选择部门"
                  onChange={() => setTimeout(this.search)}
                  justId
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}></Col>
          <Col span={5}></Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入姓名、身份证号、手机号"
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
    const { loading, systemUser } = this.props;
    const { selectedRows, visible } = this.state;
    const { pagination } = this;

    const data = systemUser
      ? systemUser.data
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

    const formModalProps = {
      userId: this.userId,
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addUser}>
                添加新用户
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeUser}>
                  删除用户
                </Button>
              </Badge>
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
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default Form.create<SystemUserListProps>()(SystemUserList);
