import React, { Component } from 'react';
import { Row, Col, Button, Form, Select, Input, Table } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';

const FormItem = Form.Item;
const { Option } = Select;

interface PersonListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  focus?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    focus,
    loading,
  }: {
    focus: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    focus,
    loading: loading.models.focus,
  }),
)
class PersonList extends Component<PersonListProps> {
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
      title: '抓拍图片',
      dataIndex: 'title',
      render: (text: string) => (
        <img
          src="https://imgs.qunarzz.com/vs_ceph_vs_tts/01a19708-6b16-44ed-b4f3-a6d458cb42c9.jpg_r_480x320x90_563484c9.jpg"
          alt=""
          style={{ width: '40px', height: '40px' }}
        />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '居民类型',
      dataIndex: 'no',
    },
    {
      title: '户号',
      dataIndex: 'phone',
    },
    {
      title: '抓拍时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '抓拍地点',
      dataIndex: 'causeNo',
    },
    {
      title: '出入方式',
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
        type: 'focus/fetchPerson',
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
              label="重点关注标签"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('tag')(
                <Select
                  placeholder="请选择重点关注标签"
                  mode="multiple"
                  onChange={() => setTimeout(this.search)}
                  showArrow
                >
                  <Option value="">不限</Option>
                  <Option value="1">待处理</Option>
                  <Option value="2">已处理</Option>
                </Select>,
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
                  placeholder="输入姓名、车牌号"
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
    const { loading, focus } = this.props;
    const { selectedRows } = this.state;
    const { pagination } = this;

    const data = focus
      ? focus.personData
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

export default Form.create<PersonListProps>()(PersonList);
