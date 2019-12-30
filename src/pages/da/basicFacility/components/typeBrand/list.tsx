import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Table, Badge, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../../model';
import TypeBrandTag from './tag';
import TypeBrandModal from './typeBrandModal';

// const FormItem = Form.Item;
// const { Option } = Select;

interface TypeBrandListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  basicFacility?: StateType;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    basicFacility,
    loading,
  }: {
    basicFacility: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicFacility,
    loading: loading.models.basicFacility,
  }),
)
class TypeBrandList extends Component<TypeBrandListProps> {
  state = {
    selectedRows: [],
    tagVisible: false,
    visible: false,
  };

  brandId: any = null;

  pagination = {
    current: 1,
    pageSize: 10,
  };

  formValues = {};

  columns = [
    {
      title: '设备品牌名称',
      dataIndex: 'deviceBrandName',
      render: (text: string, record: any) => <a onClick={() => this.goDetail(record)}>{text}</a>,
    },
    {
      title: '品牌编码',
      dataIndex: 'deviceBrandCode',
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturers',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceTypeName',
    },
    {
      title: '解码方式',
      dataIndex: 'decodeMode',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicFacility/fetchTypeBrand',
        payload: {
          ...this.formValues,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
      });
    }
  };

  goDetail = (record: any) => {
    this.brandId = record.deviceBrandId;
    this.handleModalVisible(true);
    // Router.push(`/da/basicFacility/detail?id=${record.id}`);
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

  handleTypeBrandTag = (flag?: boolean) => {
    this.setState({
      tagVisible: !!flag,
    });
  };

  handleModalVisible = (flag?: boolean) => {
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

  addTypeBrand = () => {
    this.brandId = null;
    this.handleModalVisible(true);
  };

  removeTypeBrand = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    if (selectedRows.length === 0) {
      message.info('请先勾选您要删除的设施类型品牌');
      return;
    }
    Modal.confirm({
      title: '删除设施类型品牌',
      content: (
        <span>
          您确定要删除<a>{selectedRows.map((row: any) => row.deviceBrandName).join('、')}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'basicFacility/removeTypeBrand',
            payload: {
              ids: selectedRows.map((item: any) => item.id),
              brandIds: selectedRows.map((item: any) => item.deviceBrandId),
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
    } = this.props;
    return (
      <Form layout="inline">
        <Row>
          <Col span={24}>
            <div className="searchBox textRight">
              {getFieldDecorator('deviceBrandName')(
                <Input
                  style={{ width: 220 }}
                  onPressEnter={() => setTimeout(this.search)}
                  placeholder="请输入设备品牌名称"
                />,
              )}
              <Button onClick={this.search} className="defBtn">
                搜索
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { loading, basicFacility } = this.props;
    const { selectedRows, tagVisible, visible } = this.state;
    const { pagination } = this;

    const data = basicFacility
      ? basicFacility.typeBrandData
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
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addTypeBrand}>
                添加设备品牌
              </Button>
              <Badge count={selectedRows.length}>
                <Button className="blueBtn" onClick={this.removeTypeBrand}>
                  删除
                </Button>
              </Badge>
              <Button className="greenBtn btnStyle" onClick={() => this.handleTypeBrandTag(true)}>
                设备类型管理
              </Button>
            </Col>
            <Col span={8}>{this.renderForm()}</Col>
          </Row>
        </div>
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
          />
        </div>
        <TypeBrandModal
          brandId={this.brandId}
          visible={visible}
          handleVisible={this.handleModalVisible}
          getData={this.getData}
        />
        <TypeBrandTag visible={tagVisible} handleVisible={this.handleTypeBrandTag} />
      </div>
    );
  }
}

export default Form.create<TypeBrandListProps>()(TypeBrandList);
