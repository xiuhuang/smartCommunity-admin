import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import { connect } from 'dva';
import 'braft-extensions/dist/table.css';
import styles from './index.less';

const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: false, // 插入表格前是否弹出下拉菜单
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['editor-id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['editor-id-2']  // 指定该模块对哪些BraftEditor无效
};

BraftEditor.use(Table(options));

/* eslint react/no-multi-comp:0 */
@connect(({ formModel, loading }) => ({
  formModel,
  loading: loading.models.formModel,
}))
class RichTextEditor extends Component {
  state = {};

  id = 1;

  componentWillReceiveProps(nextProps) {
    const { value, onChange } = this.props;
    if (value.toHTML() !== nextProps.value.toHTML()) {
      onChange(nextProps.value);
    }
  }

  onChange = value => {};

  fileNameOf = file => {
    const fileName = file.name;
    let suffix = 'jpg';
    const kv = fileName.split('.');
    const kvLen = kv.length;
    if (kv.length > 1) {
      suffix = kv[kvLen - 1];
    }
    const name = `${Math.floor(Math.random() * 1000000)}.${suffix}`;
    return `${new Date().getTime()}_${name}`;
  };

  myUploadFn = param => {
    const { dispatch } = this.props;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    let url = '';

    const successFn = response => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      this.id += 1;
      param.success({
        url,
        meta: {
          id: `${this.id}`,
          title: '资源',
          alt: '资源',
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: url, // 指定视频播放器的封面
        },
      });
    };

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = response => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    dispatch({
      type: 'formModel/getOssConfig',
      payload: {
        category: 'common',
      },
      callback: res => {
        if (res.code === '200') {
          const config = res.data;
          const fileName = this.fileNameOf(param.file);
          const fileKey = `${config.dir}/${fileName}`;
          url = `${config.host}/${fileKey}`;
          fd.append('key', fileKey);
          fd.append('policy', config.policy);
          fd.append('OSSAccessKeyId', config.accessKeyId);
          fd.append('signature', config.signature);
          fd.append('success_action_status', 201);

          fd.append('file', param.file, fileName);
          xhr.open('POST', config.host, true);
          xhr.send(fd);
        }
      },
    });
  };

  render() {
    const { className, height, ...set } = this.props;
    const controls = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
      'media',
      'table',
    ];

    return (
      <BraftEditor
        className={`${styles.braftEditor} ${className}`}
        controls={controls}
        contentStyle={{ height: height || 200 }}
        media={{ uploadFn: this.myUploadFn }}
        {...set}
        onChange={this.onChange}
      />
    );
  }
}
RichTextEditor.createEditorState = BraftEditor.createEditorState;
export default RichTextEditor;
