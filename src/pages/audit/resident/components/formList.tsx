import React, { Component } from 'react';
import { Form, Select, Input, Button, Row, Col, Icon } from 'antd';
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
    residentResult: [],
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
        type: 'resident/getDetail',
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
          type: 'resident/audit',
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

    const sysResult = residentResult.map((item: any) => (
      <Row>
        <Col className="title" span={8}>
          {item.codeName}:
        </Col>
        <Col className="content" span={16}>
          {item.sourceData}
        </Col>
      </Row>
    ));

    const result = residentResult.map((item: any) => (
      <Row>
        <Col className="title" span={8}>
          {item.codeName}:
        </Col>
        <Col className="content" span={16}>
          {item.targetData}
        </Col>
      </Row>
    ));

    const resultStyle = residentResult.map((item: any) => {
      if (item.result) {
        return (
          <div className="checkStyle">
            <Icon type="check" />
            匹配成功
          </div>
        );
      }
      return (
        <div className="checkStyleFalse">
          <Icon type="check" />
          匹配不成功
        </div>
      );
    });

    return (
      <div>
        <Row className="residentBox">
          <Col className="residentContent" span={10}>
            <Row className="residentZiliao">系统资料</Row>
            {sysResult}
          </Col>
          <Col span={10} className="residentContent borderLeftDash">
            <Row className="residentZiliao">认证资料</Row>
            {result}
          </Col>
          {record.auditStatus === '0' && (
            <Col span={3}>
              <Row className="residentZiliao"></Row>
              {resultStyle}
            </Col>
          )}
        </Row>
        {record.auditStatus === '0' && (
          <Row>
            <Col span={24}>
              <Form className={styles.formBox}>
                <FormItem label="审核状态" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
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
