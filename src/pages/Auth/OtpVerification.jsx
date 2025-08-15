import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('otp-email');
    if (!savedEmail) {
      toast.error('No email found. Please login again.');
      navigate('/');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }

    dispatch(verifyOtp({ email, otp })).then((res) => {
      if (res.payload?.success) {
        toast.success('Login successful!');
        navigate('/student');
      } else {
        toast.error(res.payload?.message || 'Invalid OTP');
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Background Image */}
      <img
        src="http://res.cloudinary.com/dkg6vgwit/image/upload/v1755033449/wez1xcu183xr62vztxuq.jpg"
        alt="Verification Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-900/50 to-purple-800/70"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">OTP Verification</h1>
            <p className="text-purple-200">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-white">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
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
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
