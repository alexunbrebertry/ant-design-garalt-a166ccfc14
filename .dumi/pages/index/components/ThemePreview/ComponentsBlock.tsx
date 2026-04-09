import React from 'react';
import {
  AppleFilled,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  GoogleOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MessageOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  App,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  Flex,
  Input,
  List,
  Progress,
  Radio,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  Typography,
} from 'antd';
import type { ConfigProviderProps } from 'antd';
import { createStyles } from 'antd-style';
import clsx from 'clsx';

const { Title, Text } = Typography;

const useStyle = createStyles(({ css, token, cssVar }) => {
  return {
    wrapper: css({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: `${token.paddingXL}px ${token.padding}px`,
      overflowX: 'auto',
      backgroundColor: '#f5f5f5', // matching the light gray background
    }),
    container: css({
      backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 70%, transparent)`,
      backdropFilter: 'blur(12px)',
      padding: token.paddingLG,
      border: 'none',
      boxShadow: 'none',
      width: '100%',
      '.ant-card-body': {
        padding: 0,
      },
    }),
    layoutRow: css({
      display: 'flex',
      gap: token.paddingLG,
      alignItems: 'flex-start',
      justifyContent: 'center',
      margin: '0 auto',
      width: 'max-content',
    }),
    colLeft: css({
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingLG,
    }),
    colCenter: css({
      width: 420,
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingLG,
    }),
    colRight: css({
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingLG,
    }),
    blockCard: css({
      background: cssVar.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: `1px solid ${token.colorBorderSecondary}`,
      padding: token.paddingLG,
    }),
    formLabel: css({
      display: 'block',
      fontWeight: 600,
      marginBottom: token.marginXXS,
    }),
    listIcon: css({
      fontSize: 16,
      color: token.colorTextSecondary,
    }),
  };
});

interface ComponentsBlockProps {
  config?: ConfigProviderProps;
  style?: React.CSSProperties;
  className?: string;
  containerClassName?: string;
  inherit?: boolean;
}

const ComponentsBlock: React.FC<ComponentsBlockProps> = (props) => {
  const { styles, theme: currentToken } = useStyle();
  const { config, style, className, containerClassName, inherit = false } = props;

  const { theme, ...restConfig } = config || {};

  const mergedTheme = React.useMemo(
    () => ({
      ...theme,
      inherit,
    }),
    [theme, inherit],
  );

  return (
    <ConfigProvider {...restConfig} theme={mergedTheme}>
      <Card className={clsx(containerClassName, styles.container)}>
        <App>
          <div style={style} className={clsx(styles.wrapper, className)}>
            <div className={styles.layoutRow}>
              {/* ================= LEFT COLUMN ================= */}
              <div className={styles.colLeft}>
                <div className={styles.blockCard}>
                  <Flex vertical gap="middle">
                    <div>
                      <span className={styles.formLabel}>Your email <Text type="danger">*</Text></span>
                      <Input placeholder="john@email.com" />
                      <Text type="secondary" style={{ fontSize: 12 }}>We won't share your email</Text>
                    </div>

                    <div>
                      <span className={styles.formLabel}>State <Text type="danger">*</Text></span>
                      <Select style={{ width: '100%' }} placeholder="Select one" />
                    </div>

                    <Flex align="center" justify="space-between" style={{ marginTop: 8 }}>
                      <Checkbox checked />
                      <Switch defaultChecked />
                      <Badge status="default" />
                      <Radio checked />
                      <Progress type="circle" percent={25} size={20} showInfo={false} />
                    </Flex>

                    <div style={{ marginTop: 8 }}>
                      <Flex justify="space-between">
                        <span className={styles.formLabel}>Price</span>
                        <Text strong>US$250.00</Text>
                      </Flex>
                      <Slider defaultValue={30} />
                    </div>
                  </Flex>
                </div>

                <div className={styles.blockCard} style={{ padding: '8px' }}>
                  <Segmented block options={['1D', '7D', '1M', '1Y', 'All']} />
                </div>

                <div className={styles.blockCard} style={{ padding: '8px' }}>
                  <Segmented
                    block
                    options={[
                      { label: 'Chats', value: 'Chats', icon: <MessageOutlined /> },
                      { label: 'Emails', value: 'Emails', icon: <MailOutlined /> }
                    ]}
                  />
                </div>

                <div className={styles.blockCard} style={{ padding: 0 }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      { title: 'New file', desc: 'Create a new file', icon: <FileAddOutlined />, shortcut: '⌘ N' },
                      { title: 'Edit file', desc: 'Make changes', icon: <EditOutlined />, shortcut: '⌘ E' },
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '12px 16px', borderBottom: 'none' }} extra={<Text type="secondary" style={{ fontSize: 12 }}>{item.shortcut}</Text>}>
                        <List.Item.Meta
                          avatar={<Avatar icon={item.icon} shape="square" size="small" style={{ background: 'transparent', color: currentToken.colorTextSecondary }} />}
                          title={<Text strong style={{ fontSize: 14 }}>{item.title}</Text>}
                          description={<Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>}
                        />
                      </List.Item>
                    )}
                  />
                  <Divider style={{ margin: 0 }} />
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      { title: 'Delete file', desc: 'Move to trash', icon: <DeleteOutlined />, shortcut: '⌘ ⇧ D', danger: true },
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '12px 16px', borderBottom: 'none' }} extra={<Text type="secondary" style={{ fontSize: 12 }}>{item.shortcut}</Text>}>
                        <List.Item.Meta
                          avatar={<Avatar icon={item.icon} shape="square" size="small" style={{ background: 'transparent', color: currentToken.colorError }} />}
                          title={<Text type="danger" strong style={{ fontSize: 14 }}>{item.title}</Text>}
                          description={<Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>

              {/* ================= CENTER COLUMN ================= */}
              <div className={styles.colCenter}>
                <div className={styles.blockCard} style={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar.Group size="large" style={{ marginBottom: 16 }}>
                    <Avatar style={{ backgroundColor: '#1890ff' }} />
                    <Avatar style={{ backgroundColor: '#52c41a' }} />
                    <Avatar style={{ backgroundColor: '#722ed1' }} />
                    <Avatar style={{ backgroundColor: '#eb2f96' }} />
                    <Avatar style={{ backgroundColor: '#fa541c' }} />
                    <Avatar style={{ backgroundColor: '#f5f5f5', color: '#666' }}>+5</Avatar>
                  </Avatar.Group>
                  <Title level={5}>Verify account</Title>
                  <Text type="secondary">We've sent a code to a****@gmail.com</Text>

                  <div style={{ marginTop: 24, marginBottom: 16 }}>
                    <Input.OTP length={6} defaultValue="4320" />
                  </div>

                  <Text type="secondary">Didn't receive a code? <a href="#">Resend</a></Text>
                </div>

                <Flex gap="middle">
                  <div className={styles.blockCard} style={{ flex: 1 }}>
                    <Flex wrap="wrap" gap="small" justify="center">
                      <Button type="primary" shape="round">Click me</Button>
                      <Button style={{ color: '#1677ff', background: '#e6f4ff', border: 'none' }} shape="round">Click me</Button>
                      <Button type="default" shape="round" style={{ background: '#f5f5f5', border: 'none' }}>Click me</Button>
                      <Button type="primary" danger shape="round">Click me</Button>
                      <Button danger style={{ background: '#fff2f0', border: 'none' }} shape="round">Click me</Button>
                      <Button type="default" shape="round" style={{ background: '#f5f5f5', border: 'none' }}>Click me</Button>
                    </Flex>
                  </div>
                </Flex>

                <div className={styles.blockCard}>
                  <Flex align="flex-start" gap="middle">
                    <Avatar shape="square" size={40} style={{ background: '#000' }} icon={<UserOutlined />} />
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ margin: 0 }}>HeroUI</Title>
                      <Text type="secondary" style={{ fontSize: 13 }}>@hero_ui</Text>
                      <p style={{ margin: '8px 0', fontSize: 14 }}>
                        Building the future of UI for web & mobile. 🚀 (YC S24)
                      </p>
                      <Space size="large" style={{ fontSize: 13 }}>
                        <span><Text strong>4</Text> <Text type="secondary">Following</Text></span>
                        <span><Text strong>97.1K</Text> <Text type="secondary">Followers</Text></span>
                      </Space>
                    </div>
                  </Flex>
                </div>

                <div className={styles.blockCard}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap="small">
                      <InfoCircleOutlined style={{ fontSize: 16 }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>You have 2 credits left</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Get a paid plan for more credits</Text>
                      </div>
                    </Flex>
                    <Button shape="round">Upgrade</Button>
                  </Flex>
                </div>

                <div className={styles.blockCard}>
                  <Flex align="center" justify="space-between">
                    <div>
                      <div style={{ fontWeight: 600 }}>Allow notifications</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Receive push notifications from HeroUI</Text>
                    </div>
                    <Switch defaultChecked />
                  </Flex>
                </div>
              </div>

              {/* ================= RIGHT COLUMN ================= */}
              <div className={styles.colRight}>
                <div className={styles.blockCard} style={{ textAlign: 'center', padding: '32px 24px' }}>
                  <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#f0f0f0', color: '#666', marginBottom: 16 }} />
                  <Title level={4}>Create an account</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 14 }}>
                    Start your free 7-day trial. No credit card required.
                  </Text>
                  <Button type="primary" block size="large" style={{ marginBottom: 16 }}>
                    Get Started
                  </Button>
                  <Divider style={{ color: currentToken.colorTextSecondary, fontSize: 12 }}>OR</Divider>
                  <Flex vertical gap="small">
                    <Button block size="large" icon={<GoogleOutlined />}>
                      Continue with Google
                    </Button>
                    <Button block size="large" icon={<AppleFilled />}>
                      Continue with Apple
                    </Button>
                  </Flex>
                </div>

                <Flex gap="middle">
                  <div className={styles.blockCard} style={{ flex: 1 }}>
                    <div style={{ width: 40, height: 40, background: '#ffd8bf', borderRadius: 8, marginBottom: 12 }} />
                    <div style={{ fontWeight: 600 }}>Indie Hackers</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>148 members</Text>
                    <Flex align="center" gap="small" style={{ marginTop: 12 }}>
                      <Avatar size="small" style={{ backgroundColor: '#ffccc7' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>By John</Text>
                    </Flex>
                  </div>
                  <div className={styles.blockCard} style={{ flex: 1 }}>
                    <div style={{ width: 40, height: 40, background: '#87e8de', borderRadius: 8, marginBottom: 12 }} />
                    <div style={{ fontWeight: 600 }}>AI Builders</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>362 members</Text>
                    <Flex align="center" gap="small" style={{ marginTop: 12 }}>
                      <Avatar size="small" style={{ backgroundColor: '#d9f7be' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>By Martha</Text>
                    </Flex>
                  </div>
                </Flex>

                <div className={styles.blockCard}>
                  <Avatar icon={<SaveOutlined />} shape="square" style={{ backgroundColor: '#fff7e6', color: '#fa8c16', marginBottom: 12 }} />
                  <Title level={5} style={{ margin: '0 0 8px 0' }}>Unsaved changes</Title>
                  <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>
                    Do you want to save or discard changes?
                  </Text>
                  <Flex gap="small">
                    <Button block shape="round">Discard</Button>
                    <Button type="primary" block shape="round">Save changes</Button>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </App>
      </Card>
    </ConfigProvider>
  );
};

export default ComponentsBlock;
