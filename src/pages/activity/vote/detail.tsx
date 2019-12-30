import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Row, Col, Form, message, Table, Icon } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import Router from 'umi/router';
import styles from './style.less';
import { StateType } from './model';
import UploadImg from '@/components/UploadImg';

interface AddInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  activity: StateType;
  match: any;
}

@connect(
  ({
    activity,
    loading,
  }: {
    activity: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    activity,
    loading: loading.models.activity,
  }),
)
class AddInfo extends Component<AddInfoProps> {
  state = {
    isCanEdit: false,
    detailData: {
      total: 0,
      status: '',
      title: '',
      type: '',
      image: '',
      endTime: '',
      beginTime: '',
      description: '',
      voteId: '',
      itemList: [],
    },
  };

  columns = [
    {
      title: '排名',
      render: (text: string, record: any, index: any) => <span>{index + 1}</span>,
    },
    {
      title: '图片',
      dataIndex: 'pictureUrl',
      render: (text: string, record: any) => (
        <img style={{ width: '50px' }} className="imgSize" src={text} alt="" />
      ),
    },
    {
      title: '投票项名称',
      dataIndex: 'voteItemName',
    },
    {
      title: '投票项描述',
      dataIndex: 'description',
    },
    {
      title: '票数',
      dataIndex: 'voteCount',
    },
    {
      title: '票数占比',
      dataIndex: 'percent',
    },
  ];

  // pagination = {
  //   current: 1,
  //   pageSize: 10,
  // };

  formValues = {};

  componentDidMount() {
    this.getTableDetail();
    this.canEdit();
  }

  getTableDetail = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const voteId = params.parmas;
    const parms = {
      voteId,
    };
    dispatch({
      type: 'activity/getTableDetail',
      payload: {
        ...parms,
      },
      callback: (res: any) => {
        if (res.code === '200') {
          this.setState({
            detailData: res.data,
          });
        }
      },
    });
  };

  canEdit = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const voteId = params.parmas;
    const parms = {
      voteId,
    };
    dispatch({
      type: 'activity/canEdit',
      payload: {
        ...parms,
      },
      callback: (res: any) => {
        if (res.code === '200') {
          this.setState({
            isCanEdit: res.data,
          });
        }
      },
    });
  };

  publish = (voteId: any, isPublish: boolean) => {
    const { dispatch } = this.props;
    const params = {
      publishFlag: isPublish,
      voteId,
    };
    dispatch({
      type: 'activity/publish',
      payload: {
        ...params,
      },
      callback: (res: any) => {
        if (res.code === '200' && res.data) {
          message.info(res.message);
          Router.push('/activity/vote');
        }
      },
    });
  };

  goToEdit = (voteId: any) => {
    Router.push(`/activity/vote/editActivity/${voteId}`);
  };

  submit() {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      // if (err) return;
      dispatch({
        type: 'activity/getDate',
        payload: {
          ...fieldsValue,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
            Router.push('/infoBulletin/infoManage');
          }
        },
      });
    });
  }

  renderTitle = () => {
    const { isCanEdit, detailData } = this.state;
    let useButton;
    if (detailData.status === '0') {
      useButton = (
        <Button
          type="primary"
          className="greenBtn btnStyle"
          onClick={() => this.publish(detailData.voteId, true)}
        >
          发布
        </Button>
      );
    } else if (detailData.status === '1') {
      useButton = (
        <Button
          type="primary"
          className="blueBtn btnStyle"
          onClick={() => this.publish(detailData.voteId, false)}
        >
          下架
        </Button>
      );
    }
    return (
      <Row>
        <Col span={6} className="topBtn noMargin">
          {isCanEdit ? (
            <Button
              type="primary"
              className="orangeBtn btnStyle"
              onClick={() => this.goToEdit(detailData.voteId)}
            >
              编辑
            </Button>
          ) : null}
          {useButton}
        </Col>
      </Row>
    );
  };

  render() {
    const { loading } = this.props;

    // const { pagination } = this;
    const { detailData } = this.state;

    // const paginationProps = {
    //   total: detailData.total,
    //   current: pagination.current,
    //   pageSize: pagination.pageSize,
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    // };
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card bordered={false} className="contentCart" title={this.renderTitle()}>
          <div className={styles.vote}>
            <Row type="flex" className={styles.RowStyle}>
              <Col className={styles.articleTitle} span={6}>
                活动名称：
              </Col>
              <Col className={styles.articleCon} span={12}>
                {detailData.title}
              </Col>
            </Row>
            <Row type="flex" className={styles.RowStyle}>
              <Col className={styles.articleTitle} span={6}>
                活动范围：
              </Col>
              <Col className={styles.articleCon} span={12}>
                {detailData.type === '1' ? '小区活动' : '街道活动'}
              </Col>
            </Row>
            <Row type="flex" className={styles.RowStyle}>
              <Col className={styles.articleTitle} span={6}>
                缩略图：
              </Col>
              <Col className={styles.articleCon} span={12}>
                <UploadImg
                  text="选择图片"
                  maxLength="1"
                  uploadType="idCard"
                  value={detailData.image}
                  disabled
                />
              </Col>
            </Row>
            <Row type="flex" className={styles.RowStyle}>
              <Col className={styles.articleTitle} span={6}>
                活动开始时间：
              </Col>
              <Col className={styles.articleCon} span={12}>
                {detailData.beginTime}
              </Col>
            </Row>
            <Row type="flex" className={styles.RowStyle}>
              <Col className={styles.articleTitle} span={6}>
                活动结束时间：
              </Col>
              <Col className={styles.articleCon} span={12}>
                {detailData.endTime}
              </Col>
            </Row>
            <Row type="flex" className={styles.RowStyle}>
              <Col className={styles.articleTitle} span={6}>
                描述：
              </Col>
              <Col className={styles.articleCon} span={12}>
                {detailData.description}
              </Col>
            </Row>
            <div className="tableBox">
              <Table
                columns={this.columns}
                dataSource={detailData.itemList}
                bordered
                rowKey="id"
                loading={loading}
                size="middle"
                locale={{
                  emptyText: '暂无数据',
                }}
                // pagination={null}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<AddInfoProps>()(AddInfo);
