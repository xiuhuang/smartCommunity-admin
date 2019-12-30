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
import { checkOrderNum } from '@/utils/validator';
import { removeHtml } from '@/utils/utils';

const { Option } = Select;
const FormItem = Form.Item;
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
    selectType: '1',
    columnData: [],
    detailData: {
      title: '',
      author: '',
      resource: '',
      thesis: '',
      image: '',
      content: '',
      status: '',
      id: '',
      newsTypeId: '',
      sort: '',
      keyWord: '',
      type: '1',
    },
  };

  pagination = {
    pageNum: 1,
    pageSize: 100,
  };

  componentWillMount() {
    // ES6解构赋值
    const {
      form: { setFieldsValue, getFieldsValue },
    } = this.props;
    setFieldsValue({ type: '1' });
    getFieldsValue();
    this.getColumnData();
    this.getTableDetail();
  }

  getColumnData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'infoManage/columnPageList',
      payload: {
        ...this.pagination,
      },
      callback: (res: any) => {
        if (res.code === '200') {
          this.setState({
            columnData: res.data,
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
        type: 'infoManage/infoDetail',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              detailData: res.data,
              selectType: res.data.type,
            });
          }
        },
      });
    }
  };

  onGroupChange = (e: any) => {
    this.setState({
      selectType: e.target.value,
    });
  };

  submit() {
    const { form, dispatch } = this.props;
    const { detailData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!fieldsValue.image || fieldsValue.image.length === 0) {
        fieldsValue.image = null;
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
        type: 'infoManage/addInfo',
        payload: {
          ...fieldsValue,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            message.success(res.message);
            // Router.push('/infoBulletin/infoManage');
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
    const { selectType, columnData, detailData } = this.state;
    let columnOption;
    if (columnData.length > 0) {
      columnOption = columnData.map((item: any) => (
        <Option value={item.id} key={item.id}>
          {item.typeName}
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
              <FormItem label="文章标题" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('title', {
                  initialValue: detailData.title,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入文章标题',
                    },
                  ],
                })(<Input placeholder="请输入文章标题" />)}
              </FormItem>
              <FormItem label="栏目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('newsTypeId', {
                  initialValue: detailData.newsTypeId ? Number(detailData.newsTypeId) : null,
                  rules: [
                    {
                      required: true,
                      message: '请输入栏目名称',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    // style={{ width: 200 }}
                    placeholder="选择栏目名称"
                    optionFilterProp="children"
                  >
                    {columnOption}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="排序值" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('sort', {
                  initialValue: detailData.sort,
                  rules: [
                    { validator: checkOrderNum },
                    { max: 100, message: '最多只能输入100个字符' },
                  ],
                })(<Input placeholder="" />)}
              </FormItem>
              <FormItem label="关键词" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('keyWord', {
                  initialValue: detailData.keyWord,
                })(<Input placeholder="" />)}
              </FormItem>
              <FormItem label="缩略图" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('image', {
                  initialValue: detailData.image,
                })(
                  <UploadImg
                    className="btnUpload"
                    text="选择图片"
                    maxLength="1"
                    // initialValue={detailData.image}
                  />,
                )}
              </FormItem>
              <FormItem label="选择编辑方式" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('type', {
                  initialValue: detailData.type,
                })(
                  <Radio.Group onChange={e => this.onGroupChange(e)}>
                    <Radio value="1">自定义编辑</Radio>
                    <Radio value="2">引用文章</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
              {selectType === '1' ? (
                <div>
                  <FormItem label="文章摘要" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator('thesis', {
                      initialValue: detailData.thesis,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入文章摘要',
                        },
                      ],
                    })(<Input.TextArea rows={4} placeholder="" />)}
                  </FormItem>
                  <FormItem label="作者" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator('author', {
                      initialValue: detailData.author,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入作者',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                  <FormItem label="文章内容" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: true,
                          message: '请输入文章内容',
                        },
                      ],
                      validateTrigger: 'onBlur',
                      initialValue: RichTextEditor.createEditorState(detailData.content),
                    })(<RichTextEditor />)}
                  </FormItem>
                </div>
              ) : (
                <div>
                  <FormItem label="URL地址" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator('resource', {
                      initialValue: detailData.resource,
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
