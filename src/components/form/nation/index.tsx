import React, { Component } from 'react';
import { Select } from 'antd';

const nationJson = require('./nation.json');

const { Option } = Select;

interface NationProps {
  set?: any;
  placeholder?: any;
}

class Nation extends Component<NationProps> {
  state = {};

  render() {
    const { ...set } = this.props;
    return (
      <Select {...set}>
        {nationJson.data.map((item: any) => (
          <Option value={item.name} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default Nation;
