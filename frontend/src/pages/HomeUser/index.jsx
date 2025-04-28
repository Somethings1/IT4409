import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { cn } from "../../utils/utils.jsx";
// import { PieChart, Pie, Cell } from 'recharts';
import './HomeUser.css';
// import { PieChart, Pie, Cell, Tooltip } from 'recharts';

// Mảng màu sắc cho từng trạng thái
const pieChartColors = [
  "#ff7300", // Pending
  "#0088FE", // Accepted
  "#00C49F", // Wrong Answer
  "#FFBB28", // Runtime Error
  "#FF8042", // Time Limit Exceeded
];

const Home = () => {
  const [revenueData] = useState({ percentChange: "12.5%", totalRevenueToday: "250,000", state: "increase" });
  const [incomeData] = useState({ profitToday: 120000, profitYesterday: 100000, percentChange: "20%", message: "increase" });
  const [customerData] = useState({ customerToday: 50, customerYesterday: 40, percentChange: "25%", state: "increase" });
  const [chartData] = useState([
    { date: "2025-04-01", easy: 45, medium: 135, hard: 30 },
    { date: "2025-04-02", easy: 60, medium: 158, hard: 40 },
    { date: "2025-04-03", easy: 50, medium: 145, hard: 45 },
    { date: "2025-04-04", easy: 70, medium: 160, hard: 55 },
    { date: "2025-04-05", easy: 65, medium: 155, hard: 53 },
    { date: "2025-04-06", easy: 55, medium: 145, hard: 50 },
    { date: "2025-04-07", easy: 80, medium: 150, hard: 65 },
  ]);
  
  const [topProducts] = useState([
    { name: "Pending", value: 20 },
    { name: "Accepted", value: 150 },
    { name: "Wrong Answer", value: 50 },
    { name: "Runtime Error", value: 30 },
    { name: "Time Limit Exceeded", value: 40 },
  ]);
  
  const [recentActivity] = useState([
    { date: "2024-07-28", type: "feed-item-success", detail: "Đã giải bài <a href='#'>'Two Sum'</a> (Thành công)" },
  ]);
  const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28'];

  const user = { name: "Test User" };

  const renderChangeBadge = (change) => {
    if (!change) return <Badge variant="secondary">Không đổi</Badge>;
    const isPositive = change.startsWith('+') || !change.includes('-');
    return (
      <Badge variant={isPositive ? "success" : "destructive"}>
        {change}
      </Badge>
    );
  };

  return (
    <div className="home-container">
      <div className="home-inner">
        <h1 className="home-title" >Trang chủ</h1>

        <div className="card-grid">
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Bài giải hôm nay</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">{revenueData.totalRevenueToday}</div>
              <p className="card-description"><span class="highlight">{renderChangeBadge(revenueData.percentChange)}</span>  so với hôm qua</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Streak đạt được</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">${incomeData.profitToday}</div>
              <p className="card-description"><span class="highlight">{renderChangeBadge(incomeData.percentChange)}</span> so với hôm qua</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Bài toán mới</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">{customerData.customerToday}</div>
              <p className="card-description"><span class="highlight">{renderChangeBadge(customerData.percentChange)}</span> so với hôm qua</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Tổng bài giải</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">1,234</div>
              <p className="card-description">Tổng bài đã giải</p>
            </CardContent>
          </Card>
        </div>

        <div className="main-grid">
                <div className="chart-section">
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle>Số bài đã giải</CardTitle>
              <CardDescription>Biểu đồ số lượng bài giải theo mức độ khó</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="easy"
                    stroke="#00C853"
                    fill="#00C853"
                    fillOpacity={0.3}
                    name="Dễ"
                  />
                  <Area
                    type="monotone"
                    dataKey="medium"
                    stroke="#FFEB3B"
                    fill="#FFEB3B"
                    fillOpacity={0.3}
                    name="Trung bình"
                  />
                  <Area
                    type="monotone"
                    dataKey="hard"
                    stroke="#FF3D00"
                    fill="#FF3D00"
                    fillOpacity={0.3}
                    name="Khó"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

                <div className="profile-section">
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle>Hồ sơ người dùng</CardTitle>
            </CardHeader>
            <CardContent className="profile-content">
              <div className="profile-header">
                <Avatar
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%' 
                      }}>
                <AvatarImage 
              src="https://github.com/shadcn.png" 
              alt="User Avatar" 
        
                />

                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-join-date">Ngày tham gia: {new Date(user.joinDate).toLocaleDateString()}</p>
                  <p className="profile-rank">Xếp hạng: Cao Thủ</p>
                </div>
              </div>

              {/* Thêm thông tin bổ sung */}
              <div className="profile-additional-info">
                <div className="profile-stat-row">
                  <p className="profile-stat">Số bài đã giải: 567</p>
                  <p className="profile-stat">Streak hiện tại: 23 ngày</p>
                </div>
                <div className="profile-stat-row">
                  <p className="profile-stat">Bài nộp gần đây: 10</p>
                  <p className="profile-stat">Điểm Rep: 999</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        </div>

        <div className="bottom-grid">
        <Card className="card">
          <CardHeader className="card-header">
            <CardTitle>Thống kê tiến trình</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={300} height={300}>
              <Pie
                data={topProducts}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="activity-scroll">
                {recentActivity.map((item, index) => (
                  <div key={index} className={`activity-item ${item.type}`}>
                    <div dangerouslySetInnerHTML={{ __html: item.detail }} />
                    <time className="activity-time">{item.date}</time>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
