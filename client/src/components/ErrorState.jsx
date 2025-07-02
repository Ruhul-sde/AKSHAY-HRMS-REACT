import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ error, onRetry }) => (
  <div className="bg-white rounded-xl border border-red-200 p-6">
    <div className="flex items-start gap-4">
      <div className="bg-red-100 p-3 rounded-lg">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default React.memo(ErrorState);