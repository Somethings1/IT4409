import React, { useState, useEffect } from 'react';
import { FaRegUser, FaChild, FaCheckSquare } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import './Profile.css';
import { useAuth } from '../../components/introduce/useAuth.jsx';
import Avatar from '../../components/Avatar/index.jsx';
import { useLoading } from '../../components/introduce/Loading.jsx';
import ProfilePictureOptions from './image.jsx';
import { notify } from '../../components/Notification/notification.jsx';

function Profile() {
  const CLOUD_NAME = "ddgrjo6jr";
  const UPLOAD_PRESET = "my-app";
  const { user, logout, loading } = useAuth();
  const [edit, setEdit] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [data, setData] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const [newData, setNewData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (loading) return;
      startLoading();
      const token = localStorage.getItem('token');
      const response = await fetch(import.meta.env.VITE_API_URL + "/auth/account", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        notify(2, "network is not okay!", "Thất bại");
        stopLoading();
        return;
      }

      const result = await response.json();
      stopLoading();
      setData(result.data);
      setNewData(result.data);
    };

    fetchProfile();
  }, [loading, refresh]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    startLoading();
    const token = localStorage.getItem('token');

    const bodyToSend = {
      user: {
        ...newData,
        ...(newPassword && { password: newPassword }),
      },
    };

    const response = await fetch(import.meta.env.VITE_API_URL + "/profile/change_profile", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyToSend),
    });

    const result = await response.json();
    stopLoading();

    if (response.ok && result.respond === "success") {
      notify(1, 'Cập nhật thông tin cá nhân thành công', 'Thành công');
      setEdit(false);
      setRefresh(prev => !prev);
      setNewPassword("");
    } else {
      notify(2, "Không thể cập nhật thông tin", "Thất bại");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src="https://bcp.cdnchinhphu.vn/334894974524682240/2022/12/5/dhbkhn-6920-1658994052-1-16702134834751920701721.jpg"
          alt="Profile Banner"
          className="banner"
        />
        <div>
          <div className="profile-picture" onClick={() => setEditImage((prev) => !prev)}>
            <div className='uy-avatar' style={{ cursor: "pointer" }}>
              {data ? <Avatar name={data.name} imageUrl={data.avatar} /> : ""}
            </div>
          </div>
          {editImage && <ProfilePictureOptions image={data?.avatar} reload={() => setRefresh(prev => !prev)} />}
        </div>

        <div className="profile-info">
          {!edit ? (
            <div className="profile-info__name">{data?.name}</div>
          ) : (
            <input
              type="text"
              name="name"
              value={newData?.name || ""}
              onChange={handleEditChange}
            />
          )}

          {edit ? (
            <>
              <button className="message-btn" onClick={saveChanges}>Lưu</button>
              <button className="message-btn" onClick={() => setEdit(false)} style={{ marginLeft: "10px" }}>Thoát</button>
            </>
          ) : (
            <button className="message-btn" onClick={() => setEdit(true)}>Edit profile</button>
          )}
        </div>
      </div>

      <div className="connect-section">
        <div>Thông tin cá nhân</div>
        <ul>
          <li><FaRegUser /> Tên người dùng: {data?.name}</li>
          <li><FaChild /> Vai trò: {data?.role?.name}</li>
          <li><FaCheckSquare /> Quyền: {
            data?.role?.permissions
              ? data.role.permissions.map(p => p.name).join(", ")
              : "Không có quyền"
          }</li>
          <li><MdEmail /> Email: {data?.email}</li>
          <li>
            <RiLockPasswordFill /> Mật khẩu:
            {edit && (
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            )}
          </li>
        </ul>
      </div>

      <div className="profile-logout">
        <button className="message-btn logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
