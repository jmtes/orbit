import React, { createContext, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('token') || null;
    const expiresAt = localStorage.getItem('expiresAt') || null;
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {};

    return {
      token,
      expiresAt,
      userInfo,
    };
  });

  const setAuthInfo = ({ token, expiresAt, userInfo }) => {
    // Using local storage to persist auth state is frowned upon because LS is
    // very susceptible to XSS. It's better to use HTTP-only cookies, but for
    // now we're going with LS just to get things going.
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    setAuthState({ token, expiresAt, userInfo });
  };

  const isAuthenticated = () => {
    if (!authState.token || !authState.expiresAt) return false;

    return new Date().getTime() / 1000 < authState.expiresAt;
  };

  const isAdmin = () => {
    return authState.userInfo.role === 'admin';
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userInfo');

    // Clear auth state
    setAuthState({ token: null, expiresAt: null, userInfo: {} });

    // Redirect to homepage
    history.push('/');
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState: authInfo => setAuthInfo(authInfo),
        isAuthenticated,
        isAdmin,
        logout,
      }}
    >
      {children}
    </Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw Error('useAuth must be used within an AuthProvider');

  return context;
};

export { AuthContext, AuthProvider, useAuth };
