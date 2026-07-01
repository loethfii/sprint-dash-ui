import React, { useState } from 'react';
import DashboardShell from './DashboardShell';
import { changePassword } from '../services/api';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingViewPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setIsLoading(true);
    try {
      await changePassword({
        oldPassword,
        password: newPassword,
        confirmPassword
      });
      setSuccess('Kata sandi berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal mengubah kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell activeTab="settings" title="System Settings">
      {(isDarkMode) => (
        <div className={`flex-1 p-8 overflow-y-auto flex flex-col items-center justify-start ${isDarkMode ? 'bg-[#090a0f]' : 'bg-[#f4f6f9]'
          }`}>
          <div className="w-full max-w-md space-y-6 mt-8">
            <div className="text-center space-y-2">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                System Settings
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure your account credentials and security preferences.
              </p>
            </div>

            {/* Change Password Card */}
            <div className={`border rounded-3xl p-6 sm:p-8 shadow-md transition-colors ${isDarkMode
              ? 'bg-[#0d0e12] border-[#232634] text-slate-300'
              : 'bg-white border-slate-200 text-slate-700'
              }`}>
              <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                <Lock className="w-4.5 h-4.5 text-indigo-500" />
                Change Password
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl px-4 py-3 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-xl px-4 py-3 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Old Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-all duration-200 ${isDarkMode
                    ? 'bg-[#151720] border-[#232634] focus-within:border-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500/50'
                    }`}>
                    <input
                      type={showOld ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                    >
                      {showOld ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-all duration-200 ${isDarkMode
                    ? 'bg-[#151720] border-[#232634] focus-within:border-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500/50'
                    }`}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                    >
                      {showNew ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-all duration-200 ${isDarkMode
                    ? 'bg-[#151720] border-[#232634] focus-within:border-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500/50'
                    }`}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                    >
                      {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-600/15 transition-all active:scale-[0.98] disabled:scale-100 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center min-h-10 mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving password...</span>
                    </div>
                  ) : 'Save New Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
