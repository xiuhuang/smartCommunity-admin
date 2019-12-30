import { Button, Result, Card } from 'antd';
import React from 'react';
import router from 'umi/router';

// 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage: React.FC<{}> = () => (
  <Card bordered={false}>
    <Result
      status="404"
      title="页面正在开发中"
      subTitle="页面正在开发中，敬请谅解."
      extra={
        <Button type="primary" onClick={() => router.push('/')}>
          返回首页
        </Button>
      }
    ></Result>
  </Card>
);

export default NoFoundPage;
