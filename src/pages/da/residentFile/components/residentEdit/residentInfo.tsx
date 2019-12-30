import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../styles.less';
// import IconFont from '@/components/IconFont';
import Nation from '@/components/form/nation';
import Nationality from '@/components/form/nationality';
import House from '@/components/form/house';
import AreaCascader from '@/components/form/AreaCascader';
import UploadImg from '@/components/UploadImg';
import { StateType } from '../../model';
import { checkName, checkPhone, checkID } from '@/utils/validator';

// const nationJson = require('@/utils/nation.json');
// console.log(nationJson)

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ResidentInfoProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  residentFile?: StateType;
  id?: string;
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
class ResidentInfo extends Component<ResidentInfoProps> {
  state = {
    baseInfo: {
      id: null,
      pictureUrl: null,
      residentName: null,
      sex: null,
      idCard: null,
      birthday: '',
      censusRegister: null,
      censusRegisterDetailAddress: null,
      contactPhone: null,
      education: null,
      isFocus: null,
      isMarry: null,
      nation: null,
      nationality: null,
      poc: null,
      profession: null,
      residentId: null,
      tagDTOS: [],
      workUnit: null,
    },
    houseInfo: [
      {
        resideStatus: null,
        relationType: null,
        resideReason: null,
        houseLevelDTOS: [],
        residePeriod: '',
        resideInfoId: 'f2e_00',
      },
    ],
  };

  id = 0;

  componentDidMount() {
    const { id } = this.props;
    this.getResidentTag();
    if (id) {
      this.getResidentInfo();
    }
  }

