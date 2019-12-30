import React, { Component } from 'react';
import styles from '../../styles.less';

interface BasicInfoProps {
  basicInfo: any;
}

class BasicInfo extends Component<BasicInfoProps> {
  state = {};

  render() {
    const { basicInfo } = this.props;
    return (
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>姓名</th>
            <td>{basicInfo.residentName || '--'}</td>
            <th>性别</th>
            <td>
              {basicInfo.sex === '0' && '男'}
              {basicInfo.sex === '1' && '女'}
              {!basicInfo.sex && '--'}
            </td>
            <th>身份证</th>
            <td>{basicInfo.idCard || '--'}</td>
          </tr>
          <tr>
            <th>国籍</th>
            <td>{basicInfo.nationality || '--'}</td>
            <th>民族</th>
            <td>{basicInfo.nation || '--'}</td>
            <th>出生日期</th>
            <td>{basicInfo.birthday || '--'}</td>
          </tr>
          <tr>
            <th>联系方式</th>
            <td>{basicInfo.contactPhone || '--'}</td>
            <th>婚姻状况</th>
            <td>{basicInfo.isMarry || '--'}</td>
            <th>文化程度</th>
            <td>{basicInfo.education || '--'}</td>
          </tr>
          <tr>
            <th>户籍</th>
            <td>{basicInfo.censusRegisterAddress || '--'}</td>
            <th>户籍详细地址</th>
            <td colSpan={3}>{basicInfo.censusRegisterDetailAddress || '--'}</td>
          </tr>
          <tr>
            <th>政治面貌</th>
            <td>{basicInfo.poc || '--'}</td>
            <th>工作单位</th>
            <td colSpan={3}>{basicInfo.workUnit || '--'}</td>
          </tr>
          <tr>
            <th>是否为重点关注</th>
            <td>{basicInfo.isFocus ? '是' : '否'}</td>
            <th>居民标签</th>
            <td colSpan={3}>{basicInfo.tagName || '--'}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default BasicInfo;
