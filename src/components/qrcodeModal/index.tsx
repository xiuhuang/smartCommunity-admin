import React, { Component } from 'react';
import { Button, Modal } from 'antd';
// import html2canvas from "html2canvas";
import styles from './index.less';

const QRcode = require('qrcode.react');
const html2canvas = require('html2canvas');

interface QRcodeModalProps {
  title: string;
  value: string;
}

class QRcodeModal extends Component<QRcodeModalProps> {
  state = {
    visible: false,
  };

  handleVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  downqrcode = () => {
    const { title } = this.props;
    const base64ToBlob = function(code: any) {
      const parts = code.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; i += 1) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {
        type: contentType,
      });
    };
    const dom = document.querySelector('.qrcodeBoxForDownLoad');
    html2canvas(dom).then((canvas: any) => {
      const aLink = document.createElement('a');
      const blob = base64ToBlob(canvas.toDataURL('image/png'));
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true);
      aLink.download = `${title}.jpg`;
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    });
  };

  render() {
    const { visible } = this.state;
    const { value, title } = this.props;
    return (
      <div>
        <Button icon="qrcode" onClick={() => this.handleVisible(true)} className={styles.qrcodeBtn}>
          二维码
        </Button>
        <Modal
          visible={visible}
          onCancel={() => this.handleVisible()}
          title={null}
          className={styles.modal}
          okText="下载二维码"
          onOk={this.downqrcode}
          destroyOnClose
        >
          <div className="qrcodeBoxForDownLoad">
            <div className="qrcode">
              <div>
                <QRcode value={value} size={240} />
              </div>
            </div>
            <h4>{title}</h4>
          </div>
        </Modal>
      </div>
    );
  }
}

export default QRcodeModal;
