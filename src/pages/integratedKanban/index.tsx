import React, { Component } from 'react';
import { Col, Row, Icon, Select, Form } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import Line from './components/Charts/Line';
import Stackedcolumn from './components/Charts/Stackedcolumn';
import styles from './style.less';
import { StateType } from './model';

const { Option } = Select;

interface KanbanProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  bulletinBoard: StateType;
}

@connect(
  ({
    bulletinBoard,
    loading,
  }: {
    bulletinBoard: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    bulletinBoard,
    loading: loading.models.bulletinBoard,
  }),
)
class IntegratedKanban extends Component<KanbanProps> {
  state = {};

  noticeData = [
    {
      origin: '社区通告',
      time: '08-08',
    },
    {
      origin: '社区垃圾分类通告',
      time: '08-03',
    },
    {
      origin: '社区物业缴费通知',
      time: '08-01',
    },
  ];

  facePictureData = [
    {
      address: '南门1号摄像头',
      time: '23:12:01',
    },
    {
      address: '南门2号摄像头',
      time: '23:44:01',
    },
    {
      address: '南门3号摄像头',
      time: '12:20:01',
    },
  ];

  componentDidMount() {
    this.getData();
    // this.getElementData()
  }

  handleChange = (value: any) => {
    console.log(`selected ${value}`);
  };

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bulletinBoard/getOwnershipData',
    });
    dispatch({
      type: 'bulletinBoard/getElementData',
    });
  };

  renderEntryAndExit = (
    <Col className={styles.marginBottomCard}>
      <div className={styles.leftBottomCard}>
        <div className={styles.cardTitle}>社会入场和出场流量监控</div>
        <Line />
      </div>
    </Col>
  );

  renderNotice = (
    <Col className={styles.marginBottomCard}>
      <div className={styles.rightTopCard}>
        <div className={styles.cardTitle}>社会公告</div>
        {this.noticeData.map((item: any) => (
          <Row key={item.origin} type="flex" justify="space-between" className={styles.noticeCon}>
            <Col span={15}>
              <Icon type="star" style={{ color: '#F87805' }} theme="filled" />
              <span className={styles.noticeText}>{item.origin}</span>
            </Col>
            <Col span={5}>
              <div className={styles.noticeTime}>{item.time}</div>
            </Col>
          </Row>
        ))}
      </div>
    </Col>
  );

  renderFacePicture = (
    <Col className={styles.marginBottomCard}>
      <div className={styles.rightBottomCard}>
        <div className={styles.cardTitle}>人脸抓拍</div>
        {this.facePictureData.map((item: any) => (
          <Row key={item.address} type="flex" className={styles.facePictureCon}>
            <Col className={styles.facePicture} span={10}>
              <img src=" " alt="" />
            </Col>
            <Col className={styles.facePictureText} span={10}>
              <div>{item.address}</div>
              <div>{item.time}</div>
            </Col>
          </Row>
        ))}
      </div>
    </Col>
  );

  renderElement() {
    const {
      bulletinBoard: { elementData = [] },
    } = this.props;
    return (
      <Col className={styles.leftBottomCard} span={7}>
        <div className={styles.inCard}>
          <div className={styles.cardTitle}>社会感知元素</div>
          <Stackedcolumn attr={elementData}></Stackedcolumn>
        </div>
      </Col>
    );
  }

  renderVehicle = (
    <Col className={styles.marginBottomCard} style={{ height: 300 }}>
      <div className={styles.rightBottomCard}>
        <div className={styles.cardTitle}>车辆抓拍</div>
        {this.facePictureData.map((item: any) => (
          <Row key={item.address} type="flex" className={styles.facePictureCon}>
            <Col className={styles.facePicture} span={10}>
              <img src=" " alt="" />
            </Col>
            <Col className={styles.facePictureText} span={10}>
              <div>{item.address}</div>
              <div>{item.time}</div>
            </Col>
          </Row>
        ))}
      </div>
    </Col>
  );

  renderYbss() {
    const {
      bulletinBoard: { ownershipData = [] },
    } = this.props;
    return (
      <Col className={styles.marginBottomCard}>
        <div className={styles.leftTopCard}>
          <div className={styles.cardTitle}>一标六实</div>
          <Row>
            {ownershipData.map((item: any) => (
              <Col key={item.type} span={8}>
                <div className={styles.ybssItem}>
                  <Icon className={styles.bulletinIcon} type={item.icon} />
                  <div>{item.type}</div>
                  <div className={styles.ybssNumber}>{item.number}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Col>
    );
  }

  renderMonitor = (
    <div>
      <div className={styles.cardTitle}>实时监控</div>
      <Row
        type="flex"
        className={styles.facePictureCon}
        gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}
      >
        <Col span={12}>
          <Select
            placeholder="选择监控视频"
            className={styles.selectMonitor}
            onChange={this.handleChange}
          >
            <Option value="1">南门监控</Option>
            <Option value="2">西门监控</Option>
            <Option value="3">北门监控</Option>
          </Select>
          <div className={styles.video}></div>
        </Col>
        <Col span={11}>
          <Select
            placeholder="选择监控视频"
            className={styles.selectMonitor}
            onChange={this.handleChange}
          >
            <Option value="4">南门监控</Option>
            <Option value="5">西门监控</Option>
            <Option value="6">北门监控</Option>
          </Select>
          <div className={styles.video}></div>
        </Col>
      </Row>
    </div>
  );

  render() {
    // console.log(this.props)
    return (
      <GridContent>
        <div className={styles.kanban}>
          <Row gutter={24} type="flex" justify="center" align="top">
            <Col className={styles.girdCard} span={7}>
              <Row>
                {this.renderYbss()}
                {this.renderEntryAndExit}
              </Row>
            </Col>
            <Col className={styles.girdCard} span={11}>
              <div className={styles.inCard} style={{ height: 398 }}></div>
            </Col>
            <Col className={styles.girdCard} span={6}>
              <Row>
                {this.renderNotice}
                {this.renderFacePicture}
              </Row>
            </Col>
          </Row>
          <Row gutter={24} type="flex" justify="center" align="top">
            {this.renderElement()}
            <Col className={styles.girdCard} span={11}>
              <div className={styles.inCard} style={{ height: 300 }}>
                {this.renderMonitor}
              </div>
            </Col>
            <Col className={styles.girdCard} span={6}>
              <div>
                <Row>{this.renderVehicle}</Row>
              </div>
            </Col>
          </Row>
          <Row></Row>
        </div>
      </GridContent>
    );
  }
}

export default Form.create<KanbanProps>()(IntegratedKanban);
