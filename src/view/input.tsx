import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { sendPassword } from './ipc';

// 错误信息提示
const openNotificationWithIcon = () => {
    notification.error({
      message: '错误信息',
      description:
        '管理员密码认证失败',
    });
};

const openNotificationWithIconTip = () => {
    notification.success({
        message: '提示',
        description: '验证成功, 请重新打开客户端'
    })
}

export default function() {
    return <>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={async (formData) => {
                let res = await sendPassword(formData['password']);
                if(res) {
                    openNotificationWithIconTip();
                } else {
                    openNotificationWithIcon();
                }
            }}
            autoComplete="off"
        >
            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入管理员密码' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    确定
                </Button>
            </Form.Item>
        </Form>
    </>;
}
