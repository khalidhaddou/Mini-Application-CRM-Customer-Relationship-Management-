import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assests/logo.png';
import Button from '@mui/material/Button';
import { MdOutlineMenuOpen } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdMenu } from "react-icons/io";
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import SearchBox from '../SearchBox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { MdDarkMode } from "react-icons/md";
import { Mycontext } from '../../App';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);
    const context = useContext(Mycontext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleMenuOpen = (setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => 
        (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchor(event.currentTarget);
    };

    const handleMenuClose = (setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => {
        setAnchor(null);
    };

    const handleLogout = () => {
        logout(); // Appel à la fonction logout du AuthContext
        navigate('/login'); // Redirection vers la page login
    };

    return (
        <>
            <header className="d-flex align-items-center py-2">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        {/* Logo Section */}
                        <div className="col-sm-2 col-md-2 d-flex align-items-center part1">
                            <Link to="/" className="d-flex align-items-center logo">
                                <img src={logo} alt="Logo" className="logo-img" />
                                <span className="ml-2 d-none d-md-inline">MINI CRM</span>
                            </Link>
                        </div>

                        {context.windowDimensions.width > 992 && (
                            <div className="col-sm-4 d-flex align-items-center part2 pl-4">
                                <Button className="rounded-circle mx-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                    {context.isToggleSidebar === false ? <MdOutlineMenuOpen /> : <IoMdMenu />}
                                </Button>
                                <SearchBox />
                            </div>
                        )}

                        {/* Right Buttons */}
                        <div className="col-sm-6 justify-content-end d-flex align-items-center part3 pl-4">
                            <Button className="rounded-circle mx-2" onClick={() => context.setThemeMode(!context.themeMode)}>
                                {context.themeMode ? <MdDarkMode /> : <CiLight />}
                            </Button>
                          
                            <Button className="rounded-circle mx-2" onClick={handleMenuOpen(setAnchorElNotif)}>
                                <Badge badgeContent={4} color="error">
                                    <IoIosNotificationsOutline />
                                </Badge>
                            </Button>
                            <Menu
                                anchorEl={anchorElNotif}
                                open={Boolean(anchorElNotif)}
                                onClose={handleMenuClose(setAnchorElNotif)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Divider />
                                <MenuItem onClick={handleMenuClose(setAnchorElNotif)}>View all notifications</MenuItem>
                            </Menu>

                            {context.windowDimensions.width < 992 && (
                                <Button className="rounded-circle mx-2" onClick={() => context.openNav()}>
                                    <IoMdMenu />
                                </Button>
                            )}

                            <Button onClick={handleMenuOpen(setAnchorElUser)} className="rounded-circle mx-2">
                                <Avatar alt="User" src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" />
                            </Button>
                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleMenuClose(setAnchorElUser)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem onClick={handleMenuClose(setAnchorElUser)}>
                                    <Avatar /> My account
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleMenuClose(setAnchorElUser)}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElUser)(); handleLogout(); }}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
