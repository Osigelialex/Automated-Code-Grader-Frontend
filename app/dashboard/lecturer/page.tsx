'use client'
import React, { useEffect, useRef, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";
import QuickStatistic from "../components/quick_statistic";

// Define types for chart data
type StatusData = {
  name: string;
  value: number;
};

type ScoreData = {
  range: string;
  count: number;
};

// Define type for the custom label renderer props
type CustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
};

export default function Dashboard() {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // Generate unique IDs for chart components to avoid conflicts
  const pieChartId = React.useId();
  const barChartId = React.useId();

  const statusData: StatusData[] = [
    { name: "Submitted", value: 70 },
    { name: "Pending", value: 20 },
    { name: "Overdue", value: 10 },
  ];

  const scoreData: ScoreData[] = [
    { range: "0-20", count: 2 },
    { range: "20-40", count: 5 },
    { range: "40-60", count: 8 },
    { range: "60-80", count: 12 },
    { range: "80-100", count: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial call
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate pie chart radius based on screen size
  const getPieChartRadius = () => {
    if (dimensions.width < 300) return "50%";
    if (dimensions.width < 400) return "60%";
    if (dimensions.width < 768) return "70%";
    return "80%"; // Larger screens get a bigger pie chart
  };

  // Custom label renderer
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
  }: CustomizedLabelProps) => {
    // For small screens, don't render labels at all
    if (dimensions.width < 300) return null;

    const RADIAN = Math.PI / 180;

    // For medium screens, render simpler labels
    if (dimensions.width < 400) {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={dimensions.width < 350 ? "8" : "10"}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }

    // For larger screens, render full labels
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="py-6 px-4 sm:py-8 sm:px-10 space-y-6 sm:space-y-8 dark:bg-base-200 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-bold text-xl">Welcome to Your Teacher Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Effortlessly manage and grade your students&apos; coding assignments with CheckMate!
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <QuickStatistic heading="Total Assignments" value={15} />
        <QuickStatistic heading="Pending Reviews" value={3} />
        <QuickStatistic heading="Average Class Score" value={78} trend={2} />
        <QuickStatistic heading="Low-Performing Students" value={4} trend={-1} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Assignment Status Pie Chart */}
        <div
          className="bg-base-100 p-3 sm:p-4 rounded-lg shadow-md overflow-hidden"
          ref={chartContainerRef}
        >
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Assignment Status</h2>
          <div className="w-full h-48 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%" key={pieChartId}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={getPieChartRadius()}
                  innerRadius={dimensions.width < 350 ? "20%" : "0%"}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderCustomizedLabel}
                  labelLine={false}
                  isAnimationActive={false}
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`cell-${pieChartId}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    fontSize: dimensions.width < 350 ? '0.7rem' : '0.75rem',
                    paddingTop: '10px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution Bar Chart */}
        <div className="bg-base-100 p-3 sm:p-4 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Score Distribution</h2>
          <div className="w-full h-48 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%" key={barChartId}>
              <BarChart
                data={scoreData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="range"
                  stroke="#6B7280"
                  fontSize="0.75rem"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize="0.75rem"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar
                  dataKey="count"
                  fill="#00C49F"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}