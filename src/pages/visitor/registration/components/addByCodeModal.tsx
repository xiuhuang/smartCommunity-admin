import React, { Component } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import { checkPhone } from '@/utils/validator';
import styles from '../styles.less';

const FormItem = Form.Item;

interface AddModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  visible: boolean;
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
      if (dispatch) {
        dispatch({
          type: 'visitorRegistration/addRecordByCode',
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
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.realVisitorNum = Number(fieldsValue.realVisitorNum);
      if (dispatch) {
        dispatch({
          type: 'visitorRegistration/validCode',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              this.nextStep();
            }
          },
        });
      }
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
    } = this.props;
    const { step } = this.state;

    return (
      <Modal
        visible={visible}
        title={step === 1 ? '预约码登记' : '预约码登记--人脸抓拍'}
        width={750}
        onCancel={() => handleVisible()}
        footer={step === 1 ? this.renderBtn() : null}
        destroyOnClose
      >
        <Form className="form12">
          <div style={{ display: step === 1 ? 'block' : 'none', padding: 20 }}>
            <FormItem label="访客联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('phone', {
                rules: [
                  { required: true, whitespace: true, message: '请输入访客联系方式' },
                  { validator: checkPhone },
                ],
              })(<Input placeholder="请输入访客联系方式" maxLength={11} />)}
            </FormItem>
            <FormItem label="访客码" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('visitCode', {
                rules: [{ required: true, message: '请输入访客码' }],
              })(<Input placeholder="请输入访客码" />)}
            </FormItem>
            <FormItem label="实际到访人数" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('realVisitorNum', {
                rules: [{ required: true, message: '请输入实际到访人数' }],
                initialValue: 1,
              })(<Input placeholder="请输入实际到访人数" />)}
            </FormItem>
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
