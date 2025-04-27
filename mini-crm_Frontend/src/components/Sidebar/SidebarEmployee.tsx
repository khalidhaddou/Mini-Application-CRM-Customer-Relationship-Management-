import react from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Mycontext } from '../../App';

 const SidebarEmployee = () => {
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
            <Link to={"CompanyTable"}>
                <Button className={`w-100 ${activeTab === 1 ? "active" : ""}`}  onClick={() => isOpenSubmenu(1)}>
                 <span className='icon'><MdMessage/></span>
                 Companies
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"ColleagueTable"}>
                <Button className={`w-100 ${activeTab === 2 ? "active" : ""}`}  onClick={() => isOpenSubmenu(2)}>
                 <span className='icon'><MdMessage/></span>
                 Colleagues
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
            <li>
            <Link to={"MonProfile"}>
                <Button className={`w-100 ${activeTab === 6 ? "active" : ""}`} onClick={() => isOpenSubmenu(6)} >
                 <span className='icon'><IoMdNotifications /></span>
                 My account
                 <span className='arrow'><FaAngleRight /></span>
                 
                </Button>
                </Link>
            </li>
          
          </ul>
          <br/>
        
         </div>

        </>
    )
 }
 export default SidebarEmployee;