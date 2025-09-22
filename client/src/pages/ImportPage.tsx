import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Import</h1>
        <p className="text-gray-600 mt-2">
          Import your meeting and task data from Excel files with intelligent error analysis.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The Excel importer supports specific user formats and validates data for correct committee, project, and task associations.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Excel Import System
          </CardTitle>
          <CardDescription>
            Unified Excel importer with intelligent error analysis and reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Advanced Excel Import
            </h3>
            <p className="text-gray-600 mb-6">
              Import your data with comprehensive validation and error reporting.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>• Unified Excel importer</p>
              <p>• Intelligent error analysis</p>
              <p>• Data validation and correction guidance</p>
              <p>• Support for hierarchical data structure</p>
            </div>
            <Button size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Import Excel File
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excel Format Requirements</CardTitle>
          <CardDescription>
            Your Excel file should follow this column structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• A: Meeting Title</li>
                <li>• B: Committee/Project</li>
                <li>• G: Task/Theme</li>
                <li>• J: Code</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optional Columns:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• K: Objective</li>
                <li>• L: Instrument</li>
                <li>• Date and time columns</li>
                <li>• Participant information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}