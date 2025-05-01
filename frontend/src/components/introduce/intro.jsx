import React, { useState } from "react";
import "./intro.css";
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FacebookProvider, LoginButton } from 'react-facebook';
import facebook from '../introduce/facebook.png';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.jsx';
import axios from 'axios';

import { useLoading } from "./Loading.jsx";

function LoginModal({ off, isSignup }) {
  const { startLoading, stopLoading } = useLoading();
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ...(isSignup && { username: '', confirmPassword: '', code: '' }), // Thêm confirmPassword nếu là đăng ký
  });

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const submit_log = (e) => {
  //   e.preventDefault();
  //   if (isSignup) {
  //     if (formData.password !== formData.confirmPassword) {
  //       setError("Mật khẩu khác với xác nhận mật khẩu");
  //     } else {
  //       const body = {
  //         email: formData.email,
  //         password: formData.password,
  //         name: formData.username,
  //         confirm: confirm,
  //         code: formData.code,
  //       };
  //       console.log(body);
  //       startLoading();

  //       // Giả lập gọi API - Đăng ký
  //       setTimeout(() => {
  //         stopLoading();
  //         console.log('API response:', { message: "User created successfully" });
          
  //         if (confirm) {
  //           // Giả lập lưu người dùng và role_id là 2 (thường là 'registered')
  //           const user = { email: formData.email, username: formData.username, role_id: 2 }; 
  //           Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Strict' });
  //           login(user);  // Gọi hàm login sau khi đăng ký thành công
  //           navigate('/home');
  //           // if (data.user.role_id === "Admin") {
  //           //   navigate('/home');
  //           // } else {
  //           //   navigate('/code');
  //           // }
  //         } else {
  //           setConfirm(true);
  //         }
  //       }, 2000); // Giả lập thời gian chờ 2s
  //     }
  //   } else {
  //     const body = {
  //       email: formData.email,
  //       password: formData.password,
  //     };
  //     console.log(formData);
  //     startLoading();

  //     // Giả lập gọi API - Đăng nhập
  //     setTimeout(() => {
  //       stopLoading();
  //       console.log('API response:', { message: "Login successful", token: "fakeToken", user: { email: formData.email, role_id: 2 } });
        
  //       // Giả lập xử lý login
  //       localStorage.setItem("token", "fakeToken");
  //       const user = { email: formData.email, role_id: res.data.user.role_id};  // role_id có thể lấy từ API thực tế
  //       Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Strict' });
  //       login(user);
  //       navigate('/home');
  //       // if (data.user.role_id === "Admin") {
  //       //   navigate('/home');
  //       // } else {
  //       //   navigate('/code');
  //       // }
  //     }, 2000); // Giả lập thời gian chờ 2s
  //   }
  // };

  // Google login

  const submit_log = async (e) => {
    e.preventDefault();
    setError('');
  
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu khác với xác nhận mật khẩu");
        return;
      }
  
      const body = {
        email: formData.email,
        password: formData.password,
        name: formData.username,
        confirm: confirm,
        code: formData.code,
      };
  
      startLoading();
      try {
        const res = await axios.post('http://localhost:8080/api/auth/signup', body);
        stopLoading();
        console.log('API response:', res.data);
  
        if (confirm) {
          const user = res.data.user; // giả định API trả về user object
          Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Strict' });
          login(user);
          navigate('/home');
        } else {
          setConfirm(true);
        }
      } catch (err) {
        stopLoading();
        setError(err.response?.data?.message || 'Đăng ký thất bại');
      }
  
    } else {
      const body = {
        email: formData.email,
        password: formData.password,
      };
  
      startLoading();
      try {
        const res = await axios.post('http://localhost:8080/api/auth/login', body);
        stopLoading();
        console.log('API response:', res.data);
  
        localStorage.setItem("token", res.data.token);
        const user = res.data.user;
        Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Strict' });
        login(user);
        navigate('/home');
      } catch (err) {
        stopLoading();
        setError(err.response?.data?.message || 'Đăng nhập thất bại');
      }
    }
  };
  
  const responseMessage = (response) => {
    const credential = response.credential;
    const decoded = jwtDecode(credential);
    console.log(decoded);
    const body = {
      family_name: decoded.family_name,
      given_name: decoded.given_name,
      GoogleID: decoded.sub,
      email: decoded.email,
    };
    console.log(JSON.stringify(body));
    startLoading();

    // Giả lập gọi API
    setTimeout(() => {
      stopLoading();
      console.log('API response:', { message: "Login successful", token: "fakeToken", user: { email: body.email, role_id: 2 } });
      
      localStorage.setItem("token", "fakeToken");
      Cookies.set("user", JSON.stringify({ email: body.email, role_id: 2 }), { expires: 7, secure: true, sameSite: 'Strict' });
      login({ email: body.email, role_id: 2 });
      navigate('/home');
      // if (data.user.role_id === "Admin") {
      //   navigate('/home');
      // } else {
      //   navigate('/code');
      // }
    }, 2000); // Giả lập thời gian chờ 2s
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const handleResponse = (data) => {
    console.log(data);
  };

  const handleError = (error) => {
    console.error(error);
  };

  const forgot = () => {
    setIsforgot(true);
  };

  const sentagain = () => {
    setConfirm(false);
    const body = {
      email: formData.email,
      password: formData.password,
      name: formData.username,
      confirm: false,
      code: formData.code,
    };
    console.log(body);
    startLoading();

    // Giả lập gọi API
    setTimeout(() => {
      stopLoading();
      console.log('API response:', { message: "User created successfully" });
      
      setConfirm(true);
    }, 2000); // Giả lập thời gian chờ 2s
  };

  return (
    <>
      <GoogleOAuthProvider clientId="">
        <div className="login">
          <div className="login-modal">
            <div className="image-top">
              {/* <img src={top} alt="Background" className="top-image"/> */}
            </div>
            <div className="login-header">
              <h2>{isSignup ? "Sign up" : "Login"}</h2>
              <span className="close-btn" onClick={() => { off(0) }}>
                &times;
              </span>
            </div>

            <p>
              By continuing, you agree to our <a href="#">User Agreement</a> and
              acknowledge that you understand the <a href="#">Privacy Policy</a>
              .
            </p>

            <button className="login-option">Continue with phone number</button>

            <div className="forgoogle">
              <GoogleLogin
                onSuccess={responseMessage}
                onError={errorMessage}
                theme="filled_blue"
                size="large"
                shape="circle"
                color="blue"
                className="custom-google-login"
              />
            </div>
            <FacebookProvider appId="">
              <LoginButton
                scope="email"
                onCompleted={handleResponse}
                onError={handleError}
                className="facebook-login-button"
              >
                <span className="facebook-icon" >
                  <img src={facebook} style={{ height: "40px" }}></img>
                </span>
                <span>Đăng nhập bằng Facebook</span>
              </LoginButton>
            </FacebookProvider>

            <div className="divider">
              <span>OR</span>
            </div>

            <form className="login-form" onSubmit={submit_log}>
              <div className="form-group">
                <input
                  name="email"
                  type="text"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {isSignup && (
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {isSignup && (
                <div className="form-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="user_name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {confirm && (<>
                <div className="form-group">
                  <input
                    type="text"
                    name="code"
                    placeholder="điền mã xác nhận "
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="sentagain" onClick={sentagain} >Gửi lại mã</p></>
              )}
              {!isSignup && (
                <a className="forgot-password" onClick={forgot} style={{ cursor: "pointer" }}>
                  Forgot password?
                </a>
              )}
              <button id="login-btn" type="submit">
                {isSignup ? "Sign up" : "login"}
              </button>
              <p style={{ color: "red" }}>{error}</p>
            </form>
            {!isSignup && (
              <p className="signup-text">
                New to Myapp? <a style={{ cursor: "pointer", color: "cornflowerblue" }} onClick={() => { off(2) }}>Sign Up</a>
              </p>
            )}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}

export default LoginModal;
