import React, { Component } from 'react';
import { Row, Col, Form, Table, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

interface SystemLogListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  systemLog?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    systemLog,
    loading,
  }: {
    systemLog: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    systemLog,
    loading: loading.models.systemLog,
  }),
)
class SystemLogList extends Component<SystemLogListProps> {
  state = {};

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '日志时间',
      dataIndex: 'operTime',
      render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '终端设备',
      dataIndex: 'operatorType',
      render: (text: number) => {
        let nexText;
        if (text === 0) {
          nexText = '其他';
        } else if (text === 1) {
          nexText = '后台用户';
        } else if (text === 2) {
          nexText = '手机端用户';
        }
        return <span>{nexText}</span>;
      },
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
    },
    {
      title: 'IP地址',
      dataIndex: 'operIp',
    },
    {
      title: '内容',
      dataIndex: 'title',
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'systemLog/fetch',
        payload: {
          ...this.formValues,
          // ...this.pagination,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  search = () => {};

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  timeOnchage = (date: any) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (date && date.length > 0) {
        fieldsValue.beginTime = moment(date[0]).format('YYYY-MM-DD 00:00:00');
        fieldsValue.endTime = moment(date[1]).format('YYYY-MM-DD 23:59:59');
      }
      const values = {
        ...fieldsValue,
      };
      this.formValues = values;
      this.pagination.current = 1;
      this.getData();
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row>
          <Col span={8}>
            <FormItem
              label="选择操作时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('floor')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  onChange={e => this.timeOnchage(e)}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { loading, systemLog } = this.props;
    const { pagination } = this;
    const data = systemLog
      ? systemLog.data
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

    return (
      <div>
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
            onChange={this.paginationOnChange}
            pagination={paginationProps}
            scroll={{ x: true }}
          />
        </div>
      </div>
    );
  }
}

export default Form.create<SystemLogListProps>()(SystemLogList);
