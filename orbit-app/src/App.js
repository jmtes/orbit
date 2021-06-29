import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import './App.css';
import AppShell from './AppShell';
import { AuthProvider } from './context/AuthContext';
import { FetchProvider } from './context/FetchContext';
import FourOFour from './pages/FourOFour';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';

const Account = lazy(() => import('./pages/Account'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Settings = lazy(() => import('./pages/Settings'));
const Users = lazy(() => import('./pages/Users'));

const AuthenticatedRoute = ({ children, ...props }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...props}
      render={() =>
        isAuthenticated() ? (
          <AppShell>{children}</AppShell>
        ) : (
          <Redirect to="/" />
        )
      }
    ></Route>
  );
};

const AdminRoute = ({ children, ...props }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Route
      {...props}
      render={() =>
        isAuthenticated() && isAdmin() ? (
          <AppShell>{children}</AppShell>
        ) : (
          <Redirect to="/" />
        )
      }
    ></Route>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <AuthenticatedRoute path="/dashboard">
          <Dashboard />
        </AuthenticatedRoute>
        <AdminRoute path="/inventory">
          <Inventory />
        </AdminRoute>
        <AuthenticatedRoute path="/account">
          <Account />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/settings">
          <Settings />
        </AuthenticatedRoute>
        <AdminRoute path="/users">
          <Users />
        </AdminRoute>
        <Route path="*">
          <FourOFour />
        </Route>
      </Switch>
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FetchProvider>
          <div className="bg-gray-100">
            <AppRoutes />
          </div>
        </FetchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
