import React, { Component } from 'react';
import { Button, Row, Col, Form, Modal, message, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '../model';
import { checkOrderNum } from '@/utils/validator';
import QRcodeModal from '@/components/qrcodeModal';
import styles from '../styles.less';

// const QRcode = require('qrcode.react');

const FormItem = Form.Item;
interface LevelBProps extends FormComponentProps {
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
class LevelB extends Component<LevelBProps> {
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
          {form.getFieldDecorator('parentName', {})(<div>{levelMap.parentName}</div>)}
        </FormItem>
        <FormItem label="楼栋名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('name', {
            initialValue: tableDetail.name,
            rules: [
              { required: true, message: '请输入社区地址' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="楼栋编码" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('buildCode', {
            initialValue: levelMap.buildCode,
            rules: [
              { required: true, message: '请输入楼栋编码' },
              { max: 100, message: '最多只能输入100个字符' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('sort', {
            initialValue: levelMap.sort,
            rules: [{ validator: checkOrderNum }],
          })(<Input placeholder=" " />)}
        </FormItem>
        <FormItem label="位置坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('coordinate', {
            initialValue: levelMap.coordinate,
            rules: [{ max: 100, message: '最多只能输入100个字符' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="街路巷" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('street', {
            initialValue: levelMap.street,
            rules: [{ max: 100, message: '最多只能输入100个字符' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="单元数" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('unitNum', {
            initialValue: levelMap.unitNum,
          })(<Input />)}
        </FormItem>
        <FormItem label="总层数" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('floorNum', {
            initialValue: levelMap.floorNum,
          })(<Input placeholder=" " />)}
        </FormItem>
        <FormItem label="套房数" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('floorHouseNum', {
            initialValue: levelMap.floorHouseNum,
          })(<Input placeholder=" " />)}
        </FormItem>
        <FormItem label="楼栋用途" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          {form.getFieldDecorator('purpose', {
            initialValue: levelMap.purpose,
            rules: [{ max: 100, message: '最多只能输入100个字符' }],
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
              <th>区域名称</th>
              <td>{levelMap ? levelMap.parentName : null}</td>
            </tr>
            <tr>
              <th>楼栋名称</th>
              <td>{tableDetail.name}</td>
            </tr>
            <tr>
              <th>楼栋编码</th>
              <td>{levelMap ? levelMap.buildCode : null}</td>
            </tr>
            <tr>
              <th>排序号</th>
              <td>{levelMap ? levelMap.sort : null}</td>
            </tr>
            <tr>
              <th>位置坐标</th>
              <td>{levelMap ? levelMap.coordinate : null}</td>
            </tr>
            <tr>
              <th>街路巷</th>
              <td>{levelMap ? levelMap.street : null}</td>
            </tr>
            <tr>
              <th>单元数</th>
              <td>{levelMap ? levelMap.unitNum : null}</td>
            </tr>
            <tr>
              <th>总层数</th>
              <td>{levelMap ? levelMap.floorNum : null}</td>
            </tr>
            <tr>
              <th>套房数</th>
              <td>{levelMap ? levelMap.floorHouseNum : null}</td>
            </tr>
            <tr>
              <th>楼栋用途</th>
              <td>{levelMap ? levelMap.purpose : null}</td>
            </tr>
            <tr>
              <th>实有住户数</th>
              <td>{levelMap ? levelMap.realHolders : null}</td>
            </tr>
            <tr>
              <th>楼栋实有人口</th>
              <td>{levelMap ? levelMap.realPersons : null}</td>
            </tr>
            <tr>
              <th>二维码</th>
              <td>
                {levelMap && <QRcodeModal title={tableDetail.name} value="https://www.baidu.com" />}
              </td>
            </tr>
          </tbody>
        </table>
        <Modal
          width={680}
          title="修改栋级信息"
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
export default Form.create<LevelBProps>()(LevelB);
