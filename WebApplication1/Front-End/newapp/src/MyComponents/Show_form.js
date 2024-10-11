import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios

const ShowForm = () => {
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
            const updatedData = { id, name: editName, description: editDesc , path:""};
            await axios.put(`https://localhost:7236/api/firstApi/update/${id}`, updatedData);
            setTableData(prevData => prevData.map(item => (item.id === id ? updatedData : item)));
            setEditId(null); // Exit edit mode
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    const addUser = async () => {
        try {
            const newUser = { name: newName, description: newDesc , path: ""};
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

    return (
        <div className="container">
            
            <div className="col-12">
                <div>
                    <h1>User Data</h1>
                </div>
                <button className="btn btn-primary m-3" type="button" onClick={getAllData}>Get All Data</button>
                <button className="btn btn-primary m-3" type="button" onClick={() => setShowGetDataByIdForm(!showGetDataByIdForm)}>
                    {showGetDataByIdForm ? 'Cancel' : 'Get Data By ID'}
                </button>
                <button className="btn btn-success m-3" type="button" onClick={() => setShowAddUserForm(!showAddUserForm)}>
                    {showAddUserForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {showGetDataByIdForm && ( // Show Get Data By ID Form
                <form className="row g-3 needs-validation mt-4" noValidate>
                    <div className="col-md-4">
                        <label htmlFor="getId" className="form-label">Enter User ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="getId"
                            value={Id}
                            onChange={(e) => setId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary m-3" type="button" onClick={getDataById}>Submit</button>
                    </div>
                </form>
            )}

            {showAddUserForm && ( // Show Add User Form
                <form className="row g-3 needs-validation mt-4" noValidate>
                    
                    <div className="col-md-4">
                        <label htmlFor="newName" className="form-label">New User Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="newDesc" className="form-label">New User Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="newDesc"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary m-3" type="button" onClick={() => addUser()}>Submit</button>
                    </div>
                </form>
            )}

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Images</th>
                        <th>Actions</th> {/* Add Actions header */}
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
    );
};

export default ShowForm;
