import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';

const { TreeNode } = TreeSelect;

interface DepartMentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  placeholder?: string;
  formModel?: string;
  value?: any;
  justId?: boolean;
  onChange?: (val: any) => void;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    formModel,
    loading,
  }: {
    formModel: any;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    formModel,
    loading: loading.models.formModel,
  }),
)
class DepartMent extends Component<DepartMentProps> {
  state = {
    value: [],
    treeData: [],
  };

  componentDidMount() {
    this.getTreeData();
  }

  componentWillReceiveProps(nextProps: any) {
    const { value } = this.state;
    const { justId } = this.props;
    if (nextProps.value && value !== nextProps.value) {
      let newValue = null;
      if (justId) {
        newValue = nextProps.value;
      } else {
        newValue = nextProps.value.map((item: any) => item.deptId);
      }
      this.setState({
        value: newValue,
      });
    }
  }

  getTreeData = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'formModel/getDepartMent',
        callback: (res: any) => {
          if (res.code === '200') {
            this.setState({
              treeData: res.data,
            });
          }
        },
      });
    }
  };

  getNameById = (id: string) => {
    const { treeData } = this.state;
    let deptName = '';
    const getNameFunc = (data: any) => {
      data.forEach((item: any) => {
        if (item.id === id) {
          deptName = item.name;
        } else if (data.children && data.children.length > 0) {
          getNameFunc(data.children);
        }
      });
    };
    getNameFunc(treeData);
    return deptName;
  };

  renderValue = (value: any) => {
    const { justId } = this.props;
    if (justId) return value;
    if (value) {
      if (Array.isArray(value)) {
        return value.map((id: string) => ({
          deptId: id,
          deptName: this.getNameById(id),
        }));
      }
      return [
        {
          deptId: value,
          deptName: this.getNameById(value),
        },
      ];
    }
    return [];
  };

  onChangeValue = (value: any, selectedOptions: any) => {
    const { onChange } = this.props;
    if (onChange) {
      this.setState({
        value,
      });
      onChange(this.renderValue(value));
    }
  };

  renderTree = () => {
    const { treeData } = this.state;
    const rendData = (data: any) =>
      data.map((item: any) => {
        if (item.children.length > 0) {
          return rendData(item.children);
        }
        return <TreeNode value={item.id} title={item.name} key={item.id} />;
      });
    return rendData(treeData);
  };

  render() {
    const { value } = this.state;
    const { placeholder } = this.props;
    return (
      <TreeSelect value={value} placeholder={placeholder} onChange={this.onChangeValue}>
        {this.renderTree()}
      </TreeSelect>
    );
  }
}

export default DepartMent;
