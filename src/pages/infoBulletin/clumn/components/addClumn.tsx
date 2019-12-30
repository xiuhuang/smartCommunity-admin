import React, { Component } from 'react';
import { Form, message, Button, Row, Col, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '../model';
import styles from '../style.less';
import { checkOrderNum } from '@/utils/validator';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  getData: () => void;
  handleAddVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    clumn,
    loading,
  }: {
    clumn: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    clumn,
    loading: loading.models.clumn,
  }),
)
class FormList extends Component<FormListProps> {
  state = {};

  submit() {
    const { form, dispatch, getData, handleAddVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'clumn/addOrEidt',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              getData();
              handleAddVisible();
            }
          },
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleAddVisible,
    } = this.props;

    return (
      <div className={styles.resTagBtnBox}>
        <div className={styles.clunm}>
          <Form className={`${styles.formBox} form12`}>
            <FormItem label="栏目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('typeName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入栏目名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="排序" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('sort', {
                rules: [
                  { validator: checkOrderNum },
                  { max: 100, message: '最多只能输入100个字符' },
                ],
              })(<Input />)}
            </FormItem>

            <FormItem label="描述" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('remark')(<Input />)}
            </FormItem>

            <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('image')(
                <UploadImg
                  className="btnUpload"
                  text="上传图片"
                  maxLength="1"
                  uploadType="idCard"
                />,
              )}
            </FormItem>
          </Form>
          <Row>
            <Col span={18}></Col>
            <Col span={6}>
              <Button onClick={() => handleAddVisible()}>取消</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.submit()}>
                提交
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
