import React, { useState, useEffect } from 'react';
import './css/Dashboard.css'; // Assuming the CSS is in App.css or the appropriate file
import axios from 'axios';

const Dashboard = () => {
    const [Id, setId] = useState('');
    const [tableData, setTableData] = useState([]);
    const [editId, setEditId] = useState(null); // Track which ID is being edited
    const [editName, setEditName] = useState(''); // Track edited name
    const [editDesc, setEditDesc] = useState(''); // Track edited description
    const [showAddUserForm, setShowAddUserForm] = useState(false); // Track whether to show add user form
    const [newId, setNewId] = useState(''); // Track new user ID
    const [newName, setNewName] = useState(''); // Track new user Name
    const [newDesc, setNewDesc] = useState(''); // Track new user Description
    const [showGetDataByIdForm, setShowGetDataByIdForm] = useState(false); // Track whether to show get data by ID form

    const getAllData = async () => {
        try {
            const response = await axios.get('https://localhost:7236/api/firstApi');
            setTableData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getDataById = async () => {
        try {
            const response = await axios.get(`https://localhost:7236/api/firstApi/${Id}`);
            setTableData([response.data]);
            setShowGetDataByIdForm(false); // Hide the form after fetching
            setId(''); // Reset the ID input field
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteDataById = async (id) => {
        try {
            await axios.delete(`https://localhost:7236/api/firstApi/${id}`); // Make sure to use DELETE
            setTableData(prevData => prevData.filter(item => item.id !== id)); // Remove deleted item from state
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const updateDataById = async (id) => {
        try {
            const updatedData = { id, name: editName, description: editDesc, path: "" };
            await axios.put(`https://localhost:7236/api/firstApi/update/${id}`, updatedData);
            setTableData(prevData => prevData.map(item => (item.id === id ? updatedData : item)));
            setEditId(null); // Exit edit mode
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    const addUser = async () => {
        try {
            const newUser = { name: newName, description: newDesc, path: "" };
            const response = await axios.post('https://localhost:7236/api/firstApi', newUser); // Add user
            setTableData(prevData => [...prevData, response.data]); // Add new user to state
            resetAddUserForm(); // Reset form fields after adding
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const resetAddUserForm = () => {
        setShowAddUserForm(false);
        setNewId('');
        setNewName('');
        setNewDesc('');
    };

    useEffect(() => {
        getAllData();
    }, []);


    return (
        <div>
            <input type="checkbox" id="nav-toggle" />
            <div className="sidebar">
                <div className="sidebar-brand">
                    <h2>
                        <span className="lab la-accusoft"></span>
                        <span>ITeos</span>
                    </h2>
                </div>

                <div className="sidebar-menu">
                    <ul>
                        <li>
                            <a href="#" className="active">
                                <span className="las la-igloo"></span>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="las la-users"></span>
                                <span>Customers</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="las la-clipboard-list"></span>
                                <span>Projects</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="las la-circle"></span>
                                <span>Accounts</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="las la-clipboard-list"></span>
                                <span>Task</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="main-content">
                <header>
                    <h2>
                        <label htmlFor="nav-toggle">
                            <span className="las la-bars"></span> Dashboard
                        </label>
                    </h2>
                    <div className="search-wrapper">
                        <span className="las la-search"></span>
                        <input type="search" placeholder="Search Here" />
                    </div>

                    <div className="user-wrapper">
                        <img src={require("../assets/Iteos.jpeg")} className='logo' width="30px" height="30px" alt="logo" />
                        {/*<img src="Iteos.jpeg" width="30px" height="30px" alt="" />*/}
                        <div>
                            <h4>Pushpak</h4>
                            <small>Super Admin</small>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="cards">
                        <div className="card-single">
                            <div>
                                <h1>54</h1>
                                <span>Customers</span>
                            </div>
                            <div>
                                <span className="las la-users"></span>
                            </div>
                        </div>

                        <div className="card-single">
                            <div>
                                <h1>54</h1>
                                <span>Customers</span>
                            </div>
                            <div>
                                <span className="las la-users"></span>
                            </div>
                        </div>

                        <div className="card-single">
                            <div>
                                <h1>79</h1>
                                <span>Projects</span>
                            </div>
                            <div>
                                <span className="las la-clipboard-list"></span>
                            </div>
                        </div>

                        <div className="card-single">
                            <div>
                                <h1>124</h1>
                                <span>Orders</span>
                            </div>
                            <div>
                                <span className="las la-shopping-bag"></span>
                            </div>
                        </div>
                    </div>

                    <div className="recent-grid">
                        <div className="projects">
                            <div className="card">
                                <div className="card-header">
                                    <h2>All Users</h2>
                                    <button>Create New User <span className="las la-user"></span></button>
                                </div>

                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td>Id</td>
                                                    <td>User Name</td>
                                                    <td>User Description</td>
                                                    <td>Images</td>
                                                    <td>Options</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>
                                                            {editId === item.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={editName}
                                                                    onChange={(e) => setEditName(e.target.value)}
                                                                />
                                                            ) : (
                                                                item.name
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editId === item.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={editDesc}
                                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                                />
                                                            ) : (
                                                                item.description
                                                            )}
                                                        </td>
                                                        <td>
                                                            {/*C:\Users\kambl\source\repos\WebApplication1\WebApplication1\Uploads\*/}
                                                            {editId === item.id ? (
                                                                <img src={`Uploads/${item.path}`} alt={item.path} />
                                                            ) : (
                                                                item.path
                                                            )}
                                                        </td>

                                                        <td>
                                                            {editId === item.id ? (
                                                                 /*<button>Create New User <span className="las la-user"></span></button>*/

                                                                <button className="btn btn-success" onClick={() => updateDataById(item.id)}>Save</button>
                                                            ) : (
                                                                <>
                                                                    <button className="btn btn-warning p-2 m-2 " onClick={() => {
                                                                        setEditId(item.id);
                                                                        setEditName(item.name);
                                                                        setEditDesc(item.description);
                                                                        }}>Update</button>

                                                                    <button className="btn btn-danger p-2 m-2" onClick={() => deleteDataById(item.id)}>Delete</button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="customers"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
