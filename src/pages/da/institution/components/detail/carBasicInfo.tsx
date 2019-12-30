import React, { Component } from 'react';
import styles from '../../styles.less';

interface BasicInfoProps {
  residentInfo: any;
}

class BasicInfo extends Component<BasicInfoProps> {
  state = {};

  render() {
    const { residentInfo } = this.props;

    return (
      <table className={styles.table}>
        <tr>
          <th>姓名</th>
          <td>{residentInfo.baseInfo.residentName || '--'}</td>
          <th>性别</th>
          <td>
            {residentInfo.baseInfo.sex === '1' && <span>男</span>}
            {residentInfo.baseInfo.sex === '2' && <span>女</span>}
            {!residentInfo.baseInfo.sex && <span>--</span>}
          </td>
        </tr>
        <tr>
          <th>身份证号</th>
          <td>{residentInfo.baseInfo.idCard || '--'}</td>
          <th>联系方式</th>
          <td>{residentInfo.baseInfo.contactPhone || '--'}</td>
        </tr>
        <tr>
          <th>住户号:</th>
          <td colSpan={3}>{residentInfo.houseInfo.houseAddress || '--'}</td>
        </tr>
      </table>
    );
  }
}

export default BasicInfo;
