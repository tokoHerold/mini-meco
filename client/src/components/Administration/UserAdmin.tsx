import "./UserAdmin.css"

import { useState } from 'react';

import ReturnButton from "../Components/return";
import Table from "../Components/Table";

import Edit from "./../../assets/Edit.png";
import Email from "./../../assets/EmailIcon.png";


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

function UserEdit({ user, onClose }: { user: User; onClose: (update: boolean) => void }) {
    const [email, setEmail] = useState<string>(user.email);
    const [githubUsername, setGithubUsername] = useState<string>(user.githubUsername || "");
    const [status, setStatus] = useState<string>(user.status);
    const [password, setPassword] = useState<string>();

    function onSave() {
        const promises = []
        if (githubUsername && githubUsername !== user.githubUsername) {
            promises.push(fetch(`http://localhost:3000/settings/addGitHubUsername`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "email": user.email, "newGithubUsername": githubUsername })
                })
                .then(checkError)
                .catch(console.error));
        }
        if (status !== user.status) {
            promises.push(fetch(`http://localhost:3000/updateUserStatus`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "email": user.email, "status": status })
                })
                .then(checkError)
                .catch(console.error));
        }
        if (password) {
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

const UserAdmin = () => {
    const [users, setUsers] = useState<Array<User>>(Array());
    const [editing, setEditing] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    function fetchUsers() {
        setLoading(true);
        fetch(`http://localhost:3000/getUsers`, { method: "GET", headers: { "Content-Type": "application/json" }, })
            .then(checkError)
            .then((response: Response) => response.json())
            .then((us: Array<User>) => setUsers(us))
            .then(() => setLoading(false))
            .catch(console.error);
    }

    function sendConfirmationEmail(user: User) {
        fetch(`http://localhost:3000/sendConfirmationEmail`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "email": user.email })
            })
            .then(checkError)
            .catch(console.error)
    }

    const tableData = users.map(user => [
        user.name,
        user.email,
        user.githubUsername ? user.githubUsername : "N/A",
        user.status,
        <div className="flex flex-row gap-3">
            <img className="h-5" src={Edit} title="edit" onClick={() => setEditing(user)}></img>
            {user.status === "unconfirmed" && <img className="h-5" src={Email} title="send confirmation email" onClick={() => sendConfirmationEmail(user)}></img>}
        </div>
    ]);

    return (
        <>
            <ReturnButton />
            <div className="DashboardContainer">
                <h1>User Admin</h1>
            </div>
            <div className="BigContainerUserAdmin">
                <Table
                    headings={["username", "email", "github username", "status", "action"]}
                    loading={loading}
                    loadData={fetchUsers}
                    data={tableData}
                    rowsPerPage={9}
                    filterOptions={{ key: 3, options: userStatus }}
                />
            </div>
            {editing !== null && <UserEdit user={editing} onClose={(update) => { setEditing(null); update && fetchUsers(); }} />}
        </>
    );
}

export default UserAdmin;