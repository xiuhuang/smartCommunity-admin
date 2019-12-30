import React, { Component } from 'react';
import { Form, Select, Input, message, Modal, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
// import moment from 'moment';
import { StateType } from '../model';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  visible: boolean;
  complaintId: any;
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
    detail: {
      title: null,
      complaintPerson: null,
      contactPhone: null,
      appointmentDate: null,
      houseName: null,
      picList: [],
      status: null,
      resovleOpinion: null,
      remark: null,
      content: null,
    },
  };

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (!visible && nextProps.visible && nextProps.complaintId) {
      this.getDetail(nextProps.complaintId);
    } else if (!visible && nextProps.visible) {
      this.setState({
        detail: {
          title: null,
          complaintPerson: null,
          contactPhone: null,
          appointmentDate: null,
          houseName: null,
          picList: [],
          status: null,
          resovleOpinion: null,
          remark: null,
        },
      });
    }
  }

  getDetail = (id: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'affairsComplaint/getDetail',
        payload: {
          id,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              detail: res.data,
            });
          }
        },
      });
    }
  };

  submit() {
    const { form, dispatch, getData, handleVisible, complaintId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      fieldsValue.businessId = complaintId;
      if (dispatch) {
        dispatch({
          type: 'affairsComplaint/edit',
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
      visible,
    } = this.props;
    const { detail } = this.state;
    const isEdit = detail.status === 'Cancel' || detail.status === 'ReSolved';
    return (
      <Modal
        title="居民投诉信息"
        visible={visible}
        onCancel={() => handleVisible()}
        onOk={() => this.submit()}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form className={`${styles.formBox} form12`}>
          <FormItem label="标题" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.title}
          </FormItem>

          <FormItem label="姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.complaintPerson}
          </FormItem>

          <FormItem label="联系电话" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.contactPhone}
          </FormItem>

          <FormItem label="住户号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.houseName}
          </FormItem>

          <FormItem label="图片" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.picList &&
              detail.picList.map((item: any) => (
                <img src={item.pictureUrl} alt="" key={item.pictureUrl} />
              ))}
          </FormItem>

          <FormItem label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.remark || '暂无备注信息'}
          </FormItem>

          <FormItem label="投诉内容" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {detail.content || '暂无备注信息'}
          </FormItem>

          {isEdit && (
            <div className={styles.statusBox}>
              <Row>
                <Col span={6}>处理状态:</Col>
                <Col span={14}>
                  {detail.status === 'Cancel' && '撤销'}
                  {detail.status === 'ReSolved' && '已处理'}
                </Col>
              </Row>
              <Row>
                <Col span={6}>处理意见:</Col>
                <Col span={14}>{detail.resovleOpinion}</Col>
              </Row>
            </div>
          )}

          {!isEdit && (
            <div>
              <FormItem label="处理状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('eventStatus', {
                  initialValue: isEdit ? detail.status : null,
                })(
                  <Select placeholder="请选择处理状态" disabled={isEdit}>
                    <Option value="Cancel">撤销</Option>
                    <Option value="ReSolved">已处理</Option>
                  </Select>,
                )}
              </FormItem>

              <FormItem label="处理意见" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('resovleOpinion', {
                  initialValue: detail.resovleOpinion,
                })(<Input.TextArea rows={4} placeholder="请输入处理意见" disabled={isEdit} />)}
              </FormItem>

              <Row style={{ marginTop: 15 }}>
                <Col span={6}></Col>
                <Col span={14}>
                  <Button onClick={() => handleVisible()}>取消</Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={() => this.submit()}>
                    提交
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
