import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Row, Col, Form, Radio, Input, message, Select, Icon } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
// import Router from 'umi/router';
import RichTextEditor from '@/components/RichTextEditor';
import styles from './style.less';
import { StateType } from './model';
import UploadImg from '@/components/UploadImg';
import { checkPhone } from '@/utils/validator';
import { removeHtml } from '@/utils/utils';

const { Option } = Select;
const FormItem = Form.Item;
const { Group } = Radio;
interface AddInfoProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  match: any;
}

@connect(
  ({
    infoManage,
    loading,
  }: {
    infoManage: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    infoManage,
    loading: loading.models.infoManage,
  }),
)
class AddInfo extends Component<AddInfoProps> {
  state = {
    type: '1',
    serviceTypeData: [],
    detailData: {
      serviceName: '',
      serviceTypeId: '',
      contactPhone: '',
      pictureUrl: '',
      id: '',
      type: '1',
      content: '',
      url: '',
    },
  };

  pagination = {
    pageNum: 1,
    pageSize: 100,
  };

  componentWillMount() {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ type: '1' });
    this.getServiceTypeData();
    this.getTableDetail();
  }

  getServiceTypeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'service/serviceTypePageList',
      payload: {
        ...this.pagination,
      },
      callback: (res: any) => {
        if (res.code === '200') {
          this.setState({
            serviceTypeData: res.data,
          });
        }
      },
    });
  };

  getTableDetail = () => {
    const { dispatch, match } = this.props;
    const { params } = match;

    const parms = {
      id: params.id,
    };
    if (dispatch && params.id) {
      dispatch({
        type: 'service/infoDetail',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              detailData: res.data,
              type: res.data.type,
              // }, () => form.resetFields());
            });
          }
        },
      });
    }
  };

  onGroupChange = (e: any) => {
    this.setState({
      type: e.target.value,
    });
  };

  submit() {
    const { form, dispatch } = this.props;
    const { detailData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.pictureUrl || fieldsValue.pictureUrl.length === 0) {
        fieldsValue.pictureUrl = null;
      }

      if (detailData.id) {
        fieldsValue.id = detailData.id;
      }
      if (fieldsValue.content) {
        fieldsValue.content = fieldsValue.content.toHTML();
      }
      if (fieldsValue.content && !removeHtml(fieldsValue.content)) {
        message.info('请输入文章内容');
        return;
      }
      if (err) return;
      dispatch({
        type: 'service/addInfo',
        payload: {
          ...fieldsValue,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
            // Router.push('/communityService/service');
            window.history.back();
          }
        },
      });
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { serviceTypeData, detailData, type } = this.state;
    let serviceTypeOption;
    if (serviceTypeData.length > 0) {
      serviceTypeOption = serviceTypeData.map((item: any) => (
        <Option value={item.id} key={item.id}>
          {item.serviceTypeName}
        </Option>
      ));
    }

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        backIcon={<Icon type="arrow-left" style={{ color: '#0B9BD3' }} />}
      >
        <Card bordered={false} className="contentCart">
          <div className={styles.info}>
            <Form className={styles.formWarp}>
              <FormItem label="服务名称" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('serviceName', {
                  initialValue: detailData.serviceName,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入文章标题',
                    },
                  ],
                })(<Input placeholder="请输入文章标题" />)}
              </FormItem>
              <FormItem label="服务类型" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('serviceTypeId', {
                  initialValue: detailData.serviceTypeId ? Number(detailData.serviceTypeId) : null,
                  rules: [
                    {
                      required: true,
                      message: '请输入栏目名称',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="选择栏目名称"
                    optionFilterProp="children"
                  >
                    {serviceTypeOption}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="联系方式" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('contactPhone', {
                  initialValue: detailData.contactPhone,
                  rules: [{ validator: checkPhone }],
                })(<Input placeholder="" maxLength={11} />)}
              </FormItem>
              <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('pictureUrl', {
                  initialValue: detailData.pictureUrl,
                })(
                  <UploadImg
                    className="btnUpload"
                    text="选择图片"
                    maxLength="1"
                    // initialValue={detailData.pictureUrl}
                  />,
                )}
              </FormItem>
              <FormItem label="选择编辑方式" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('type', {
                  initialValue: detailData.type,
                })(
                  <Group onChange={(e: any) => this.onGroupChange(e)} defaultSelect="1">
                    <Radio value="1">自定义编辑</Radio>
                    <Radio value="2">引用文章</Radio>
                  </Group>,
                )}
              </FormItem>
              {type === '1' ? (
                <div>
                  <FormItem label="文章内容" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator('content', {
                      initialValue: RichTextEditor.createEditorState(detailData.content),
                      rules: [
                        {
                          required: true,
                          message: '请输入文章内容',
                        },
                      ],
                      validateTrigger: 'onBlur',
                    })(<RichTextEditor />)}
                  </FormItem>
                </div>
              ) : (
                <div>
                  <FormItem label="URL地址" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator('url', {
                      initialValue: detailData.url,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入URL地址',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                </div>
              )}

              <Row>
                <Col span={6}></Col>
                <Col span={10}>
                  <Button className={styles.submitBtn} type="primary" onClick={() => this.submit()}>
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
