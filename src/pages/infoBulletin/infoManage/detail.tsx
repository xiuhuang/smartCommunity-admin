import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Row, Col, Form, message, Icon } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import Router from 'umi/router';
import styles from './style.less';
import { StateType } from './model';

interface AddInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  match: any;
}

@connect(
  ({
    infoManage,
    loading,
  }: {
    infoManage: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    infoManage,
    loading: loading.models.infoManage,
  }),
)
class AddInfo extends Component<AddInfoProps> {
  state = {
    detailData: {
      title: '',
      author: '',
      resource: '',
      thesis: '',
      image: '',
      content: '',
      status: '',
      id: '',
      type: '',
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
        type: 'infoManage/infoDetail',
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
      type: 'infoManage/publishOrOffline',
      payload: {
        ...params,
      },
      callback: (res: any) => {
        if (res.code === '200' && res.data) {
          message.info(res.message);
          Router.push('/infoBulletin/infoManage');
        }
      },
    });
  };

  gotoAdd = () => {
    const { detailData } = this.state;
    Router.push(`/infoBulletin/infoManage/addInfo/${detailData.id}`);
  };

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
          {detailData.image ? (
            <img className="infoImage" alt="example" src={detailData.image} />
          ) : null}
        </div>
        <div className={`${detailData.image ? 'infoRight' : ''}`}>
          <Row>
            <Col span={16} className={styles.articleTitle}>
              {detailData.title}
            </Col>
            <Col span={8} className={`${styles.btnRightBox} topBtn`}>
              <Button type="primary" className="orangeBtn bianjiBtn" onClick={this.gotoAdd}>
                编辑
              </Button>
              {btnStyle}
            </Col>
            <Col span={24} className={styles.articleSameCon}>
              作者：{detailData.author || '--'}
            </Col>
            <Col span={24} className={styles.articleSameCon}>
              文章来源：{detailData.resource || '--'}
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  render() {
    const { detailData } = this.state;
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
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
                    src={detailData.resource}
                    className={styles.iframeCon}
                    style={{ height: this.iframeH }}
                  ></iframe>
                </Col>
              </Row>
            )}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<AddInfoProps>()(AddInfo);
