import React, { Component } from 'react';
import styles from '../../styles.less';

interface HouseInfoProps {
  houseInfo: any;
}

class HouseInfo extends Component<HouseInfoProps> {
  state = {};

  render() {
    const { houseInfo = [] } = this.props;
    return (
      <table className={styles.table}>
        {houseInfo &&
          houseInfo.map((item: any, index: number) => (
            <tbody key={item.houseId}>
              <tr>
                <th>住户号</th>
                <td colSpan={5}>{item.houseName}</td>
              </tr>
              <tr>
                <th>房主</th>
                <td>{item.houseOwner}</td>
                <th>房屋编码</th>
                <td>{item.houseCode}</td>
                <th>房屋面积</th>
                <td>{item.builtArea}</td>
              </tr>
              <tr>
                <th>房屋坐落</th>
                <td colSpan={5}>{item.houseAddress}</td>
              </tr>
              <tr>
                <th>与房主关系</th>
                <td>{item.relationTypeName}</td>
                <th>居住状态</th>
                <td>{item.resideStatusName}</td>
                <th>居住时间</th>
                <td>{item.residePeriod}</td>
              </tr>
              <tr>
                <th>居住事由</th>
                <td colSpan={5}>{item.resideReasonName}</td>
              </tr>
              {houseInfo.length > 1 && index !== houseInfo.length - 1 && (
                <tr>
                  <td colSpan={6} style={{ backgroundColor: '#0B9BD3', height: 14 }}></td>
                </tr>
              )}
            </tbody>
          ))}
      </table>
    );
  }
}

export default HouseInfo;
