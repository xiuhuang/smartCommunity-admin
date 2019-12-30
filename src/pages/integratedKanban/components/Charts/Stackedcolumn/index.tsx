import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

export interface StackedProps {
  attr: any;
}

class Stackedcolumn extends Component<StackedProps> {
  state = {};

  render() {
    const { attr = [] } = this.props;
    const ds = new DataSet();
    const dv = ds.createView().source(attr);
    dv.transform({
      type: 'fold',
      fields: ['周边闯入', '紧急求助', '烟感报警', '设备检修', '消防栓警报', '社区访客'],
      // 展开字段集
      key: '数量',
      // key字段
      value: '周边元素', // value字段
    });
    return (
      <div>
        <Chart padding="auto" height={256} width={200} data={dv} forceFit>
          <Legend />
          <Axis
            label={{
              formatter: val => `${val}`,
              textStyle: {
                textAlign: 'center',
                fill: '#0B9BD3',
              },
            }}
            name="数量"
          />
          <Axis
            name="周边元素"
            label={{
              formatter: val => `${val}`,
              textStyle: {
                textAlign: 'center',
                fill: '#0B9BD3',
              },
            }}
            grid={{
              type: 'line' || 'polygon',
              lineStyle: {
                stroke: '#274066',
                lineWidth: 1,
              },
            }}
          />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="数量*周边元素"
            color={['name', ['#1E74F0', '#00D0CC']]}
            style={{
              stroke: 'transparent',
              lineWidth: 1,
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default Stackedcolumn;
