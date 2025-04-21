import React, { useState, useEffect } from 'react';
import { FaRegUser } from "react-icons/fa";
import { FaChild } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import './Profile.css';
import { useAuth } from '../../components/introduce/useAuth.jsx';
import Avatar from '../../components/Avatar/index.js';
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
 
const [image,SetImage]=useState(null)
const [x,SetX]=useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      if (loading) return;
      startLoading();
      const response = await fetch("http://localhost:5000/profile/get_profile", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
      
      if (!response.ok) {
        notify(2,"network is not okay!","Thất bại");}
      const profileData = await response.json();
      
      console.log(profileData)
      stopLoading();
      setData(profileData);
      setNewData(profileData);
    
    };

    fetchProfile();
  }, [loading, x]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    startLoading();
    const response = await fetch("http://localhost:5000/profile/change_profile", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newData }),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const result = await response.json();
    stopLoading();
    if (result.respond === "success") {
      notify(1, 'Cập nhật thông tin cá nhân thành công', 'Thành công');
      setEdit(false);
      setRefresh((prev) => !prev);
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
          {editImage && <ProfilePictureOptions image={data.avatar} reload={() => setRefresh((prev) => !prev)} />}
        </div>

        <div className="profile-info">
          {!edit ? (
            <div className="profile-info__name">{data ? data.name : ""}</div>
          ) : (
            <input
              type="text"
              name="name"
              value={newData ? newData.name : ""}
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
          <li><a href="#"><FaRegUser /> Tài khoản của : {data ? data.id_owner.name : ""}</a></li>
          <li><a href="#"><FaChild /> vị trí : {data ? data.role : ""}</a></li>
          <li><a href="#"><FaCheckSquare /> Quyền : {data ? (data.right ? data.right.permissions.map((p) => p).join(", ") : data.role=="Admin"?"tất cả các quyền":"Không có quyền gì") : ""}</a></li>
          <li><a href="#"><MdEmail /> Email : {data ? data.email : ""}</a></li>
          <li><a href="#"><RiLockPasswordFill /> Mật khẩu :
            {!edit ? (data ? data.password : "") :
              <input
                type="text"
                name="password"
                value={newData ? newData.password : ""}
                onChange={handleEditChange}
              />}
          </a></li>
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
