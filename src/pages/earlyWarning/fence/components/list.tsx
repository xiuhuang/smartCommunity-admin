import React, { Component } from 'react';
import { Row, Col, Button, Form, Select, Input, Table, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface FenceListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  fence?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    fence,
    loading,
  }: {
    fence: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    fence,
    loading: loading.models.fence,
  }),
)
class FenceList extends Component<FenceListProps> {
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
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备地址',
      dataIndex: 'no',
    },
    {
      title: '设备IP',
      dataIndex: 'phone',
    },
    {
      title: '负责人/检修人',
      dataIndex: 'carNo',
    },
    {
      title: '报警时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number) => {
        let newText = '';
        if (text === 1) {
          newText = '常住';
        }
        return <span>{newText}</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'fence/fetch',
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
                  onChange={() => setTimeout(this.search)}
                  placeholder={['开始时间', '结束时间']}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem
              label="处理状态"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('tag')(
                <Select
                  placeholder="请选择来访事由"
                  onChange={() => setTimeout(this.search)}
                  mode="multiple"
                  showArrow
                >
                  <Option value="">不限</Option>
                  <Option value="1">待处理</Option>
                  <Option value="2">已处理</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={1}></Col>
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
    const { loading, fence } = this.props;
    const { selectedRows } = this.state;
    const { pagination } = this;

    const data = fence
      ? fence.data
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

export default Form.create<FenceListProps>()(FenceList);
