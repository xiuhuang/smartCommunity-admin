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
import AddByCodeModal from './addByCodeModal';
import AddModal from './addModal';
import InfoModal from './infoModal';
import { downloadExcelForPost } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface RegistrationListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  visitorRegistration?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    visitorRegistration,
    loading,
  }: {
    visitorRegistration: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    visitorRegistration,
    loading: loading.models.visitorRegistration,
  }),
)
class RegistrationList extends Component<RegistrationListProps> {
  state = {
    selectedRows: [],
    tagVisible: false,
    visible: false,
    infoVisible: false,
  };

  recordId: any = null;

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '头像',
      dataIndex: 'headIcon',
      render: (text: string) => (
        <img src={text || '/touxiang.png'} alt="" style={{ width: '40px', height: '40px' }} />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'visitorName',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
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
      title: '登记时间',
      dataIndex: 'realVisitDate',
      // render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'visitStatus',
      render: (text: string) => {
        let newText = '';
        if (text === '1') {
          newText = '来访中';
        } else if (text === '2') {
          newText = '已签离';
        } else if (text === '3') {
          newText = '自动签离';
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
        type: 'visitorRegistration/fetch',
        payload: {
          ...this.formValues,
          // ...this.pagination,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  getVisitorReason = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'visitorRegistration/fetchCauseTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
    }
  };

  goDetail = (record: any) => {
    this.recordId = record.recordId;
    this.handleInfoVisible(true);
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

  handleInfoVisible = (flag?: boolean) => {
    this.setState({
      infoVisible: !!flag,
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  handleAddByCodeModal = (flag?: boolean) => {
    this.setState({
      tagVisible: !!flag,
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
    this.recordId = null;
    this.handleVisible(true);
  };

  removeResident = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的访客记录');
      return;
    }
    Modal.confirm({
      title: '删除访客记录',
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
            type: 'visitorRegistration/remove',
            payload: {
              ids: selectedRows.map((item: any) => item.recordId),
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
      visitorRegistration,
    } = this.props;

    const causeTagList =
      visitorRegistration && visitorRegistration.causeTagList
        ? visitorRegistration.causeTagList
        : [];
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem
              label="登记时间"
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
              label="访客状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('visitStatus')(
                <Select placeholder="请选择状态" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="1">来访中</Option>
                  <Option value="2">已签离</Option>
                  <Option value="3">自动签离</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('queryKey')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入姓名、身份证号、车牌号、手机号"
                />,
              )}
              <Button onClick={this.search}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  exportExcle = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'visitorRegistration/exportVisitor',
        payload: {
          ...this.formValues,
          // ...this.pagination,
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          downloadExcelForPost(res, '访客记录.xlsx');
        },
      });
    }
  };

  render() {
    const { loading, visitorRegistration } = this.props;
    const { selectedRows, tagVisible, visible, infoVisible } = this.state;
    const { pagination } = this;

    const data = visitorRegistration
      ? visitorRegistration.data
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
      // recordId: this.recordId,
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
    };

    const infoModalProps = {
      recordId: this.recordId,
      visible: infoVisible,
      handleVisible: this.handleInfoVisible,
      getData: this.getData,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addResident}>
                登记访客
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeResident}>
                  删除访客记录
                </Button>
              </Badge>
              <Button className="greenBtn btnStyle" onClick={() => this.handleAddByCodeModal(true)}>
                预约码登记
              </Button>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button className="transparentBtn" type="primary" onClick={this.exportExcle}>
                数据导出
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
        <AddByCodeModal
          visible={tagVisible}
          handleVisible={this.handleAddByCodeModal}
          getData={this.getData}
        />
        <AddModal {...addModalProps} />
        <InfoModal {...infoModalProps} />
      </div>
    );
  }
}

export default Form.create<RegistrationListProps>()(RegistrationList);
