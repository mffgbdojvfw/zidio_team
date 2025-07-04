
import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white animate-fade-in">
      <Sidebar />

      <main className="ml-20 lg:ml-64 w-full px-6 py-10 space-y-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 flex items-center gap-3 animate-slide-down">
          👤 User Profile
        </h1>

        {user ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User ID */}
            <div className="bg-slate-900 p-6 rounded-xl border border-blue-600 shadow-lg hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="flex items-center gap-4 mb-2 text-blue-400">
                <User className="w-6 h-6" />
                <h2 className="text-lg font-semibold">User ID</h2>
              </div>
              <p className="text-sm text-slate-300 break-all">{user.userId || user.id}</p>
            </div>

            {/* Email */}
            <div className="bg-slate-900 p-6 rounded-xl border border-green-500 shadow-lg hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="flex items-center gap-4 mb-2 text-green-400">
                <Mail className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Email</h2>
              </div>
              <p className="text-sm text-slate-300 break-all">{user.email}</p>
            </div>

            {/* Role */}
            <div className="bg-slate-900 p-6 rounded-xl border border-purple-500 shadow-lg hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="flex items-center gap-4 mb-2 text-purple-400">
                <Shield className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Role</h2>
              </div>
              <p className="text-sm text-slate-300 capitalize">{user.role}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-lg animate-slide-down mt-10">
            ⚠️ No user data available. Please log in.
          </p>
        )}
      </main>
    </div>
  );
};

export default UserProfile;

