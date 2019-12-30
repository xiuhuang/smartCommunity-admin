import React, { Component } from 'react';
import { Button, Row, Col, Tree, Icon, Form, Modal, Input, message, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import IconFont from '@/components/IconFont';
import { checkOrderNum } from '@/utils/validator';
import { StateType } from '../model';
import styles from '../styles.less';
import LevelA from './levelA';
import LevelB from './levelB';
import LevelC from './levelC';
import LevelU from './levelU';
import LevelH from './levelH';
import BatchQrcodeModal from '@/components/qrcodeModal/batch';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;

interface BuildingsInfoProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  basicInfo?: StateType;
}

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
class BuildingsInfo extends Component<BuildingsInfoProps> {
  state = {
    expandedKeys: [],
    visible: false,
    level: 'C',
    selectedLevel: '',
    treeDateArr: [],
    tableDetail: {},
    selectedNodes: {
      buildName: '',
      id: '',
      level: '',
      levelId: '',
      orderNum: '',
      parentId: '',
      buildTreeId: '',
    },
    dlQrcodeVisible: false,
  };

  qrcodeArr: any = [];

  componentWillMount = () => {
    this.getTreeData();
    this.getOriginData();
  };

  getTreeData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicInfo/getTreeData',
        callback: (res: any) => {
          this.setState({
            treeDateArr: res.data,
            selectedNodes: res.data[0],
          });
        },
      });
    }
  };

  getTreeDataO = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicInfo/getTreeData',
        callback: (res: any) => {
          this.setState({
            treeDateArr: res.data,
          });
        },
      });
    }
  };

  getOriginData = () => {
    const { dispatch } = this.props;
    const communityId = localStorage.getItem('communityId');
    const parms = {
      level: 'C',
      levelId: communityId,
    };
    if (dispatch) {
      dispatch({
        type: 'basicInfo/getTableDetail',
        payload: {
          ...parms,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              tableDetail: res.data,
            });
          }
        },
      });
    }
  };

  getParentIdNodes = (data: any, parentId: any) => {
    const { treeDateArr } = this.state;
    data.forEach((item: any) => {
      if (parentId === '0') {
        return;
      }
      if (item.id === parentId) {
        this.getParentIdNodes(treeDateArr, item.parentId);
      } else if (item.children) {
        this.getParentIdNodes(item.children, parentId);
      }
    });
  };

  onSelect = (selectedKeys: any, { selectedNodes }: any) => {
    const { dispatch } = this.props;
    const { treeDateArr } = this.state;
    if (selectedNodes.length > 0) {
      const { props } = selectedNodes[0];
      this.getParentIdNodes(treeDateArr, props.parentId);
      const { level } = props;
      const { levelId } = props;
      this.setState({
        level,
        selectedNodes: props,
      });
      const parms = {
        level,
        levelId,
      };
      if (dispatch) {
        dispatch({
          type: 'basicInfo/getTableDetail',
          payload: {
            ...parms,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              this.setState({
                tableDetail: res.data,
              });
            }
          },
        });
      }
    }
  };

  upTableDate = (param: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'basicInfo/getTableDetail',
        payload: {
          ...param,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              tableDetail: res.data,
            });
          }
        },
      });
    }
  };

  addBuilding = () => {
    this.setState({
      visible: true,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
      selectedLevel: '',
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedLevel: '',
    });
  };

  onExpand = (expandedKeys: any, info: any) => {
    this.setState({
      expandedKeys,
    });
  };

  handleQrcodeVisible = (flag?: boolean) => {
    this.setState({
      dlQrcodeVisible: !!flag,
    });
  };

  downloadAllQRcode = () => {
    const { treeDateArr } = this.state;
    const qrcodeArr: any = [];
    const renderTree = (data: any) =>
      data.forEach((item: any) => {
        if (item.level === 'H' || item.level === 'B' || item.level === 'U') {
          qrcodeArr.push({
            title: item.buildName,
            value: 'https://www.baidu.com',
          });
        }
        if (item.children && item.children.length > 0) {
          renderTree(item.children);
        }
      });
    renderTree(treeDateArr);
    this.qrcodeArr = qrcodeArr;
    this.handleQrcodeVisible(true);
  };

  renderTree = () => {
    const { expandedKeys, treeDateArr } = this.state;
    expandedKeys.map(Number);
    const setPermission = (tree: any) => {
      if (tree.length === 0 || !tree) {
        return null;
      }
      let renderIcon;
      const showTreeNode = tree.map((item: any) => {
        if (!item.children || item.children.length === 0) {
          if (item.level !== 'H') {
            return (
              <TreeNode
                icon={<Icon type="plus" onClick={this.addBuilding} />}
                title={item.buildName ? item.buildName : null}
                key={item.id}
                id={item.id}
                buildTreeId={item.buildTreeId}
                level={item.level}
                buildName={item.buildName ? item.buildName : null}
                levelId={item.levelId}
                parentId={item.parentId}
              />
            );
          }
          return (
            <TreeNode
              title={item.buildName ? item.buildName : null}
              id={item.id}
              key={item.id}
              level={item.level}
              buildTreeId={item.buildTreeId}
              buildName={item.buildName ? item.buildName : null}
              levelId={item.levelId}
              parentId={item.parentId}
            />
          );
        }
        if (expandedKeys.map(Number).indexOf(item.id) > -1) {
          renderIcon = <IconFont className={styles.iconfont} type="iconxingzhuang-copy" />;
        } else if (expandedKeys.length === 0) {
          renderIcon = <IconFont className={styles.iconfont} type="iconxingzhuang-copy" />;
        } else {
          renderIcon = <IconFont className={styles.iconfont} type="iconicon-test13" />;
        }
        return (
          <TreeNode
            icon={<Icon type="plus" onClick={this.addBuilding} />}
            title={
              <div className={styles.treeItem}>
                {renderIcon}
                <span className={styles.buildName}>{item.buildName ? item.buildName : null}</span>
              </div>
            }
            level={item.level}
            id={item.id}
            key={item.id}
            buildTreeId={item.buildTreeId}
            buildName={item.buildName ? item.buildName : null}
            levelId={item.levelId}
            parentId={item.parentId}
          >
            {setPermission(item.children)}
          </TreeNode>
        );
      });
      return showTreeNode;
    };
    return setPermission(treeDateArr);
  };

  onSelectLevel = (value: any) => {
    this.setState({
      selectedLevel: value,
    });
  };

  changeToC = () => {
    this.getOriginData();
    this.setState({
      level: 'C',
    });
  };

  submit() {
    const { selectedNodes, selectedLevel } = this.state;
    const { form, dispatch } = this.props;
    const { buildTreeId } = selectedNodes;
    form.validateFields((err, fieldsValue) => {
      if (selectedNodes.level === 'A') {
        fieldsValue.areaId = selectedNodes.levelId;
      }
      if (selectedNodes.level === 'B') {
        fieldsValue.buildId = selectedNodes.levelId;
      }
      if (selectedNodes.level === 'U') {
        fieldsValue.unitId = selectedNodes.levelId;
      }
      const param = {
        buildName: fieldsValue.name,
        level: selectedLevel,
        parentId: buildTreeId,
        levelMap: fieldsValue,
      };
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'basicInfo/Addcommunity',
          payload: {
            ...param,
          },
          callback: (res: any) => {
            if (res.code === '200') {
              message.success(res.message);
              this.handleCancel();
              this.getTreeData();
            }
          },
        });
      }
    });
  }

  renderLevelForm() {
    const { form } = this.props;
    const { selectedLevel } = this.state;
    let formList;
    if (selectedLevel === 'A') {
      formList = (
        <div>
          <h4>区域信息</h4>
          <FormItem label="区域名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入区域名称' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="区域编码" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('areaCode', {
              rules: [{ max: 50, message: '最多只能输入50个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="详细地址" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('address', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="位置坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('coordinate', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('sort', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }, { validator: checkOrderNum }],
            })(<Input />)}
          </FormItem>
        </div>
      );
    } else if (selectedLevel === 'B') {
      formList = (
        <div>
          <h4>楼栋信息</h4>
          <FormItem label="楼栋名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入区域名称' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="楼栋编码" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('buildCode', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('sort', {
              rules: [{ validator: checkOrderNum }, { max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="位置坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('coordinate', {
              rules: [
                { required: true, message: '请输入区域名称' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="街路巷" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('street', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="单元数" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('unitNum', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="总层数" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('floorNum', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="套房数" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('floorHouseNum', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="楼栋用途" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('purpose', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
        </div>
      );
    } else if (selectedLevel === 'U') {
      formList = (
        <div>
          <h4>单元信息</h4>
          <FormItem label="单元名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入社区地址' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="单元编码" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('unitCode', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('sort', {
              rules: [{ validator: checkOrderNum }, { max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="位置坐标" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('coordinate', {
              rules: [
                { required: true, message: '请输入区域名称' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
        </div>
      );
    } else if (selectedLevel === 'H') {
      formList = (
        <div>
          <h4>房屋信息</h4>
          <FormItem label="房屋名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入社区地址' },
                { max: 100, message: '最多只能输入100个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="房屋编码" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('houseCode', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="房屋面积" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('builtArea', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="房屋类型" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('houseType', {
              rules: [{ max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="排序号" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
            {form.getFieldDecorator('sort', {
              rules: [{ validator: checkOrderNum }, { max: 100, message: '最多只能输入100个字符' }],
            })(<Input />)}
          </FormItem>
        </div>
      );
    } else {
      formList = null;
    }

    return <div>{formList}</div>;
  }

  render() {
    const { visible, level, selectedNodes, treeDateArr, tableDetail, dlQrcodeVisible } = this.state;
    const { form } = this.props;

    const { buildName } = selectedNodes;
    const selectedData = {
      getTreeData: this.getTreeData,
      getTreeDataO: this.getTreeData,
      changeToC: this.changeToC,
      upTableDate: this.upTableDate,
      tableDetail,
      selectedNodes,
    };
    let levelCon;
    if (level === 'A') {
      levelCon = <LevelA {...selectedData} />;
    } else if (level === 'B') {
      levelCon = <LevelB {...selectedData} />;
    } else if (level === 'C') {
      levelCon = <LevelC {...selectedData} />;
    } else if (level === 'U') {
      levelCon = <LevelU {...selectedData} />;
    } else if (level === 'H') {
      levelCon = <LevelH {...selectedData} />;
    }

    const batchProps = {
      visible: dlQrcodeVisible,
      handleVisible: this.handleQrcodeVisible,
      data: this.qrcodeArr,
      zipTitle: '居民房栋信息二维码',
    };

    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.downloadAllQRcode}>
                下载全部二维码
              </Button>
              {/* <Button className="blueBtn btnStyle">模版下载</Button>
              <Button className="greenBtn btnStyle">批量导入</Button> */}
            </Col>
          </Row>
        </div>
        <Row type="flex" justify="space-between">
          <Col span={8}>
            {treeDateArr.length > 0 ? (
              <Tree
                showIcon
                showLine
                defaultExpandAll
                onExpand={this.onExpand}
                onSelect={this.onSelect}
                switcherIcon={<Icon type="down" />}
                selectedKeys={[String(selectedNodes.id)]}
              >
                {this.renderTree()}
              </Tree>
            ) : (
              <span>暂无数据</span>
            )}
          </Col>
          {levelCon}
        </Row>
        <Modal
          width={680}
          title="添加下级信息"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose
        >
          <Form className="form12">
            <FormItem label="上级名称" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
              <span>{buildName || null}</span>
            </FormItem>
            <FormItem label="选择社区行政等级属性" labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
              {form.getFieldDecorator('level', {
                rules: [{ required: true, message: '请选择社区行政等级属性' }],
              })(
                <Select placeholder="选择社区行政等级属性" onChange={this.onSelectLevel}>
                  <Option
                    value="A"
                    disabled={
                      selectedNodes.level === 'A' ||
                      selectedNodes.level === 'B' ||
                      selectedNodes.level === 'U'
                    }
                  >
                    区
                  </Option>
                  <Option
                    value="B"
                    disabled={selectedNodes.level === 'B' || selectedNodes.level === 'U'}
                  >
                    栋
                  </Option>
                  <Option value="U" disabled={selectedNodes.level === 'U'}>
                    单元
                  </Option>
                  <Option value="H">室</Option>
                </Select>,
              )}
            </FormItem>
            {this.renderLevelForm()}
            <Row className={styles.footerBtn}>
              <Col span={16}></Col>
              <Col span={6}>
                <Button
                  onClick={() => {
                    this.handleVisible();
                  }}
                >
                  取消
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.submit()}>
                  提交
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
        <BatchQrcodeModal {...batchProps} />
      </div>
    );
  }
}

export default Form.create<BuildingsInfoProps>()(BuildingsInfo);
