import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker, Card, Tabs, message, Icon } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import moment from 'moment';
import Router from 'umi/router';
import { StateType } from './model';
import UploadImg from '@/components/UploadImg';
import { checkPhone } from '@/utils/validator';
import styles from './styles.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

// const momentTime = (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss');

interface ResidentInfoProps extends FormComponentProps {
  loading?: any;
  dispatch?: Dispatch<any>;
  institutionData?: StateType;
  match: any;
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
class ResidentInfo extends Component<ResidentInfoProps> {
  state = {
    activeKey: '1',
    companyId: '',
    editDate: {
      companyName: '',
      busLic: '',
      legalPerson: '',
      legalPhone: '',
      legalIdentityCard: '',
      operatorPeriod: '',
      legelAddress: '',
      busLicPictureUrl: '',
      housePurpose: '',
      houseType: '',
      houseArea: '',
      proPapersNum: '',
      proPhone: '',
      proPerson: '',
      proType: '',
      address: '',
      legalPicture: '',
    },
  };

  componentWillMount() {
    this.getEditData();
  }

  getEditData = () => {
    const { match, dispatch } = this.props;
    const parms = {
      companyId: match.params.companyId,
    };
    this.setState({
      companyId: match.params.companyId,
    });
    if (dispatch) {
      dispatch({
        type: 'institution/getDetailData',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              editDate: res.data,
            });
          }
        },
      });
    }
  };

  tabsChange = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  submit() {
    const { form, dispatch } = this.props;
    const { companyId } = this.state;
    form.validateFields((err, fieldsValue) => {
      // fieldsValue.operatorPeriod = `${momentTime(fieldsValue.operatorPeriod[0])} ~ ${momentTime(
      //   fieldsValue.operatorPeriod[1],
      // )}`;
      fieldsValue.companyId = companyId;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'institution/saveOrEdit',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              Router.push('/da/Institution');
            }
          },
        });
      }
    });
  }

  renderTitle = () => {
    const { activeKey } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.tabsChange}>
        <TabPane tab="添加单位信息" key="1" />
      </Tabs>
    );
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { editDate } = this.state;
    let defaultSelectDate;
    if (editDate.operatorPeriod) {
      defaultSelectDate = {
        startDate: moment(editDate.operatorPeriod[0]),
        endDate: moment(editDate.operatorPeriod[1]),
      };
    } else {
      defaultSelectDate = {
        startDate: null,
        endDate: null,
      };
    }
    return (
      <Form className={styles.resiEditBox}>
        <div className={styles.title}>单位基本信息</div>
        <div className={`${styles.content} ${styles.basicBox}`}>
          <div className={styles.conLeft}>
            <div className="avatarBox">
              {getFieldDecorator('legalPicture', {
                initialValue: editDate.legalPicture,
              })(
                <UploadImg
                  text="添加法人照片"
                  maxLength="1"
                  uploadType="idCard"
                  // initialValue={editDate.legalPicture}
                />,
              )}
            </div>
          </div>
          <Row>
            <Col span={11}>
              <FormItem label="单位名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('companyName', {
                  initialValue: editDate.companyName,
                  rules: [{ required: true, whitespace: true, message: '请输入单位名称' }],
                })(<Input placeholder="请输入单位名称" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="注册号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('busLic', {
                  initialValue: editDate.busLic,
                  rules: [{ required: true, whitespace: true, message: '请输入注册号' }],
                })(<Input placeholder="请输入注册号" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="经营者姓名/法人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('legalPerson', {
                  initialValue: editDate.legalPerson,
                  rules: [{ required: true, whitespace: true, message: '请输入经营者姓名/法人' }],
                })(<Input placeholder="请输入经营者姓名/法人" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('legalPhone', {
                  initialValue: editDate.legalPhone,
                  rules: [
                    { required: true, whitespace: true, message: '请输入联系方式' },
                    { validator: checkPhone },
                  ],
                })(<Input placeholder="请输入联系方式" maxLength={11} />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="法人身份证号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('legalIdentityCard', {
                  initialValue: editDate.legalIdentityCard,
                  rules: [{ required: true, whitespace: true, message: '请输入法人身份证号' }],
                })(<Input placeholder="请输入法人身份证号" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="营业期限" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('operatorPeriod', {
                  initialValue: [defaultSelectDate.startDate, defaultSelectDate.endDate],
                  rules: [{ required: true, message: '请输入营业期限' }],
                })(
                  <RangePicker
                    placeholder={['开始时间', '结束时间']}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="住所" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('legelAddress', {
                  initialValue: editDate.legelAddress,
                  rules: [{ required: true, whitespace: true, message: '请输入住所' }],
                })(<Input placeholder="请输入住所" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="营业执照" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('busLicPictureUrl', {
                  initialValue: editDate.busLicPictureUrl,
                  rules: [{ required: true, whitespace: true, message: '营业执照必须上传' }],
                })(
                  <UploadImg
                    className="btnUpload"
                    text="选择图片"
                    maxLength="1"
                    uploadType="idCard"
                    // initialValue={editDate.busLicPictureUrl}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <div className={styles.title}>房屋基本信息</div>
        <div className={styles.content}>
          <div className={styles.conLeft}></div>
          <Row>
            <Col span={11}>
              <FormItem label="房屋地址" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('address', {
                  initialValue: editDate.address,
                  rules: [{ required: false, whitespace: true, message: '请输入房屋地址' }],
                })(<Input placeholder="请输入房屋地址" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="产权人类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('proType', {
                  initialValue: editDate.proType,
                  rules: [{ required: false, whitespace: true, message: '请输入产权人类型' }],
                })(<Input placeholder="请输入产权人类型" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="房屋所有权人" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('proPerson', {
                  initialValue: editDate.proPerson,
                  rules: [{ required: false, whitespace: true, message: '请输入房屋所有权人' }],
                })(<Input placeholder="请输入房屋所有权人" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="联系方式" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('proPhone', {
                  initialValue: editDate.proPhone,
                  rules: [
                    { required: false, whitespace: true, message: '请输入联系方式' },
                    { validator: checkPhone },
                  ],
                })(<Input placeholder="请输入联系方式" maxLength={11} />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="身份证号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('proPapersNum', {
                  initialValue: editDate.proPapersNum,
                  rules: [{ required: false, whitespace: true, message: '请输入身份证号' }],
                })(<Input placeholder="请输入身份证号" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="房屋面积" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('houseArea', {
                  initialValue: editDate.houseArea,
                  rules: [{ required: false, whitespace: true, message: '请输入房屋面积' }],
                })(<Input placeholder="请输入房屋面积" />)}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="房屋性质" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('houseType', {
                  initialValue: editDate.houseType,
                  rules: [{ required: false, whitespace: true, message: '请选择房屋性质' }],
                })(
                  <Select placeholder="请选择房屋性质">
                    <Option value="1">商品房</Option>
                    <Option value="2">集资房</Option>
                    <Option value="3">安居房</Option>
                    <Option value="4">解困房</Option>
                    <Option value="5">存量房</Option>
                    <Option value="6">廉价住房</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem label="规划用途" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('housePurpose', {
                  initialValue: editDate.housePurpose,
                  rules: [{ required: false, whitespace: true, message: '请选择规划用途' }],
                })(
                  <Select placeholder="请选择规划用途">
                    <Option value="1">住宅</Option>
                    <Option value="2">厂房</Option>
                    <Option value="3">仓库</Option>
                    <Option value="4">商业</Option>
                    <Option value="5">服务</Option>
                    <Option value="6">文化</Option>
                    <Option value="7">教育</Option>
                    <Option value="8">卫生</Option>
                    <Option value="9">体育</Option>
                    <Option value="10">办公用房</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className={styles.editBtnBox}>
          <Button type="primary" onClick={() => this.submit()}>
            提交
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    const { activeKey } = this.state;

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card
          className="contentCart titleTabs bodyNoPadding"
          bordered={false}
          title={this.renderTitle()}
        >
          {activeKey === '1' && this.renderForm()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ResidentInfoProps>()(ResidentInfo);
