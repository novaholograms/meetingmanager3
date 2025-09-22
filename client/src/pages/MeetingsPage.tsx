import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Plus, FileText } from 'lucide-react';

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive meeting management with documentation and PDF export capabilities.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting Management
          </CardTitle>
          <CardDescription>
            Create, track, and document meetings with real-time collaboration features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Advanced Meeting Management
            </h3>
            <p className="text-gray-600 mb-6">
              Schedule meetings, track participants, and generate comprehensive documentation.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Meeting scheduling and tracking</p>
              <p>• Real-time editable notes</p>
              <p>• PDF export of meeting summaries</p>
              <p>• Proposal and response management</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}