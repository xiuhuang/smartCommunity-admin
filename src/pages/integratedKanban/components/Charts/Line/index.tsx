import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Guide } from 'bizcharts';

const { Line } = Guide;

class Series extends Component {
  state = {};

  render() {
    const data = [
      {
        month: '6:00',
        city: 'China',
        revenue: 7,
      },
      {
        month: '6:00',
        city: 'Oversea',
        revenue: 3.9,
      },
      {
        month: '6:00',
        city: 'riben',
        revenue: 2.5,
      },
      {
        month: '6:00',
        city: 'hanguo',
        revenue: 8,
      },

      {
        month: '7:00',
        city: 'China',
        revenue: 8,
      },
      {
        month: '7:00',
        city: 'Oversea',
        revenue: 8.6,
      },
      {
        month: '7:00',
        city: 'riben',
        revenue: 4.9,
      },
      {
        month: '7:00',
        city: 'hanguo',
        revenue: 3,
      },
      {
        month: '8:00',
        city: 'China',
        revenue: 7,
      },
      {
        month: '8:00',
        city: 'Oversea',
        revenue: 3.9,
      },
      {
        month: '8:00',
        city: 'riben',
        revenue: 4,
      },
      {
        month: '8:00',
        city: 'hanguo',
        revenue: 8,
      },
    ];
    const cols = {
      month: {
        range: [0, 1],
      },
    };
    return (
      <div>
        <Chart padding="auto" width={200} height={176} data={data} scale={cols} forceFit>
          <Legend />
          <Axis
            name="month"
            label={{
              formatter: val => `${val}`,
              textStyle: {
                textAlign: 'center',
                fill: '#0B9BD3',
              },
            }}
            line={{
              fill: 'pink',
              lineWidth: 1,
            }}
          />
          <Axis
            name="revenue"
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
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="line"
            position="month*revenue"
            size={2}
            color={['city', ['#00D0CC', '#45B9F5', '#F87805', '#1E74F0']]}
          />
          <Geom
            type="point"
            position="month*revenue"
            size={2}
            shape="circle"
            color="city"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
          <Guide>
            <Line
              top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
              start={{ month: 'Aug', revenue: 26.5 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
              end={{ month: 'Dec', revenue: 29 }}
              lineStyle={{
                lineWidth: 1,
              }}
              text={{
                position: 'start',
                autoRotate: true,
                style: {
                  fill: 'red',
                },
                offsetX: 20,
                offsetY: -10,
              }}
            />
          </Guide>
        </Chart>
      </div>
    );
  }
}

export default Series;
