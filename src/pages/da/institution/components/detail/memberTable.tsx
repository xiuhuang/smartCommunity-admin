import React, { Component } from 'react';
import { Button, Row, Col, Badge, Form, Table, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../../model';
import MemberFromModal from './memberFromModal';
import styles from '../../styles.less';

interface CarTableProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  location?: any;
  institution?: any;
  detailData: any;
  companyId: any;
}

const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    institution,
    loading,
  }: {
    institution: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    institution,
    loading: loading.models.institution,
  }),
)
class CarTable extends Component<CarTableProps> {
  state = {
    selectedRows: [],
    visible: false,
    memberDataList: {
      data: [],
    },
    recordState: {
      memberId: null,
      memberName: null,
      sex: null,
      contactPhone: null,
      idCard: null,
      pictureUrl: null,
    },
  };

  pagination = {
    current: 1,
    pageSize: 10,
    companyId: '',
  };

  formValues = {};

  columns = [
    {
      title: '头像',
      dataIndex: 'pictureUrl',
      render: (text: string) => <img src={text} alt="" style={{ width: 40, height: 40 }} />,
    },
    {
      title: '姓名',
      dataIndex: 'memberName',
      render: (text: string, record: any) => <a onClick={() => this.editCarInfo(record)}>{text}</a>,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (text: string, record: any) => {
        if (text === '0') {
          return <span>男</span>;
        }
        if (text === '1') {
          return <span>女</span>;
        }
        return <span>未设置</span>;
      },
    },
    {
      title: '身份证',
      dataIndex: 'idCard',
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
    },
    {
      title: '操作',
      render: (text: number, record: any) => (
        <span className="topBtn noMargin">
          <Button className="greenBtn" onClick={() => this.editCarInfo(record)}>
            修改
          </Button>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { detailData } = this.props;
    this.pagination.companyId = detailData.companyId;
    this.getData();
  }

  componentWillReceiveProps(nextProps: any) {
    const { detailData } = this.props;
    this.pagination.companyId = detailData.companyId;
    if (nextProps.detailData !== detailData) {
      this.pagination.companyId = nextProps.detailData.companyId;
      this.getData();
    }
  }

  getData = () => {
    const { dispatch, companyId } = this.props;
    if (dispatch) {
      dispatch({
        type: 'institution/fetchMemberList',
        payload: {
          // ...this.pagination,
          companyId,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              memberDataList: res,
            });
          }
        },
      });
    }
  };

  addMember = () => {
    const { recordState } = this.state;
    recordState.memberId = null;
    this.handleVisible(true);
    this.setState({
      recordState: {
        memberId: null,
        memberName: null,
        companyId: null,
        sex: null,
        contactPhone: null,
        idCard: null,
        pictureUrl: null,
      },
    });
  };

  editCarInfo = (record: any) => {
    this.setState({
      recordState: record,
    });
    this.handleVisible(true);
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
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
          您确定要删除<a>{selectedRows.map((row: any) => row.memberName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'institution/removeMember',
            payload: {
              ids: selectedRows.map((row: any) => row.memberId),
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

  rowOnChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({
      selectedRows,
    });
  };

  paginationOnChange = (pagination: any) => {
    this.pagination = pagination;
    this.getData();
  };

  renderTitle() {
    const { selectedRows } = this.state;
    return (
      <Row>
        <Col span={12}></Col>
        <Col span={12} className="topRight">
          <Badge count={selectedRows.length}>
            <Button type="primary" className="blueBtn" onClick={this.remove}>
              删除
            </Button>
          </Badge>
          <Button type="primary">数据导出</Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { loading, institution, detailData } = this.props;

    const { companyId } = detailData;

    const memberData = institution
      ? institution.memberData
      : {
          total: 0,
          data: [],
        };

    const { selectedRows, visible, memberDataList, recordState } = this.state;

    const { pagination } = this;

    const paginationProps = {
      total: memberData.total,
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelection = {
      selectedRowKeys: selectedRows.map((row: any) => row.memberId),
      onChange: this.rowOnChange,
    };

    const formListProps = {
      record: recordState,
      companyId,
      visible,
      handleVisible: this.handleVisible,
      getData: this.getData,
      memberDataList,
    };

    return (
      <div className={styles.memberTable}>
        <div className="contentCart noShadow">
          <div className={styles.mbtBtnBox}>
            <Button className="orangeBtn" onClick={this.addMember}>
              添加成员
            </Button>
            <Badge count={selectedRows.length}>
              <Button type="primary" className="blueBtn" onClick={this.remove}>
                删除成员
              </Button>
            </Badge>
          </div>
          <div className="tableBox" style={{ marginTop: 10 }}>
            <Table
              columns={this.columns}
              dataSource={memberDataList.data}
              bordered
              rowKey="memberId"
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
        <MemberFromModal {...formListProps} />
      </div>
    );
  }
}

export default Form.create<CarTableProps>()(CarTable);
