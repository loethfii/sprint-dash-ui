import React, { useState } from 'react';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="w-full max-w-105 bg-white rounded-4xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 p-8 sm:p-10 flex flex-col items-center">
      {/* Logo & Header */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/assets/logo-bg-removed.png" className="w-20 h-20" alt="logo" />
        <span className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
          Sprint Dash
        </span>
      </div>

      {/* Greetings */}
      <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] text-center mb-1">
        Selamat Datang
      </h1>
      <p className="text-sm text-slate-500 text-center mb-8">
        Masuk ke Sprint Dash Anda
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Username/Email Input */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 bg-[#f5f6fa] border border-slate-200/60 rounded-xl px-4 py-3.5 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Email atau Nama Pengguna"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-slate-800 placeholder-slate-400"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 bg-[#f5f6fa] border border-slate-200/60 rounded-xl px-4 py-3.5 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-200">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-slate-800 placeholder-slate-400"
              required
            />
          </div>
          <a
            href="#forgot"
            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors text-right mt-2.5 self-end"
          >
            Lupa kata sandi?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#3d3ff3] hover:bg-[#2c2ed6] active:scale-[0.98] text-white text-sm font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-600/10 transition-all duration-200 mt-2"
        >
          Masuk
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-xs text-slate-500 flex items-center">
        <span>Belum punya akun?</span>
        <a
          href="#register"
          className="font-semibold text-[#b87c31] hover:text-[#9c6321] transition-colors ml-1"
        >
          Buat akun gratis
        </a>
      </div>
    </div>
  );
}
