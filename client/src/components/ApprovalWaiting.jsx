import React, { useState, useEffect } from 'react';
import { getGameApiUrl } from '../config';

const ApprovalWaiting = ({ requestId, studentName, onApproved, onRejected }) => {
  const [status, setStatus] = useState('pending');
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(getGameApiUrl(`/api/approval/status/${requestId}`));
        
        if (!response.ok) {
          if (response.status === 410) {
            setError('Request expired. Please scan the QR code again.');
            return;
          }
          throw new Error('Failed to check status');
        }

        const data = await response.json();
        setStatus(data.status);

        if (data.status === 'approved') {
          onApproved();
        } else if (data.status === 'rejected') {
          onRejected('Your request was rejected by booth staff.');
        }
      } catch (err) {
        setError('Failed to check approval status. Please try again.');
      }
    };

    // every 2 seconds magrerefresh
    const interval = setInterval(checkStatus, 2000);
    
    // timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setError('Request expired. Please scan the QR code again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [requestId, onApproved, onRejected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4">
      <div className="w-full max-w-lg bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[2.5rem] bg-[#fffef6] p-10 border-4 border-[#b08968] shadow-inner">
          <h1 className="text-[#4a3f2a] text-4xl font-bold mb-6 text-center drop-shadow-sm">
            Waiting for Approval
          </h1>
          
          <div className="text-center mb-6">
            <p className="text-[#6b5b47] text-lg mb-2">
              Hello, <span className="font-bold text-[#4a3f2a]">{studentName}</span>!
            </p>
            <p className="text-[#6b5b47] text-base">
              Please wait while booth staff verifies your registration.
            </p>
          </div>

          <div className="mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fca94c]"></div>
          </div>

          <div className="mb-6 text-center">
            <p className="text-[#8b7355] text-sm mb-2">Time remaining:</p>
            <p className="text-[#4a3f2a] text-2xl font-bold">
              {formatTime(timeRemaining)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[#8b7355] text-sm">
              Make sure you've signed up at our booth before requesting approval.
            </p>
          </div>

          {error && (
            <div className="mt-6 text-red-600 text-center px-4 py-2 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalWaiting;