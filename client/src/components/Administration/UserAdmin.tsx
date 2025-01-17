import { useState, useEffect } from 'react';
import ReturnButton from "../Components/return";
import "./UserAdmin.css"
import Edit from "./../../assets/Edit.png";

const userStatus = ["unconfirmed", "confirmed", "suspended", "removed"];

interface User {
    id: number;
    email: string;
    name: string;
    githubUsername: string | null;
    status: string;
    password: string;
}

function Pagination({ pages, page, setPage }: { pages: number; page: number; setPage: React.Dispatch<React.SetStateAction<number>> }) {
    //const left = Math.max(Math.max(page - 2, 0) - (3 - (Math.min(page + 3, pages) - page)), 0);
    const left = Math.max(Math.max(page - 2, 0) + Math.min(page + 3, pages) - page - 3, 0);
    const right = Math.min(Math.max(page - 2, 0) + Math.min(page + 3, pages) - page + 2, pages);

    const buttons = [];
    for (let i = left; i < right; i++) {
        if (page == i) {
            buttons.push(
                <li>
                    <a key={i} onClick={() => setPage(i)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-blue-50 border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{i + 1}</a>
                </li>
            )
        } else {
            buttons.push(
                <li>
                    <a key={i} onClick={() => setPage(i)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{i + 1}</a>
                </li>
            )
        }
    }

    return (
        <nav className="flex items-center flex-wrap flex-row justify-between pt-4 select-none">
            <ul className="inline-flex -space-x-px text-sm h-8">
                <li>
                    {page > 0 ? (
                        <a onClick={() => setPage(page - 1)} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">Previous</a>
                    ) : (
                        <a className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:text-gray-500">Previous</a>
                    )}
                </li>
                {buttons}
                <li>
                    {page < pages - 1 ? (
                        <a onClick={() => setPage(page + 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">Next</a>
                    ) : (
                        <a className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-gray-100 border border-gray-300 rounded-e-lg hover:text-gray-500">Next</a>
                    )}
                </li>
            </ul>
        </nav>
    )
}

function UserRow({ user, onEdit }: { user: User; onEdit: (u: User) => void }) {
    return (
        <tr className='bg-white border-b hover:bg-gray-50'>
            <td className='px-6 py-4'>{user.name}</td>
            <td className='px-6 py-4'>{user.email}</td>
            <td className='px-6 py-4'>{user.githubUsername ? user.githubUsername : "N/A"}</td>
            <td className='px-6 py-4'>{user.status}</td>
            <td className='px-6 py-4'>
                <img className="w-5 h-5"src={Edit} onClick={() => onEdit(user)}></img>
            </td>
        </tr>
    );
}

function FilterButton({ options, filter, setFilter }: { options: Array<string>; filter: Array<string>; setFilter: (s: Array<string>) => void }) {
    const [show, setShow] = useState<boolean>(false);
    return (
        <>
            <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button" onClick={() => setShow(!show)}>
                Select status
                <svg className="w-2.5 h-2.5 ms-3" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" /></svg>
            </button>
            { show && 
                <div className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow" style={{ position: "absolute" }}>
                    <ul className="p-3 space-y-3 text-sm text-gray-700">
                        <li>
                            <div className="flex items-center">
                                <input type="checkbox" checked={filter.length == options.length} onChange={e => e.target.checked && setFilter(options)}className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                                <label className="ms-2 text-sm font-medium text-gray-900">all</label>
                            </div>
                        </li>
                    </ul>
                    <ul className="p-3 space-y-3 text-sm text-gray-700">
                        {options.map((option) => { return (
                                <li>
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={filter.includes(option)} onChange={e => e.target.checked ? setFilter(filter.concat(option)) : setFilter(filter.filter(f => f != option))}className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"/>
                                        <label className="ms-2 text-sm font-medium text-gray-900">{option}</label>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            }
        </>
    );
}

function checkError(response: Response) {
    if (response.status >= 200 && response.status <= 299) {
        return response;
    } else {
        throw Error(response.statusText);
    }
}

function UserTable() {
    const [page, setPage] = useState<number>(0);
    const [users, setUsers] = useState<Array<User>>(Array());
    const [editing, setEditing] = useState<User | null>(null);
    const [filter, setFilter] = useState<Array<string>>(userStatus);

    function fetchUsers() {
        setUsers([]);
        setPage(0);
        fetch(`http://localhost:3000/getUsers`, { method: "GET", headers: { "Content-Type": "application/json" }, })
            .then(checkError)
            .then((response: Response) => response.json())
            .then((us: Array<User>) => setUsers(us))
            .catch(console.error);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const usersFiltered = users.filter((user) => filter.includes(user.status));

    const USERS_PER_PAGE = 9;
    const pages: number = Math.max(Math.ceil(usersFiltered.length / USERS_PER_PAGE), 1);


    const rows: Array<any> = [];
    for (let i = (page * USERS_PER_PAGE); i < Math.min((page + 1) * USERS_PER_PAGE, usersFiltered.length); i++) {
        rows.push(<UserRow user={usersFiltered[i]} onEdit={setEditing}></UserRow>)
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between flex-wrap flex-row space-y-0 pb-4 bg-white'>
                <div>
                    <FilterButton options={userStatus} filter={filter} setFilter={(f) => {setFilter(f); setPage(0);}}></FilterButton>
                </div>
                <div>
                    <button onClick={fetchUsers} type="button" className='text-gray-700 bg-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2'>
                        refresh
                    </button>
                </div>
            </div>
            <table className='w-full text-left text-sm text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th className='px-6 py-3'>username</th>
                        <th className='px-6 py-3'>email</th>
                        <th className='px-6 py-3'>github username</th>
                        <th className='px-6 py-3'>status</th>
                        <th className='px-6 py-3'></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
            {usersFiltered.length === 0 && <span>No users found</span>}
            <Pagination pages={pages} page={page} setPage={setPage}></Pagination>
            {editing !== null && <UserEdit user={editing} onClose={(update) => {setEditing(null); update && fetchUsers()}} />}
        </div>
    );
}

function UserEdit({ user, onClose }: { user: User; onClose: (update: boolean) => void}) {
    const [email, setEmail] = useState<string>(user.email);
    const [githubUsername, setGithubUsername] = useState<string>(user.githubUsername || "");
    const [status, setStatus] = useState<string>(user.status);
    const [password, setPassword] = useState<string>();

    function onSave() {
        const promises = []
        if(githubUsername && githubUsername !== user.githubUsername){
            promises.push(fetch(`http://localhost:3000/settings/addGitHubUsername`, 
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "email": user.email, "newGithubUsername": githubUsername })
                })
                .then(checkError)
                .catch(console.error));
        }
        if(status !== user.status){
            promises.push(fetch(`http://localhost:3000/updateUserStatus`, 
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "email": user.email, "status": status })
                })
                .then(checkError)
                .catch(console.error));
        }
        if(password){
            promises.push(fetch(`http://localhost:3000/settings/changePassword`, 
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "email": user.email, "password": password })
                })
                .then(checkError)
                .catch(console.error));
        }

        Promise.all(promises).then(() => 
            email !== user.email ?
                fetch(`http://localhost:3000/settings/changeEmail`, 
                    { 
                        method: "POST", 
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ "newEmail": email, "oldEmail": user.email })
                    })
                    .then(checkError)
                    .catch(console.error) : null).then(() => onClose(true));
    }

    function onCancel() {
        onClose(false);
    }

    return (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full flex bg-gray-900/50 text-left">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Edit user
                        </h3>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <form onSubmit={onSave}>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                                <input value={user.name} disabled={true} className="bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">GitHub Username</label>
                                <input value={githubUsername} onChange={e => setGithubUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                                    <option>unconfirmed</option>
                                    <option>confirmed</option>
                                    <option>suspended</option>
                                    <option>removed</option>
                                </select>
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button onClick={onSave} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                        <button onClick={onCancel} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function UserAdmin() {

    return (
        <>
            <ReturnButton />
            <div className="DashboardContainer">
                <h1>User Admin</h1>
            </div>
            <div className="BigContainerUserAdmin">
                <UserTable />
            </div>
        </>
    );
}