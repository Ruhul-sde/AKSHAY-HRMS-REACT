import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="relative">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
    <div className="text-center">
      <span className="text-gray-600 font-medium">{message}</span>
    </div>
  </div>
);

export default React.memo(LoadingState);