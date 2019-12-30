import React, { Component } from 'react';
import { Cascader } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';

interface HouseProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  placeholder?: string;
  formModel?: string;
  value?: any;
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
class House extends Component<HouseProps> {
  state = {
    options: [],
    value: [],
  };

  componentDidMount() {
    const { value } = this.props;
    this.init(value);
  }

  componentWillReceiveProps(nextProps: any) {
    const { value } = this.props;
    const { value: stateValue } = this.state;
    if (value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
      if (nextProps.value !== stateValue) {
        this.init(nextProps.value);
      }
    }
  }

  init = (value: any) => {
    if (value && value.length > 0) {
      const newValue: any = [];
      value.forEach((item: any) => {
        if (item.level !== 'C') {
          newValue.push(item);
        }
      });
      this.setState({
        value: newValue,
      });
      this.loadData(newValue, 0);
    } else {
      this.loadData(
        [
          {
            level: '',
            levelId: '',
          },
        ],
        0,
      );
    }
  };

  renderTreeData = (data: any) =>
    data.map((item: any) => {
      item.label = item.buildName;
      item.value = `${item.levelId}`;
      item.isLeaf = item.leaf;
      return item;
    });

  renderInitOptions = (optionData: any, selectedOptions: any, isInit: number) => {
    let { options } = this.state;
    if (isInit === 0) {
      return optionData;
    }
    const renderOptions = (data: any, i: number) =>
      data.map((da: any) => {
        if (selectedOptions[i].levelId === da.levelId) {
          if (i === isInit - 1) {
            da.children = optionData;
          } else {
            i += 1;
            da.children = renderOptions(da.children, i);
          }
        }
        return da;
      });
    options = renderOptions(options, 0);
    return options;
  };

  loadData = (selectedOptions: any, isInit?: number) => {
    const { dispatch } = this.props;
    let targetOption: any = null;
    if (isInit === 0) {
      targetOption = {
        level: '',
        levelId: '',
      };
    } else if (isInit) {
      targetOption = selectedOptions[isInit - 1];
    } else {
      targetOption = selectedOptions[selectedOptions.length - 1];
    }
    if (targetOption.level === 'H') return;
    if (!isInit) {
      targetOption.loading = true;
    }
    if (dispatch) {
      dispatch({
        type: 'formModel/fetchLevel',
        payload: {
          ...targetOption,
        },
        callback: (res: any) => {
          targetOption.loading = false;
          const treeData = this.renderTreeData(res.data);
          if (res.code === '200' && res.data) {
            if (isInit === 0 || isInit) {
              this.setState({
                options: this.renderInitOptions(treeData, selectedOptions, isInit),
              });
              if (selectedOptions.length > isInit) {
                isInit += 1;
                this.loadData(selectedOptions, isInit);
              }
            } else {
              targetOption.children = treeData;
              const { options } = this.state;
              this.setState({
                options,
              });
            }
          }
        },
      });
    }
  };

  onChangeValue = (value: any, selectedOptions: any) => {
    const { onChange } = this.props;
    if (onChange) {
      const params = selectedOptions.map((item: any) => ({
        level: item.level,
        levelId: item.levelId,
        name: item.buildName,
      }));
      this.setState(
        {
          value: params,
        },
        () => {
          onChange(params);
        },
      );
    }
  };

  render() {
    const { options, value } = this.state;
    const { placeholder } = this.props;
    const newValue = value ? value.map((val: any) => `${val.levelId}`) : [];
    return (
      <Cascader
        value={newValue}
        options={options}
        loadData={this.loadData}
        placeholder={placeholder}
        changeOnSelect
        onChange={this.onChangeValue}
      />
    );
  }
}

export default House;
