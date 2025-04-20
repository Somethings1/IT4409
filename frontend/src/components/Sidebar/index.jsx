import { Link, useLocation } from "react-router-dom";
import './Sidebar.css';
import { MdOutlineHome } from "react-icons/md";
import { LuClipboardCheck } from "react-icons/lu";

import { useState, useEffect } from "react";



function Sidebar({ change }) {
  const location = useLocation();  // Lấy thông tin đường dẫn hiện tại
  const [selected, setSelected] = useState(1);  // Trạng thái mặc định cho mục được chọn
  const [isExpanded, setIsExpanded] = useState(true);  // Trạng thái cho sidebar có mở rộng hay không
  const [isAddOpen, setIsAddOpen] = useState(false); 

  const toggleAddDropdown = () => {
    console.log(isAddOpen)
    setIsAddOpen(!isAddOpen);
  };
  // Cập nhật trạng thái `selected` dựa trên đường dẫn hiện tại
  useEffect(() => {
    switch (location.pathname) {
      case '/home':
        setSelected(1);
        break;
      case '/home/manage-product':
        setSelected(2);
        break;

      default:
        setSelected(1); // Nếu không khớp với bất kỳ trường hợp nào, thiết lập mặc định là 1
    }
  }, [location.pathname]);

  // Hàm để chuyển đổi kích thước sidebar
  const toggleSidebar = () => {
    change();  // Gọi hàm change từ prop
    setIsExpanded(!isExpanded);  // Đảo ngược trạng thái mở rộng
  };
  return (
    <ul className="sidebar" style={{ width: isExpanded ? "20%" : "4%" }}>
      <div className="logo-header" style={isExpanded ? {} : { display: "flex", justifyContent: "center", alignItems: "center" }}>
        {isExpanded && (
          <a href="/home">
           
          </a>
        )}
        <div className={`sidebar__icon ${!isExpanded ? "add_jus" : ""}`} style={!isExpanded?{marginRight:"0px",cursor:"pointer"}:{cursor:"pointer"}} onClick={toggleSidebar}>
          <svg
            stroke="currentColor"
            fill="black"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </div>
      </div>
      <li className="sidebar__home">
        <Link className={`sidebar__link ${selected === 1 ? 'active' : ''} ${!isExpanded ? "add_jus" : ""}`} style={!isExpanded?{padding:"15px 0px"}:{}} to='/home'>
          <div className="sidebar__icon" style={!isExpanded?{marginRight:"0px"}:{}}><MdOutlineHome /></div>
          {isExpanded && "Home"}
        </Link>
      </li>
      <li className="sidebar__product">
        <Link className={`sidebar__link ${selected === 2 ? 'active' : ''} ${!isExpanded ? "add_jus" : ""}`} style={!isExpanded?{padding:"15px 0px"}:{}} to='/home/manage-product'>
          <div className="sidebar__icon" style={!isExpanded?{marginRight:"0px"}:{}}><LuClipboardCheck /></div>
          {isExpanded && "Quản lí bài tập"}
        </Link>
      </li>
   
    </ul>
  );
}

export default Sidebar;
