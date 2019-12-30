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
  activity?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm');

@connect(
  ({
    activity,
    loading,
  }: {
    activity: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    activity,
    loading: loading.models.activity,
  }),
)
class ActivityVote extends Component<InfoManageProps> {
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
      title: '活动标题',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.routerTo(record)}>{text}</a>,
    },
    {
      title: '活动范围',
      dataIndex: 'type',
      render: (text: any) => {
        let newText = '';
        if (text === '1') {
          newText = '小区活动';
        } else if (text === '2') {
          newText = '街道活动';
        }
        return <span>{newText}</span>;
      },
    },
    {
      title: '活动开始时间',
      dataIndex: 'beginTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '活动结束时间',
      dataIndex: 'endTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: any) => {
        let newText = '';
        if (text === '0') {
          newText = '下架';
        } else if (text === '1') {
          newText = '已发布';
        }
        return <span>{newText}</span>;
      },
    },
    {
      title: '操作',
      render: (text: number, record: any) => {
        if (record.status === '1') {
          return (
            <Button
              type="primary"
              className="blueBtn btnStyle"
              onClick={() => this.publish(record, false)}
            >
              下架
            </Button>
          );
        }
        return (
          <Button
            type="primary"
            className="greenBtn btnStyle"
            onClick={() => this.publish(record, true)}
          >
            发布
          </Button>
        );
      },
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
        type: 'activity/getDate',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  publish = (record: any, isPublish: boolean) => {
    const { dispatch } = this.props;
    const params = {
      publishFlag: isPublish,
      voteId: record.voteId,
    };
    if (dispatch) {
      dispatch({
        type: 'activity/publish',
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
    Router.push(`/activity/vote/detail/${record.voteId}`);
  };

  addActivity = () => {
    Router.push('/activity/vote/addActivity');
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
            type: 'activity/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.voteId),
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

  // selectChange = (value: any) => {
  //   const formValues = {
  //     status: value,
  //   };
  //   const { dispatch } = this.props;

  //   if (dispatch) {
  //     dispatch({
  //       type: 'activity/getDate',
  //       payload: {
  //         ...formValues,
  //         ...this.pagination,
  //       },
  //     });
  //   }
  // };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row type="flex" justify="space-between">
          <Col span={5}>
            <FormItem
              label="活动状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('status')(
                <Select placeholder="请选择活动状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="0">下架</Option>
                  <Option value="1">已发布</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <div className="searchBox textRight">
              {getFieldDecorator('title')(
                <Input
                  style={{ width: 220 }}
                  placeholder="请输入标题"
                  onPressEnter={() => setTimeout(this.search)}
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderTitle = () => {
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12} className="topBtn">
          <Button className="orangeBtn btnStyle" onClick={() => this.addActivity()}>
            新增活动
          </Button>
          <Badge count={selectedRows.length}>
            <Button className="blueBtn" onClick={this.remove}>
              删除
            </Button>
          </Badge>
        </Col>
      </Row>
    );
  };

  render() {
    const { loading, activity } = this.props;

    const { selectedRows } = this.state;
    const data =
      activity && activity.data
        ? activity.data
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
        <div className={styles.vote}>
          <div className="foormTop">{this.renderTitle()}</div>
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
export default Form.create<InfoManageProps>()(ActivityVote);
