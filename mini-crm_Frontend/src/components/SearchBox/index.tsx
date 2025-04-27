import { IoIosSearch } from "react-icons/io";
const SearchBox = () => {
    return (
        <div className="searchBox position-relative d-flex align-items-center justify-content-center">
        <IoIosSearch className="mr-2 " />
        <input type="text" placeholder="Search" className="search-input" />
    </div>
    
    );
};

export default SearchBox;
