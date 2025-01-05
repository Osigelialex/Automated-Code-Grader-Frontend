import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'January', uv: 85, pv: 78, amt: 82 },
  { name: 'February', uv: 88, pv: 80, amt: 84 },
  { name: 'March', uv: 75, pv: 70, amt: 72 },
  { name: 'April', uv: 90, pv: 85, amt: 87 },
  { name: 'May', uv: 65, pv: 60, amt: 62 },
  { name: 'June', uv: 72, pv: 68, amt: 70 },
  { name: 'July', uv: 95, pv: 92, amt: 94 },
];


const ScoreStatistic = () => {
  return (
    <div className="w-full h-[300px] bg-base-100 rounded-lg p-4">
      <h1 className='font-bold mb-4'>Score Statistic</h1>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#93c5fd" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreStatistic;