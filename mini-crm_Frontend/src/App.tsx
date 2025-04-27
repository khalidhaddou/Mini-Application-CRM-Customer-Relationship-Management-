import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import SidebarAdmin from './components/Sidebar/SidebarAdmin';
import SidebarEmployee from './components/Sidebar/SidebarEmployee';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';
import EmployeeRoutes from './routes/EmployeeRoutes';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

const Mycontext = createContext<any>(null);

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [themeMode, setThemeMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: themeMode ? 'light' : 'dark',
      ...(themeMode
        ? {}
        : {
            background: {
              default: '#112143',
              paper: '#112143',
            },
          }),
    },
  });

  const openNav = () => setIsOpenNav(!isOpenNav);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(themeMode ? "light" : "dark");
    localStorage.setItem("themeMode", themeMode ? "light" : "dark");
  }, [themeMode]);

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    windowDimensions,
    openNav,
    isOpenNav,
    setIsOpenNav,
    themeMode,
    setThemeMode,
  };

  const role = user?.role;

  const isExcludedRoute =
    pathname.startsWith("/invitation/validate") ||
    pathname.startsWith("/complete-profile");

  return (
    <ThemeProvider theme={theme}>
      <Mycontext.Provider value={values}>
        {!isAuthenticated ? (
          <PublicRoutes />
        ) : isExcludedRoute ? (
          <PublicRoutes />
        ) : role === 'admin' ? (
          <>
            <Header />
            <div className="main d-flex">
              <div
                className={`sidebarOverlay d-none ${isOpenNav ? 'show' : ''}`}
                onClick={() => setIsOpenNav(false)}
              ></div>
              <div className={`sidebarWrapper ${isToggleSidebar ? 'toggle' : ''}${isOpenNav ? 'open' : ''}`}>
                <SidebarAdmin />
              </div>
              <div className={`content ${isToggleSidebar ? 'toggle' : ''}`}>
                <AdminRoutes />
              </div>
            </div>
          </>
        ) : role === 'employee' ? (
          <>
            <Header />
            <div className="main d-flex">
              <div
                className={`sidebarOverlay d-none ${isOpenNav ? 'show' : ''}`}
                onClick={() => setIsOpenNav(false)}
              ></div>
              <div className={`sidebarWrapper ${isToggleSidebar ? 'toggle' : ''}${isOpenNav ? 'open' : ''}`}>
                <SidebarEmployee />
              </div>
              <div className={`content ${isToggleSidebar ? 'toggle' : ''}`}>
                <EmployeeRoutes />
              </div>
            </div>
          </>
        ) : (
          <Navigate to="/login" />
        )}
      </Mycontext.Provider>
    </ThemeProvider>
  );
}

export default AppWrapper;
export { Mycontext };
