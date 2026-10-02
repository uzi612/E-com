import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-slate-800 animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 space-x-3">
      <Loader2 className="w-6 h-6 text-slate-800 animate-spin" />
      <span className="text-gray-500 text-sm font-medium">{message}</span>
    </div>
  );
};

export default Loader;
