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
  Cascader,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import Router from 'umi/router';
import { StateType } from '../model';
import { downloadExcelForPost } from '@/utils/utils';
import ResidentTag from './residentTag';

const FormItem = Form.Item;
const { Option } = Select;
// const { TreeNode } = TreeSelect;

interface ResidentListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  residentFile?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    residentFile,
    loading,
  }: {
    residentFile: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    residentFile,
    loading: loading.models.residentFile,
  }),
)
class ResidentList extends Component<ResidentListProps> {
  state = {
    selectedRows: [],
    tagVisible: false,
    communityTree: [],
  };

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '头像',
      dataIndex: 'pictureUrl',
      render: (text: string) => (
        <img src={text || '/touxiang.png'} alt="" style={{ width: '40px', height: '40px' }} />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'residentName',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '居民标签',
      dataIndex: 'tagName',
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: '重点关注',
      dataIndex: 'isFocus',
      render: (isFocus: boolean) => <span>{isFocus ? '是' : '否'}</span>,
    },
    {
      title: '户号',
      dataIndex: 'houseName',
    },
    {
      title: '居住状态',
      dataIndex: 'resideStatusName',
    },
    {
      title: '操作',
      // fixed: 'right',
      render: (text: number, record: any) => (
        <div className="btnBox" style={{ width: 160 }}>
          <Button onClick={() => this.editResident(record)}>修改</Button>
          <Button onClick={() => this.editResident(record, '2')}>添加车辆</Button>
        </div>
      ),
    },
  ];

  componentDidMount() {
    this.getData();
    this.getResidentList();
    this.getCommunityTree();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/fetchResidentList',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  getResidentList = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/fetchResidentTag',
        payload: {
          type: '0',
        },
      });
    }
  };

  getCommunityTree = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/getCommunityTree',
        callback: (res: any) => {
          if (res.code === '200') {
            // console.log(res.data);
            this.setState({
              communityTree: res.data,
            });
          }
        },
      });
    }
  };

  editResident = (record: any, tabs?: string) => {
    Router.push(
      `/da/residentFile/editResident?id=${record.residentId}${tabs ? `&tabs=${tabs}` : ''}`,
    );
  };

  goDetail = (record: any) => {
    Router.push(`/da/residentFile/detail?residentId=${record.residentId}`);
  };

  getLevelByIds = (ids: any) => {
    const { communityTree } = this.state;
    const len = ids.length;
    const id = ids[len - 1];
    const treeObj = {};
    const renderObjTree = (data: any) =>
      data.forEach((item: any) => {
        treeObj[item.buildTreeId] = item;
        if (item.children && item.children.length > 0) {
          renderObjTree(item.children);
        }
      });
    renderObjTree(communityTree);
    return treeObj[id];
  };

  search = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.isFocus) {
        fieldsValue.isFocus = fieldsValue.isFocus === '1';
      } else {
        fieldsValue.isFocus = undefined;
      }
      if (fieldsValue.buildId && fieldsValue.buildId.length > 0) {
        const levelObj = this.getLevelByIds(fieldsValue.buildId);
        fieldsValue.level = levelObj.level;
        fieldsValue.levelId = levelObj.levelId;
        fieldsValue.buildId = undefined;
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

  exportExcle = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/exportResidentData',
        payload: {
          ...this.formValues,
          pageNum: 1,
          pageSize: 2000,
        },
        callback: (res: any) => {
          downloadExcelForPost(res, '社区居民档案.xlsx');
        },
      });
    }
  };

  handleResidentTag = (flag?: boolean) => {
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
    Router.push('/da/residentFile/addResident');
  };

  removeResident = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的居民');
      return;
    }
    Modal.confirm({
      title: '删除居民',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.residentName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'residentFile/removeResident',
            payload: selectedRows.map((item: any) => item.residentId),
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

  renderCommunityData = () => {
    const { communityTree } = this.state;
    if (!communityTree) return [];
    const renderTree = (tree: any) =>
      tree.map((item: any) => {
        item.value = item.buildTreeId;
        item.label = item.buildName;
        if (item.children && item.children.length > 0) {
          item.children = renderTree(item.children);
        }
        return item;
      });
    return renderTree(communityTree);
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
      residentFile,
    } = this.props;
    const residentTagList =
      residentFile && residentFile.residentTagList ? residentFile.residentTagList : [];

    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem
              label="居民楼栋"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('buildId')(
                <Cascader
                  placeholder="请选择居民楼栋"
                  options={this.renderCommunityData()}
                  onChange={() => setTimeout(this.search)}
                ></Cascader>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="居民标签"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('tagIds')(
                <Select
                  placeholder="请选择居民标签"
                  mode="multiple"
                  onChange={() => setTimeout(this.search)}
                  showArrow
                >
                  {residentTagList.map((item: any) => (
                    <Option value={item.tagId} key={item.tagId}>
                      {item.tagName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="重点关注"
              style={{ width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('isFocus')(
                <Select placeholder="请选择重点关注" onChange={() => setTimeout(this.search)}>
                  <Option value="">不限</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <div className="searchBox textRight">
              {getFieldDecorator('keyword')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="输入姓名、身份证号"
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
    const { loading, residentFile } = this.props;
    const { selectedRows, tagVisible } = this.state;
    const { pagination } = this;

    const data = residentFile
      ? residentFile.residentList
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
      selectedRowKeys: selectedRows.map((row: any) => row.residentId),
      onChange: this.rowOnChange,
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addResident}>
                添加居民
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn btnStyle" onClick={this.removeResident}>
                  删除居民
                </Button>
              </Badge>
              <Button className="greenBtn btnStyle" onClick={() => this.handleResidentTag(true)}>
                居民标签管理
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
            rowKey="residentId"
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
        <ResidentTag
          visible={tagVisible}
          handleVisible={this.handleResidentTag}
          getResidentList={this.getResidentList}
        />
      </div>
    );
  }
}

export default Form.create<ResidentListProps>()(ResidentList);
