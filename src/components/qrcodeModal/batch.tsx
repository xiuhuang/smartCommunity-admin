import React, { Component } from 'react';
import { Modal, Spin, message } from 'antd';
import styles from './index.less';

const QRcode = require('qrcode.react');
const html2canvas = require('html2canvas');
const JSZip = require('jszip');
const FileSaver = require('file-saver');

interface QRcodeModalProps {
  zipTitle?: string;
  visible: boolean;
  handleVisible: () => void;
  data: any;
}

class QRcodeModal extends Component<QRcodeModalProps> {
  state = {
    loading: false,
  };

  down = () => {
    const { loading } = this.state;
    if (loading) {
      message.info('正在下载中，请稍后...');
      return;
    }
    this.setState(
      {
        loading: true,
      },
      () => {
        setTimeout(this.downqrcode, 10);
      },
    );
  };

  downqrcode = () => {
    const { data = [], zipTitle } = this.props;
    const zip = new JSZip();
    const doms = document.getElementsByClassName('qrcodeBoxForDownLoad');
    const domsLen = doms.length;
    for (let i = 0; i < domsLen; i += 1) {
      html2canvas(doms[i]).then((canvas: any) => {
        const base64 = canvas.toDataURL('image/png');
        zip.file(`${data[i].title}.jpg`, base64.substring(22), { base64: true });
      });
    }
    setTimeout(() => {
      zip.generateAsync({ type: 'blob' }).then((content: any) => {
        FileSaver.saveAs(content, `${zipTitle || '批量下载二维码'}.zip`);
      });
      this.setState({
        loading: false,
      });
    }, data.length * 800);
  };

  render() {
    const { loading } = this.state;
    const { visible, handleVisible, data = [], zipTitle } = this.props;
    return (
      <Modal
        title={`${zipTitle || '批量下载二维码'}`}
        visible={visible}
        onCancel={() => handleVisible()}
        className={styles.modalForBatch}
        okText="下载"
        width={568}
        onOk={this.down}
        destroyOnClose
      >
        <Spin spinning={loading} tip="下载中，请稍后...">
          <div className="content">
            {data.map((item: any) => (
              <div key={item.title}>
                <h4>{item.title}</h4>
                <div className="qrcodeBoxForDownLoad">
                  <div className="qrcode">
                    <div>
                      <QRcode value={item.value} size={240} />
                    </div>
                  </div>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default QRcodeModal;
