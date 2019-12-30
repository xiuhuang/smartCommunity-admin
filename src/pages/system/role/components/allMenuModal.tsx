import React, { Component } from 'react';
import { Modal, Checkbox, Spin } from 'antd';
// import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import styles from '../styles.less';

interface FormModalProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  roleInfo?: any;
  visible: boolean;
  handleVisible: () => void;
  getData: () => void;
}

const getMenuIds = (competenceList: any) => {
  const menuIds: any = [];
  function mapList(list: any) {
    list.map((item: any) => {
      if (item.checked || item.indeterminate) {
        menuIds.push(item.id);
      }
      if (item.children.length > 0) {
        mapList(item.children);
      }
      return false;
    });
  }
  mapList(competenceList);
  return menuIds;
};

function renderIndeterminateData(competenceList: any) {
  competenceList.map((firstCompete: any) => {
    const firstCompetence = firstCompete;
    let firstChildrenLen = firstCompetence.children.length;
    let firstChildrenCheckLen = 0;
    if (firstCompetence.children.length > 0) {
      firstCompetence.children.map((secondCompet: any) => {
        const secondCompetence = secondCompet;
        const secondChildrenLen = secondCompetence.children.length;
        let secondChildrenCheckLen = 0;
        firstChildrenLen += secondChildrenLen;
        if (secondChildrenLen) {
          secondCompetence.children.map((thirdCompete: any) => {
            const thirdCompetence = thirdCompete;
            if (thirdCompetence.checked) {
              secondChildrenCheckLen += 1;
              firstChildrenCheckLen += 1;
            }
            return false;
          });
          if (secondChildrenCheckLen > 0) {
            secondCompetence.checked = true;
          } else {
            secondCompetence.checked = false;
          }
          if (secondChildrenCheckLen > 0 && secondChildrenCheckLen < secondChildrenLen) {
            secondCompetence.indeterminate = true;
          } else {
            secondCompetence.indeterminate = false;
          }
        } else {
          secondCompetence.indeterminate = false;
        }
        if (secondCompetence.checked) {
          firstChildrenCheckLen += 1;
        }
        return false;
      });
      if (firstChildrenCheckLen > 0) {
        firstCompetence.checked = true;
      } else {
        firstCompetence.checked = false;
      }
      if (firstChildrenCheckLen > 0 && firstChildrenCheckLen < firstChildrenLen) {
        firstCompetence.indeterminate = true;
      } else {
        firstCompetence.indeterminate = false;
      }
    }
    return false;
  });
  return competenceList;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    role,
    loading,
  }: {
    role: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    role,
    loading: loading.models.role,
  }),
)
class FormModal extends Component<FormModalProps> {
  state = {
    competenceList: [{ id: '0', children: [{ children: [{ children: [] }] }] }],
  };

  componentWillReceiveProps(nextProps: any) {
    const { visible } = this.props;
    if (nextProps.roleInfo && !visible && nextProps.visible) {
      this.getPermission(nextProps.roleInfo);
    }
  }

