import { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import LoginModal from './intro.js'
import './main.css'
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

import logo from "./img/computer-coding-icons-set_1284-37673-removebg-preview.png"

function Main(){
   const [a,setA]= useState(0)
   const handle=(x)=>{setA(x)}
   const location = useLocation();
   const storedUser = Cookies.get("user");
   let user = null;
 
   
   if (storedUser) {
     try {
       const decodedString = decodeURIComponent(storedUser);
       user = JSON.parse(decodedString);
     } catch (error) {
       console.error("Không thể giải mã hoặc phân tích dữ liệu người dùng:", error);
     }
   }
   if (user) {
       console.log(user)
     // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
     return <Navigate to="/home" replace />;
   }
  return(<>
  {a==1&&<LoginModal off={handle} isSignup={false}/>}
  {a==2&&<LoginModal off={handle} isSignup={true}/>}
  <div 
  style={a!=0?{opacity:0.3}:{}}
  className="main">
   <header>
       <div className="logo"><img style={{height:"112px",position:"absolute",top:"0px",left:"30%", borderRadius :"50%"}} src={logo}/>LEET CODE</div>
       <div className="auth-buttons">
           <button className="btn"
           onClick={()=>{setA(1)
           }}
           >Đăng nhập</button>
           <button className="btn"
           onClick={()=>{
           setA(2)
           }}
           >Đăng ký</button>
       </div>
   
   </header>
{
   <section className="content" style={{ color: "white"}}>

       <p>Chào mừng đến với trang web của chúng tôi! Đây là nơi giới thiệu các tính năng và dịch vụ mà chúng tôi cung cấp.</p>
   </section> }

   </div>
   </>) 
}
export default Main