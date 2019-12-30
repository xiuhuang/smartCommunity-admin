import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import styles from '../../styles.less';

class ResidentChart extends Component {
  state = {};

  render() {
    const data = [
      {
        year: '1991',
        value: 3,
      },
      {
        year: '1992',
        value: 4,
      },
      {
        year: '1993',
        value: 3.5,
      },
      {
        year: '1994',
        value: 5,
      },
      {
        year: '1995',
        value: 4.9,
      },
      {
        year: '1996',
        value: 6,
      },
      {
        year: '1997',
        value: 7,
      },
      {
        year: '1998',
        value: 9,
      },
      {
        year: '1999',
        value: 13,
      },
    ];
    const cols = {
      value: {
        min: 0,
      },
      year: {
        range: [0, 1],
      },
    };

    return (
      <div className={styles.chartBox}>
        <h4>近15天单位成员日活动趋势</h4>
        <Chart height={278} padding={50} data={data} scale={cols} forceFit>
          <Axis
            name="year"
            label={{
              textStyle: {
                fill: '#0B9BD3',
              },
            }}
          />
          <Axis
            name="value"
            label={{
              textStyle: {
                fill: '#0B9BD3',
              },
            }}
            grid={{
              type: 'line',
              lineStyle: {
                stroke: '#274066',
                lineWidth: 1,
              },
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="year*value" size={2} color="#1E74F0" />
          <Geom
            type="point"
            position="year*value"
            size={3}
            shape="circle"
            color="#1E74F0"
            style={{
              stroke: '#1E74F0',
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default ResidentChart;
