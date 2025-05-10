import React, { useState, useEffect } from "react";
import { useAuth } from "../introduce/useAuth.jsx";
import { useLoading } from "../introduce/Loading.jsx";
import { FaRegBell } from "react-icons/fa";
import "./noti.css";

const Notification = () => {
  const { startLoading, stopLoading } = useLoading();
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Hàm để lấy các thông báo gần đây trong vòng 2 ngày
  const fetchNotifications = async () => {
    if (loading || !user) return;

    setIsFetching(true);
    startLoading();

    try {
      const token = localStorage.getItem('token');
         
      const response = await fetch(import.meta.env.VITE_API_URL + "/comments", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log("data", data.data.result);
      const datacomment = data.data.result;

      // Lọc các thông báo trong vòng 2 ngày
      const currentTime = new Date();
      const filteredNotifications = datacomment.filter((notification) => {
        const notificationTime = new Date(notification.createdAt);
        const timeDifference = (currentTime - notificationTime) / (1000 * 60 * 60 * 24); // Thời gian chênh lệch tính theo ngày
        return timeDifference <= 2; // Chỉ lấy thông báo trong 2 ngày gần đây
      });

      setNotifications(filteredNotifications);
      setHasUnreadNotifications(filteredNotifications.length > 0);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      stopLoading();
      setIsFetching(false);
    }
  };

  // Cập nhật thông báo mỗi khi có thay đổi hoặc theo chu kỳ
  useEffect(() => {
    if (user && !loading) {
      fetchNotifications(); // Lần đầu tiên gọi hàm để lấy dữ liệu thông báo
      const interval = setInterval(fetchNotifications, 600000); // Cập nhật mỗi 10 phút

      // Cleanup interval khi component bị unmount
      return () => clearInterval(interval);
    }
  }, [user, loading]);

  // Hiển thị thông báo khi click vào chuông
  const handleBellClick = () => {
    if (isFetching) return; // Tránh gọi API nếu đang tải dữ liệu
    setIsVisible((prev) => !prev);
    if (!isVisible) {
      fetchNotifications();
      setHasUnreadNotifications(false);
    }
  };

  return (
    <div className="notification-container">
      <FaRegBell
        className="notification-bell"
        onClick={handleBellClick}
        style={{
          cursor: "pointer",
          color: hasUnreadNotifications ? "black" : "gray",
          fontSize: "24px",
        }}
      />
      
      {/* Hiển thị thông báo badge nếu có thông báo chưa đọc */}
      {hasUnreadNotifications && (
        <div className="notification-badge">{notifications.length}</div>
      )}

      {/* Hiển thị popup thông báo */}
      <div className={`notification-popup ${isVisible ? "show" : ""}`}>
        <div className="notification-header">
          <h4>Bạn có thông báo mới</h4>
        </div>
        <div className="notification-content">
          {isFetching ? (
            <p>Đang tải...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-header">
                  <h5>{notification.problem.title}</h5> {/* Hiển thị tiêu đề */}
                  <p><small>{new Date(notification.createdAt).toLocaleString()}</small></p> {/* Hiển thị thời gian */}
                </div>
                <div className="notification-body">
                  <p><strong>{notification.user.name}</strong> - {notification.content}</p> {/* Hiển thị tên người dùng và nội dung */}
                </div>
              </div>
            ))
          ) : (
            <p>Không có thông báo mới trong 2 ngày gần đây.</p> 
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
