import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Eye } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600 mt-2">
          Visualize your meetings and tasks in calendar and Gantt chart views.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar & Gantt Views
          </CardTitle>
          <CardDescription>
            Visual representation of meetings and task timelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Visual Planning Tools
            </h3>
            <p className="text-gray-600 mb-6">
              View your meetings and tasks in calendar format with Gantt chart visualization.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Calendar view for meetings</p>
              <p>• Gantt chart for task timelines</p>
              <p>• Proper date parsing and display</p>
              <p>• Interactive timeline management</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}