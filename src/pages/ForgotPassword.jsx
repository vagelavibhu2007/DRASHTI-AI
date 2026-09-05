import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const navigate = useNavigate();

  // Evaluate password strength
  const evaluatePassword = (pass) => {
    const checks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      digit: /[0-9]/.test(pass),
      special: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(pass),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let label = 'Very Weak';
    let color = 'bg-red-500';
    let percent = 20;

    if (score === 5) {
      label = 'Strong';
      color = 'bg-emerald-500';
      percent = 100;
    } else if (score >= 4) {
      label = 'Good';
      color = 'bg-sky-500';
      percent = 80;
    } else if (score >= 3) {
      label = 'Fair';
      color = 'bg-amber-500';
      percent = 60;
    } else if (score >= 2) {
      label = 'Weak';
      color = 'bg-orange-500';
      percent = 40;
    }

    return { checks, score, label, color, percent };
  };

  const passEval = evaluatePassword(newPassword);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered official email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.forgotPassword(email.trim().toLowerCase());
      if (res.token) {
        setResetToken(res.token);
      }
      setInfoMsg(res.message || 'Password reset token generated.');
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Could not find an account associated with this email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!resetToken.trim()) {
      setErrorMsg('Reset token is required.');
      return;
    }

    if (passEval.score < 4) {
      setErrorMsg('New password must meet at least 4 security criteria.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.resetPassword({
        token: resetToken.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setStep(3);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to reset password. The token may be expired or invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gov-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10">
        <Link to="/login" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-700/80 border border-sky-400/30 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white">DRISHTI AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Security Recovery
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Authorized Credential Recovery Portal
            </p>
          </div>
        </Link>

        <Link
          to="/login"
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      {/* Main Box */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {/* STEP 1: Request Reset */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400 mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Password Recovery</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered official email address to initiate statutory security reset.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRequestToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. officer@gov.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] disabled:opacity-60 transition shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Token</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Set New Password */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Reset Account Password</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter the recovery token and specify your new secure password.
                </p>
              </div>

              {infoMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Reset Token / Key
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter security token"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {newPassword && (
                    <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Strength:</span>
                        <span className={`font-bold ${
                          passEval.label === 'Strong' ? 'text-emerald-400' :
                          passEval.label === 'Good' ? 'text-sky-400' :
                          passEval.label === 'Fair' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {passEval.label}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passEval.color} transition-all duration-300`}
                          style={{ width: `${passEval.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60 transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Password Reset Complete</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your account password has been updated securely. You can now sign in with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-500 transition flex items-center justify-center gap-2"
              >
                <span>Return to Secure Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto text-center text-xs text-slate-500 border-t border-slate-800/60 pt-4 z-10">
        DRISHTI AI • Ministry of Statistics and Programme Implementation (MoSPI) • Government of India
      </div>
    </div>
  );
};

export default ForgotPassword;
