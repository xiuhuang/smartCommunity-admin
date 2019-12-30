import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Icon, Row, Col, Form } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import styles from './styles.less';
import { StateType } from './model';

interface AddInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  letter: StateType;
  match: any;
}

@connect(
  ({
    letter,
    loading,
  }: {
    letter: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    letter,
    loading: loading.models.letter,
  }),
)
class LetterDetail extends Component<AddInfoProps> {
  state = {
    detailData: '<div></div>',
  };

  componentDidMount() {
    this.getTableDetail();
  }

  getTableDetail = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { messageId } = params;
    const parms = {
      messageId,
    };
    dispatch({
      type: 'letter/messageDetail',
      payload: {
        ...parms,
      },
      callback: (res: any) => {
        if (res.code === '200') {
          this.setState({
            detailData: res.data.data,
          });
        }
      },
    });
  };

  render() {
    const { detailData } = this.state;
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card bordered={false} className="contentCart">
          <Row type="flex" justify="center">
            <Col span={16}>
              <div
                className={styles.letterCon}
                dangerouslySetInnerHTML={{ __html: detailData }}
              ></div>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<AddInfoProps>()(LetterDetail);
