import React, { Component } from 'react';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import styles from '../styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface FormListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  record?: any;
  getData: () => void;
  handleVisible: () => void;
}
/* eslint react/no-multi-comp:0 */
@connect(
  ({
    vehicle,
    loading,
  }: {
    vehicle: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    vehicle,
    loading: loading.models.vehicle,
  }),
)
class FormList extends Component<FormListProps> {
  state = {
    residentResult: {
      residentName: '',
      idCard: '',
      contactPhone: '',
      houseFullName: '',
      relationType: '',
      picUrls: '',
    },
  };

  componentWillMount() {
    this.getResult();
  }

  getResult = () => {
    const { dispatch, record } = this.props;
    const parms = {
      auditId: record.auditId,
    };
    if (dispatch) {
      dispatch({
        type: 'buildings/getDetail',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              residentResult: res.data,
            });
          }
        },
      });
    }
  };

  submit() {
    const { form, dispatch, getData, handleVisible, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.auditId = record.auditId;
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'buildings/audit',
          payload: {
            ...fieldsValue,
          },
          callback: (res: any) => {
            if (res.code === '200') {
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
      record,
    } = this.props;
    const { residentResult } = this.state;
    let relationText;
    if (residentResult.relationType === '1') {
      relationText = '本人';
    } else if (residentResult.relationType === '2') {
      relationText = '配偶';
    } else if (residentResult.relationType === '3') {
      relationText = '父母';
    } else if (residentResult.relationType === '4') {
      relationText = '子女';
    } else if (residentResult.relationType === '5') {
      relationText = '祖父母';
    } else if (residentResult.relationType === '6') {
      relationText = '外祖父母';
    } else if (residentResult.relationType === '7') {
      relationText = '孙子女';
    } else if (residentResult.relationType === '8') {
      relationText = '亲戚';
    } else if (residentResult.relationType === '9') {
      relationText = '朋友';
    } else if (residentResult.relationType === '10') {
      relationText = '租客';
    } else if (residentResult.relationType === '20') {
      relationText = '其他';
    }

    return (
      <div>
        <Row className="buildingsBox">
          <Col className="residentContent" span={20}>
            <Row>
              <Col className="title" span={8}>
                房主:
              </Col>
              <Col className="content" span={16}>
                {residentResult.residentName}
              </Col>
            </Row>
            <Row>
              <Col className="title" span={8}>
                身份证号:
              </Col>
              <Col className="content" span={16}>
                {residentResult.idCard}
              </Col>
            </Row>
            <Row>
              <Col className="title" span={8}>
                联系方式:
              </Col>
              <Col className="content" span={16}>
                {residentResult.contactPhone}
              </Col>
            </Row>
            <Row>
              <Col className="title" span={8}>
                住户号:
              </Col>
              <Col className="content" span={16}>
                {residentResult.houseFullName}
              </Col>
            </Row>
            <Row>
              <Col className="title" span={8}>
                与房主关系:
              </Col>
              <Col className="content" span={16}>
                {relationText}
              </Col>
            </Row>
            <Row>
              <Col className="title" span={8}>
                认证图片:
              </Col>
              <Col className={!residentResult.picUrls ? 'content' : ''} span={16}>
                <img
                  alt=""
                  src={residentResult.picUrls}
                  // src='http://pic25.nipic.com/20121112/9252150_150552938000_2.jpg'
                />
              </Col>
            </Row>
          </Col>
        </Row>
        {record.auditStatus === '0' && (
          <Row>
            <Col span={24}>
              <Form className={styles.formBox}>
                <FormItem label="处理状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('auditStatus')(
                    <Select placeholder="请选择审核状态">
                      <Option value="0">待审批</Option>
                      <Option value="1">审批通过</Option>
                      <Option value="2">审批拒绝</Option>
                      <Option value="3">取消认证</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="处理意见" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('remark')(<Input placeholder="请输入处理意见" />)}
                </FormItem>
              </Form>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={8}></Col>
                <Col span={12}>
                  <Button onClick={() => handleVisible()}>取消</Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={() => this.submit()}>
                    提交
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default Form.create<FormListProps>()(FormList);
