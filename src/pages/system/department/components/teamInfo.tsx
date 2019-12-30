import React, { Component } from 'react';
import { Button, Row, Col, Tree, Icon, Form, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import IconFont from '@/components/IconFont';
import { StateType } from '../model';
import styles from '../styles.less';
import FormList from './addDept';
import EditFormList from './editDept';
import AddGroup from './addGroup';

const { TreeNode } = Tree;
interface BuildingsInfoProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  department?: StateType;
}

@connect(
  ({
    department,
    loading,
  }: {
    department: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    department,
    loading: loading.models.department,
  }),
)
class TeamInfo extends Component<BuildingsInfoProps> {
  state = {
    expandedKeys: [],
    visible: false,
    editVisible: false,
    groupVisible: false,
    treeDateArr: [],
    selectedNodes: {
      deptName: '',
      leader: '',
      id: '',
      name: '',
      parentDeptName: '',
      deptUserNum: '',
      orderNum: '',
      remark: '',
      title: '',
      deptId: '',
    },
  };

  componentWillMount = () => {
    this.getTreeData();
  };

  getTreeData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'department/getTreeData',
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              treeDateArr: res.data,
              selectedNodes: res.data[0],
            });
            const param = {
              deptId: res.data[0].id,
            };
            // debugger
            this.upTableDate(param);
          }
        },
      });
    }
  };

  initGetTreeData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'department/getTreeData',
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              treeDateArr: res.data,
              // selectedNodes: res.data[0],
            });
            // const param = {
            //   deptId: res.data[0].id,
            // };
          }
        },
      });
    }
  };

  onExpand = (expandedKeys: any, info: any) => {
    this.setState({
      expandedKeys,
    });
  };

  onSelect = (selectedKeys: any, { selectedNodes }: any) => {
    if (selectedNodes[0]) {
      const { props } = selectedNodes[0];
      if (selectedNodes.length > 0) {
        const param = {
          deptId: props.id,
        };
        this.upTableDate(param);
      }
    }
  };

  addPartment = () => {
    this.setState({
      visible: true,
    });
  };

  addGroup = () => {
    this.setState({
      groupVisible: true,
    });
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  renderTree = () => {
    const { expandedKeys, treeDateArr } = this.state;
    expandedKeys.map(Number);
    const setPermission = (tree: any) => {
      if (tree.length === 0) {
        return null;
      }
      let renderIcon;
      const showTreeNode = tree.map((item: any) => {
        if (!item.children || item.children.length === 0) {
          return (
            <TreeNode
              icon={<Icon type="plus" onClick={this.addGroup} />}
              title={item.name}
              key={item.id}
              id={item.id}
              name={item.name}
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
            icon={<Icon type="plus" onClick={this.addGroup} />}
            title={
              <div className={styles.treeItem}>
                {renderIcon}
                <span className={styles.buildName}>{item.name}</span>
              </div>
            }
            id={item.id}
            level={item.level}
            key={item.id}
            buildTreeId={item.buildTreeId}
            name={item.name}
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

  showModal = () => {
    this.setState({
      editVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  edithandleCancel = () => {
    this.setState({
      editVisible: false,
    });
  };

  grouphandleCancel = () => {
    this.setState({
      groupVisible: false,
    });
  };

  upTableDate = (param: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'department/deptDetail',
        payload: {
          ...param,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              selectedNodes: res.data,
            });
          }
        },
      });
    }
  };

  removeTreeDate = () => {
    const { dispatch } = this.props;
    const { selectedNodes } = this.state;
    const { deptId } = selectedNodes;
    const parmas = {
      deptId,
    };
    Modal.confirm({
      title: '温馨提示',
      content: (
        <span>
          您确定要删除<a>{selectedNodes.deptName}</a>吗？
        </span>
      ),
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'department/remove',
            payload: {
              ...parmas,
            },
            callback: (res: any) => {
              if (res.code === '200') {
                this.getTreeData();
              }
            },
          });
        }
      },
    });
  };

  submit() {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (dispatch) {
        dispatch({
          type: 'department/getTreeData',
          payload: {
            ...fieldsValue,
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

  render() {
    const { visible, selectedNodes, treeDateArr, editVisible, groupVisible } = this.state;
    const parmas = {
      initGetTreeData: this.initGetTreeData,
      edithandleCancel: this.edithandleCancel,
      upTableDate: this.upTableDate,
      selectedNodes,
    };

    const groupParmas = {
      initGetTreeData: this.initGetTreeData,
      grouphandleCancel: this.grouphandleCancel,
      getTreeData: this.getTreeData,
      selectedNodes,
    };

    const addParmas = {
      handleCancel: this.handleCancel,
      getTreeData: this.getTreeData,
    };
    return (
      <div>
        <div className="topBtn">
          <Row>
            <Col span={16}>
              <Button className="orangeBtn btnStyle" onClick={this.addPartment}>
                添加部门
              </Button>
            </Col>
          </Row>
        </div>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            {treeDateArr.length > 0 ? (
              <Tree
                showIcon
                showLine
                defaultExpandAll
                onExpand={this.onExpand}
                onSelect={this.onSelect}
                switcherIcon={<Icon type="down" />}
              >
                {this.renderTree()}
              </Tree>
            ) : (
              <span>暂无数据</span>
            )}
          </Col>
          <Col span={18} style={{ paddingLeft: '20px' }}>
            <Row className={styles.tableData}>
              <Col className={styles.tableLeft} span={8}>
                <div className={styles.borderBottom}>部门名称</div>
                <div className={styles.borderBottom}>上级部门</div>
                <div className={styles.borderBottom}>部门经理/总监</div>
                <div className={styles.borderBottom}>描述</div>
                <div className={styles.borderBottom}>排序序号</div>
                <div className={styles.borderBottom}>部门人员</div>
              </Col>
              <Col className={styles.borderLeft} span={16}>
                <div className={styles.borderBottom}>
                  {selectedNodes.deptName ? selectedNodes.deptName : '--'}
                </div>
                <div className={styles.borderBottom}>
                  {selectedNodes.parentDeptName ? selectedNodes.parentDeptName : '--'}
                </div>
                <div className={styles.borderBottom}>
                  {selectedNodes.leader ? selectedNodes.leader : '--'}
                </div>
                <div className={styles.borderBottom}>
                  {selectedNodes.remark ? selectedNodes.remark : '--'}
                </div>
                <div className={styles.borderBottom}>
                  {selectedNodes.orderNum ? selectedNodes.orderNum : '--'}
                </div>
                <div className={styles.borderBottom}>
                  {selectedNodes.deptUserNum ? selectedNodes.deptUserNum : '--'}
                </div>
              </Col>
            </Row>
            <div className={styles.bottomBtn}>
              <Button className="transparentBtn" onClick={this.showModal}>
                修改
              </Button>
              <Button className="transparentBtn" onClick={this.removeTreeDate}>
                删除
              </Button>
            </div>
          </Col>
        </Row>
        <Modal
          width={680}
          title="添加部门"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose
        >
          <FormList {...addParmas} />
        </Modal>
        <Modal
          width={680}
          title="修改部门信息"
          visible={editVisible}
          onCancel={this.edithandleCancel}
          footer={null}
          destroyOnClose
        >
          <EditFormList {...parmas} />
        </Modal>

        <Modal
          width={680}
          title="新增小组"
          visible={groupVisible}
          onCancel={this.grouphandleCancel}
          footer={null}
          destroyOnClose
        >
          <AddGroup {...groupParmas} />
        </Modal>
      </div>
    );
  }
}

export default Form.create<BuildingsInfoProps>()(TeamInfo);
