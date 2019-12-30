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
  Card,
  message,
  InputNumber,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { StateType } from './model';
import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface CarInfoProps extends FormComponentProps {
  loading?: boolean;
  dispatch?: Dispatch<any>;
  match: any;
  location?: any;
}

@connect(
  ({
    institutionData,
    loading,
  }: {
    institutionData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    institutionData,
    loading: loading.models.institutionData,
  }),
)
class CarInfo extends Component<CarInfoProps> {
  state = {
    carTag: [],
    carInfo: {
      lpCode: '',
      lpType: '',
      lpStatus: '',
      lpExpireDate: '',
      carBrand: '',
      carColour: '',
      carType: '',
      carVin: '',
      isFocus: '',
      tagIds: '',
      pcCode: '',
      pcType: '',
      pcRegisterDate: '',
      pcExpireDate: '',
      plNumber: '',
      pcMoney: '',
      subCardTotal: '',
    },
    detailData: {
      companyName: '',
      legalIdentityCard: '',
      legalPerson: '',
      legalPhone: '',
    },
  };

  id = 0;

  companyId: any = null;

  carId: any = null;

  componentDidMount() {
    this.getResidentInfo();
    this.getCardInfo();
    this.getCarTags();
  }

  getResidentInfo = () => {
    const { dispatch, location } = this.props;
    this.companyId = location.query.companyId;
    if (dispatch) {
      dispatch({
        type: 'institution/getDetailData',
        payload: {
          companyId: this.companyId,
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

  getCarTags = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'institution/getCarTags',
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

  removeKeys = (k: string) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter((key: string) => key !== k),
    });
  };

  addKeys = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    this.id += 1;
    const nextKeys = keys.concat(`form${this.id}`);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  renderPar = (fieldsValue: any) => {
    const { location } = this.props;
    const fieldsValueArr: any = [];

    fieldsValue.keys.map((key: string) => {
      fieldsValue[key].companyId = Number(location.query.companyId);
      fieldsValue[key].carId = Number(location.query.carId);
      fieldsValue[key].isFocus = Boolean(fieldsValue[key].isFocus);
      if (fieldsValue[key].pcExpireDate) {
        fieldsValue[key].pcExpireDate = moment(fieldsValue[key].pcExpireDate).format('YYYY-MM-DD');
      }
      if (fieldsValue[key].lpExpireDate) {
        fieldsValue[key].lpExpireDate = moment(fieldsValue[key].lpExpireDate).format('YYYY-MM-DD');
      }
      if (fieldsValue[key].pcRegisterDate) {
        fieldsValue[key].pcRegisterDate = moment(fieldsValue[key].pcRegisterDate).format(
          'YYYY-MM-DD',
        );
      }
      fieldsValueArr.push(fieldsValue[key]);
      return null;
    });
    return fieldsValueArr;
  };

  submit = (e: any) => {
    const { dispatch, form, location } = this.props;
    this.companyId = location.query.companyId;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.companyId = location.query.companyId;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'institution/saveOrEditCar',
          payload: [...this.renderPar(fieldsValue)],
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              window.history.back();
            }
          },
        });
      }
    });
  };

  getCardInfo = () => {
    const { dispatch, location } = this.props;
    this.carId = location.query.carId;
    if (dispatch && this.carId !== undefined) {
      dispatch({
        type: 'institution/getCarInfoDetail',
        payload: {
          carId: this.carId,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              carInfo: res.data,
            });
          }
        },
      });
    }
  };

  isShowMonth = (k: any) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const resideStatus = getFieldValue(`[${k}][pcType]`);
    if (resideStatus === 'times') {
      return false;
    }
    return true;
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      location,
    } = this.props;

    const { detailData, carInfo, carTag } = this.state;
    this.carId = location.query.carId;
    getFieldDecorator('keys', { initialValue: ['form0'] });
    const keys = getFieldValue('keys');

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card bordered={false} className="contentCart formBox">
          <div className={styles.editCarBox}>
            <h4>车主基本信息</h4>
            <div className={styles.tableBox} style={{ height: 'auto' }}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>车主</th>
                    <td>{detailData.companyName}</td>
                    <th>法人</th>
                    <td>{detailData.legalPerson}</td>
                  </tr>
                  <tr>
                    <th>法人身份证号</th>
                    <td>{detailData.legalIdentityCard}</td>
                    <th>联系方式</th>
                    <td>{detailData.legalPhone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.editCarBox}>
            <h4>车辆信息</h4>
            <div className={styles.carouselBox}>
              <Form>
                {keys.map((k: string, index: number) => (
                  <div className={styles.formBox} key={k}>
                    <div className={styles.formNo}>{index + 1}</div>
                    {keys.length > 1 && (
                      <div className={styles.fromClose} onClick={() => this.removeKeys(k)}>
                        <Icon type="close" />
                      </div>
                    )}
                    {keys.length === index + 1 && (
                      <div>
                        {!this.carId ? (
                          <div className={styles.fromAdd} onClick={this.addKeys}>
                            <Icon type="plus" />
                          </div>
                        ) : null}
                      </div>
                    )}
                    <Row>
                      <Col span={12}>
                        <FormItem label="车牌号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                          {getFieldDecorator(`[${k}][lpCode]`, {
                            initialValue: carInfo.lpCode,
                            rules: [{ required: true, whitespace: true, message: '请输入车牌号' }],
                          })(<Input placeholder="请输入车牌号" />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label="车牌号种类"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`[${k}][lpType]`, {
                            initialValue: carInfo.lpType,
                            // rules: [{ required: true, whitespace: true, message: '请选择车牌号种类'}]
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
                          {getFieldDecorator(`[${k}][lpStatus]`, {
                            initialValue: carInfo.lpStatus,
                            // rules: [{ required: true, whitespace: true, message: '请选择车牌状态'}]
                          })(
                            <Select placeholder="请选择车牌状态">
                              <Option value="0">过期</Option>
                              <Option value="1">正常</Option>
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label="车牌有效期"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`[${k}][lpExpireDate]`, {
                            initialValue: carInfo.lpExpireDate
                              ? moment(carInfo.lpExpireDate)
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
                          {getFieldDecorator(`[${k}][carBrand]`, {
                            initialValue: carInfo.carBrand,
                          })(<Input placeholder="请输入车辆品牌" />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="车辆颜色" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                          {getFieldDecorator(`[${k}][carColour]`, {
                            initialValue: carInfo.carColour,
                          })(<Input placeholder="请输入车辆颜色" />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="车辆类型" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                          {getFieldDecorator(`[${k}][carType]`, {
                            initialValue: carInfo.carType,
                          })(
                            <Select placeholder="请选择车辆类型">
                              <Option value="max">大型车</Option>
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
                          {getFieldDecorator(`[${k}][carVin]`, {
                            initialValue: carInfo.carVin,
                          })(<Input placeholder="请输入车辆识别代号VIN" />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label="是否重点关注"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`[${k}][isFocus]`, {
                            initialValue: carInfo.isFocus ? 1 : 0,
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
                          {getFieldDecorator(`[${k}][tagIds]`, {
                            initialValue: carInfo.tagIds || [],
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
                          {getFieldDecorator(`[${k}][pcCode]`, {
                            initialValue: carInfo.pcCode,
                          })(<Input placeholder="请输入停车卡号" />)}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label="停车卡类型"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`[${k}][pcType]`, {
                            initialValue: carInfo.pcType || 'month',
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
                          {getFieldDecorator(`[${k}][pcRegisterDate]`, {
                            initialValue: carInfo.pcRegisterDate
                              ? moment(carInfo.pcRegisterDate)
                              : null,
                          })(
                            <DatePicker
                              placeholder="请输入注册时间"
                              format="YYYY-MM-DD"
                              style={{ width: '100%' }}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label="停车卡有效期"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`[${k}][pcExpireDate]`, {
                            initialValue: carInfo.pcExpireDate
                              ? moment(carInfo.pcExpireDate)
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
                          {getFieldDecorator(`[${k}][plNumber]`, {
                            initialValue: carInfo.plNumber,
                          })(<Input placeholder="请输入车位号" />)}
                        </FormItem>
                      </Col>
                      {!this.isShowMonth(k) ? (
                        <Col span={12}>
                          <FormItem label="次数" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                            {getFieldDecorator(`[${k}][subCardTotal]`, {
                              // rules: [{ required: true, whitespace: true, message: '请输入月租金额'}]
                              initialValue: carInfo.subCardTotal,
                            })(<Input placeholder="请输入次数" />)}
                          </FormItem>
                        </Col>
                      ) : (
                        <Col span={12}>
                          <FormItem
                            label="月租金额"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                          >
                            {getFieldDecorator(`[${k}][pcMoney]`, {
                              initialValue: carInfo.pcMoney ? Number(carInfo.pcMoney) : null,
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
                    </Row>
                  </div>
                ))}
                <div>2</div>
              </Form>
            </div>
            <div className={styles.btnBox}>
              <Button type="primary" onClick={this.submit} style={{ width: 320 }}>
                提交
              </Button>
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<CarInfoProps>()(CarInfo);
