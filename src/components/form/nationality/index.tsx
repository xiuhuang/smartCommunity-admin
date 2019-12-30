import React, { Component } from 'react';
import { Select } from 'antd';

const NationalityJson = require('./nationality.json');

const { Option } = Select;

interface NationalityProps {
  set?: any;
  placeholder?: any;
}

class Nationality extends Component<NationalityProps> {
  state = {};

  render() {
    const { ...set } = this.props;
    return (
      <Select {...set}>
        {NationalityJson.data.map((item: any) => (
          <Option value={item.name} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default Nationality;
