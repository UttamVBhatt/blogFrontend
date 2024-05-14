import { createContext, useContext, useState } from "react";

/* eslint-disable*/
const AuthContext = createContext();

export const useAuthController = () => useContext(AuthContext);

function AuthController({ children }) {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const BASE_URL = "https://blogbackend-8joh.onrender.com";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthController;
