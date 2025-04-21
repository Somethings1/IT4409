import { Outlet } from "react-router-dom";
import Header from "../../components/Header/index.jsx";
import Sidebar from "../../components/SidebarUser/index.jsx";
import React, { useState,useEffect } from "react";


import "../LayoutUser/index.css"
function LayoutDefault(){
const [size,formSize]=useState(80)
const [chat,setChat]=useState(false)
const [ring2,setRing2]=useState(false)
const change=()=>{
  formSize((a)=>{if(a==80) return 96;else return 80});
}
const ring=()=>{
setRing2(true);
  
}
  return(
    <>
       <Header size={size}/>
       <Sidebar change={change} style={{ height: "100vh", position: "fixed", top: 0, left: 0 }} />
      <main>
     
    
        <div style={{width:`${size}%`,marginLeft:`${100-size}%`,marginTop:"82px"}}>
<Outlet className="main__content"/>
<div id="wrapper">
      

        <div className="image-container2" style={ring2?{animation:"tiltAnimation 1.5s infinite"}:{animation:""}}>
            <div className="support-btn" style={chat?{right:"50px",bottom:"18px",cursor:"pointer"}:{right:"57px",bottom:"18px",cursor:"pointer"}} onClick={()=>{setChat((a)=>!a); setRing2(false)}}>
          
            </div>

        </div>    
    </div>
        </div>
        
      </main>
  
    </>
  )
}

export default LayoutDefault;