  getResidentInfo = () => {
    const { id } = this.props;
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/getResidentInfo',
        payload: {
          residentId: Number(id),
        },
        callback: (res: any) => {
          if (res.code === '200') {
            let newHouseInfo: any = [];
            if (res.data.houseInfo) {
              newHouseInfo = res.data.houseInfo;
            }
            this.setState({
              baseInfo: res.data.baseInfo || {},
              houseInfo: newHouseInfo,
            });
          }
        },
      });
    }
  };

  getResidentTag = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'residentFile/fetchResidentTag',
        payload: {
          type: '0',
        },
      });
    }
  };

  renderFieldsValue = (fieldsValue: any) => {
    let isBack = false;
    if (fieldsValue.birthday) {
      fieldsValue.birthday = fieldsValue.birthday.format('YYYY-MM-DD');
    }
    fieldsValue.isFocus = Boolean(fieldsValue.isFocus);
    fieldsValue.resideInfoList = fieldsValue.keys.map((key: any, index: number) => {
      if (
        fieldsValue.resideInfoList[key.resideInfoId].residePeriod &&
        fieldsValue.resideInfoList[key.resideInfoId].residePeriod.length > 0
      ) {
        fieldsValue.resideInfoList[key.resideInfoId].residePeriod = `${fieldsValue.resideInfoList[
          key.resideInfoId
        ].residePeriod[0].format('YYYY-MM-DD')}~${fieldsValue.resideInfoList[
          key.resideInfoId
        ].residePeriod[1].format('YYYY-MM-DD')}`;
      } else {
        fieldsValue.resideInfoList[key.resideInfoId].residePeriod = undefined;
      }
      if (String(key.resideInfoId).indexOf('f2e_') === -1) {
        fieldsValue.resideInfoList[key.resideInfoId].resideInfoId = key.resideInfoId;
      }
      const { houseLevelDTOS } = fieldsValue.resideInfoList[key.resideInfoId];
      const level = houseLevelDTOS.find((item: any) => item.level === 'H');
      if (!level || level.length === 0) {
        isBack = true;
        message.info(`请在第${index + 1}个房屋信息选择正确的住户号`);
      }
      return fieldsValue.resideInfoList[key.resideInfoId];
    });

    if (isBack) {
      return false;
    }
    return fieldsValue;
  };

  submit = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = this.renderFieldsValue(fieldsValue);
      if (!params) {
        return;
      }
      if (dispatch) {
        dispatch({
          type: 'residentFile/addResident',
          payload: {
            ...params,
          },
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
    const nextKeys = keys.concat({
      resideInfoId: `f2e_${this.id}`,
    });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  isDisabled = (k: any) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const resideStatus = getFieldValue(`resideInfoList[${k.resideInfoId}][resideStatus]`);
    if (resideStatus === '1' || resideStatus === '2') {
      return true;
    }
    return false;
  };

  disabledBrithdayDate = (endValue: any) => endValue.valueOf() >= new Date().getTime();

  render() {
    const { baseInfo, houseInfo } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      residentFile,
    } = this.props;

    const residentTagList =
      residentFile && residentFile.residentTagList ? residentFile.residentTagList : [];

    getFieldDecorator('keys', { initialValue: houseInfo });
    const keys = getFieldValue('keys');
    return (
      <Form className={styles.resiEditBox}>
        <div className={styles.title}>居民基本信息</div>
        <div className={`${styles.content} ${styles.basicBox}`}>
          {getFieldDecorator('id', {
            initialValue: baseInfo.id || null,
          })(<Input placeholder="请输入姓名" style={{ display: 'none' }} />)}
          <div className={styles.conLeft}>
            <div className="avatarBox">
              {getFieldDecorator('pictureUrl', {
                rules: [{ required: false, message: '请上传头像' }],
                initialValue: baseInfo.pictureUrl || null,
              })(<UploadImg text="上传头像" uploadType="avator" maxLength={1} />)}
            </div>
          </div>
          <Row>
            <Col span={12}>
              <FormItem label="姓名" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('residentName', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入姓名' },
                    { validator: checkName },
                  ],
                  initialValue: baseInfo.residentName || null,
                })(<Input placeholder="请输入姓名" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="性别" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('sex', {
                  rules: [{ required: true, message: '请选择性别' }],
                  initialValue: baseInfo.sex || null,
                })(
                  <Select placeholder="请选择性别">
                    <Option value="0">男</Option>
                    <Option value="1">女</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="出生日期" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('birthday', {
                  rules: [{ required: true, message: '请输入出生日期' }],
                  initialValue: baseInfo.birthday ? moment(baseInfo.birthday) : null,
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={this.disabledBrithdayDate}
                    placeholder="请输入出生日期"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="身份证号" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('idCard', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入身份证号' },
                    { validator: checkID },
                  ],
                  initialValue: baseInfo.idCard || null,
                  // initialValue: '513436200009281329',
                })(<Input placeholder="请输入身份证号" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('contactPhone', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入联系方式' },
                    { validator: checkPhone },
                  ],
                  initialValue: baseInfo.contactPhone || null,
                })(<Input placeholder="请输入联系方式" maxLength={11} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="户籍" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('censusRegister', {
                  rules: [{ required: true, message: '请选择户籍所在地' }],
                  initialValue: baseInfo.censusRegister || null,
                })(<AreaCascader placeholder="请选择户籍所在地" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="居民标签" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('tagIds', {
                  rules: [{ required: false, message: '请选择居民标签' }],
                  initialValue: baseInfo.tagDTOS
                    ? baseInfo.tagDTOS.map((item: any) => item.tagId)
                    : [],
                })(
                  <Select placeholder="请选择居民标签" mode="multiple" showArrow>
                    {residentTagList.map((item: any) => (
                      <Option value={item.tagId} key={item.tagId}>
                        {item.tagName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="是否为重点关注" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('isFocus', {
                  rules: [{ required: false, message: '请选择是否为重点关注' }],
                  initialValue: baseInfo.isFocus ? 1 : 0,
                })(
                  <Select placeholder="请选择是否为重点关注">
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className={styles.title}>居民房屋信息</div>
        <div className={styles.content} style={{ padding: 20 }}>
          <div className={styles.editCarBox}>
            <div className={styles.carouselBox}>
              {keys.map((k: any, index: number) => (
                <div className={styles.formBox} key={k.resideInfoId}>
                  <div className={styles.formNo}>{index + 1}</div>
                  {keys.length > 1 && (
                    <div className={styles.fromClose} onClick={() => this.removeKeys(k)}>
                      <Icon type="close" />
                    </div>
                  )}
                  {keys.length === index + 1 && (
                    <div className={styles.fromAdd} onClick={this.addKeys}>
                      <Icon type="plus" />
                    </div>
                  )}
                  <Row>
                    <Col span={12}>
                      <FormItem label="住户号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator(`resideInfoList[${k.resideInfoId}][houseLevelDTOS]`, {
                          rules: [{ required: true, message: '请输入住户号' }],
                          initialValue:
                            houseInfo[index] && houseInfo[index].houseLevelDTOS
                              ? houseInfo[index].houseLevelDTOS
                              : [],
                        })(<House placeholder="请输入住户号" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="与房主关系" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator(`resideInfoList[${k.resideInfoId}][relationType]`, {
                          rules: [{ required: true, message: '请选择与房主关系' }],
                          initialValue: houseInfo[index] ? houseInfo[index].relationType : null,
                        })(
                          <Select placeholder="请选择与房主关系">
                            <Option value="1">本人</Option>
                            <Option value="2">配偶</Option>
                            <Option value="3">父母</Option>
                            <Option value="4">子女</Option>
                            <Option value="5">亲戚</Option>
                            <Option value="6">朋友</Option>
                            <Option value="7">租客</Option>
                            <Option value="8">其他</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="居住状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator(`resideInfoList[${k.resideInfoId}][resideStatus]`, {
                          rules: [{ required: true, message: '请选择居住状态' }],
                          initialValue: houseInfo[index] ? houseInfo[index].resideStatus : null,
                        })(
                          <Select placeholder="请选择居住状态">
                            <Option value="0">常住</Option>
                            <Option value="1">暂住</Option>
                            <Option value="2">租房</Option>
                            <Option value="3">搬离</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      {this.isDisabled(k) && (
                        <FormItem label="居住时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                          {getFieldDecorator(`resideInfoList[${k.resideInfoId}][residePeriod]`, {
                            rules: [{ required: false, message: '请输入居住时间' }],
                            initialValue:
                              houseInfo[index] && houseInfo[index].residePeriod
                                ? [
                                    moment(houseInfo[index].residePeriod.split('~')[0]),
                                    moment(houseInfo[index].residePeriod.split('~')[1]),
                                  ]
                                : [],
                          })(
                            <RangePicker
                              placeholder={['开始时间', '结束时间']}
                              format="YYYY-MM-DD"
                              style={{ width: '100%' }}
                            />,
                          )}
                        </FormItem>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="居住事由" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator(`resideInfoList[${k.resideInfoId}][resideReason]`, {
                          rules: [{ required: false, message: '请选择居住事由' }],
                          initialValue: houseInfo[index] ? houseInfo[index].resideReason : null,
                        })(
                          <Select placeholder="请选择居住事由">
                            <Option value="0">务工</Option>
                            <Option value="1">经商</Option>
                            <Option value="2">务农</Option>
                            <Option value="3">服务</Option>
                            <Option value="4">因公出差</Option>
                            <Option value="5">借读培训</Option>
                            <Option value="6">治病疗养</Option>
                            <Option value="7">随迁亲属</Option>
                            <Option value="8">拆迁搬家</Option>
                            <Option value="9">记挂户口</Option>
                            <Option value="10">婚姻嫁娶</Option>
                            <Option value="11">投靠亲友</Option>
                            <Option value="12">保姆</Option>
                            <Option value="13">探亲访友</Option>
                            <Option value="14">旅游观光</Option>
                            <Option value="15">人才引进</Option>
                            <Option value="16">其他</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.title}>居民其他信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={8}>
              <FormItem label="国籍" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('nationality', {
                  rules: [{ required: false, message: '请选择国籍' }],
                  initialValue: baseInfo.nationality || null,
                })(<Nationality placeholder="请选择国籍" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="民族" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('nation', {
                  rules: [{ required: false, message: '请选择民族' }],
                  initialValue: baseInfo.nation || null,
                })(<Nation placeholder="请选择民族" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="婚姻状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('isMarry', {
                  rules: [{ required: false, message: '请选择婚姻状态' }],
                  initialValue: baseInfo.isMarry || null,
                })(
                  <Select placeholder="请选择婚姻状态">
                    <Option value="">未设置</Option>
                    <Option value="未婚">未婚</Option>
                    <Option value="已婚">已婚</Option>
                    <Option value="离婚">离婚</Option>
                    <Option value="丧偶">丧偶</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="职业" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('profession', {
                  rules: [{ required: false, message: '请选择职业' }],
                  initialValue: baseInfo.profession || null,
                })(
                  <Select placeholder="请选择职业">
                    <Option value="">未设置</Option>
                    <Option value="互联网技术">互联网技术</Option>
                    <Option value="金融保险业">金融保险业</Option>
                    <Option value="商业及服务业">商业及服务业</Option>
                    <Option value="工程制造">工程制造</Option>
                    <Option value="交通运输">交通运输</Option>
                    <Option value="文化传媒">文化传媒</Option>
                    <Option value="娱乐体育">娱乐体育</Option>
                    <Option value="公共事业">公共事业</Option>
                    <Option value="学生">学生</Option>
                    <Option value="自由职业">自由职业</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="文化程度" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('education', {
                  rules: [{ required: false, message: '请选择文化程度' }],
                  initialValue: baseInfo.education || null,
                })(
                  <Select placeholder="请选择文化程度">
                    <Option value="">未设置</Option>
                    <Option value="小学">小学</Option>
                    <Option value="初中">初中</Option>
                    <Option value="高中">高中</Option>
                    <Option value="大学">大学</Option>
                    <Option value="硕士">硕士</Option>
                    <Option value="博士">博士</Option>
                    <Option value="博士后">博士后</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="政治面貌" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('poc', {
                  rules: [{ required: false, message: '请选择政治面貌' }],
                  initialValue: baseInfo.poc || null,
                })(
                  <Select placeholder="请选择政治面貌">
                    <Option value="">未设置</Option>
                    <Option value="群众">群众</Option>
                    <Option value="党员">党员</Option>
                    <Option value="共青团员">共青团员</Option>
                    <Option value="其他民主党派">其他民主党派</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="工作单位" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('workUnit', {
                  rules: [
                    { required: false, whitespace: true, message: '请输入工作单位' },
                    { max: 50, message: '最多只能输入50个字符' },
                  ],
                  initialValue: baseInfo.workUnit || null,
                })(<Input placeholder="请输入工作单位" />)}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem label="户籍详细地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('censusRegisterDetailAddress', {
                  rules: [
                    { required: false, whitespace: true, message: '请输入户籍详细地址' },
                    { max: 200, message: '最多只能输入200个字符' },
                  ],
                  initialValue: baseInfo.censusRegisterDetailAddress || null,
                })(<Input placeholder="请输入户籍详细地址" />)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className={styles.editBtnBox}>
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create<ResidentInfoProps>()(ResidentInfo);
