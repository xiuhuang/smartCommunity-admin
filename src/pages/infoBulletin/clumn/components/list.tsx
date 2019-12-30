import React, { Component } from 'react';
import { Button, Row, Col, Badge, Form, Input, Table, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import FormList from './formList';
import AddClumn from './addClumn';

import styles from '../style.less';

interface InfoManageProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  clumn?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

@connect(
  ({
    clumn,
    loading,
  }: {
    clumn: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    clumn,
    loading: loading.models.clumn,
  }),
)
class InfoManage extends Component<InfoManageProps> {
  state = {
    selectedRows: [],
    visible: false,
    addVisible: false,
    record: {},
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '栏目名称',
      dataIndex: 'typeName',
      render: (text: string, record: any) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '描述',
      dataIndex: 'remark',
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
        type: 'clumn/getDate',
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

  handleAddVisible = (flag?: boolean) => {
    this.setState({
      addVisible: !!flag,
    });
  };

  showDrawer = (record: any) => {
    this.setState({
      record,
    });
    this.handleVisible(true);
  };

  addClumn = () => {
    this.setState({
      addVisible: true,
    });
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
          您确定要删除<a>{selectedRows.map((row: any) => row.typeName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'clumn/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.id),
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

  renderTitle() {
    const { selectedRows } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Row>
        <Col span={12} className="topBtn noMargin">
          <Button className="orangeBtn btnStyle" onClick={() => this.addClumn()}>
            新增栏目
          </Button>
          <Badge count={selectedRows.length}>
            <Button className="blueBtn" onClick={this.remove}>
              删除
            </Button>
          </Badge>
        </Col>
        <Col span={12} className="searchBox textRight">
          {getFieldDecorator('typeName')(
            <Input
              style={{ width: 220 }}
              placeholder="输入名称"
              className="defu"
              onPressEnter={() => setTimeout(this.search)}
            />,
          )}
          <Button onClick={this.search}>搜索</Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { loading, clumn } = this.props;

    const { selectedRows, visible, record, addVisible } = this.state;
    const data =
      clumn && clumn.data
        ? clumn.data
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
      record,
      handleVisible: this.handleVisible,
      getData: this.getData,
    };
    const addFormListProps = {
      handleAddVisible: this.handleAddVisible,
      getData: this.getData,
    };

    return (
      <div>
        <div>
          <div className={styles.clunm}>
            <div className="formTop">{this.renderTitle()}</div>
            {/* <div className="formBox">{this.renderForm()}</div> */}
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
        </div>
        <Modal
          title="栏目详情"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <FormList {...formListProps} />
        </Modal>

        <Modal
          title="新增栏目"
          visible={addVisible}
          onCancel={() => this.handleAddVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <AddClumn {...addFormListProps} />
        </Modal>
      </div>
    );
  }
}
export default Form.create<InfoManageProps>()(InfoManage);
