import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  // Select,
  Input,
  Table,
  Badge,
  message,
  Modal,
  // DatePicker,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
// import moment from 'moment';
import Router from 'umi/router';
import { StateType } from '../model';
// import CauseTag from './causeTag';
import FormModal from './formModal';

interface RoleListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  letter?: StateType;
  templateType?: any;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    letter,
    loading,
  }: {
    letter: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    letter,
    loading: loading.models.letter,
  }),
)
class RoleList extends Component<RoleListProps> {
  state = {
    selectedRows: [],
    visible: false,
  };

  roleId: any = null;

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {
    templateType: '',
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '接收时间',
      dataIndex: 'createTime',
    },
    {
      title: '消息类型',
      dataIndex: 'templateType',
      render: (text: string, record: any) => {
        let nextText;
        if (text === '0') {
          nextText = '报警提醒';
        } else if (text === '1') {
          nextText = '认证审核';
        } else if (text === '2') {
          nextText = '居民事务';
        } else if (text === '3') {
          nextText = '活动消息';
        } else if (text === '4') {
          nextText = '审核消息';
        } else if (text === '5') {
          nextText = '物业消息';
        }
        return <span>{nextText}</span>;
      },
    },
    {
      title: '消息状态',
      dataIndex: 'status',
      render: (text: string, record: any) => {
        let nextText;
        if (text === '0') {
          nextText = '未读';
        } else if (text === '1') {
          nextText = '已读';
        }
        return <span>{nextText}</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch, templateType } = this.props;
    if (dispatch) {
      this.formValues.templateType = templateType;
      dispatch({
        type: 'letter/fetch',
        payload: {
          ...this.formValues,
          // ...this.pagination,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  edit = (record: any) => {
    this.roleId = record.id;
    this.handleVisible(true);
  };

  permission = (record: any) => {
    console.log(record);
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  search = () => {
    const { form, templateType } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.templateType = templateType;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.formValues = values;
      this.pagination.current = 1;
      this.getData();
    });
  };

  goDetail = (record: any) => {
    Router.push(`/system/letter/detail/${record.mailMessageId}`);
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
    this.roleId = null;
    this.handleVisible(true);
  };

  removeRole = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的站内信');
      return;
    }
    Modal.confirm({
      title: '删除站内信',
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
            type: 'letter/remove',
            payload: {
              ids: selectedRows.map((item: any) => item.mailMessageId),
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

  isRead = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选站内信');
      return;
    }
    if (dispatch) {
      dispatch({
        type: 'letter/isRead',
        payload: {
          ids: selectedRows.map((item: any) => item.mailMessageId),
          readFlag: '1',
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              selectedRows: [],
            });
            this.getData();
          }
        },
      });
    }
  };

  render() {
    const { loading, letter } = this.props;
    const { selectedRows, visible } = this.state;
    const { pagination } = this;

    const data =
      letter && letter.data
        ? letter.data
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

    const formModalProps = {
      roleId: this.roleId,
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
    };

    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Badge count={selectedRows.length}>
                <Button className="orangeBtn btnStyle" onClick={this.isRead}>
                  标记为已读
                </Button>
              </Badge>
              <Badge count={selectedRows.length}>
                <Button onClick={this.removeRole} className="blueBtn">
                  删除
                </Button>
              </Badge>
            </Col>
            <Col span={8}>
              <div className="searchBox textRight">
                {getFieldDecorator('title')(
                  <Input
                    style={{ width: 220 }}
                    onPressEnter={() => setTimeout(this.search)}
                    placeholder="请输入关键字"
                  />,
                )}
                <Button onClick={this.search} className="defBtn">
                  搜索
                </Button>
              </div>
            </Col>
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
            scroll={{ x: true }}
          />
        </div>
        <Modal
          title="居民活动详情"
          visible={visible}
          onCancel={() => this.handleVisible()}
          footer={null}
          width={750}
          destroyOnClose
        >
          <FormModal {...formModalProps} />
        </Modal>
      </div>
    );
  }
}

export default Form.create<RoleListProps>()(RoleList);
