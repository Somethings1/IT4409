import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Button, Layout, Typography, Row, Col, Space } from 'antd';
import Cookies from 'js-cookie';
import LoginModal from './intro.jsx';
import notify from '@/components/Notification/notification.jsx';
import Logo from '@/components/Logo'
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
                <Header style={{ padding: '0 50px', background: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)', }}>
                    <Row align="middle" justify="space-between" style={{ width: '100%' }}>
                        <Col>
                            <Space>
                                <Logo />
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

                <Content className="main-content">
                    <Row style={{ height: '100%' }}>
                        <Col
                            span={12}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'left',
                                padding: '50px',
                                zIndex: 1, // above the gradient
                            }}
                        >
                            <Typography>
                                <Title level={1} className="codezilla-title" style={{ color: '#fff', fontSize: '4rem' }}>WELCOME TO CODEZILLA</Title>
                                <Paragraph className="codezilla-paragraph">
                                    Codezilla is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews. With thousand of coding problems and a strong community, willing to help you become your best self in programming.
                                </Paragraph>
                            </Typography>
                            <div style={{ display: 'inline-block' }}>
                                <Button size='middle' style={{ width: 'auto', marginTop: 20 }} onClick={() => setA(2)}>Explore now</Button>
                            </div>
                        </Col>

                        <Col span={12}></Col> {/* Empty space to let the gradient breathe */}
                    </Row>
                </Content>
            </Layout>
        </>
    );
}

export default Main;

