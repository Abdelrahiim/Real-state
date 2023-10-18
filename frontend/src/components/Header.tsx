import {Link, NavLink, useNavigate} from "react-router-dom"
import {FaSearch} from "react-icons/fa"
import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {FormEvent, useEffect, useState} from "react";


const Header = () => {
  const {currentUser} = useSelector((state: RootState) => state.user)
  const [searchTerm,setSearchTerm] = useState<string>("")
  const navigate = useNavigate()
  const handleSubmit = async (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("searchTerm",searchTerm)
    const searchQuery=  urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm")
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])
  return (
    <header className={"bg-slate-200 shadow-md mb-4"}>
      <nav className={"flex justify-between items-center gap-x-4 max-w-6xl mx-auto p-3"}>
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Infinity</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form onSubmit={handleSubmit} className={"bg-slate-100 px-2 py-2 rounded-lg flex  items-center"}>
          <input
            type='text'
            placeholder='Search...'
            id={"search"}
            className='bg-transparent border-0 focus:outline-none border-lg  w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className={"flex justify-between items-center gap-4"}>
          <li className={"hidden sm:inline text-slate-700 hover:underline"}><NavLink
            className={({isActive}) => (isActive ? "underline" : "")} to={"/"}>Home</NavLink></li>
          <li className={"hidden sm:inline text-slate-700  hover:underline"}><NavLink
            className={({isActive}) => (isActive ? "underline" : "")} to={"about"}>About</NavLink></li>
          <li className={"text-slate-700 hover:underline"}>
            {currentUser ? <Link to={"profile"}>
                <img className={"rounded-full w-9 h-9 object-cover"} src={currentUser.avatar} alt={"Profile Pic"}/>
              </Link> :

              <NavLink
                className={({isActive}) => (isActive ? "underline" : "")}
                to={"sign-up"}>Sign Up</NavLink>
            }

          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header
