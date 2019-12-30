import React, { Component } from 'react';
import styles from '../../styles.less';

interface HouseInfoProps {
  carInfo: any;
}
class HouseInfo extends Component<HouseInfoProps> {
  state = {};

  componentDidMount() {}

  render() {
    const { carInfo } = this.props;
    return (
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>停车卡号</th>
            <td>{carInfo.pcCode ? carInfo.pcCode : '--'}</td>
            <th>停车卡类型</th>
            <td>
              {carInfo.pcType === 'month' && <span>月租卡</span>}
              {carInfo.pcType === 'times' && <span>次卡</span>}
              {!carInfo.pcType && <span>--</span>}
            </td>
            <th>停车卡有效期至</th>
            <td>{carInfo.pcExpireDate ? carInfo.pcExpireDate : '--'}</td>
          </tr>
          <tr>
            <th>停车卡状态</th>
            <td>
              {carInfo.pcStatus === '1' && <span>正常</span>}
              {carInfo.pcStatus === '0' && <span>到期</span>}
              {!carInfo.pcStatus && <span>--</span>}
            </td>
            <th>
              {carInfo.pcType === 'month' && <span>月租金额</span>}
              {carInfo.pcType === 'times' && <span>次数</span>}
            </th>
            <td>
              {carInfo.pcType === 'month' && carInfo.pcMoney ? carInfo.pcMoney : ''}
              {carInfo.pcType === 'times' && carInfo.subCardTotal ? carInfo.subCardTotal : ''}
            </td>
            <th></th>
            <td></td>
          </tr>
          <tr>
            <th>车牌号</th>
            <td>{carInfo.lpCode ? carInfo.lpCode : '--'}</td>
            <th>车牌种类</th>
            <td>{carInfo.lpTypeName ? carInfo.lpTypeName : '--'}</td>
            <th>车牌状态</th>
            <td>
              {carInfo.lpStatus === '1' && <span>正常</span>}
              {carInfo.lpStatus === '0' && <span>不正常</span>}
              {!carInfo.lpStatus && <span>--</span>}
            </td>
          </tr>
          <tr>
            <th>车牌有效期</th>
            <td>{carInfo.lpExpireDate ? carInfo.lpExpireDate : '--'}</td>
            <th>车辆品牌</th>
            <td>{carInfo.carBrand ? carInfo.carBrand : '--'}</td>
            <th>车辆颜色</th>
            <td>{carInfo.carColour ? carInfo.carColour : '--'}</td>
          </tr>
          <tr>
            <th>车主</th>
            <td>{carInfo.residentName ? carInfo.residentName : '--'}</td>
            <th>车辆识别代号VIN</th>
            <td>{carInfo.carVin ? carInfo.carVin : '--'}</td>
            <th>车辆标签</th>
            <td>{carInfo.tagName ? carInfo.tagName : '--'}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default HouseInfo;
