import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestOtp } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const result = await dispatch(requestOtp(email)).unwrap();
      toast.success(result.message || 'OTP sent to your email');
      sessionStorage.setItem('otp-email', email);
      navigate('/otp');
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Background Image */}
      <img
        src="http://res.cloudinary.com/dkg6vgwit/image/upload/v1755033449/wez1xcu183xr62vztxuq.jpg"
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-900/50 to-purple-800/70"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              FACE OF STETHOSCOPE
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                autoFocus
                className="mt-1 block w-full px-4 py-2 rounded-lg shadow-sm bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 
                        0 0 5.373 0 12h4zm2 5.291A7.962 
                        7.962 0 014 12H0c0 3.042 1.135 
                        5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                'Next'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
