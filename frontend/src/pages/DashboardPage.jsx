// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import {
//   getAllFilesAdmin,
//   getAllUsers,
//   getSystemAlerts,
// } from '../api/api';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   FileBarChart,
//   Users,
//   AlertTriangle,
//   Signal,
//   FileBarChart2,
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from 'recharts';

// const Dashboard = () => {
//   const [fileCount, setFileCount] = useState(0);
//   const [userCount, setUserCount] = useState(0);
//   const [alerts, setAlerts] = useState([]);
//   const [uploadTrendData, setUploadTrendData] = useState([]);
//   const [signupTrendData, setSignupTrendData] = useState([]);
//   const [fileSizeData, setFileSizeData] = useState([]);
//   const [chartRange, setChartRange] = useState('weekly');
//   const [signupChartRange, setSignupChartRange] = useState('weekly');
//   const [systemOnline, setSystemOnline] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   console.log("Dashboard rendered");

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const pingSystem = async () => {
//       try {
//         await getAllUsers(token);
//         setSystemOnline(true);
//       } catch (err) {
//         setSystemOnline(false);
//       }
//     };

//     pingSystem();
//     const interval = setInterval(pingSystem, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const fetchData = async () => {
//       try {
//         const fileRes = await getAllFilesAdmin(token);
//         const files = fileRes.data.files || [];
//         setFileCount(files.length);

//         const now = new Date();
//         const fileBuckets = {};
//         const sizeBuckets = {
//           '< 100 KB': 0,
//           '100–500 KB': 0,
//           '500KB – 1MB': 0,
//           '> 1MB': 0,
//         };

//         for (let i = 6; i >= 0; i--) {
//           const d = new Date(now);
//           d.setDate(now.getDate() - i);
//           const label = d.toLocaleDateString('en-US', { weekday: 'short' });
//           fileBuckets[label] = 0;
//         }

//         files.forEach((file) => {
//           const uploaded = new Date(file.uploadedAt);
//           const label = uploaded.toLocaleDateString('en-US', { weekday: 'short' });
//           if (label in fileBuckets) fileBuckets[label]++;

//           const sizeKB = file.size / 1024;
//           if (sizeKB < 100) sizeBuckets['< 100 KB']++;
//           else if (sizeKB < 500) sizeBuckets['100–500 KB']++;
//           else if (sizeKB < 1024) sizeBuckets['500KB – 1MB']++;
//           else sizeBuckets['> 1MB']++;
//         });

//         setUploadTrendData(Object.entries(fileBuckets).map(([day, uploads]) => ({ day, uploads })));
//         setFileSizeData(Object.entries(sizeBuckets).map(([bucket, count]) => ({ bucket, count })));

//         const userRes = await getAllUsers(token);
//         const users = userRes.data.users || [];
//         setUserCount(users.length);

//         const userBuckets = {};
//         if (signupChartRange === 'weekly') {
//           for (let i = 6; i >= 0; i--) {
//             const d = new Date(now);
//             d.setDate(now.getDate() - i);
//             const label = d.toLocaleDateString('en-US', { weekday: 'short' });
//             userBuckets[label] = 0;
//           }

//           users.forEach((u) => {
//             const created = new Date(u.createdAt);
//             const label = created.toLocaleDateString('en-US', { weekday: 'short' });
//             if (label in userBuckets) userBuckets[label]++;
//           });
//         } else if (signupChartRange === 'monthly') {
//           for (let i = 29; i >= 0; i--) {
//             const d = new Date(now);
//             d.setDate(now.getDate() - i);
//             const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//             userBuckets[label] = 0;
//           }

//           users.forEach((u) => {
//             const created = new Date(u.createdAt);
//             const label = created.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//             if (label in userBuckets) userBuckets[label]++;
//           });
//         } else if (signupChartRange === 'yearly') {
//           for (let i = 11; i >= 0; i--) {
//             const d = new Date(now);
//             d.setMonth(now.getMonth() - i);
//             const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
//             userBuckets[label] = 0;
//           }

//           users.forEach((u) => {
//             const created = new Date(u.createdAt);
//             const label = created.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
//             if (label in userBuckets) userBuckets[label]++;
//           });
//         }

//         setSignupTrendData(Object.entries(userBuckets).map(([day, count]) => ({ day, count })));

//         const alertRes = await getSystemAlerts(token);
//         setAlerts(alertRes.data.alerts.slice(0, 3));
//       } catch (err) {
//         console.error('Dashboard load error:', err);
//       }
//     };

//     fetchData();
//   }, [chartRange, signupChartRange]);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
//       <Sidebar />
//       <main className="ml-20 lg:ml-64 w-full px-6 py-10 space-y-10 animate-fade-in">
//         <div className="flex items-center justify-between">
//           <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
//             📊 Dashboard Overview
//           </h1>
//           <div>
//             <span className="relative inline-flex items-center gap-2 px-4 py-1 rounded-full font-medium bg-green-900 text-green-400">
//               <span className="relative flex h-3 w-3">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
//               </span>
//               Online
//             </span>
//           </div>
//         </div>

//         <p className="text-slate-400 text-lg">
//           Welcome back, <span className="font-semibold text-white">{user?.name}</span>!
//         </p>

//         {/* Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[
//             {
//               icon: <FileBarChart className="w-6 h-6 animate-pulse" />,
//               label: 'Files Uploaded',
//               value: fileCount,
//               bgColor: 'bg-blue-900/50',
//               textColor: 'text-blue-400',
//               borderColor: 'border-blue-600',
//               shadowColor: 'hover:shadow-blue-600/40',
//               valueColor: 'text-blue-500',
//             },
//             {
//               icon: <Users className="w-6 h-6 animate-pulse" />,
//               label: 'Total Users',
//               value: userCount,
//               bgColor: 'bg-indigo-900/50',
//               textColor: 'text-indigo-400',
//               borderColor: 'border-indigo-500',
//               shadowColor: 'hover:shadow-indigo-500/40',
//               valueColor: 'text-indigo-500',
//             },
//           ].map(({ icon, label, value, bgColor, textColor, borderColor, shadowColor, valueColor }) => (
//             <div
//               key={label}
//               className={`bg-slate-900 p-6 rounded-2xl border ${borderColor} shadow-lg transition transform hover:scale-105 ${shadowColor}`}
//             >
//               <div className={`flex items-center gap-3 mb-4 ${textColor}`}>
//                 <div className={`${bgColor} p-2 rounded-full`}>{icon}</div>
//                 <h2 className="text-lg font-semibold">{label}</h2>
//               </div>
//               <p className={`text-5xl font-bold ${valueColor}`}>{value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Upload Trend Chart */}
//         <section className="bg-slate-900 p-6 rounded-2xl border border-cyan-500/20 shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-cyan-400">📈 Upload Trend ({chartRange})</h2>
//             <select
//               value={chartRange}
//               onChange={(e) => setChartRange(e.target.value)}
//               className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1"
//             >
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={uploadTrendData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//               <XAxis dataKey="day" stroke="#94a3b8" />
//               <YAxis stroke="#94a3b8" allowDecimals={false} />
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
//                 labelStyle={{ color: '#38bdf8' }}
//                 itemStyle={{ color: '#38bdf8' }}
//               />
//               <Line type="monotone" dataKey="uploads" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </section>

//         {/* Signups Over Time Chart */}
//         <section className="bg-slate-900 p-6 rounded-2xl border border-emerald-500/20 shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-emerald-400">📅 User Signups Over Time</h2>
//             <select
//               value={signupChartRange}
//               onChange={(e) => setSignupChartRange(e.target.value)}
//               className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1"
//             >
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={signupTrendData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//               <XAxis dataKey="day" stroke="#94a3b8" />
//               <YAxis stroke="#94a3b8" allowDecimals={false} />
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
//                 labelStyle={{ color: '#34d399' }}
//                 itemStyle={{ color: '#34d399' }}
//                 cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}
//               />
//               <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </section>

//         {/* File Size Distribution */}
//         <section className="bg-slate-900 p-6 rounded-2xl border border-fuchsia-500/30 shadow-md">
//           <h2 className="text-xl font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
//             <FileBarChart2 className="w-5 h-5" /> File Size Distribution
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={fileSizeData} barSize={30} barCategoryGap="30%">
//               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//               <XAxis dataKey="bucket" stroke="#94a3b8" />
//               <YAxis stroke="#94a3b8" allowDecimals={false} />
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
//                 labelStyle={{ color: '#f0abfc' }}
//                 itemStyle={{ color: '#f0abfc' }}
//                 cursor={{ fill: 'rgba(240, 171, 252, 0.1)' }}
//               />
//               <Bar dataKey="count" fill="url(#fileGradient)" radius={[6, 6, 0, 0]} />
//               <defs>
//                 <linearGradient id="fileGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#f0abfc" stopOpacity={1} />
//                   <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
//                 </linearGradient>
//               </defs>
//             </BarChart>
//           </ResponsiveContainer>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  getAllFilesAdmin,
  getAllUsers,
  getSystemAlerts,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FileBarChart,
  Users,
  FileBarChart2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard = () => {
  const [fileCount, setFileCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [uploadTrendData, setUploadTrendData] = useState([]);
  const [signupTrendData, setSignupTrendData] = useState([]);
  const [fileSizeData, setFileSizeData] = useState([]);
  const [chartRange, setChartRange] = useState('weekly');
  const [signupChartRange, setSignupChartRange] = useState('weekly');
  const [systemOnline, setSystemOnline] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const pingSystem = async () => {
      try {
        await getAllUsers(token);
        setSystemOnline(true);
      } catch (err) {
        setSystemOnline(false);
      }
    };
    pingSystem();
    const interval = setInterval(pingSystem, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const fileRes = await getAllFilesAdmin(token);
        const files = fileRes.data.files || [];
        setFileCount(files.length);

        const now = new Date();
        const fileBuckets = {};
        const sizeBuckets = {
          '< 100 KB': 0,
          '100–500 KB': 0,
          '500KB – 1MB': 0,
          '> 1MB': 0,
        };

        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const label = d.toLocaleDateString('en-US', { weekday: 'short' });
          fileBuckets[label] = 0;
        }

        files.forEach((file) => {
          const uploaded = new Date(file.uploadedAt);
          const label = uploaded.toLocaleDateString('en-US', { weekday: 'short' });
          if (label in fileBuckets) fileBuckets[label]++;

          const sizeKB = file.size / 1024;
          if (sizeKB < 100) sizeBuckets['< 100 KB']++;
          else if (sizeKB < 500) sizeBuckets['100–500 KB']++;
          else if (sizeKB < 1024) sizeBuckets['500KB – 1MB']++;
          else sizeBuckets['> 1MB']++;
        });

        setUploadTrendData(Object.entries(fileBuckets).map(([day, uploads]) => ({ day, uploads })));
        setFileSizeData(Object.entries(sizeBuckets).map(([bucket, count]) => ({ bucket, count })));

        const userRes = await getAllUsers(token);
        const users = userRes.data.users || [];
        setUserCount(users.length);

        const userBuckets = {};
        if (signupChartRange === 'weekly') {
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            userBuckets[label] = 0;
          }

          users.forEach((u) => {
            const created = new Date(u.createdAt);
            const label = created.toLocaleDateString('en-US', { weekday: 'short' });
            if (label in userBuckets) userBuckets[label]++;
          });
        } else if (signupChartRange === 'monthly') {
          for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            userBuckets[label] = 0;
          }

          users.forEach((u) => {
            const created = new Date(u.createdAt);
            const label = created.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            if (label in userBuckets) userBuckets[label]++;
          });
        } else if (signupChartRange === 'yearly') {
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setMonth(now.getMonth() - i);
            const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            userBuckets[label] = 0;
          }

          users.forEach((u) => {
            const created = new Date(u.createdAt);
            const label = created.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (label in userBuckets) userBuckets[label]++;
          });
        }

        setSignupTrendData(Object.entries(userBuckets).map(([day, count]) => ({ day, count })));

        const alertRes = await getSystemAlerts(token);
        setAlerts(alertRes.data.alerts.slice(0, 3));
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    };

    fetchData();
  }, [chartRange, signupChartRange]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <Sidebar />
      <main className="w-full ml-0 lg:ml-64 px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
            📊 Dashboard Overview
          </h1>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-green-900 text-green-400 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            Online
          </span>
        </div>

        <p className="text-slate-400 text-sm sm:text-base">
          Welcome back, <span className="font-semibold text-white">{user?.name}</span>!
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{
            icon: <FileBarChart className="w-5 h-5 animate-pulse" />,
            label: 'Files Uploaded',
            value: fileCount,
            bg: 'bg-blue-900/50',
            color: 'text-blue-400',
            border: 'border-blue-600',
            valueColor: 'text-blue-500'
          }, {
            icon: <Users className="w-5 h-5 animate-pulse" />,
            label: 'Total Users',
            value: userCount,
            bg: 'bg-indigo-900/50',
            color: 'text-indigo-400',
            border: 'border-indigo-500',
            valueColor: 'text-indigo-500'
          }].map(({ icon, label, value, bg, color, border, valueColor }) => (
            <div key={label} className={`bg-slate-900 p-5 rounded-xl border ${border} shadow-md`}>
              <div className={`flex items-center gap-3 mb-2 ${color}`}>
                <div className={`${bg} p-2 rounded-full`}>{icon}</div>
                <h2 className="text-lg font-medium">{label}</h2>
              </div>
              <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Upload Trend */}
        <section className="bg-slate-900 p-5 rounded-xl border border-cyan-500/30 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-cyan-400">📈 Upload Trend</h2>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="uploads" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Signup Trend */}
        <section className="bg-slate-900 p-5 rounded-xl border border-emerald-500/30 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-emerald-400">📅 User Signups</h2>
            <select
              value={signupChartRange}
              onChange={(e) => setSignupChartRange(e.target.value)}
              className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* File Size Distribution */}
        <section className="bg-slate-900 p-5 rounded-xl border border-fuchsia-500/30 shadow-md">
          <h2 className="text-lg font-semibold text-fuchsia-400 mb-3 flex items-center gap-2">
            <FileBarChart2 className="w-5 h-5" /> File Size Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fileSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="bucket" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="count" fill="url(#fileGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="fileGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0abfc" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
