import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useAuth } from './useAuth';
import { useLoading } from "./Loading";
import Forgot_password from "./forgot_password";
import Change_password from "./resetpassword";
import "./intro.css";

const { Title, Text, Link } = Typography;

const LoginModal = ({ off, isSignup }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { startLoading, stopLoading } = useLoading();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        ...(isSignup && { username: "", confirmPassword: "", code: "" }),
    });

    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState(false);
    const [isforgot, setIsforgot] = useState(false);
    const [isreset, setIsreset] = useState(false);

    const handleChange = (e) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            stopLoading();
            return;
        }

        const response = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                name: formData.username,
                confirm,
                code: formData.code
            }),
        });

        const data = await response.json();
        stopLoading();

        if (response.status === 201) {
            Cookies.set("user", JSON.stringify(data.user), { expires: 7, secure: true, sameSite: 'Strict' });
            login(data.user);
            navigate("/home");
        } else {
            setError(data.error);
        }
    }

    const handleSignin = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: formData.email,
                password: formData.password
            }),
        });

        if (!response.ok) throw new Error("Login failed");
        const data = await response.json();

        const user = data.data.user;
        const userCookieData = {
            _id: user.id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            GoogleID: null,
            role: user.role?.name ?? "USER",
            role_id: user.role?.id.toString() ?? 2,
            //createdAt: user.role.createdAt,
            //updatedAt: user.role.updatedAt || user.role.createdAt,
            //id_owner: user.id.toString()
        };

        localStorage.setItem("token", data.data.access_token);
        Cookies.set("user", JSON.stringify(userCookieData), { expires: 7, sameSite: 'Strict' });

        login(user);
        navigate(userCookieData.role === "ADMIN" ? "/home" : "/code");
        stopLoading();
    }

    const submit_log = async () => {
        setError('');
        startLoading();

        try {
            if (isSignup) {
                handleSignup();
            } else {
                handleSignin();
            }
        } catch (err) {
            stopLoading();
            setError("Incorrect email or password.");
        }
    };

    return (
        <>
            {isreset && <Change_password off={() => setIsreset(false)} email={isreset} />}
            {isforgot && <Forgot_password off={() => setIsforgot(false)} turnon={(email) => setIsreset(email)} />}

            <div className="login">
                <div className="login-modal">
                    <div className="login-header">
                        <Title level={3}>{isSignup ? "Sign up" : "Login"}</Title>
                        <span className="close-btn" onClick={() => off(0)}>×</span>
                    </div>


                    <Form layout="vertical" onFinish={submit_log}>
                        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                            <Input name="email" value={formData.email} onChange={handleChange} />
                        </Form.Item>

                        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                            <Input.Password name="password" value={formData.password} onChange={handleChange} />
                        </Form.Item>

                        {isSignup && (
                            <>
                                <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true }]}>
                                    <Input.Password name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                                    <Input name="username" value={formData.username} onChange={handleChange} />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item>
                            <Text className="term-of-service">
                                By continuing, you agree to our <Link>Terms</Link> and <Link>Privacy Policy</Link>.<br />
                            </Text>
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                {isSignup ? "Sign Up" : "Login"}
                            </Button>
                        </Form.Item>

                        {error && <Text type="danger">{error}</Text>}
                    </Form>
                    {!isSignup && (
                        <Text type="secondary" style={{ cursor: "pointer" }} onClick={() => setIsforgot(true)}>
                            Forgot password?
                        </Text>
                    )}

                    <Divider />


                    {isSignup ? (
                        <Text>
                            Already a member?{" "}
                            <Link onClick={() => off(1)}>Login</Link>
                        </Text>
                    ) : (
                        <Text>
                            New to Codezilla?{" "}
                            <Link onClick={() => off(2)}>Sign Up</Link>
                        </Text>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginModal;

