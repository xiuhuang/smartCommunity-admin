import React, { Component } from 'react';
import { Form, message, Button, Row, Col, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '../model';
import UploadImg from '@/components/UploadImg';
import { checkOrderNum } from '@/utils/validator';
import styles from '../style.less';

const FormItem = Form.Item;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
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
class AddFormList extends Component<FormListProps> {
  state = {
    isEdit: false,
    detailData: {
      image: '',
    },
  };

  componentWillMount() {
    this.getTableDetail();
  }

  getTableDetail = () => {
    const { dispatch, record } = this.props;

    const parms = {
      id: record.id,
    };
    if (dispatch) {
      dispatch({
        type: 'serviceType/serviceTypeDetail',
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

  handleIsEdit = (flag?: boolean) => {
    this.setState({
      isEdit: !flag,
    });
  };

  submit() {
    const { form, dispatch, getData, handleVisible, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.id = record.id;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'serviceType/addOrEidt',
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
  }

  render() {
    const {
      form: { getFieldDecorator },
      record,
      handleVisible,
    } = this.props;

    const { isEdit, detailData } = this.state;

    let clumnCon;

    if (!isEdit) {
      clumnCon = (
        <Form className={`${styles.formBox} form12`}>
          <FormItem label="服务类型名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('serviceTypeName')(<div>{record.serviceTypeName}</div>)}
          </FormItem>

          <FormItem label="排序" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('sort')(<div>{record.sort}</div>)}
          </FormItem>

          <FormItem label="描述" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark')(<div>{record.remark}</div>)}
          </FormItem>
          <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
            {getFieldDecorator('image', {
              initialValue: detailData.image,
            })(
              <UploadImg
                text="选择图片"
                maxLength="1"
                uploadType="idCard"
                disabled
                // initialValue={detailData.image}
              />,
            )}
          </FormItem>
        </Form>
      );
    } else {
      clumnCon = (
        <Form className={`${styles.formBox} form12`}>
          <FormItem label="栏目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('serviceTypeName', {
              initialValue: record.serviceTypeName,
            })(<Input />)}
          </FormItem>

          <FormItem label="排序" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('sort', {
              initialValue: record.sort,
              rules: [{ validator: checkOrderNum }, { max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>

          <FormItem label="描述" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('remark', {
              initialValue: record.remark,
            })(<Input />)}
          </FormItem>
          <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
            {getFieldDecorator('image', {
              initialValue: detailData.image,
            })(
              <UploadImg
                text="选择图片"
                maxLength="1"
                uploadType="idCard"
                // initialValue={detailData.image}
              />,
            )}
          </FormItem>
        </Form>
      );
    }

    return (
      <div>
        <div className={styles.resTagBtnBox}>
          {clumnCon}
          {!isEdit ? (
            <Row>
              <Col span={18}></Col>
              <Col span={6}>
                <Button type="primary" onClick={() => this.handleIsEdit()}>
                  编辑
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={18}></Col>
              <Col span={6}>
                <Button onClick={() => handleVisible()}>取消</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.submit()}>
                  保存
                </Button>
              </Col>
            </Row>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create<FormListProps>()(AddFormList);
