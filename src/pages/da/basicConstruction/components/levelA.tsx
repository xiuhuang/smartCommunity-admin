import React, { Component } from 'react';
import { Button, Row, Col, Form, Modal, message, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '../model';
import { checkOrderNum } from '@/utils/validator';
import styles from '../styles.less';

const FormItem = Form.Item;
interface LevelAProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  getTreeData: () => void;
  getTreeDataO: () => void;
  changeToC: () => void;
  upTableDate: (param: any) => void;
  selectedNodes?: any;
  basicInfo?: any;
  tableDetail?: any;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    basicInfo,
    loading,
  }: {
    basicInfo: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    basicInfo,
    loading: loading.models.basicInfo,
  }),
)
class LevelA extends Component<LevelAProps> {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  removeTreeDate = () => {
    const { dispatch, selectedNodes, getTreeData, changeToC } = this.props;
    const { children } = selectedNodes;
    const { buildTreeId } = selectedNodes;
    if (!children || children.length === 0) {
      Modal.confirm({
        title: '温馨提示',
        content: (
          <span>
            您确定要删除<a>{selectedNodes.buildName}</a>吗？
          </span>
        ),
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          if (dispatch) {
            dispatch({
              type: 'basicInfo/remove',
              payload: {
                ids: [buildTreeId],
              },
              callback: (res: any) => {
                if (res.code === '200') {
                  message.success(res.message);
                  getTreeData();
                  changeToC();
                }
              },
            });
          }
        },
      });
    } else {
      message.error('存在下级社区机构，不允许删除！');
    }
  };

  submit() {
    const { form, dispatch, tableDetail, upTableDate, getTreeDataO } = this.props;
    const { levelMap } = tableDetail;

    form.validateFields((err, fieldsValue) => {
      fieldsValue.id = levelMap.id;
      const updateParms = {
        level: tableDetail.level,
        levelId: tableDetail.levelId,
      };
      const param = {
        level: tableDetail.level,
        levelId: tableDetail.levelId,
        name: tableDetail.name,
        levelMap: fieldsValue,
      };
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'basicInfo/editTableDetail',
          payload: {
            ...param,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              this.handleVisible();
              upTableDate(updateParms);
              getTreeDataO();
            }
          },
        });
      }
    });
  }

  renderFormList = () => {
    const { form, tableDetail } = this.props;
    const { levelMap } = tableDetail;
    const formList = (
      <div>
        <FormItem label="区域名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('name', {
            initialValue: tableDetail.name,
            rules: [
              { required: true, message: '请输入社区地址' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="区域编码" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('areaCode', {
            initialValue: levelMap.areaCode,
            rules: [
              { required: true, message: '请输入区域编码' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('sort', {
            rules: [{ validator: checkOrderNum }],
            initialValue: levelMap.sort,
          })(<Input placeholder=" " />)}
        </FormItem>
      </div>
    );
    return (
      <Form className="form12">
        {formList}
        <Row className={styles.footerBtn}>
          <Col span={16}></Col>
          <Col span={6}>
            <Button onClick={() => this.handleVisible()}>取消</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.submit()}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { visible } = this.state;
    const { tableDetail } = this.props;
    const { levelMap } = tableDetail;
    return (
      <Col span={16} style={{ paddingLeft: '20px' }}>
        <table className="tablefordetail">
          <tbody>
            <tr>
              <th>社区名称</th>
              <td>{levelMap ? levelMap.parentName : null}</td>
            </tr>
            <tr>
              <th>区域名称</th>
              <td>{tableDetail.name}</td>
            </tr>
            <tr>
              <th>区域编码</th>
              <td>{levelMap ? levelMap.areaCode : null}</td>
            </tr>
            <tr>
              <th>排序号</th>
              <td>{levelMap ? levelMap.sort : null}</td>
            </tr>
          </tbody>
        </table>
        <Modal
          width={680}
          title="修改区级信息"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose
        >
          {this.renderFormList()}
        </Modal>
        <div className={styles.bottomBtn}>
          <Button className="transparentBtn" onClick={this.showModal}>
            修改
          </Button>
          <Button className="transparentBtn" onClick={this.removeTreeDate}>
            删除
          </Button>
        </div>
      </Col>
    );
  }
}
export default Form.create<LevelAProps>()(LevelA);
