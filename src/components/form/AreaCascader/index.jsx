import React, { Component } from 'react';
import { Cascader } from 'antd';
import options from './pic.json';

class AreaCascader extends Component {
  state = {
    value: null,
  };

  componentWillMount() {
    const { value } = this.props;
    this.setState({
      value,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  onChangeValue = (value, selectedOptions) => {
    const { onChange } = this.props;
    let province;
    let city;
    let county;
    let provinceId;
    let cityId;
    let countyId;

    const parms = {
      provinceId: selectedOptions[0].code,
      cityId: selectedOptions[1].code,
      countyId: selectedOptions[2].code,
      province: selectedOptions[0].name,
      city: selectedOptions[1].name,
      county: selectedOptions[2].name,
    };
    onChange(parms);
  };

  render() {
    const { value } = this.state;
    let newValue = [];
    if (value) {
      newValue = [value.provinceId, value.cityId, value.countyId];
    }
    return (
      <Cascader
        onChange={this.onChangeValue}
        fieldNames={{ label: 'name', value: 'code', children: 'child' }}
        options={options}
        placeholder="请选择区域"
        value={newValue}
      />
    );
  }
}
export default AreaCascader;
