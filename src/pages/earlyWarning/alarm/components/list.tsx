import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Table, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface AlarmListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  alarm?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    alarm,
    loading,
  }: {
    alarm: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    alarm,
    loading: loading.models.alarm,
  }),
)
class AlarmList extends Component<AlarmListProps> {
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
      title: '报警电话',
      dataIndex: 'name',
    },
    {
      title: '报警居民',
      dataIndex: 'no',
    },
    {
      title: '住户号',
      dataIndex: 'phone',
    },
    {
      title: '位置信息',
      dataIndex: 'carNo',
    },
    {
      title: '报警时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'alarm/fetch',
        payload: {
          ...this.formValues,
          ...this.pagination,
        },
      });
    }
  };

  search = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.time && fieldsValue.time.length > 0) {
        fieldsValue.time = `${fieldsValue.time[0].format(
          'YYYY-MM-DD 00:00:00',
        )} ~ ${fieldsValue.time[1].format('YYYY-MM-DD 23:59:59')}`;
      } else {
        fieldsValue.time = undefined;
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

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row>
          <Col span={7}>
            <FormItem
              label="报警时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('time')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  onChange={() => setTimeout(this.search)}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={8}></Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
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

  render() {
    const { loading, alarm } = this.props;
    const { selectedRows } = this.state;
    const { pagination } = this;

    const data = alarm
      ? alarm.data
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
            rowSelection={rowSelection}
            pagination={paginationProps}
            onChange={this.paginationOnChange}
            scroll={{ x: true }}
          />
        </div>
      </div>
    );
  }
}

export default Form.create<AlarmListProps>()(AlarmList);
