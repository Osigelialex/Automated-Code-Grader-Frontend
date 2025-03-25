'use client'
import { api } from '@/lib/axiosConfig';
import React, { useEffect, useState, useRef } from 'react';
import { IProfile } from '@/app/interfaces/profileInterface';
import Loading from '@/app/loading';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/app/interfaces/errorInterface';
import { toast } from 'sonner';
import QuickStatistic from '../components/quick_statistic';
import { IQuickStats } from '../interfaces/quickstats';
import { IAssignmentStatusData } from "../interfaces/student-assignment-stats";
import { Bell } from 'lucide-react';
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

type StatusData = {
  name: string;
  value: number;
};

type ScoreData = {
  assignment: string;
  score: number;
};

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
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [assignmentStatusData, setAssignmentStatusData] = useState<IAssignmentStatusData>({
    completed: 0, pending: 0, overdue: 0
  })
  const [quickstats, setQuickstats] = useState<IQuickStats>({
    average_score: 0, non_optimal_submissions: 0, pending_assignments: 0, total_submissions: 0
  });

  const pieChartId = React.useId();
  const barChartId = React.useId();

  useEffect(() => {
    // Handle dimensions for chart responsiveness
    const handleResize = () => {
      if (chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileResponse, statsResponse, assignmentStatus] = await Promise.all([
          api.get<IProfile>('/auth/profile'),
          api.get<IQuickStats>('analytics/student-dashboard-quick-stats'),
          api.get<IAssignmentStatusData>('analytics/student-assignment-status')
        ]);

        setProfile(profileResponse.data);
        setQuickstats(statsResponse.data);
        setAssignmentStatusData(assignmentStatus.data);
      } catch (e: unknown) {
        const error = e as AxiosError<ErrorResponse>;
        const errorMessage = error.response?.data.message || 'Failed to load data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const statusData: StatusData[] = [
    { name: "Completed", value: assignmentStatusData.completed },
    { name: "Pending", value: assignmentStatusData.pending },
    { name: "Overdue", value: assignmentStatusData.overdue },
  ];

  const scoreData: ScoreData[] = [
    { assignment: "A1", score: 85 },
    { assignment: "A2", score: 70 },
    { assignment: "A3", score: 92 },
    { assignment: "A4", score: 60 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

  // Calculate pie chart radius based on screen size
  const getPieChartRadius = () => {
    if (dimensions.width < 300) return "50%";
    if (dimensions.width < 400) return "60%";
    if (dimensions.width < 768) return "70%";
    return "80%";
  };

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8 space-y-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="font-bold text-xl">Welcome, {profile?.first_name}</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Keep up the great work on your coding assignments!
          </p>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <Bell size={18} className="text-gray-600 cursor-pointer hover:text-gray-800" />
          <div className="bg-blue-600 w-8 h-8 grid place-items-center text-white text-lg font-semibold rounded-full cursor-pointer">
            {profile?.first_name?.[0]}
          </div>
        </div>
      </div>

      {/* Quick Stats - Improved for mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <QuickStatistic heading="Total Submissions" value={quickstats?.total_submissions} />
        <QuickStatistic heading="Average Score" value={quickstats?.average_score} trend={5} />
        <QuickStatistic heading="Pending Assignments" value={quickstats?.pending_assignments} />
        <QuickStatistic heading="Non-Optimal Submissions" value={quickstats?.non_optimal_submissions} trend={-10} />
      </div>

      {/* Charts Section - Made responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Your Scores by Assignment</h2>
          <div className="w-full h-48 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%" key={barChartId}>
              <BarChart
                data={scoreData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="assignment"
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
                  dataKey="score"
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