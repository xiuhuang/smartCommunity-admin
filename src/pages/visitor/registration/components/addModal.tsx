import React, { Component } from 'react';
import { Modal, Form, Input, Select, Row, Col, DatePicker, message, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import House from '@/components/form/house';
import { StateType } from '../model';
import { checkID, checkPhone, checkCarNum } from '@/utils/validator';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface AddModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  visible: boolean;
  visitorRegistration?: StateType;
  handleVisible: () => void;
  getData: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    visitorRegistration,
    loading,
  }: {
    visitorRegistration: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    visitorRegistration,
    loading: loading.models.visitorRegistration,
  }),
)
class AddModal extends Component<AddModalProps> {
  state = {
    step: 1,
  };

  componentDidMount() {
    this.getVisitorReason();
  }

  componentWillReceiveProps(nextStep: any) {
    const { visible } = this.props;
    if (nextStep.visible && !visible) {
      this.setState({
        step: 1,
      });
    }
  }

  getVisitorReason = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'visitorRegistration/fetchCauseTag',
        payload: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
    }
  };

  submit = () => {
    const { form, dispatch, getData, handleVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const houseLen = fieldsValue.houseInfo.length;
      if (fieldsValue.houseInfo[houseLen - 1].level !== 'H') {
        message.info('请选择正确的住户号');
        return;
      }
      fieldsValue.houseId = fieldsValue.houseInfo[houseLen - 1].levelId;
      fieldsValue.houseName = fieldsValue.houseInfo.map((item: any) => item.name).join('/');
      fieldsValue.houseInfo = undefined;
      fieldsValue.leaveDate = fieldsValue.leaveDate.format('YYYY-MM-DD HH:mm:ss');
      fieldsValue.vrId = fieldsValue.reasonInfo.key;
      fieldsValue.visitReason = fieldsValue.reasonInfo.label;
      fieldsValue.reasonInfo = undefined;
      // fieldsValue.visitDate = fieldsValue.visitDate.format('YYYY-MM-DD');
      if (dispatch) {
        dispatch({
          type: 'visitorRegistration/add',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              getData();
              handleVisible();
            }
          },
        });
      }
    });
  };

  prepStep = () => {
    let { step } = this.state;
    step -= 1;
    this.setState({
      step,
    });
  };

  nextStep = () => {
    let { step } = this.state;
    step += 1;
    this.setState({
      step,
    });
  };

  capture = () => {
    this.nextStep();
  };

  goNext = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const houseLen = fieldsValue.houseInfo.length;
      if (fieldsValue.houseInfo[houseLen - 1].level !== 'H') {
        message.info('请选择正确的User');
        return;
      }
      this.nextStep();
    });
  };

  renderBtn = () => {
    const { handleVisible } = this.props;
    return (
      <div>
        <Button onClick={() => handleVisible()}>取消</Button>
        <Button type="primary" onClick={this.goNext}>
          下一步
        </Button>
      </div>
    );
  };

  render() {
    const {
      visible,
      handleVisible,
      form: { getFieldDecorator },
      visitorRegistration,
    } = this.props;
    const { step } = this.state;
    const causeTagList =
      visitorRegistration && visitorRegistration.causeTagList
        ? visitorRegistration.causeTagList
        : [];
    return (
      <Modal
        visible={visible}
        title={step === 1 ? '登记访客' : '登记访客--人脸抓拍'}
        width={750}
        onCancel={() => handleVisible()}
        footer={step === 1 ? this.renderBtn() : null}
        destroyOnClose
      >
        <Form className="form12">
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <h4>被访人员信息</h4>
            <Row>
              <Col span={12}>
                <FormItem label="被访人对象" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('respondents', {
                    rules: [{ required: true, whitespace: true, message: '请输入被访人对象' }],
                  })(<Input placeholder="请输入被访人对象" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="住户号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('houseInfo', {
                    rules: [{ required: true, message: '请选择住户号' }],
                  })(<House placeholder="请选择住户号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="来访事由" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('reasonInfo', {
                    rules: [{ required: true, message: '请选择来访事由' }],
                  })(
                    <Select placeholder="请选择来访事由" labelInValue>
                      {causeTagList &&
                        causeTagList.map((item: any) => (
                          <Option value={item.vrId} key={item.vrId}>
                            {item.vrName}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="预计离开时间" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('leaveDate', {
                    rules: [{ required: true, message: '请输入预计离开时间' }],
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请输入预计离开时间"
                      style={{ width: '100%' }}
                      showTime
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <h4>访客信息</h4>
            <Row>
              <Col span={12}>
                <FormItem label="姓名" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('visitorName', {
                    rules: [{ required: true, whitespace: true, message: '请输入姓名' }],
                  })(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="性别" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('visitorSex', {
                    rules: [{ required: false, message: '请选择性别' }],
                  })(
                    <Select placeholder="请选择性别">
                      <Option value="0">男</Option>
                      <Option value="1">女</Option>
                      <Option value="2">未知</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="联系方式" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('visitorPhone', {
                    rules: [
                      { required: true, whitespace: true, message: '请输入联系方式' },
                      { validator: checkPhone },
                    ],
                  })(<Input placeholder="请输入联系方式" maxLength={11} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="身份证号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('visitorIdCard', {
                    rules: [
                      { required: false, whitespace: true, message: '请输入身份证号' },
                      { validator: checkID },
                    ],
                  })(<Input placeholder="请输入身份证号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="车牌号码" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('visitorLpCode', {
                    rules: [
                      { required: false, whitespace: true, message: '请输入车牌号码' },
                      { validator: checkCarNum },
                    ],
                  })(<Input placeholder="请输入车牌号码" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="来访单位" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('visitorCompany', {
                    rules: [{ required: false, whitespace: true, message: '请输入来访单位' }],
                  })(<Input placeholder="请输入来访单位" />)}
                </FormItem>
              </Col>
            </Row>
          </div>

          <div style={{ display: step !== 1 ? 'block' : 'none' }} className={styles.headBox}>
            <h4>人脸采集时，请提醒访客正视摄像头，确认访客露出眉毛和耳朵</h4>
            {step === 2 && (
              <div>
                <div className={styles.vedioBox}>摄像头抓拍区</div>
                <div className={styles.vedioBtnBox}>
                  <Button type="primary" onClick={() => this.capture()}>
                    抓 拍
                  </Button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <div className={styles.imgBox}>
                  <img src="/default.png" alt="" />
                </div>
                <div className={styles.vedioBtnBox}>
                  <Button onClick={this.prepStep}>重新采集</Button>
                  <Button type="primary" onClick={this.submit}>
                    保存并提交
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<AddModalProps>()(AddModal);
