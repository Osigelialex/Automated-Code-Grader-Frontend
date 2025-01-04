import React from 'react';

export default function QuickStatistic({ 
  heading, 
  value,
  trend = 0,
}: { 
  heading: string;
  value: number;
  trend?: number;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">
          {heading}
        </h3>
        
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {value}
          </span>
          
          {trend !== 0 && (
            <span className={`text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>

        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}