"use client";

import React, { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/admin";
import { LoginButton } from "./submit-button";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action] = useActionState(login, {
    error: null,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-50">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-medium">IN</span>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Logo</h1>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-600 text-sm">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {state.error}
          </div>
        )}

        <form action={action}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="w-full px-4 py-3 rounded-md 
                  border border-gray-200
                  bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                  hover:border-gray-300
                  transition-colors duration-200"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-md 
                    border border-gray-200
                    bg-white text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                    hover:border-gray-300
                    transition-colors duration-200"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    text-gray-400 hover:text-gray-600
                    transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <LoginButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
