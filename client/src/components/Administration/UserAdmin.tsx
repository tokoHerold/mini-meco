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

function checkError(response: Response) {
    if (response.status >= 200 && response.status <= 299) {
        return response;
    } else {
        throw Error(response.statusText);
    }
}

function FilterButton({ options, filter, setFilter }: { options: Array<string>; filter: Array<string>; setFilter: (s: Array<string>) => void }) {
    const [show, setShow] = useState<boolean>(false);
    return (
        <>
            <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button" onClick={() => setShow(!show)}>
                Select status
                <svg className="w-2.5 h-2.5 ms-3" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" /></svg>
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

function Pagination({ pages, page, setPage }: { pages: number; page: number; setPage: React.Dispatch<React.SetStateAction<number>> }) {
    //const left = Math.max(Math.max(page - 2, 0) - (3 - (Math.min(page + 3, pages) - page)), 0);
    const left = Math.max(Math.max(page - 2, 0) + Math.min(page + 3, pages) - page - 3, 0);
    const right = Math.min(Math.max(page - 2, 0) + Math.min(page + 3, pages) - page + 2, pages);

    const buttons = [];
    for (let i = left; i < right; i++) {
        if (page == i) {
            buttons.push(
                <li key={i}>
                    <a onClick={() => setPage(i)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-blue-50 border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{i + 1}</a>
                </li>
            )
        } else {
            buttons.push(
                <li key={i}>
                    <a onClick={() => setPage(i)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{i + 1}</a>
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
        <tr className='bg-gray-50 border-b'>
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

function UserTable() {
    const [page, setPage] = useState<number>(0);
    const [users, setUsers] = useState<Array<User>>(Array());
    const [editing, setEditing] = useState<User | null>(null);
    const [filter, setFilter] = useState<Array<string>>(userStatus);
    const [loading, setLoading] = useState<boolean>(false);

    const USERS_PER_PAGE = 9;

    const usersFiltered = users.filter((user) => filter.includes(user.status));
    const pages: number = Math.max(Math.ceil(usersFiltered.length / USERS_PER_PAGE), 1);

    function fetchUsers() {
        setLoading(true);
        setUsers([]);
        setPage(0);
        fetch(`http://localhost:3000/getUsers`, { method: "GET", headers: { "Content-Type": "application/json" }, })
            .then(checkError)
            .then((response: Response) => response.json())
            .then((us: Array<User>) => setUsers(us))
            .then(() => setLoading(false))
            .catch(console.error);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const rows: Array<any> = [];
    for (let i = (page * USERS_PER_PAGE); i < Math.min((page + 1) * USERS_PER_PAGE, usersFiltered.length); i++) {
        rows.push(<UserRow key={i} user={usersFiltered[i]} onEdit={setEditing}></UserRow>)
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between flex-wrap flex-row space-y-0 pb-4 bg-white'>
                <div>
                    <FilterButton options={userStatus} filter={filter} setFilter={(f) => {setFilter(f); setPage(0);}}></FilterButton>
                </div>
                <div>
                    <button onClick={fetchUsers} type="button" className='text-gray-700 bg-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2'>
                        {loading ? 
                            <svg className="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                            </svg> :
                            "refresh"
                        }
                    </button>
                </div>
            </div>
            <table className='w-full text-left text-sm text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
                    <tr>
                        <th className='px-6 py-3'>username</th>
                        <th className='px-6 py-3'>email</th>
                        <th className='px-6 py-3'>github username</th>
                        <th className='px-6 py-3'>status</th>
                        <th className='px-6 py-3'>edit</th>
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
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full inset-0 h-full flex bg-gray-900/50 text-left">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Edit user
                        </h3>
                    </div>
                    <div className="p-5 space-y-4">
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
                    <div className="flex items-center p-5 border-t border-gray-200 rounded-b">
                        <button onClick={onSave} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save</button>
                        <button onClick={onCancel} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700">Cancel</button>
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