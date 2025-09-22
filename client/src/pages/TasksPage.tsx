import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckSquare, Plus, Search } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your tasks with intelligent hierarchical organization.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Task Management
          </CardTitle>
          <CardDescription>
            Your tasks are organized hierarchically: Project/Committee → Objective/Group → Instrument/Subgroup → Task/Theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Task Management System
            </h3>
            <p className="text-gray-600 mb-6">
              Create, track, and manage tasks with automatic sequential code generation and search capabilities.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Hierarchical task organization</p>
              <p>• Automatic task code generation</p>
              <p>• Search by task name or code</p>
              <p>• Excel import support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}