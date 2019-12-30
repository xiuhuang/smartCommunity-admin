import React, { Component } from 'react';
import { Upload, Icon, Modal, Form, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { Dispatch } from 'redux';

interface AvatarProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  // uploadImg?: StateType;
  maxLength?: any;
  text?: any;
  className?: any;
  uploadType?: any;
  onChange?: any;
  value?: any;
  index?: any;
  prompt?: any;
  disabled?: boolean;
}

@connect(
  ({
    uploadImg,
    loading,
  }: {
    uploadImg: any;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    uploadImg,
    loading: loading.models.uploadImg,
  }),
)
class Avatar extends Component<AvatarProps> {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    uploadUrl: [],
    name: '',
  };

  // ossHost = '';

  dataParams = {
    ossHost: '',
    key: '',
    policy: '',
    OSSAccessKeyId: '',
    signature: '',
    success_action_status: 201,
  };

  componentWillMount() {
    const { value } = this.props;
    if (value && value.length > 0) {
      this.setState({
        fileList: [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: value,
          },
        ],
      });
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      if (nextProps.value && nextProps.value.length > 0) {
        this.setState({
          fileList: [
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: nextProps.value,
            },
          ],
        });
      }
    }
  }

  getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file: any) => {
    if (file.fileUri) {
      this.setState({
        previewImage: file.fileUri,
        previewVisible: true,
      });
    } else {
      this.setState({
        previewImage: file.url,
        previewVisible: true,
      });
    }
  };

  handleChange = (fileObj: any) => {
    const { onChange, index } = this.props;
    const { uploadUrl } = this.state;
    if (fileObj.fileList.length === 1) {
      this.setState({
        uploadUrl: fileObj.fileList[0].fileUri,
      });
    } else if (fileObj.fileList.length > 1) {
      const url = [''];
      fileObj.fileList.map((item: any) => {
        url.push(item.fileUri);
        return url;
      });
      this.setState({
        uploadUrl: url,
      });
    }
    this.setState({
      fileList: fileObj.fileList,
    });
    onChange(uploadUrl, index);
  };

  beforeUpload = (file: any, fileList: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isJpgOrPng) {
      message.error('图片格式必须是 JPG/PNG !');
    }
    if (!isLt10M) {
      message.error('图片必须小于10MB!');
    }

    return new Promise((resolve, reject) => {
      const { dispatch, uploadType } = this.props;
      if (dispatch) {
        dispatch({
          type: 'uploadImg/getPolicyData',
          payload: uploadType || 'common',
          callback: (res: any) => {
            if (res.code === '200') {
              const name = `${new Date().getTime()}_${(10000 * Math.random()).toFixed(0)}.${
                file.name.split('.')[1]
              }`;
              this.dataParams = {
                ossHost: res.data.host,
                key: `${res.data.dir}/${name}`,
                policy: res.data.policy,
                OSSAccessKeyId: res.data.accessKeyId,
                signature: res.data.signature,
                success_action_status: 201,
              };
              const fileUri = `${res.data.host}/${this.dataParams.key}`;
              file.fileUri = fileUri;
              resolve();
            } else {
              reject();
            }
          },
        });
      }
    });
  };

  isUploadOk = (file: any) => {};

  render() {
    const { previewVisible, previewImage, fileList, name } = this.state;
    const { maxLength, text, className, disabled, prompt } = this.props;

    const { dataParams } = this;
    const promptCon = (
      <span className="promptCon">
        <span className="promptConStar">*</span>请上传格式为jpg或png，大小为640*640px的图片
      </span>
    );
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{text}</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          accept="image/*"
          className={className}
          action={`${dataParams.ossHost}/`}
          listType="picture-card"
          fileList={fileList}
          disabled={disabled}
          data={dataParams}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= maxLength ? null : uploadButton}
        </Upload>
        {prompt ? promptCon : null}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt={name} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default Form.create<AvatarProps>()(Avatar);
