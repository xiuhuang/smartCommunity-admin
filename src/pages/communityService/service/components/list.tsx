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
  service?: StateType;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

@connect(
  ({
    service,
    loading,
  }: {
    service: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    service,
    loading: loading.models.service,
  }),
)
class Service extends Component<InfoManageProps> {
  state = {
    serviceTypeData: [],
    selectedRows: [],
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      render: (text: string, record: any) => <a onClick={() => this.routerTo(record)}>{text}</a>,
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
    },
    {
      title: '服务类型',
      dataIndex: 'serviceTypeName',
    },
    {
      title: 'URL地址',
      dataIndex: 'url',
      render: (text: string, record: any) => {
        if (record.type === '1') {
          return <span>{`${window.location.origin}/msite/news/${record.id}`}</span>;
        }
        if (record.type === '2') {
          return <span>{text}</span>;
        }
        return <span>--</span>;
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      render: (text: number) => <span>{momentTime(text)}</span>,
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
    this.getServiceTypeData();
  }

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'service/getDate',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  getServiceTypeData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'service/serviceTypePageList',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              serviceTypeData: res.data,
            });
          }
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
        type: 'service/publishOrOffline',
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
    Router.push(`/communityService/service/detail/${record.id}`);
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
          您确定要删除<a>{selectedRows.map((row: any) => row.serviceName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'service/remove',
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
    const { serviceTypeData } = this.state;
    let serviceTypeOption;
    if (serviceTypeData.length > 0) {
      serviceTypeOption = serviceTypeData.map((item: any) => (
        <Option value={item.id} key={item.id}>
          {item.serviceTypeName}
        </Option>
      ));
    }
    return (
      <Form layout="inline">
        <Row type="flex" justify="space-between">
          <Col span={7}>
            <FormItem
              label="服务类型"
              style={{ width: '100%' }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('serviceTypeId')(
                <Select placeholder="请选择服务类型" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  {serviceTypeOption}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <div className="searchBox textRight">
              {getFieldDecorator('serviceName')(
                <Input
                  style={{ width: 220 }}
                  placeholder="请输入服务名称"
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

  renderTitle() {
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12} className="topBtn">
          <Button className="orangeBtn btnStyle" onClick={() => this.addInfo()}>
            新增服务
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
    const { loading, service } = this.props;

    const { selectedRows } = this.state;
    const data =
      service && service.data
        ? service.data
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
          <div>{this.renderTitle()}</div>
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
export default Form.create<InfoManageProps>()(Service);
