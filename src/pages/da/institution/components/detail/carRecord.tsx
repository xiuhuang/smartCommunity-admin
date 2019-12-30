import React, { Component } from 'react';
import styles from '../../styles.less';

class AccessRecord extends Component {
  state = {};

  render() {
    return (
      <div className={styles.tableBox}>
        <h4>近7天单位车辆出入记录</h4>
        <table className={styles.table2}>
          <thead>
            <tr>
              <th>出入抓拍图片</th>
              <th>抓拍时间</th>
              <th>抓拍地点</th>
              <th>出场入场类型</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  src="https://imgs.qunarzz.com/vs_ceph_vs_tts/01a19708-6b16-44ed-b4f3-a6d458cb42c9.jpg_r_480x320x90_563484c9.jpg"
                  alt=""
                />
              </td>
              <td>xx</td>
              <td>xx</td>
              <td>xx</td>
            </tr>
            <tr>
              <td>
                <img
                  src="https://imgs.qunarzz.com/vs_ceph_vs_tts/01a19708-6b16-44ed-b4f3-a6d458cb42c9.jpg_r_480x320x90_563484c9.jpg"
                  alt=""
                />
              </td>
              <td>xx</td>
              <td>xx</td>
              <td>xx</td>
            </tr>
            <tr>
              <td>
                <img
                  src="https://imgs.qunarzz.com/vs_ceph_vs_tts/01a19708-6b16-44ed-b4f3-a6d458cb42c9.jpg_r_480x320x90_563484c9.jpg"
                  alt=""
                />
              </td>
              <td>xx</td>
              <td>xx</td>
              <td>xx</td>
            </tr>
            <tr>
              <td>
                <img
                  src="https://imgs.qunarzz.com/vs_ceph_vs_tts/01a19708-6b16-44ed-b4f3-a6d458cb42c9.jpg_r_480x320x90_563484c9.jpg"
                  alt=""
                />
              </td>
              <td>xx</td>
              <td>xx</td>
              <td>xx</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default AccessRecord;
