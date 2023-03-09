import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

const { confirm } = Modal;

const showPromiseConfirm = () => {
  confirm({
    title: 'Do you want to delete these items?',
    icon: <ExclamationCircleFilled />,
    content: 'When clicked the OK button, this dialog will be closed after 1 second',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
};

const App: React.FC = () => (
  <Space wrap>
    <Button onClick={showPromiseConfirm}>With promise</Button>
  </Space>
);

export default App;