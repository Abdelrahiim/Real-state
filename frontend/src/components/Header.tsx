import {Form, Link, NavLink} from "react-router-dom"
import {FaSearch} from "react-icons/fa"

import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";


const Header = () => {
  const {currentUser} = useSelector((state: RootState) => state.user)

  return (
    <header className={"bg-slate-200 shadow-md mb-4"}>
      <nav className={"flex justify-between items-center max-w-6xl mx-auto p-3"}>
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Infinity</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <Form className={"bg-slate-100 p-2 rounded-lg flex items-center"}>
          <FaSearch className={"text-slate-600"}/>
          <input type="text" placeholder={"Search ...."}
                 className={"bg-transparent pl-2 focus:outline-none w-24 sm:w-64"}/>
        </Form>
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
