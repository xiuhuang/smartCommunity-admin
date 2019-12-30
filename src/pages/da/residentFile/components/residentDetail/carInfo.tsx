import React, { Component } from 'react';
import styles from '../../styles.less';

interface HouseInfoProps {
  carInfo: any;
}

class HouseInfo extends Component<HouseInfoProps> {
  state = {};

  render() {
    const { carInfo } = this.props;
    return (
      <table className={styles.table}>
        {carInfo &&
          carInfo.length > 0 &&
          carInfo.map((car: any, index: number) => (
            <tbody key={car.id}>
              <tr>
                <th>停车卡号</th>
                <td>{car.pcCode}</td>
                <th>停车卡类型</th>
                <td>
                  {car.pcType === 'month' && <span>月租卡</span>}
                  {car.pcType === 'times' && <span>次卡</span>}
                </td>
                <th>停车卡有效期至</th>
                <td>{car.pcExpireDate}</td>
              </tr>
              <tr>
                <th>停车卡状态</th>
                <td>
                  {car.pcStatus === '1' && <span>正常</span>}
                  {car.pcStatus === '0' && <span>到期</span>}
                  {!car.pcStatus && <span>--</span>}
                </td>
                <th>
                  {car.pcType === 'month' && <span>月租金额</span>}
                  {car.pcType === 'times' && <span>次数</span>}
                </th>
                <td>
                  {car.pcType === 'month' && car.pcMoney ? car.pcMoney : ''}
                  {car.pcType === 'times' && car.subCardTotal ? car.subCardTotal : ''}
                </td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>车牌号</th>
                <td>{car.lpCode}</td>
                <th>车牌种类</th>
                <td>
                  {car.lpType === 'blue' && <span>小型汽车</span>}
                  {car.lpType === 'yellow' && <span>大车</span>}
                  {car.lpType === 'white' && <span>军用车</span>}
                  {car.lpType === 'black' && <span>境外车辆</span>}
                  {car.lpType === 'green' && <span>电动汽车</span>}
                </td>
                <th>车牌状态</th>
                <td>
                  {car.lpStatus === '0' && <span>不正常</span>}
                  {car.lpStatus === '1' && <span>正常</span>}
                </td>
              </tr>
              <tr>
                <th>车牌有效期</th>
                <td>{car.lpExpireDate}</td>
                <th>车辆品牌</th>
                <td>{car.carBrand}</td>
                <th>车辆颜色</th>
                <td>{car.carColour}</td>
              </tr>
              <tr>
                <th>车主</th>
                <td>{car.residentName}</td>
                <th>车辆识别代号VIN</th>
                <td>{car.carVin}</td>
                <th>车辆标签</th>
                <td>{car.carId}</td>
              </tr>
              {carInfo.length > 1 && index !== carInfo.length - 1 && (
                <tr>
                  <td colSpan={6} style={{ backgroundColor: '#0B9BD3', height: 14 }}></td>
                </tr>
              )}
            </tbody>
          ))}
        {carInfo.length === 0 && (
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', height: 120 }}>暂无车辆信息</td>
            </tr>
          </tbody>
        )}
      </table>
    );
  }
}

export default HouseInfo;
