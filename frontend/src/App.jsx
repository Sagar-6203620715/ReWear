import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home"
import { Toaster } from "sonner"
import Login from './pages/Login';
import Register from './pages/Register';
import StartSwapping from './pages/StartSwapping';
import BrowseItems from './pages/BrowseItems';
import ListItem from './pages/ListItem';
import UserDashboard from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';
import ItemDetail from './pages/ItemDetail';
import NotFound from './pages/NotFound';
import AdminLayoutNew from './components/Admin/AdminLayoutNew';
import AdminDashboard from './pages/AdminDashboard';
import UserManagementNew from './components/Admin/UserManagementNew';
import ItemModeration from './components/Admin/ItemModeration';
import AnalyticsNew from './components/Admin/AnalyticsNew';
import { Provider } from "react-redux";
import store from "./redux/store";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute';
import NotAuthorized from './pages/NotAuthorized';

const App = () => {
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`);
        const data = await response.json();
        setBackendHealthy(data.status === "ok");
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendHealth();
    
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          {!backendHealthy && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm md:text-base">
              <strong className="font-bold">Warning: </strong>
              <span className="block sm:inline">ReWear API is not reachable or unhealthy. Some features may not work properly.</span>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/start-swapping" element={<StartSwapping />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/list-item" element={<ListItem />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/item/:itemId" element={<ItemDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/admin/*" element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayoutNew />}>
                <Route index element={<AdminDashboard />} />
                <Route path="moderation" element={<ItemModeration />} />
                <Route path="users" element={<UserManagementNew />} />
                <Route path="analytics" element={<AnalyticsNew />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;