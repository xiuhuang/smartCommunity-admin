import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Row, Col, Form, message, Icon, Spin } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import Router from 'umi/router';
import styles from './style.less';
import { StateType } from './model';
// import 'braft-editor/dist/index.css';
// import 'braft-extensions/dist/table.css';
// import 'braft-editor/dist/output.css'

interface AddInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  match: any;
}

@connect(
  ({
    service,
    loading,
  }: {
    service: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    service,
    loading: loading.models.service,
  }),
)
class AddInfo extends Component<AddInfoProps> {
  state = {
    detailData: {
      serviceName: '',
      serviceTypeId: '',
      serviceTypeName: '',
      contactPhone: '',
      content: '',
      id: '',
      status: '',
      type: '',
      pictureUrl: '',
      url: '',
    },
  };

  iframeH = 0;

  componentWillMount() {
    this.getTableDetail();
    this.iframeH = window.document.body.clientHeight - 300;
  }

  getTableDetail = () => {
    const { dispatch, match } = this.props;
    const { params } = match;

    const parms = {
      id: params.id,
    };
    if (dispatch) {
      dispatch({
        type: 'service/infoDetail',
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
    }
  };

  publish = (id: any, status: any) => {
    const { dispatch } = this.props;
    const params = {
      status,
      id,
    };
    dispatch({
      type: 'service/publishOrOffline',
      payload: {
        ...params,
      },
      callback: (res: any) => {
        if (res.code === '200' && res.data) {
          message.info(res.message);
          Router.push('/communityService/service');
        }
      },
    });
  };

  gotoAdd = () => {
    const { detailData } = this.state;
    Router.push(`/communityService/service/addService/${detailData.id}`);
  };

  submit() {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      // if (err) return;
      dispatch({
        type: 'service/getDate',
        payload: {
          ...fieldsValue,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
            Router.push('/communityService/service');
          }
        },
      });
    });
  }

  renderTitle = () => {
    const { detailData } = this.state;
    let btnStyle;
    if (detailData.status === '0' || detailData.status === '2') {
      btnStyle = (
        <Button
          type="primary"
          className="greenBtn btnStyle"
          onClick={() => this.publish(detailData.id, '1')}
        >
          发布
        </Button>
      );
    } else {
      btnStyle = (
        <Button
          type="primary"
          className="blueBtn btnStyle"
          onClick={() => this.publish(detailData.id, '2')}
        >
          下架
        </Button>
      );
    }

    return (
      <div className={styles.info}>
        <div className="infoLeft">
          {detailData.pictureUrl ? (
            <img className="infoImage" alt="example" src={detailData.pictureUrl} />
          ) : null}
        </div>
        <div className={`${detailData.pictureUrl ? 'infoRight' : ''}`}>
          <Row>
            <Col span={16} className={styles.articleTitle}>
              {detailData.serviceName}
            </Col>
            <Col span={8} className={`${styles.btnRightBox} topBtn`}>
              <Button type="primary" className="orangeBtn bianjiBtn" onClick={this.gotoAdd}>
                编辑
              </Button>
              {btnStyle}
            </Col>
            <Col span={24} className={styles.articleSameCon}>
              服务类型：{detailData.serviceTypeName}
            </Col>
            <Col span={24} className={styles.articleSameCon}>
              联系方式：{detailData.contactPhone ? detailData.contactPhone : '--'}
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  render() {
    const { detailData } = this.state;
    const { loading } = this.props;
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Spin spinning={loading}>
          <Card bordered={false} className="contentCart" title={this.renderTitle()}>
            <div className={styles.conWarp}>
              {detailData.type === '1' && (
                <Row type="flex">
                  <Col span={24}>
                    <div
                      className="braft-output-content"
                      dangerouslySetInnerHTML={{ __html: detailData.content }}
                    ></div>
                  </Col>
                </Row>
              )}
              {detailData.type === '2' && (
                <Row type="flex">
                  <Col span={24} style={{ fontSize: 0 }}>
                    <iframe
                      title="文章内容"
                      src={detailData.url}
                      className={styles.iframeCon}
                      style={{ height: this.iframeH }}
                    ></iframe>
                  </Col>
                </Row>
              )}
            </div>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<AddInfoProps>()(AddInfo);
