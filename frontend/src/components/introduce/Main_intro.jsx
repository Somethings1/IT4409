import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Button, Layout, Typography, Row, Col, Space } from 'antd';
import Cookies from 'js-cookie';
import LoginModal from './intro.jsx';
import notify from '../Notification/notification.jsx';
import logo from './img/computer-coding-icons-set_1284-37673-removebg-preview.png';
import './main.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function Main() {
  const [a, setA] = useState(0);
  const handle = (x) => setA(x);
  const location = useLocation();
  const storedUser = Cookies.get("user");

  let user = null;
  useEffect(() => {
    if (location.state) {
      notify(2, "Bạn phải đăng nhập", "Thất bại");
    }
  }, []);

  if (storedUser) {
    try {
      const decodedString = decodeURIComponent(storedUser);
      user = JSON.parse(decodedString);
    } catch (error) {
      console.error("Không thể giải mã hoặc phân tích dữ liệu người dùng:", error);
    }
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      {a === 1 && <LoginModal off={handle} isSignup={false} />}
      {a === 2 && <LoginModal off={handle} isSignup={true} />}

      <Layout className="main" style={{ minHeight: '100vh', }}>
        <Header style={{ padding: '0 50px', background: 'rgba(0, 0, 0, 0.6)',}}>
          <Row align="middle" justify="space-between" style={{ width: '100%' }}>
            <Col>
              <Space>
                <img src={logo} alt="logo" style={{ paddingTop: '30px', height: '80px', borderRadius: '50%' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>LEET CODE</Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={() => setA(1)}>Đăng nhập</Button>
                <Button onClick={() => setA(2)}>Đăng ký</Button>
              </Space>
            </Col>
          </Row>
        </Header>

        <Content
          style={{
            textAlign: 'center',
            padding: '100px 50px',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.6)', // subtle overlay, remove if not needed
          }}
        >
          <Typography>
            <Title level={3} style={{ color: 'white' }}>Chào mừng đến với trang web của chúng tôi!</Title>
            <Paragraph style={{ color: 'white', maxWidth: '600px', margin: '0 auto' }}>
              Đây là nơi giới thiệu các tính năng và dịch vụ mà chúng tôi cung cấp.
            </Paragraph>
          </Typography>
        </Content>
      </Layout>
    </>
  );
}

export default Main;

