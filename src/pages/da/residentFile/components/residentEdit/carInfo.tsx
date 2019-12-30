import React, { Component } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Icon,
  message,
  InputNumber,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../../model';
import { checkCarNum } from '@/utils/validator';
import styles from '../../styles.less';

const FormItem = Form.Item;
const { Option } = Select;
// const { RangePicker } = DatePicker;

interface CarInfoProps extends FormComponentProps {
  residentId: any;
  dispatch?: Dispatch<any>;
  loading?: boolean;
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
class CarInfo extends Component<CarInfoProps> {
  state = {
    carTag: [],
    carInfoList: [
      {
        carBrand: null,
        carColour: null,
        carId: null,
        carType: null,
        carVin: null,
        companyId: null,
        focus: false,
        houseId: 0,
        isFocus: false,
        lpCode: '',
        lpExpireDate: null,
        lpStatus: null,
        lpType: null,
        pcCode: null,
        pcExpireDate: null,
        pcMoney: null,
        pcRegisterDate: null,
        pcStatus: null,
        pcType: null,
        plNumber: null,
        residentId: null,
        subCardTotal: null,
        tagIds: [],
      },
    ],
  };

  id = 0;

  componentDidMount() {
    this.getCarInfo();
    this.getCarTag();
  }

  getCarInfo = () => {
    const { residentId, dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/getCarInfoByResidentId',
        payload: {
          residentId: 1 * residentId,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              carInfoList: res.data,
            });
          }
        },
      });
    }
  };

  getCarTag = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/fetchResidentTag',
        payload: {
          type: '1',
        },
        callback: (res: any) => {
          if (res.code) {
            this.setState({
              carTag: res.data,
            });
          }
        },
      });
    }
  };

  removeKeys = (k: any) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // if (keys.length === 1) {
    //   return;
    // }
    form.setFieldsValue({
      keys: keys.filter((key: any) => key.carId !== k.carId),
    });
  };

  addKeys = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    this.id += 1;
    const nextKeys = keys.concat({
      carId: `form${this.id}`,
    });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  isShowMonth = (k: any) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const resideStatus = getFieldValue(`carInfo[${k.carId}][pcType]`);
    if (resideStatus === 'times') {
      return false;
    }
    return true;
  };

  renderSubmitData = (value: any) => {
    const newValue: any = [];
    value.keys.map((key: any) => {
      newValue.push(value.carInfo[key.carId]);
      return key;
    });

    newValue.map((item: any) => {
      if (item.pcExpireDate) {
        item.pcExpireDate = moment(item.pcExpireDate).format('YYYY-MM-DD');
      }
      if (item.lpExpireDate) {
        item.lpExpireDate = moment(item.lpExpireDate).format('YYYY-MM-DD');
      }
      if (item.createTime) {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD');
      }
      if (item.pcRegisterDate) {
        item.pcRegisterDate = moment(item.pcRegisterDate).format('YYYY-MM-DD');
      }
      item.isFocus = !!item.isFocus;
      return item;
    });

    return newValue;
  };

  submit = (e: any) => {
    const { dispatch, residentId } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (dispatch) {
          dispatch({
            type: 'residentFile/saveCarInfo',
            payload: {
              data: [...this.renderSubmitData(values)],
              residentId,
            },
            callback: (res: any) => {
              if (res.code === '200') {
                message.success(res.message);
                window.history.back();
              }
            },
          });
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      residentId,
    } = this.props;
    const { carTag, carInfoList } = this.state;

    getFieldDecorator('keys', { initialValue: carInfoList });
    const keys = getFieldValue('keys');

    return (
      <div className={styles.editCarBox}>
        <h4>车辆信息</h4>
        <div className={styles.carouselBox}>
          <Form>
            {keys.map((k: any, index: number) => (
              <div className={styles.formBox} key={k.carId}>
                <div className={styles.formNo}>{index + 1}</div>
                {/* {keys.length > 1 && ( */}
                <div className={styles.fromClose} onClick={() => this.removeKeys(k)}>
                  <Icon type="close" />
                </div>
                {/* )} */}
                {keys.length === index + 1 && (
                  <div className={styles.fromAdd} onClick={this.addKeys}>
                    <Icon type="plus" />
                  </div>
                )}
                <Row>
                  <Col span={12}>
                    <FormItem
                      label="居民ID"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 14 }}
                      style={{ display: 'none' }}
                    >
                      {getFieldDecorator(`carInfo[${k.carId}][residentId]`, {
                        initialValue: residentId,
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      label="carId"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 14 }}
                      style={{ display: 'none' }}
                    >
                      {getFieldDecorator(`carInfo[${k.carId}][carId]`, {
                        initialValue: carInfoList[index] ? carInfoList[index].carId : null,
                      })(<Input />)}
                    </FormItem>
                    <FormItem label="车牌号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][lpCode]`, {
                        rules: [
                          { required: true, whitespace: true, message: '请输入车牌号' },
                          { validator: checkCarNum },
                        ],
                        initialValue: carInfoList[index] ? carInfoList[index].lpCode : null,
                      })(<Input placeholder="请输入车牌号" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车牌号种类" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][lpType]`, {
                        rules: [{ required: false, message: '请选择车牌号种类' }],
                        initialValue:
                          carInfoList[index] && carInfoList[index].lpType
                            ? carInfoList[index].lpType
                            : '',
                      })(
                        <Select placeholder="请选择车牌号种类">
                          <Option value="blue">小型汽车</Option>
                          <Option value="yellow">大车</Option>
                          <Option value="white">军用车</Option>
                          <Option value="black">境外车辆</Option>
                          <Option value="green">电动汽车</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车牌状态" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][lpStatus]`, {
                        rules: [{ required: false, message: '请选择车牌状态' }],
                        initialValue: carInfoList[index] ? carInfoList[index].lpStatus : null,
                      })(
                        <Select placeholder="请选择车牌状态">
                          <Option value="0">不正常</Option>
                          <Option value="1">正常</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车牌有效期" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][lpExpireDate]`, {
                        rules: [{ required: false, message: '请选择车牌有效期' }],
                        initialValue:
                          carInfoList[index] && carInfoList[index].lpExpireDate
                            ? moment(carInfoList[index].lpExpireDate || '')
                            : null,
                      })(
                        <DatePicker
                          format="YYYY-MM-DD"
                          placeholder="请选择车牌有效期"
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车辆品牌" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][carBrand]`, {
                        rules: [
                          { required: false, message: '请输入车辆品牌' },
                          { max: 100, message: '最多只能输入100个字符' },
                        ],
                        initialValue: carInfoList[index] ? carInfoList[index].carBrand : null,
                      })(<Input placeholder="请输入车辆品牌" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车辆颜色" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][carColour]`, {
                        rules: [
                          { required: false, message: '请输入车辆颜色' },
                          { max: 100, message: '最多只能输入100个字符' },
                        ],
                        initialValue:
                          carInfoList[index] && carInfoList[index].carColour
                            ? carInfoList[index].carColour
                            : null,
                      })(<Input placeholder="请输入车辆颜色" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车辆类型" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][carType]`, {
                        rules: [{ required: false, message: '请选择车辆类型' }],
                        initialValue: carInfoList[index] ? carInfoList[index].carType : null,
                      })(
                        <Select placeholder="请选择车辆类型">
                          <Option value="Max">大型车</Option>
                          <Option value="medium">中型车</Option>
                          <Option value="small">小型车</Option>
                          <Option value="mini">微型车</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label="车辆识别代号VIN"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 14 }}
                    >
                      {getFieldDecorator(`carInfo[${k.carId}][carVin]`, {
                        rules: [
                          { required: false, message: '请输入车辆识别代号VIN' },
                          { max: 100, message: '最多只能输入100个字符' },
                        ],
                        initialValue: carInfoList[index] ? carInfoList[index].carVin : null,
                      })(<Input placeholder="请输入车辆识别代号VIN" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="是否重点关注" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][isFocus]`, {
                        rules: [{ required: false, message: '请选择是否重点关注' }],
                        initialValue: carInfoList[index] && carInfoList[index].isFocus ? 1 : 0,
                      })(
                        <Select placeholder="请选择是否重点关注">
                          <Option value={1}>是</Option>
                          <Option value={0}>否</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车辆标签" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][tagIds]`, {
                        rules: [{ required: false, message: '请选择车辆标签' }],
                        initialValue: carInfoList[index] ? carInfoList[index].tagIds : [],
                      })(
                        <Select placeholder="请选择车辆标签" mode="multiple" showArrow>
                          {carTag.map((item: any) => (
                            <Option value={item.tagId} key={item.tagId}>
                              {item.tagName}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="停车卡号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][pcCode]`, {
                        rules: [
                          { required: false, message: '请输入停车卡号' },
                          { max: 100, message: '最多只能输入100个字符' },
                        ],
                        initialValue: carInfoList[index] ? carInfoList[index].pcCode : null,
                      })(<Input placeholder="请输入停车卡号" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="停车卡类型" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][pcType]`, {
                        rules: [{ required: false, message: '请选择停车卡类型' }],
                        initialValue: carInfoList[index] ? carInfoList[index].pcType : '',
                      })(
                        <Select placeholder="请选择停车卡类型">
                          <Option value="month">月租卡</Option>
                          <Option value="times">次卡</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label="注册时间" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][pcRegisterDate]`, {
                        initialValue:
                          carInfoList[index] && carInfoList[index].pcRegisterDate
                            ? moment(carInfoList[index].pcRegisterDate || '')
                            : null,
                      })(
                        <DatePicker
                          format="YYYY-MM-DD"
                          placeholder="请输入注册时间"
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="停车卡有效期" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][pcExpireDate]`, {
                        initialValue:
                          carInfoList[index] && carInfoList[index].pcExpireDate
                            ? moment(carInfoList[index].pcExpireDate || '')
                            : null,
                      })(
                        <DatePicker
                          placeholder="请输入停车卡有效期"
                          format="YYYY-MM-DD"
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="车位号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator(`carInfo[${k.carId}][plNumber]`, {
                        rules: [{ required: false, message: '请输入车位号' }],
                        initialValue: carInfoList[index] ? carInfoList[index].plNumber : null,
                      })(<Input placeholder="请输入车位号" />)}
                    </FormItem>
                  </Col>
                  {this.isShowMonth(k) && (
                    <Col span={12}>
                      <FormItem label="月租金额" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                        {getFieldDecorator(`carInfo[${k.carId}][pcMoney]`, {
                          rules: [{ required: false, message: '请输入月租金额' }],
                          initialValue: carInfoList[index]
                            ? Number(carInfoList[index].pcMoney)
                            : null,
                        })(
                          <InputNumber
                            placeholder="请输入月租金额"
                            style={{ width: '100%' }}
                            formatter={value => (value ? `${value}元` : '')}
                          />,
                        )}
                      </FormItem>
                    </Col>
                  )}
                  {!this.isShowMonth(k) && (
                    <Col span={12}>
                      <FormItem label="次数" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                        {getFieldDecorator(`carInfo[${k.carId}][subCardTotal]`, {
                          rules: [{ required: false, message: '请输入月租金额' }],
                          initialValue: carInfoList[index] ? carInfoList[index].subCardTotal : null,
                        })(<Input placeholder="请输入次数" />)}
                      </FormItem>
                    </Col>
                  )}
                </Row>
              </div>
            ))}
            {keys.length === 0 && (
              <div className={styles.formBox} style={{ padding: 0, border: 0 }}>
                <div className={styles.fromAdd} onClick={this.addKeys}>
                  <Icon type="plus" />
                </div>
              </div>
            )}
          </Form>
        </div>
        <div className={styles.btnBox}>
          <Button type="primary" onClick={this.submit} style={{ width: 320 }}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create<CarInfoProps>()(CarInfo);
