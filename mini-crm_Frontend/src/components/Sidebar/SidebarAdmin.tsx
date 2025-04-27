import react from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { AiFillWindows } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { PiUserListBold } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { RiChatHistoryFill } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Mycontext } from '../../App';

 const SidebarAdmin = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const context = useContext(Mycontext);

    const isOpenSubmenu = (index: number) => {
        if (activeTab === index) {
            setIsToggleSubmenu(!isToggleSubmenu); // Toggle only the current submenu
        } else {
            setActiveTab(index);  // Set active tab
            setIsToggleSubmenu(true); // Open the new submenu
        }
    };
    return (
        <>
         <div className={`sidebar ${context.isToggleSidebar ? "toggle" : ""}`}>
          <ul>
            
            <li>
            <Link to={"/"}>
                <Button  className={`w-100 ${activeTab === 0 ? "active" : ""}`}   onClick={() => isOpenSubmenu(0)} >
                 <span className='icon'>< MdDashboard /></span>
                 Dashboard 
                 <span className='arrow'><FaAngleRight /></span>
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"/Company/list"}>
                <Button className={`w-100 ${activeTab === 1 ? "active" : ""}`}  onClick={() => isOpenSubmenu(1)}>
                 <span className='icon'><AiFillWindows/></span>
               Company
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"/Employee/list"}>
                <Button className={`w-100 ${activeTab === 2 ? "active" : ""}`}  onClick={() => isOpenSubmenu(2)}>
                 <span className='icon'><PiUserListBold/></span>
                 Employees
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"/invitation/list"}>
                <Button className={`w-100 ${activeTab === 3 ? "active" : ""}`}  onClick={() => isOpenSubmenu(3)}>
                 <span className='icon'><MdMessage/></span>
                 Invitations
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"/Admin/History"}>
                <Button className={`w-100 ${activeTab === 4 ? "active" : ""}`}  onClick={() => isOpenSubmenu(4)}>
                 <span className='icon'><RiChatHistoryFill /></span>
                 History
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"/Admin/list"}>
                <Button className={`w-100 ${activeTab === 5 ? "active" : ""}`}  onClick={() => isOpenSubmenu(5)}>
                 <span className='icon'><RiAdminFill/></span>
                 Administrators
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"/Admin/MyAcount"}>
                <Button className={`w-100 ${activeTab === 6 ? "active" : ""}`} onClick={() => isOpenSubmenu(6)} >
                 <span className='icon'><MdManageAccounts /></span>
                 My account
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
          
          </ul>
          <br/>
          <div className='logoutWrapper'>
            <div className='logoutBox'>
                <Button variant="contained"> <IoIosLogOut />Déconnexion
                   </Button>
            </div>

          </div>
         </div>

        </>
    )
 }
 export default SidebarAdmin;