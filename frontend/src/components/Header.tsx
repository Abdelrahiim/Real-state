import { Link, NavLink} from "react-router-dom"
import {FaSearch} from "react-icons/fa"

import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {TextInput} from "flowbite-react";


const Header = () => {
  const {currentUser} = useSelector((state: RootState) => state.user)

  return (
    <header className={"bg-slate-200 shadow-md mb-4"}>
      <nav className={"flex justify-between items-center gap-x-4 max-w-6xl mx-auto p-3"}>
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Infinity</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form className={"bg-slate-100 rounded-lg flex  items-center"}>
          <div className={"w-full"}>
          <TextInput
            icon={FaSearch}
            id="search"
            placeholder="Search"
            sizing="md"
            type="text"
            className={"w-full"}
          />
          </div>
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