  getPermission = (roleInfo: any) => {
    const { roleId } = roleInfo;
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'role/getAllMenu',
        payload: {
          roleId,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              competenceList: res.data,
            });
          }
        },
      });
    }
  };

  handleOk = () => {
    const { roleInfo, dispatch, getData, handleVisible } = this.props;
    const { competenceList } = this.state;

    const permissionIds = getMenuIds(competenceList);
    if (dispatch) {
      dispatch({
        type: 'role/savePremission',
        payload: {
          menuIds: permissionIds.join(','),
          roleId: roleInfo.roleId,
        },
        callback: (res: any) => {
          if (res.code === '200') {
            getData();
            handleVisible();
          }
        },
      });
    }
  };

  checkedAll(firstCompete: any, preIndex: number) {
    const firstCompetence = firstCompete;
    let { competenceList } = this.state;
    firstCompetence.checked = !firstCompetence.checked;
    firstCompetence.children.forEach((secondCompete: any) => {
      const secondCompetence = secondCompete;
      secondCompetence.checked = firstCompetence.checked;
      secondCompetence.children.forEach((thirdCompete: any) => {
        const thirdCompetence = thirdCompete;
        thirdCompetence.checked = firstCompetence.checked;
      });
    });
    competenceList[preIndex] = firstCompetence;
    competenceList = renderIndeterminateData(competenceList);
    this.setState({
      competenceList: [...competenceList],
    });
  }

  childrenCheckedAll(secondCompete: any, preIndex: number, index: number) {
    const secondCompetence = secondCompete;
    let { competenceList } = this.state;
    secondCompetence.checked = !secondCompetence.checked;
    secondCompetence.children.map((thirdCompete: any) => {
      const thirdCompetence = thirdCompete;
      thirdCompetence.checked = secondCompetence.checked;
      return false;
    });
    competenceList[preIndex].children[index] = secondCompetence;
    competenceList = renderIndeterminateData(competenceList);
    this.setState({
      competenceList: [...competenceList],
    });
  }

  checkBox(thirdCompete: any, preIndex: number, index: number, childIndex: number) {
    const thirdCompetence = thirdCompete;
    let { competenceList } = this.state;
    thirdCompetence.checked = !thirdCompetence.checked;
    competenceList[preIndex].children[index].children[childIndex] = thirdCompetence;
    competenceList = renderIndeterminateData(competenceList);
    this.setState({
      competenceList: [...competenceList],
    });
  }

  renderTr(firstCompetence: any, preIndex: any) {
    return (
      <tbody key={firstCompetence.id}>
        {firstCompetence.children.map((secondCompetence: any, index: number) => (
          <tr key={secondCompetence.id}>
            {index === 0 ? (
              <td rowSpan={firstCompetence.children.length} style={{ width: '20%' }}>
                <Checkbox
                  checked={firstCompetence.checked}
                  value={firstCompetence.id}
                  className={styles.competeCheckbox}
                  indeterminate={firstCompetence.indeterminate}
                  onChange={() => this.checkedAll(firstCompetence, preIndex)}
                  // disabled={!check('auth:menu:edit', true)}
                >
                  {firstCompetence.name}
                </Checkbox>
              </td>
            ) : null}
            <td style={{ width: '23%' }}>
              <Checkbox
                checked={secondCompetence.checked}
                className={styles.competeCheckbox}
                indeterminate={secondCompetence.indeterminate}
                onChange={() => this.childrenCheckedAll(secondCompetence, preIndex, index)}
                // disabled={!check('auth:menu:edit', true)}
              >
                {secondCompetence.name}
              </Checkbox>
            </td>
            <td className={styles.competeTd}>
              {secondCompetence.children.map((thirdCompetence: any, childIndex: number) => (
                <Checkbox
                  checked={thirdCompetence.checked}
                  key={thirdCompetence.id}
                  className={styles.competeCheckbox}
                  onChange={() => this.checkBox(thirdCompetence, preIndex, index, childIndex)}
                  // disabled={!check('auth:menu:edit', true)}
                >
                  {thirdCompetence.name}
                </Checkbox>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  render() {
    const { visible, handleVisible, roleInfo = {}, loading } = this.props;
    const { competenceList } = this.state;
    return (
      <Modal
        visible={visible}
        title={`权限关联${roleInfo ? `角色名：${roleInfo.roleName}` : ''}`}
        okText="提交"
        cancelText="取消"
        onOk={this.handleOk}
        width={750}
        onCancel={() => handleVisible()}
        destroyOnClose
      >
        <div className={styles.competeTable}>
          <Spin spinning={loading}>
            <table>
              <thead>
                <tr>
                  <th>一级</th>
                  <th>二级</th>
                  <th>权限配置细则</th>
                </tr>
              </thead>
              {competenceList.map((firstCompetence, index) =>
                this.renderTr(firstCompetence, index),
              )}
            </table>
          </Spin>
        </div>
      </Modal>
    );
  }
}

export default FormModal;
