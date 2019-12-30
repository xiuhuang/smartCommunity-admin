import React, { Component } from 'react';
import { Button, Row, Col, Form, Input, Table, Modal, message, Cascader, Badge } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import AddFormList from './addFormList';

const FormItem = Form.Item;

interface RecordProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  lifeManage?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    lifeManage,
    loading,
  }: {
    lifeManage: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    lifeManage,
    loading: loading.models.lifeManage,
  }),
)
class Water extends Component<RecordProps> {
  state = {
    record: {},
    selectedRows: [],
    visible: false,
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {
    accountType: '1',
  };

  columns = [
    {
      title: '户主',
      dataIndex: 'residentName',
    },
    {
      title: '住户号',
      dataIndex: 'houseFullName',
    },
    {
      title: '客户编号（收费单位CSMS中账号）',
      dataIndex: 'accountNumber',
    },
    {
      title: '收费单位',
      dataIndex: 'paymentUnit',
    },
    {
      title: '操作',
      dataIndex: 'type',
      render: (text: string, record: any) => (
        <Button className="btnStyle blueBtn" onClick={() => this.editDetail(record)}>
          修改
        </Button>
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
        type: 'lifeManage/fetch',
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

  showAddModel = () => {
    this.setState({
      record: {},
    });
    this.handleVisible(true);
  };

  editDetail = (record: any) => {
    this.setState({
      record,
    });
    this.handleVisible(true);
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
          您确定要删除<a>{selectedRows.map((row: any) => row.accountNumber).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '删除',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'lifeManage/remove',
            payload: {
              accountIds: selectedRows.map((row: any) => row.accountId),
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
      <Form layout="inline" className="form12">
        <Row>
          <Col span={5} className="cascaderBox">
            <FormItem
              label="居民楼栋"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('building')(
                <Cascader
                  className="cascader"
                  onChange={() => setTimeout(this.search)}
                  placeholder="请选择楼栋信息"
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
                  placeholder="输入姓名"
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderBtnList() {
    const { selectedRows } = this.state;
    return (
      <Row className="topBtn">
        <Col span={16}>
          <Button className="darkGreenBtn btnStyle" onClick={() => this.showAddModel()}>
            添加水费缴纳账号
          </Button>
          <Badge count={selectedRows.length}>
            <Button className="blueBtn" onClick={this.remove}>
              删除
            </Button>
          </Badge>
        </Col>
      </Row>
    );
  }

  render() {
    const { loading, lifeManage } = this.props;

    const { selectedRows, visible, record } = this.state;

    const { pagination } = this;
    const data =
      lifeManage && lifeManage.data
        ? lifeManage.data
        : {
            data: [],
            total: 0,
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

    const formListProps = {
      handleVisible: this.handleVisible,
      getData: this.getData,
      record,
      accountType: '1',
    };
    return (
      <div>
        <div className="">
          {this.renderBtnList()}
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
        </div>
        <Modal
          title="添加水费缴纳账号"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <AddFormList {...formListProps} />
        </Modal>
      </div>
    );
  }
}

export default Form.create<RecordProps>()(Water);
