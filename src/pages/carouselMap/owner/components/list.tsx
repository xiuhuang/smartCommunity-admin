import React, { Component } from 'react';
import { Button, Row, Col, Badge, Table, Modal, message } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import AddModal from './addModal';
import styles from '../style.less';

interface CarouseMapProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  carouselMap?: StateType;
  position: string;
}

@connect(
  ({
    carouselMap,
    loading,
  }: {
    carouselMap: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    carouselMap,
    loading: loading.models.carouselMap,
  }),
)
class CarouseMap extends Component<CarouseMapProps> {
  state = {
    selectedRows: [],
    visible: false,
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  position = '1';

  bannerId = '';

  columns = [
    {
      title: '轮播图',
      dataIndex: 'pictureUrl',
      render: (text: string, record: any) => (
        <img src={text} alt="" style={{ width: '40px', height: '40px' }} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (text: string, record: any) => <a onClick={() => this.edit(record)}>{text}</a>,
    },
    {
      title: '排序号',
      dataIndex: 'sort',
    },
    {
      title: 'URL地址',
      dataIndex: 'directUrl',
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
      render: (text: number, record: any) => (
        <div>
          <Button type="primary" className="greenBtn btnStyle" onClick={() => this.edit(record)}>
            修改
          </Button>
          {record.status === '1' && (
            <Button
              type="primary"
              className="blueBtn btnStyle"
              onClick={() => this.publish(record, false)}
            >
              下架
            </Button>
          )}
          {record.status !== '1' && (
            <Button
              type="primary"
              className="darkGreenBtn btnStyle"
              onClick={() => this.publish(record, true)}
            >
              发布
            </Button>
          )}
        </div>
      ),
    },
  ];

  componentDidMount() {
    const { position } = this.props;
    this.position = position;
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'carouselMap/getDate',
        payload: {
          position: this.position,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  edit = (record: any) => {
    this.bannerId = record.bannerId;
    this.handleVisible(true);
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  publish = (record: any, status: boolean) => {
    const { dispatch } = this.props;
    const params = {
      publishFlag: status,
      bannerId: record.bannerId,
    };
    if (dispatch) {
      dispatch({
        type: 'carouselMap/publishOrOffline',
        payload: {
          ...params,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
            this.getData();
          }
        },
      });
    }
  };

  addInfo = () => {
    this.bannerId = '';
    this.handleVisible(true);
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
          您确定要删除<a>{selectedRows.map((row: any) => row.title).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'carouselMap/remove',
            payload: {
              ids: selectedRows.map((row: any) => row.bannerId),
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

  renderTitle() {
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12} className="topBtn">
          <Button className="orangeBtn btnStyle" onClick={() => this.addInfo()}>
            新增轮播图
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
    const { loading, carouselMap } = this.props;

    const { selectedRows, visible } = this.state;
    const data =
      carouselMap && carouselMap.data
        ? carouselMap.data
        : {
            total: 0,
            data: [],
          };
    const rowSelection = {
      selectedRowKeys: selectedRows.map((row: any) => row.bannerId),
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

    const addModalProps = {
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
      position: this.position,
      bannerId: this.bannerId,
    };

    return (
      <div>
        <div className={styles.info}>
          <div className="formTop">{this.renderTitle()}</div>
          <div className="tableBox">
            <Table
              columns={this.columns}
              dataSource={data.data}
              bordered
              rowKey="bannerId"
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
        <AddModal {...addModalProps} />
      </div>
    );
  }
}
export default CarouseMap;
