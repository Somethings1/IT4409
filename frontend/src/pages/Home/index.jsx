
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/introduce/useAuth.jsx';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, PieChart, Pie, Cell } from 'recharts';
import DOMPurify from 'dompurify';
import './Home.css';

function Home() {
  const { user, loading } = useAuth();
  const [submissions, setSubmissions] = useState({totalsubmit:0, totalToday: 0, percentChange: '0%', state: '' });
  const [problems, setProblems] = useState({ total: 0, easy: 0, medium: 0, hard: 0, percentChange: '0%' });
  // const [users, setUsers] = useState({ activeToday: 0, newToday: 0, percentChange: '0%', state: 'notchange' });
  const [users, setUsers] = useState({
    activeToday: 0,
    newToday: 0,
    percentChange: '0%',
  });
  const [contests, setContests] = useState({ upcoming: 3, percent: '80%' });
  const [activity, setActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);
  const [comments, setComments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('daily');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sample chart data
  const sampleChartData = [
    { name: 'Jan', submissions: 4000, users: 2400, problems: 200 },
    { name: 'Feb', submissions: 3000, users: 1398, problems: 210 },
    { name: 'Mar', submissions: 5000, users: 2800, problems: 220 },
    { name: 'Apr', submissions: 4500, users: 2600, problems: 230 },
    { name: 'May', submissions: 6000, users: 3000, problems: 240 },
    { name: 'Jun', submissions: 5500, users: 2900, problems: 250 },
    { name: 'Jul', submissions: 7000, users: 3200, problems: 260 },
    { name: 'Aug', submissions: 6500, users: 3100, problems: 270 },
    { name: 'Sep', submissions: 8000, users: 3400, problems: 280 },
    { name: 'Oct', submissions: 7500, users: 3300, problems: 290 },
    { name: 'Nov', submissions: 9000, users: 3500, problems: 300 },
    { name: 'Dec', submissions: 8500, users: 3600, problems: 310 },
  ];

  const sampleDifficultyData = [
    { name: 'Easy', value: problems.easy },
    { name: 'Medium', value: problems.medium },
    { name: 'Hard', value: problems.hard },
  ];

  // Sample data for new sections
  const sampleComments = [
    { id: 1, user: 'JohnDoe', content: 'Great problem explanation!', date: '2025-05-01 10:00' },
    { id: 2, user: 'JaneSmith', content: 'Can someone clarify the edge cases?', date: '2025-05-01 09:30' },
  ];

  const sampleRecentSubmissions = [
    { id: 1, user: 'Alice', problem: 'Two Sum', status: 'Accepted', date: '2025-05-01 11:00' },
    { id: 2, user: 'Bob', problem: 'Reverse Linked List', status: 'Wrong Answer', date: '2025-05-01 10:45' },
  ];

  const sampleRecentProblems = [
    { id: 1, title: 'Binary Search', difficulty: 'Easy', date: '2025-05-01' },
    { id: 2, title: 'Longest Substring', difficulty: 'Medium', date: '2025-04-30' },
  ];

//   useEffect(() => {
//     const fetchData = async () => {
//       if (loading || !user) return;
//       setError(null);
//    const fetchProblems = async () => {
//   try {
        // const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:8080/api/v1/problems', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`, // nếu bạn có token
//       },
//     });

//     if (!response.ok) throw new Error('Failed to fetch problems');
//     const data = await response.json();
//     const problems = data.data.result;

//     let easy = 0, medium = 0, hard = 0;

//     problems.forEach(problem => {
//       if (problem.difficulty === 'EASY') easy++;
//       else if (problem.difficulty === 'MEDIUM') medium++;
//       else if (problem.difficulty === 'HARD') hard++;
//     });

//     const total = easy + medium + hard;
//     const percentChange = '0%'; // tính sau nếu cần

//     setProblems({ total, easy, medium, hard, percentChange });
//   } catch (error) {
//     console.error('Error fetching problems:', error);
//     setError('Failed to fetch problems');
//     setProblems({ total: 0, easy: 0, medium: 0, hard: 0, percentChange: '0%' });
//   }
// };

//       const fetchWithErrorHandling = async (url, setState, sampleData, isActivity = false) => {
//         try {
//           const response = await fetch(url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ user, timeFilter }),
//           });
//           if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
//           const data = await response.json();
//           // For activity, ensure data.events is an array; for others, ensure data is an array or object
//           if (isActivity) {
//             setState(Array.isArray(data.events) ? data.events : []);
//           } else {
//             setState(data && Array.isArray(data) ? data : sampleData);
//           }
//         } catch (error) {
//           console.error(`Error fetching ${url}:`, error);
//           setError(`Failed to load data from ${url}. Using sample data.`);
//           setState(sampleData); // Fallback to sample data
//         }
//       };

//       await Promise.all([
//         fetchProblems(), 
        
//       ]);
//     };

//     fetchData();
//   }, [loading, user, timeFilter]);

useEffect(() => {
  const fetchData = async () => {
    if (loading || !user ) return;
    setError(null);
    
    


  const getRecentSubmissionss = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/v1/submissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch submissions');
    const data = await response.json();
    const submissions = data.data.result;
    
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    let totalToday = 0;
    let totalYesterday = 0;
    const recentList = [];
    console.log("submit data",submissions)
    for (const submission of submissions) {
      const date = submission.createdAt.split(' ')[0]; // "yyyy-mm-dd"

      if (date === today) totalToday++;
      else if (date === yesterday) totalYesterday++;

      const subDate = new Date(submission.createdAt);
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);

      if (subDate >= sevenDaysAgo) {
        recentList.push({
          id:submission._id,
          user:submission.user.name,
          date,
          type: submission.status === 'FAILED' ? 'feed-item-error' : 'feed-item-success',
          problem:submission.problem.title,
          detail: `Đã nộp bài <a href='#'>${submission.problem.title}</a> (${submission.status})`,
          status:submission.status,
        });
      }
    }

    const percentChange =
      totalYesterday === 0
        ? '100%'
        : `${(((totalToday - totalYesterday) / totalYesterday) * 100).toFixed(1)}%`;

    const state =
      totalToday === totalYesterday
        ? ''
        : totalToday > totalYesterday
        ? 'increase'
        : 'decrease';

    setSubmissions({ totalsubmit:data.data.meta.total,totalToday, percentChange, state });
    setRecentSubmissions(recentList.slice(0, 10)); // giới hạn 10 item gần nhất
     console.log("submit hhhhhh",recentList)
  } catch (error) {
    console.error('Error fetching comments:', error);
    setComments([]); // Set empty array on error
  }
};
  const getRecentComments = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/v1/comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    const commentsList = data.data.result;
     console.log("commentsList",commentsList)
     console.log("submit",recentSubmissions)
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const filteredComments = commentsList.filter((comment) => {
      const commentDate = new Date(comment.createdAt);
      return commentDate >= sevenDaysAgo;
    });
    console.log("comment",comments)
    setComments(filteredComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    setComments([]); // Set empty array on error
  }
};

   const getRecentProblems = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/v1/problems', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // const responsess = await fetch('http://localhost:8080/api/v1/submissions', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // const datass = await responsess.json();
    // console.log("datas",datass)
    if (!response.ok) throw new Error('Failed to fetch problems');
    const data = await response.json();
    const problemst = data.data.result;

    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const filteredProblemsupdate = problemst.filter((problem) => {
      const problemDate = new Date(problem.updatedAt);
      return problemDate >= sevenDaysAgo;
    });

    const filteredProblems = problemst.filter((problem) => {
      const problemDate = new Date(problem.createdAt);
      return problemDate >= sevenDaysAgo;
    });
    setActivity(filteredProblemsupdate)
    setRecentProblems(filteredProblems);
    console.log("rêcntactivity",activity)
  };

    const fetchDataUser = async () => {
      try {
                const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const usersData = data.data.result;

        // Lọc người dùng mới trong 2 ngày qua
        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 4);

        const newUsers = usersData.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= twoDaysAgo && createdAt <= today;
        });

        // Cập nhật giá trị vào trạng thái
        const newToday = newUsers.length;
        const activeToday = usersData.length;
        const percentChange = activeToday > 0 ? ((newToday / activeToday) * 100).toFixed(2) + '%' : '0%';

        setUsers({
          activeToday,
          newToday,
          percentChange,
        });

      } catch (error) {
        console.error('Error fetching users:', error);
      }};
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
      
        const response = await fetch('http://localhost:8080/api/v1/problems', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch problems');

        const data = await response.json();
        const problemst = data.data.result;

        let easy = 0, medium = 0, hard = 0;
       
        problemst.forEach(problem => {
          if (problem.difficulty === 'EASY') easy++;
          else if (problem.difficulty === 'MEDIUM') medium++;
          else if (problem.difficulty === 'HARD') hard++;
        });
        //  console.log("problems",hard);
        const total = easy + medium + hard;
        const percentChange = easy/total * 100; // tính sau nếu cần

        setProblems({ total, easy, medium, hard, percentChange });
        //  console.log("problems",percentChange);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to fetch problems');
        setProblems({ total: 0, easy: 0, medium: 0, hard: 0, percentChange: '0%' });
      }
    };

    await Promise.all([
      fetchProblems(),
      fetchDataUser(),
      getRecentProblems(),
      getRecentComments(),
      getRecentSubmissionss(),      // Thêm các fetch khác ở đây nếu cần
    ]);
  };

  fetchData();
}, [loading, user, timeFilter]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return <div className="alert alert-warning m-4">Please log in to access the admin dashboard.</div>;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-fluid ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="d-flex">
        {/* Sidebar */}


        {/* Main Content */}
        <div className="flex-grow-1 main-content">
          {/* Dashboard Header */}
          <div className="dashboard-container">
            <div className="dashboard-title">
              <h3>Admin Dashboard</h3>
              <h6>Made by Team 24</h6>
            </div>
            <div className="dashboard-actions">
              <a href="#">Manage</a>
              <a href="#">Add Admin</a>
            </div>
          </div>

          {/* Mobile Sidebar Toggle */}
          <button
            className="btn btn-primary d-md-none mb-3"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Theme Toggle */}
          {/* <button
            className="btn btn-outline-secondary theme-toggle"
            onClick={toggleDarkMode}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button> */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Overview</h3>
            <br>
            </br>
            <div>
              {/* Commented out as per provided code */}
              {/* <select
                className="form-select d-inline-block w-auto"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <a href="#" className="btn btn-primary ms-2">Add Problem</a>
              <a href="#" className="btn btn-secondary ms-2">Manage Contests</a> */}
            </div>
          </div>
{/*
          {error && <div className="alert alert-danger">{error}</div>} */}

          {/* Metrics Cards */}
          <div className="row mb-4">
          {/* <div className="row"> */}
            {/* First Row: Total Submissions and Total Problems */}
            <div className="col-md-6 ">
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="card-title">Total Submissions</h6>
                  <h4 className="text-primary fw-bold">{submissions.totalsubmit}</h4>
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: submissions.percentChange }}
                      aria-valuenow={parseFloat(submissions.percentChange)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small>{submissions.percentChange} {submissions.state}</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="card mb -3">
                <div className="card-body">
                  <h6 className="card-title">Total Problems</h6>
                  <h4 className="text-success fw-bold">{problems.total}</h4>
                <div className="progress" style={{ height: '8px' }}>
  {/* Màu Xanh (Easy) */}
  {/* <div
    className="progress-bar bg-success"
    role="progressbar"
    style={{ width: '33.33%',marginLeft: "0",paddingLeft:"0" }} // Màu xanh chiếm 1/3 thanh
    aria-valuenow={33.33}
    aria-valuemin="0"
    aria-valuemax="100"
  ></div> */}

  {/* Màu Vàng (Medium) */}
  {/* <div
    className="progress-bar bg-warning"
    role="progressbar"
    style={{
      width: '33.33%', // Màu vàng chiếm 1/3 thanh
      marginLeft: '33.33%' // Dịch sang phải bắt đầu từ 33.33%
    }}
    aria-valuenow={66.66}
    aria-valuemin="0"
    aria-valuemax="100"
  ></div> */}

  {/* Màu Đỏ (Hard) */}
  {/* <div
    className="progress-bar bg-danger"
    role="progressbar"
    style={{
      width: '33.33%', // Màu đỏ chiếm 1/3 thanh
      marginLeft: '66.66%' // Dịch sang phải bắt đầu từ 66.66%
    }}
    aria-valuenow={100}
    aria-valuemin="0"
    aria-valuemax="100"
  ></div> */}

                    {/* <div className="progress"> */}
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                     style={{ width: `${problems.percentChange}%` }}

                      aria-valuenow={parseFloat(problems.percentChange)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  {/* </div>  */}
                  
                  </div>


                  <small>Easy: {problems.easy}, Medium: {problems.medium}, Hard: {problems.hard}</small>
                </div>
              </div>
            {/* </div> */}
            </div>

            {/* Second Row: Active Users and Upcoming Contests */}
            {/* <div className="row"> */}
            <div className="col-md-6 ">
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="card-title">Active Users</h6>
                  <h4 className="text-info fw-bold">{users.activeToday}</h4>
                  <div className="progress">
                    <div
                      className="progress-bar bg-info"
                      role="progressbar"
                      style={{ width: users.percentChange }}
                      aria-valuenow={parseFloat(users.percentChange)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small>New: {users.newToday} ({users.percentChange})</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="card-title">Upcoming Contests</h6>
                  <h4 className="text-warning fw-bold">{contests.upcoming}</h4>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: contests.percent }}
                      aria-valuenow={parseFloat(contests.percent)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small>{contests.percent} change</small>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>

          {/* Charts */}
          <div className="row-card-no-pd">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title">Submission Trends</h6>
                </div>
                <div className="card-body chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData.length ? chartData : sampleChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="submissions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="users" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="problems" stroke="#ffc107" fill="#ffc107" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title">Problem Difficulty Distribution</h6>
                </div>
                <div className="card-body chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={difficultyData.length ? difficultyData : sampleDifficultyData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {sampleDifficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#28a745', '#ffc107', '#dc3545'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and User Issues */}
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header">
                  <h6 className="card-title">Recent Activity</h6>
                </div>
                <div className="card-body">
                  <ol className="activity-feed">
                    {Array.isArray(activity) && activity.length ? (
                      activity.map((act, index) => (
                        <li key={index} className={`feed-item ${act.type || ''}`}>
                          <time className="date">
                            {act.updatedAt 
                              ? new Date(act.updatedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Unknown'}
                          </time>
                             <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(act.title || 'No details'),
                            }}
                          />
                        </li>
                      ))
                    ) : (
                      <p className="text-muted">No recent activity.</p>
                    )}
                  </ol>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header">
                  <h6 className="card-title">User Issues</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex mb-3">
                    <div className="flex-grow-1">
                      <h6>Joko Subianto <span className="badge bg-warning">Pending</span></h6>
                      <p className="text-muted">Issue with submission timeout.</p>
                    </div>
                    <small className="text-muted">8:40 PM</small>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="flex-grow-1">
                      <h6>Prabowo Widodo <span className="badge bg-success">Resolved</span></h6>
                      <p className="text-muted">Query about contest rules.</p>
                    </div>
                    <small className="text-muted">1 Day Ago</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Comments */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title">Recent Comments</h6>
                </div>
                <div className="card-body">
                  <ol className="activity-feed">
                    {Array.isArray(comments) && comments.length ? (
                      comments.map((comment) => (
                        <li key={comment.id} className="feed-item">
                          <time className="date">
                            {comment.createdAt 
                              ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Unknown date'}
                          </time>
                          <div>
                            <h6>{comment.user.name || 'Anonymous'}</h6>
                               <h6>
                             
                              {comment.problem?.title && (
                                <span className="badge bg-info ms-2">
                                  {comment.problem.title}
                                </span>
                              )}
                            </h6>
                            <p className="text-muted">
                              {comment.content || comment.body || comment.message || 'No content available'}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted">No recent comments found.</p>
                    )}
                  </ol>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title">Recent Submissions</h6>
                </div>
                <div className="card-body">
                  <ol className="activity-feed">
                    {Array.isArray(recentSubmissions) && recentSubmissions.length ? (
                      recentSubmissions.map((submission) => (
                        <li key={submission.id} className={`feed-item ${submission.status?.toLowerCase() || ''}`}>
                          <time className="date">{submission.date || 'Unknown'}</time>
                          <div>
                            <h6>{submission.user || 'Anonymous'} - {submission.problem || 'Unknown'}</h6>
                            <p className="text-muted">
                              Status: <span className={`badge bg-${submission.status === 'ACCEPTED' ? 'success' : 'danger'}`}>
                                {submission.status || 'Unknown'}
                              </span>
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted">No recent submissions.</p>
                    )}
                  </ol>
                </div>
              </div>
            </div>

            {/* Recent Problems */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title">Recent Problems</h6>
                </div>
                <div className="card-body">
                  <ol className="activity-feed">
                    {Array.isArray(recentProblems) && recentProblems.length ? (
                      recentProblems.map((problem) => (
                        <li key={problem.id} className={`feed-item ${problem.difficulty?.toLowerCase() || ''}`}>
                          <time className="date">{problem.createdAt }</time>
                          <div>
                            <h6>{problem.title || 'Untitled'}</h6>
                            <p className="text-muted">
                              Difficulty: <span className={`badge bg-${problem.difficulty === 'EASY' ? 'success' : problem.difficulty === 'MEDIUM' ? 'warning' : 'danger'}`}>
                                {problem.difficulty || 'Unknown'}
                              </span>
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted">No recent problems.</p>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 LeetCode Admin Dashboard. Made by Team 24.</p>
      </footer>
    </div>
  );
}

export default Home;
