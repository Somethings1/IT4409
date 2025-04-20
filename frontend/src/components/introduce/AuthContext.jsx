
// import React, { createContext, useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// // Tạo Context
// export const AuthContext = createContext();

// // Tạo Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải dữ liệu người dùng
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = Cookies.get("user");
//     if (storedUser) {
//       try {
//         const decodedString = decodeURIComponent(storedUser);
//         const userData = JSON.parse(decodedString);
//         console.log("User data from cookie:", userData);
//         setUser( userData);
//       } catch (error) {
//         console.error("Không thể giải mã hoặc phân tích dữ liệu người dùng:", error);
//       }
//     }
//     setLoading(false); // Đánh dấu đã tải xong
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     Cookies.remove("user");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sử dụng useCallback để ổn định hàm
  const checkAuth = useCallback(() => {
    const storedUser = Cookies.get("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(storedUser));
      setUser(userData);
    } catch (error) {
      console.error("Lỗi xử lý cookie:", error);
      Cookies.remove("user");
    } finally {
      setLoading(false); // Đảm bảo luôn tắt loading
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sử dụng useCallback và batch updates
  const login = useCallback((userData, rememberMe = false) => {
    const encodedUser = encodeURIComponent(JSON.stringify(userData));
    const cookieOptions = rememberMe ? { expires: 7 } : {};
    
    Cookies.set("user", encodedUser, cookieOptions);
    setUser(userData);
  }, []);

  // Tách navigation ra effect riêng
  const [shouldLogout, setShouldLogout] = useState(false);
  
  const logout = useCallback(() => {
    Cookies.remove("user");
    setUser(null);
    setShouldLogout(true); // Kích hoạt navigation effect
  }, []);

  useEffect(() => {
    if (shouldLogout) {
      navigate("/", { replace: true });
      setShouldLogout(false);
    }
  }, [shouldLogout, navigate]);
  const getUserName = useCallback(() => {
    return user?.name || 'Khách';
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        isAuthenticated: !!user,
        getUserName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};