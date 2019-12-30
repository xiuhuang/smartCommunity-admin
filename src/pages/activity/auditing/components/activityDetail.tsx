import React, { Component } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  // DatePicker,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from '../model';
import UploadImg from '@/components/UploadImg';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  record: any;
  getData: () => void;
  handleVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    affairsComplaint,
    loading,
  }: {
    affairsComplaint: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    affairsComplaint,
    loading: loading.models.affairsComplaint,
  }),
)
class FormList extends Component<FormListProps> {
  state = {
    detailData: {
      activityName: '',
      activityType: '',
      userName: '',
      contactPhone: '',
      beginTime: '',
      endTime: '',
      pictureUrl: [],
      activityAddress: '',
      content: '',
      status: '',
      passFlag: '',
      auditOpinion: '',
    },
  };

  componentWillMount() {
    this.getTableDetail();
  }

  getTableDetail = () => {
    const { dispatch, record } = this.props;
    const { activityId } = record;
    const parms = {
      activityId,
    };
    if (dispatch) {
      dispatch({
        type: 'activityAudit/getDetail',
        payload: {
          ...parms,
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

  submit() {
    const { form, dispatch, getData, handleVisible, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.activityId = record.activityId;
      if (fieldsValue.time) {
        fieldsValue.time = moment(fieldsValue.time).format('YYYY-MM-DD HH:mm:ss');
      }
      if (dispatch) {
        dispatch({
          type: 'activityAudit/audit',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              handleVisible();
              getData();
            }
          },
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleVisible,
    } = this.props;
    const { detailData } = this.state;
    // const { pictureUrl } = detailData;

    // let pictureCon;
    // if (pictureUrl.length > 0) {
    //   pictureCon = pictureUrl.map((item: any) => {
    //     return (
    //       <UploadImg
    //         text="上传图片"
    //         className="lsUploadImg"
    //         maxLength="1"
    //         uploadType="idCard"
    //         disabled={true}
    //         initialValue={ item }
    //       />
    //     )
    //   })
    // }

    return (
      <Form className={`${styles.formBox} form12`}>
        <FormItem label="活动标题" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('title')(<div>{detailData.activityName}</div>)}
        </FormItem>

        <FormItem label="活动范围" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('activityType')(
            <div>{detailData.activityType === '1' ? '同城活动' : '小区活动'}</div>,
          )}
        </FormItem>

        <FormItem label="活动发起人" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('phone')(<div>{detailData.userName}</div>)}
        </FormItem>
        <FormItem label="联系电话" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('title')(
            <div>{detailData.contactPhone ? detailData.contactPhone : '--'}</div>,
          )}
        </FormItem>

        <FormItem label="活动开始时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('beginTime')(<div>{detailData.beginTime}</div>)}
        </FormItem>

        <FormItem label="活动结束时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('endTime')(<div>{detailData.endTime}</div>)}
        </FormItem>
        <FormItem label="活动地点" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('activityAddress')(<div>{detailData.activityAddress}</div>)}
        </FormItem>

        <FormItem label="活动内容介绍" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('content')(<div>{detailData.content}</div>)}
        </FormItem>
        <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('pictureUrl', {
            initialValue: detailData.pictureUrl[0],
          })(
            <UploadImg
              text="上传图片"
              className="lsUploadImg"
              maxLength="1"
              uploadType="idCard"
              disabled
              // initialValue={detailData.pictureUrl[0]}
            />,
          )}
        </FormItem>
        {detailData.status === '0' ? (
          <div>
            <FormItem label="审核状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('passFlag')(
                <Select placeholder="请选择处理状态">
                  <Option value="false">驳回</Option>
                  <Option value="true">通过</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="审核意见" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('auditOpinion')(
                <Input.TextArea rows={4} placeholder="请输入审核意见" />,
              )}
            </FormItem>
            <Row>
              <Col span={6}></Col>
              <Col span={14}>
                <Button onClick={() => handleVisible()}>取消</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.submit()}>
                  提交
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <FormItem label="审核状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('passFlag')(
                <div>{detailData.status === '1' ? '驳回' : '通过'}</div>,
              )}
            </FormItem>
            <FormItem label="审核意见" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('auditOpinion')(<div>{detailData.auditOpinion}</div>)}
            </FormItem>
          </div>
        )}
      </Form>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
