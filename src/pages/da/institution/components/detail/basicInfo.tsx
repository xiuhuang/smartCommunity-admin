import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Form } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import styles from '../../styles.less';
import { StateType } from '../../model';

interface BasicInfoProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  institution?: any;
  detailData: any;
}

@connect(
  ({
    institution,
    loading,
  }: {
    institution: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    institution,
    loading: loading.models.institution,
  }),
)
class BasicInfo extends Component<BasicInfoProps> {
  state = {};

  render() {
    const { detailData } = this.props;
    let textHousePurpose;
    let textHouseType;
    if (detailData.housePurpose === '1') {
      textHousePurpose = '住宅';
    } else if (detailData.housePurpose === '2') {
      textHousePurpose = '厂房';
    } else if (detailData.housePurpose === '3') {
      textHousePurpose = '仓库';
    } else if (detailData.housePurpose === '4') {
      textHousePurpose = '商业';
    } else if (detailData.housePurpose === '5') {
      textHousePurpose = '服务';
    } else if (detailData.housePurpose === '6') {
      textHousePurpose = '文化';
    } else if (detailData.housePurpose === '7') {
      textHousePurpose = '教育';
    } else if (detailData.housePurpose === '8') {
      textHousePurpose = '卫生';
    } else if (detailData.housePurpose === '9') {
      textHousePurpose = '体育';
    } else if (detailData.housePurpose === '10') {
      textHousePurpose = '办公用房';
    } else {
      textHousePurpose = '--';
    }

    if (detailData.houseType === '1') {
      textHouseType = '商品房';
    } else if (detailData.houseType === '2') {
      textHouseType = '集资房';
    } else if (detailData.houseType === '3') {
      textHouseType = '安居房';
    } else if (detailData.houseType === '4') {
      textHouseType = '解困房';
    } else if (detailData.houseType === '5') {
      textHouseType = '存量房';
    } else if (detailData.houseType === '6') {
      textHouseType = '廉价住房';
    } else {
      textHouseType = '--';
    }
    return (
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>单位名称</th>
            <td>{detailData.companyName}</td>
            <th>注册号</th>
            <td>{detailData.busLic}</td>
            <th>经营者姓名/法人</th>
            <td>{detailData.legalPerson}</td>
          </tr>
          <tr>
            <th>联系方式</th>
            <td>{detailData.legalPhone}</td>
            <th>身份证号</th>
            <td>{detailData.legalIdentityCard}</td>
            <th>营业期限</th>
            <td>
              {detailData.operatorPeriod[0]} - {detailData.operatorPeriod[1]}
            </td>
          </tr>
          <tr>
            <th>房屋地址</th>
            <td colSpan={5}>{detailData.legelAddress}</td>
          </tr>
          <tr>
            <th>产权人类型</th>
            <td>{detailData.proType}</td>
            <th>房屋所有权人</th>
            <td>{detailData.proPerson}</td>
            <th>身份证号</th>
            <td>{detailData.proPapersNum}</td>
          </tr>
          <tr>
            <th>联系方式</th>
            <td>{detailData.proPhone}</td>
            <th>房屋面积</th>
            <td>{detailData.houseArea}</td>
            <th>房屋性质</th>
            <td>{textHouseType}</td>
          </tr>
          <tr>
            <th>规划用途</th>
            <td colSpan={5}>{textHousePurpose}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Form.create<BasicInfoProps>()(BasicInfo);
