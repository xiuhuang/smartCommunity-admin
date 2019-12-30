import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Select,
  Input,
  Table,
  Badge,
  message,
  Modal,
  DatePicker,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
// import moment from 'moment';
import { StateType } from '../model';
import CauseTag from './causeTag';
import AddModal from './addModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface ReservationListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  reservation?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    reservation,
    loading,
  }: {
    reservation: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    reservation,
    loading: loading.models.reservation,
  }),
)
class ReservationList extends Component<ReservationListProps> {
  state = {
    selectedRows: [],
    tagVisible: false,
    visible: false,
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '姓名',
      dataIndex: 'visitorName',
      // render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '身份证号',
      dataIndex: 'visitorIdCard',
    },
    {
      title: '联系方式',
      dataIndex: 'visitorPhone',
    },
    {
      title: '车牌号码',
      dataIndex: 'visitorLpCode',
    },
    {
      title: '所属单位',
      dataIndex: 'visitorCompany',
    },
    {
      title: '被访对象',
      dataIndex: 'respondents',
    },
    {
      title: '被访对象住户号',
      dataIndex: 'houseName',
    },
    {
      title: '来访事由',
      dataIndex: 'visitReason',
    },
    {
      title: '预计到访时间',
      dataIndex: 'visitDate',
      // render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '访客码',
      dataIndex: 'visitCode',
    },
    {
      title: '状态',
      dataIndex: 'visitStatus',
      render: (text: string) => {
        let newText = '';
        if (text === '0') {
          newText = '失效';
        } else if (text === '1') {
          newText = '正常';
        } else if (text === '2') {
          newText = '已使用';
        } else if (text === '3') {
          newText = '未生成';
        }
        return <span>{newText}</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
    this.getVisitorReason();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'reservation/fetch',
        payload: {
          ...this.formValues,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.current,
        },
      });
    }
  };

  getVisitorReason = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'reservation/fetchCauseTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
    }
  };

  search = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.visitTime && fieldsValue.visitTime.length > 0) {
        fieldsValue.visitTime = `${fieldsValue.visitTime[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.visitTime[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.visitTime = undefined;
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

  handleCauseTag = (flag?: boolean) => {
    this.setState({
      tagVisible: !!flag,
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

  addResident = () => {
    this.handleVisible(true);
  };

  removeResident = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的访客预约');
      return;
    }
    Modal.confirm({
      title: '删除访客',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.visitorName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'reservation/remove',
            payload: {
              ids: selectedRows.map((item: any) => item.appointmentId),
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
      reservation,
    } = this.props;

    const causeTagList = reservation && reservation.causeTagList ? reservation.causeTagList : [];
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem
              label="预计到访"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('visitTime')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  onChange={() => setTimeout(this.search)}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="来访事由"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('vrId')(
                <Select
                  placeholder="请选择来访事由"
                  showArrow
                  onChange={() => setTimeout(this.search)}
                >
                  <Option value="">不限</Option>
                  {causeTagList &&
                    causeTagList.map((item: any) => (
                      <Option value={item.vrId} key={item.vrId}>
                        {item.vrName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('visitStatus')(
                <Select placeholder="请选择状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="0">失效</Option>
                  <Option value="1">正常</Option>
                  <Option value="2">已使用</Option>
                  <Option value="3">未生成</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('queryKey')(
                <Input
                  style={{ width: 220 }}
                  placeholder="输入姓名、身份证号、车牌号、手机号"
                  onPressEnter={() => setTimeout(this.search)}
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
    const { loading, reservation } = this.props;
    const { selectedRows, tagVisible, visible } = this.state;
    const { pagination } = this;

    const data = reservation
      ? reservation.data
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

    const addModalProps = {
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addResident}>
                添加预约访客
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeResident}>
                  删除访客预约
                </Button>
              </Badge>
              <Button className="greenBtn btnStyle" onClick={() => this.handleCauseTag(true)}>
                来访事由编辑
              </Button>
            </Col>
          </Row>
        </div>
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
            scroll={{ x: true }}
          />
        </div>
        <CauseTag visible={tagVisible} handleVisible={this.handleCauseTag} />
        <AddModal {...addModalProps} />
      </div>
    );
  }
}

export default Form.create<ReservationListProps>()(ReservationList);
