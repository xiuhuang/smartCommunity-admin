import React, { Component } from 'react';
import { Modal, Form, Input, Select, Row, Col, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import House from '@/components/form/house';
import { checkID, checkPhone, checkCarNum } from '@/utils/validator';
import { StateType } from '../model';

const FormItem = Form.Item;
const { Option } = Select;

interface AddModalProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  visible: boolean;
  reservation?: any;
  handleVisible: () => void;
  getData: () => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    reservation,
    loading,
  }: {
    reservation: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    reservation,
    loading: loading.models.reservation,
  }),
)
class AddModal extends Component<AddModalProps> {
  state = {};

  id = 0;

  componentDidMount() {}

  addCause = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    this.id += 1;
    form.setFieldsValue({
      keys: keys.concat(`${this.id}`),
    });
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
      fieldsValue.visitDate = fieldsValue.visitDate.format('YYYY-MM-DD HH:mm:ss');
      fieldsValue.vrId = fieldsValue.reasonInfo.key;
      fieldsValue.visitReason = fieldsValue.reasonInfo.label;
      fieldsValue.realVisitorNum = Number(fieldsValue.realVisitorNum);
      fieldsValue.reasonInfo = undefined;
      if (dispatch) {
        dispatch({
          type: 'reservation/addReservation',
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

  render() {
    const {
      visible,
      handleVisible,
      form: { getFieldDecorator },
      reservation,
    } = this.props;

    const causeTagList = reservation && reservation.causeTagList ? reservation.causeTagList : [];

    return (
      <Modal
        visible={visible}
        title="添加预约访客"
        okText="提交"
        cancelText="取消"
        width={750}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        destroyOnClose
      >
        <Form className="form12">
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
          </Row>
          <h4>预约时间信息</h4>
          <Row>
            <Col span={12}>
              <FormItem label="预约到访时间" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('visitDate', {
                  rules: [{ required: true, message: '请输入预约到访时间' }],
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请输入预约到访时间"
                    style={{ width: '100%' }}
                    showTime
                  />,
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
          </Row>

          <h4>预约访客信息</h4>
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
                  rules: [{ required: false, whitespace: true, message: '请选择性别' }],
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
            <Col span={12}>
              <FormItem label="到访人数" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('realVisitorNum', {
                  rules: [{ required: false, whitespace: true, message: '请输入到访人数' }],
                  initialValue: '1',
                })(<Input placeholder="请输入到访人数" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<AddModalProps>()(AddModal);
