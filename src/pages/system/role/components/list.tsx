import React, { Component } from 'react';
import { Row, Col, Button, Form, Table, Badge, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import FormModal from './formModal';
import AllMenuModal from './allMenuModal';

interface RoleListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  role?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    role,
    loading,
  }: {
    role: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    role,
    loading: loading.models.role,
  }),
)
class RoleList extends Component<RoleListProps> {
  state = {
    selectedRows: [],
    visible: false,
    menuVisible: false,
  };

  roleInfo: any = {};

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (text: string, record: any) => <a onClick={() => this.edit(record)}>{text}</a>,
    },
    {
      title: '角色说明',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text: number, record: any) => (
        <span className="btnBox">
          <Button onClick={() => this.permission(record)}>权限关联</Button>
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
        type: 'role/fetch',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  edit = (record: any) => {
    this.roleInfo = record;
    this.handleVisible(true);
  };

  permission = (record: any) => {
    this.roleInfo = record;
    this.handleMenuVisible(true);
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  handleMenuVisible = (flag?: boolean) => {
    this.setState({
      menuVisible: !!flag,
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

  addRole = () => {
    this.roleInfo = null;
    this.handleVisible(true);
  };

  removeRole = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的角色');
      return;
    }
    Modal.confirm({
      title: '删除角色',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.roleName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'role/remove',
            payload: {
              ids: selectedRows.map((item: any) => item.roleId),
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

  render() {
    const { loading, role } = this.props;
    const { selectedRows, visible, menuVisible } = this.state;
    const { pagination } = this;

    const data = role
      ? role.data
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
      selectedRowKeys: selectedRows.map((row: any) => row.roleId),
      onChange: this.rowOnChange,
    };

    const formModalProps = {
      roleInfo: this.roleInfo,
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
    };

    const allMenuProps = {
      roleInfo: this.roleInfo,
      visible: menuVisible,
      handleVisible: this.handleMenuVisible,
      getData: this.getData,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addRole}>
                添加角色
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn" onClick={this.removeRole}>
                  删除角色
                </Button>
              </Badge>
            </Col>
          </Row>
        </div>
        <div className="tableBox">
          <Table
            columns={this.columns}
            dataSource={data.data}
            bordered
            rowKey="roleId"
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
        <AllMenuModal {...allMenuProps} />
      </div>
    );
  }
}

export default Form.create<RoleListProps>()(RoleList);
