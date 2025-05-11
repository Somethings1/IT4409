import React, { useState,useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { cn } from "../../utils/utils.jsx";
import { useAuth } from '../../components/introduce/useAuth.jsx';
import axios from 'axios';

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
  // const [submissionData] = useState({ percentChange: "12.5%", totalRevenueToday: "250,000", state: "increase" });
  
    const [submissionData, setSubmissionData] = useState({
    percentChange: "0%",
    totalRevenueToday: "0",
    totalRevenue:"0",
    state: "increase",
  });
  const [streakData] = useState({ profitToday: 0, profitYesterday: 0, percentChange: "0%", message: "increase" });
  const [problemData,setProblemData] = useState({ problemToday: 0, problemYesterday: 0, percentChange: "0%", state: "increase" });
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
  
  const [recentActivity, setRecentActivity] = useState([
    { date: "2024-07-28", type: "feed-item-success", detail: "Đã giải bài <a href='#'>'Two Sum'</a> (Thành công)" },
  ]);

  
  // const user = { name: "Test User" };
  const { user, loading } = useAuth();
  
  // console.log("user",user)
    
 useEffect(() => {
const fetchSubmissionData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!user || !user._id) return;

    const [submissionRes, problemRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/submissions`, {
        params: {
          filter: `user.id:${user._id}`,
          page: 4,
          pageSize: 100,
        },
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${import.meta.env.VITE_API_URL}/problems`, {
        headers: { Authorization: `Bearer ${token}` },
      
      }),
    ]);

    const allSubmissions = submissionRes.data.data.result;
    const allProblems = problemRes.data.data.result;

    const today = new Date().toISOString().split('T')[0];
    console.log("today ".today)

    const todaySubmissions = allSubmissions.filter(sub => sub.createdAt.startsWith(today));
    const todayProblems = allProblems.filter(prob => prob.createdAt.startsWith(today));

    const activities = allSubmissions.map(sub => ({
      date: sub.createdAt.slice(0, 10),
      type: sub.status === "ACCEPTED" ? "feed-item-success" : "feed-item-danger",
      detail: `Đã submit bài <a href='#'>${sub.problem?.title || "Không rõ tên bài"}</a> (${sub.status})`,
    }));

    console.log("todaysub", activities)
    setRecentActivity(activities);
    console.log("todaysub", allSubmissions)
    setSubmissionData({
      totalRevenueToday: todaySubmissions.length,
      percentChange: calculatePercentChange(todaySubmissions.length, submissionRes.data.data.meta.total),
      totalRevenue: submissionRes.data.data.meta.total,
    });

    setProblemData({
      problemToday: todayProblems.length,
      problemYesterday: problemRes.data.data.meta.total,
      percentChange: calculatePercentChange(todayProblems.length, problemRes.data.data.meta.total),
    });

  } catch (error) {
    console.error('Error fetching submission data:', error);
  }
};


    fetchSubmissionData();
  }, [loading,user]);

  const calculatePercentChange = (rightTestcase, totalTestcase) => {
    if (totalTestcase === 0) return "0%";
    return `${((rightTestcase / totalTestcase) * 100).toFixed(2)}%`;
  };

  const formatRevenue = (rightTestcase) => {
    return `$${(rightTestcase * 50000).toLocaleString()}`;
  };

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
              <div className="card-number">{submissionData.totalRevenueToday}</div>
              <p className="card-description"><span class="highlight">{renderChangeBadge(submissionData.percentChange)}</span>  so với hôm qua</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Streak đạt được</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">{streakData.profitToday}</div>
              <p className="card-description"><span class="highlight">{renderChangeBadge(streakData.percentChange)}</span> so với hôm qua</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Bài toán mới</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">{problemData.problemToday}</div>
              <p className="card-description"><span class="highlight">{renderChangeBadge(problemData.percentChange)}</span> so với hôm qua</p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Tổng bài giải</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="card-number">{problemData.problemYesterday}</div>
              <p className="card-description">Tổng bài giải</p>
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
        {/* <AvatarImage 
  src="https://github.com/shadcn.png" 
  alt="User Avatar" 
  style={{ borderRadius: "50%" }}
   className="avatar"
/> */}
                <img 
                  src="https://github.com/shadcn.png" 
                  alt="User Avatar" 
                  className="avatar"
                />



               
                </Avatar>
              <div>
                <h2 className="profile-name">{user ? user.name : 'Chưa có tên'}</h2>
                <p className="profile-join-date">
                  Ngày tham gia: {user ? new Date(user.joinDate).toLocaleDateString() : 'Chưa có ngày tham gia'}
                </p>
                <p className="profile-rank">Xếp hạng: Cao Thủ</p>
              </div>

              </div>

              {/* Thêm thông tin bổ sung */}
              <div className="profile-additional-info">
                <div className="profile-stat-row">
                  <p className="profile-stat">Số bài đã giải: 567</p>
                  <p className="profile-stat">Streak hiện tại: {streakData.profitToday}</p>
                </div>
                <div className="profile-stat-row">
                  <p className="profile-stat">Bài nộp gần đây:{submissionData.totalRevenue} </p>
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
                {recentActivity.slice(0, 10).map((item, index) => (
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
