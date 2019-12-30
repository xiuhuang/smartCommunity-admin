import React, { Component } from 'react';
import { Button, Row, Col, Form, Select, Input, Table, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import Router from 'umi/router';
import { StateType } from '../model';
import FormList from './activityDetail';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface InfoManageProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  activityAudit?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm');

@connect(
  ({
    activityAudit,
    loading,
  }: {
    activityAudit: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    activityAudit,
    loading: loading.models.activityAudit,
  }),
)
class ActivityAudit extends Component<InfoManageProps> {
  state = {
    selectedRows: [],
    visible: false,
    record: {},
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '活动标题',
      dataIndex: 'activityName',
      render: (text: string, record: any) => <a onClick={() => this.showModal(record)}>{text}</a>,
    },
    {
      title: '活动范围',
      dataIndex: 'activityType',
      render: (text: any) => {
        let newText = '';
        if (text === '1') {
          newText = '同城活动';
        } else if (text === '2') {
          newText = '小区活动';
        }
        return <span>{newText}</span>;
      },
    },
    {
      title: '活动发起人',
      dataIndex: 'userName',
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
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
      title: '审核人',
      dataIndex: 'updateBy',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      render: (text: any) => {
        let newText = '';
        if (text === '0') {
          newText = '待处理';
        } else if (text === '1') {
          newText = '驳回';
        } else if (text === '2') {
          newText = '通过';
        }
        return <span>{newText}</span>;
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
        type: 'activityAudit/getDate',
        payload: {
          ...this.formValues,
          // ...this.pagination,
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

  showModal = (record: any) => {
    this.setState({
      record,
    });
    this.handleVisible(true);
  };

  addInfo = () => {
    Router.push('/communityService/service/addService');
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
          您确定要删除<a>{selectedRows.map((row: any) => row.name).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'buildings/remove',
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
    return (
      <Form layout="inline">
        <Row type="flex" justify="space-between">
          <Col span={7}>
            <FormItem
              label="审核状态"
              style={{ width: '100%' }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('status')(
                <Select placeholder="请选择审核状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="0">待处理</Option>
                  <Option value="1">驳回</Option>
                  <Option value="2">通过</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <div className="searchBox textRight">
              {getFieldDecorator('activityName')(
                <Input
                  style={{ width: 220 }}
                  placeholder="请输入活动标题"
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

  render() {
    const { loading, activityAudit } = this.props;

    const { visible, record } = this.state;
    const data =
      activityAudit && activityAudit.data
        ? activityAudit.data
        : {
            total: 0,
            data: [],
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
      handleVisible: this.handleVisible,
      getData: this.getData,
      record,
    };

    return (
      <div>
        <div>
          <div className={styles.info}>
            <div className="formBox">{this.renderForm()}</div>
            <div className="tableBox">
              <Table
                columns={this.columns}
                dataSource={data.data}
                bordered
                rowKey="activityId"
                loading={loading}
                size="middle"
                locale={{
                  emptyText: '暂无数据',
                }}
                pagination={paginationProps}
                onChange={this.paginationOnChange}
              />
            </div>
          </div>
        </div>
        <Modal
          title="居民活动详情"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <FormList {...formListProps} />
        </Modal>
      </div>
    );
  }
}
export default Form.create<InfoManageProps>()(ActivityAudit);
