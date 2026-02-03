import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, User, Lock, Mail } from 'lucide-react';

interface EmployeeLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function EmployeeLogin({ onLogin, onBack }: EmployeeLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, any credentials work
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-[#000035] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#000035]" />
            </div>
            <h1 className="text-2xl font-bold text-[#000035] mb-2">Employee Portal</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000035] focus:border-transparent outline-none transition-all"
                  placeholder="employee@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000035] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#000035] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#000035] hover:bg-[#000052] text-white py-6 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">Demo Mode</p>
            <p className="text-xs text-blue-600">Use any email and password to login</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          SimplifyMove © 2025 - Employee Portal
        </p>
      </div>
    </div>
  );
}
