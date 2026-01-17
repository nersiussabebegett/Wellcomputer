
import React, { useState } from 'react';
import { User, Role } from '../types';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: Role.SALES });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      ...newUser,
      id: `u${Date.now()}`,
      active: true, // Ensuring new users are directly active
      password: 'password123' // Default password for new users
    });
    setNewUser({ name: '', email: '', phone: '', role: Role.SALES });
    setShowForm(false);
  };

  // Restrict roles that can be added by non-Superadmins
  const availableRoles = currentUser.role === Role.SUPERADMIN 
    ? Object.values(Role) 
    : [Role.SALES, Role.ADMIN];

  const inputClass = "w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">User Management Hub</h3>
          <p className="text-sm text-slate-500">Manage staff access and roles across the organization.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add New User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-slide-in">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
              <input 
                required
                className={inputClass}
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                placeholder="Staff Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
              <input 
                required
                type="email"
                className={inputClass}
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
                placeholder="email@wellcomputer.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Role</label>
              <select 
                className={inputClass}
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
              >
                {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 h-[38px]">
              Save & Activate
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Name & Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email} • {user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    user.role === Role.SUPERADMIN ? 'bg-purple-100 text-purple-700' :
                    user.role === Role.OWNER ? 'bg-amber-100 text-amber-700' :
                    user.role === Role.ADMIN ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {currentUser.role === Role.SUPERADMIN || (currentUser.role === Role.ADMIN && user.role === Role.SALES) ? (
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-600 p-2"
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
