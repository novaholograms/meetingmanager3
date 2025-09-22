import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, CheckSquare, Users, FileText, TrendingUp, Clock } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DashboardPage() {
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const { data: recentTasks } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks?limit=5', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
  });

  const { data: upcomingMeetings } = useQuery({
    queryKey: ['upcoming-meetings'],
    queryFn: async () => {
      const response = await fetch('/api/meetings?upcoming=true&limit=5', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch meetings');
      return response.json();
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your meeting management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingTasks || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMeetings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.upcomingMeetings || 0} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
            <CardDescription>
              Your latest task activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks?.slice(0, 5).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.name}</p>
                    <p className="text-xs text-gray-500">Code: {task.code}</p>
                  </div>
                  <Badge variant={
                    task.status === 'completed' ? 'default' :
                    task.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {task.status}
                  </Badge>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No tasks found</p>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/tasks')}
                className="w-full"
              >
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>
              Your scheduled meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings?.slice(0, 5).map((meeting: any) => (
                <div key={meeting.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{meeting.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(meeting.date).toLocaleDateString()}
                      {meeting.startTime && ` at ${meeting.startTime}`}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No upcoming meetings</p>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/meetings')}
                className="w-full"
              >
                View All Meetings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setLocation('/meetings')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Schedule Meeting</span>
            </Button>
            <Button 
              onClick={() => setLocation('/tasks')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <CheckSquare className="h-6 w-6" />
              <span>Create Task</span>
            </Button>
            <Button 
              onClick={() => setLocation('/import')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="h-6 w-6" />
              <span>Import Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}