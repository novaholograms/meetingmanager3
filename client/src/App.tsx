import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import MeetingsPage from './pages/MeetingsPage';
import CalendarPage from './pages/CalendarPage';
import ImportPage from './pages/ImportPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Switch>
              <Route path="/login" component={LoginPage} />
              <Route path="/">
                <ProtectedRoute>
                  <Layout>
                    <Switch>
                      <Route path="/" component={DashboardPage} />
                      <Route path="/tasks" component={TasksPage} />
                      <Route path="/meetings" component={MeetingsPage} />
                      <Route path="/calendar" component={CalendarPage} />
                      <Route path="/import" component={ImportPage} />
                      <Route>
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                              Page Not Found
                            </h2>
                            <p className="text-gray-600">
                              The page you're looking for doesn't exist.
                            </p>
                          </div>
                        </div>
                      </Route>
                    </Switch>
                  </Layout>
                </ProtectedRoute>
              </Route>
            </Switch>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;