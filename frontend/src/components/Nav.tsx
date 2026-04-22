import { Link } from "react-router-dom"

const Nav = () => {

    return (
        <header>
            <nav className='w-full bg-red-500/60 flex justify-between gap-4 items-center p-2'>
                <Link to="/">Home</Link>
                <div className="flex gap-4">
                    <Link to={{ pathname: "/auth", search: "?mode=login" }}>Auth</Link>
                    <Link to="/tasks">Tasks</Link>
                    <Link to="/profile/1">Profile</Link>
                </div>
            </nav>
        </header>
    )
}

export default Nav