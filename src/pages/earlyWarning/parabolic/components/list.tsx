import React, { Component } from 'react';
import { Table } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';

interface ParabolicListProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  parabolic?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    parabolic,
    loading,
  }: {
    parabolic: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    parabolic,
    loading: loading.models.parabolic,
  }),
)
class ParabolicList extends Component<ParabolicListProps> {
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
      title: '视频预览',
      dataIndex: 'video',
    },
    {
      title: '视频名称',
      dataIndex: 'name',
    },
    {
      title: '抓拍时间',
      dataIndex: 'updateTime',
      render: (text: number) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '设备名称',
      dataIndex: 'phone',
    },
    {
      title: '设备IP',
      dataIndex: 'carNo',
    },
    {
      title: '抓拍地址',
      dataIndex: 'updateTime1',
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
        type: 'parabolic/fetch',
        payload: {
          ...this.formValues,
          ...this.pagination,
        },
      });
    }
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

  render() {
    const { loading, parabolic } = this.props;
    const { selectedRows } = this.state;
    const { pagination } = this;

    const data = parabolic
      ? parabolic.data
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

export default ParabolicList;
