import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    expiresAt: null,
    userInfo: {},
  });

  const setAuthInfo = ({ token, expiresAt, userInfo }) => {
    setAuthState({ token, expiresAt, userInfo });
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState: authInfo => setAuthInfo(authInfo),
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
