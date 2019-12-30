import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Row, Col, Form, Input, message, Select, Icon, DatePicker } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import moment from 'moment';
// import Router from 'umi/router';
import IconFont from '@/components/IconFont';
import styles from './style.less';
import { StateType } from './model';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;
const { Option } = Select;
interface AddInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
}

@connect(
  ({
    activity,
    loading,
  }: {
    activity: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    activity,
    loading: loading.models.activity,
  }),
)
class AddInfo extends Component<AddInfoProps> {
  state = {
    settingVote: [
      {
        id: 'f2e_0',
        pictureUrl: '',
        description: '',
        voteItemName: '',
      },
    ],
  };

  id = 1;

  submit = (e: any) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.beginTime = moment(fieldsValue.beginTime).format('YYYY-MM-DD HH:mm');
      fieldsValue.endTime = moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm');
      fieldsValue.itemList = fieldsValue.keys.map((item: any) => {
        const newItem = fieldsValue.itemList[item.id];
        if (String(item.id).indexOf('f2e_') === -1) {
          newItem.id = item.id;
        }
        return fieldsValue.itemList[item.id];
      });
      if (dispatch) {
        dispatch({
          type: 'activity/addActivity',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              // Router.push('/activity/vote');
              window.history.back();
            }
          },
        });
      }
    });
  };

  remove = (k: any) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // if (keys.length === 1) {
    //   return;
    // }
    form.setFieldsValue({
      keys: keys.filter((key: any) => key.id !== k.id),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    this.id += 1;
    const nextKeys = keys.concat({
      id: `f2e_${this.id}`,
    });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  renderSettingVote() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { settingVote } = this.state;
    getFieldDecorator('keys', { initialValue: settingVote });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k: any, index: any) => (
      <Row key={k.id}>
        <Col span={6} className={styles.indexText}>
          第{index + 1}项：
        </Col>
        <Col span={2} style={{ marginRight: 10 }}>
          {getFieldDecorator(`itemList[${k.id}]pictureUrl`, {
            validateTrigger: ['onChange', 'onBlur'],
          })(
            <UploadImg
              text="上传图片"
              className="lsUploadImg"
              maxLength="1"
              uploadType="idCard"
              index={index}
            />,
          )}
        </Col>
        <Col span={7}>
          <Row className={styles.iconWarp}>
            <Col span={18}>
              {getFieldDecorator(`itemList[${k.id}]voteItemName`, {
                validateTrigger: ['onChange', 'onBlur'],
              })(<Input placeholder="输入投票选项名称" />)}
            </Col>
            <Col span={24}>
              {getFieldDecorator(`itemList[${k.id}]description`, {
                validateTrigger: ['onChange', 'onBlur'],
              })(<Input placeholder="输入投票描述" />)}
            </Col>
            {/* {keys.length > 1 ? ( */}
            <div className={styles.removeIcon} onClick={() => this.remove(k)}>
              <IconFont type="iconshanchu" className="dynamic-delete-button" />
            </div>
            {/* ) : null} */}
          </Row>
        </Col>
      </Row>
    ));
    return formItems;
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card bordered={false} className="contentCart">
          <div className={styles.vote}>
            <Form className={styles.formWarp}>
              <FormItem label="活动名称" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入活动名称',
                    },
                  ],
                })(<Input placeholder="" />)}
              </FormItem>
              <FormItem label="活动范围" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请选择活动范围',
                    },
                  ],
                })(
                  <Select placeholder="活动范围">
                    <Option value="1">小区活动</Option>
                    <Option value="2">街道活动</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('image', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请选择缩略图',
                    },
                  ],
                })(
                  <UploadImg
                    className="btnUpload"
                    text="选择图片"
                    maxLength="1"
                    uploadType="idCard"
                    prompt
                  />,
                )}
              </FormItem>
              <FormItem label="开始时间" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('beginTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开始时间',
                    },
                  ],
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm"
                    showTime
                    placeholder="请选择开始时间"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
              <FormItem label="结束时间" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间',
                    },
                  ],
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm"
                    showTime
                    placeholder="请选择结束时间"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
              <FormItem label="描述" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('description')(<Input placeholder="" />)}
              </FormItem>
              <Row className={styles.settingVote}>
                <Col span={3}></Col>
                <Col span={3}>设置投票项</Col>
              </Row>
              <div className="settingVoteList">
                {this.renderSettingVote()}
                <Col span={24}>
                  <Icon className={styles.addSettingVote} type="plus" onClick={this.add} />
                </Col>
              </div>
              <Row>
                <Col span={6}></Col>
                <Col span={10}>
                  <Button className={styles.submitBtn} type="primary" onClick={this.submit}>
                    提交
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<AddInfoProps>()(AddInfo);
