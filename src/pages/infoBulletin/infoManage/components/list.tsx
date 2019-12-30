import React, { Component } from 'react';
import { Button, Row, Col, Badge, Form, Select, Input, Table, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import Router from 'umi/router';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface InfoManageProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  infoManage?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

@connect(
  ({
    infoManage,
    loading,
  }: {
    infoManage: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    infoManage,
    loading: loading.models.infoManage,
  }),
)
class InfoManage extends Component<InfoManageProps> {
  state = {
    columnData: [],
    selectedRows: [],
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.routerTo(record)}>{text}</a>,
    },
    {
      title: '栏目名称',
      dataIndex: 'newsTypeName',
    },
    {
      title: 'URL地址',
      dataIndex: 'resource',
    },
    {
      title: '发布日期',
      dataIndex: 'publishTime',
      render: (text: number) => <span>{text ? momentTime(text) : '--'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: any) => {
        let newText = '';
        if (text === '0') {
          newText = '未发布';
        } else if (text === '1') {
          newText = '已发布';
        } else if (text === '2') {
          newText = '已下架';
        }
        return <span>{newText}</span>;
      },
    },
    {
      title: '操作',
      render: (text: number, record: any) => {
        let con;
        if (record.status === '0' || record.status === '2') {
          con = (
            <Button
              type="primary"
              className="greenBtn btnStyle"
              onClick={() => this.publish(record, '1')}
            >
              发布
            </Button>
          );
        }
        if (record.status === '1') {
          con = (
            <Button
              type="primary"
              className="blueBtn btnStyle"
              onClick={() => this.publish(record, '2')}
            >
              下架
            </Button>
          );
        }
        return con;
      },
    },
  ];

  componentDidMount() {
    this.getData();
    this.getColumnData();
  }

  getColumnData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'infoManage/columnPageList',
        payload: {
          // ...this.pagination,
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              columnData: res.data,
            });
          }
        },
      });
    }
  };

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'infoManage/getDate',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  publish = (record: any, status: any) => {
    const { dispatch } = this.props;
    const params = {
      status,
      id: record.id,
    };
    if (dispatch) {
      dispatch({
        type: 'infoManage/publishOrOffline',
        payload: {
          ...params,
        },
        callback: (res: any) => {
          if (res.code === '200' && res.data) {
            message.info(res.message);
            this.getData();
          }
        },
      });
    }
  };

  routerTo = (record: any) => {
    Router.push(`/infoBulletin/infoManage/detail/${record.id}`);
  };

  addInfo = () => {
    Router.push('/infoBulletin/infoManage/addInfo');
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
          您确定要删除<a>{selectedRows.map((row: any) => row.title).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'infoManage/remove',
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

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { columnData } = this.state;
    let columnOption;
    if (columnData.length > 0) {
      columnOption = columnData.map((item: any, key: any) => (
        <Option value={item.id} key={item.id}>
          {item.typeName}
        </Option>
      ));
    }
    return (
      <Form layout="inline">
        <Row type="flex" justify="space-between">
          <Col span={7}>
            <FormItem
              label="栏目名称"
              style={{ width: '100%' }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('newsTypeId')(
                <Select
                  placeholder="请选择栏目名称"
                  onChange={() => setTimeout(this.search)}
                  showArrow
                  // mode="multiple"
                >
                  <Option value="">不限</Option>
                  {columnOption}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <div className="searchBox textRight">
              {getFieldDecorator('title')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="请输入标题"
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderTitle() {
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12} className="topBtn">
          <Button className="orangeBtn btnStyle" onClick={() => this.addInfo()}>
            新增资讯
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
    const { loading, infoManage } = this.props;

    const { selectedRows } = this.state;
    const data =
      infoManage && infoManage.data
        ? infoManage.data
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

    return (
      <div>
        <div className={styles.info}>
          <div className="formTop">{this.renderTitle()}</div>
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
      </div>
    );
  }
}
export default Form.create<InfoManageProps>()(InfoManage);
