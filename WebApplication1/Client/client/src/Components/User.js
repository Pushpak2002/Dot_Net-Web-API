import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";
// import { Link } from 'react-router-dom';
import "./css/Dashboard.css"; // Ensure your CSS is correctly linked
import config from "../../src/config/config.json";

// import XLSX from "xlsx";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const User = () => {
  // State variables
  const [tableData, setTableData] = useState([]); // Save all user info

  // State for new user
  const [newName, setNewName] = useState(""); // Track new user name
  const [newDesc, setNewDesc] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false); // Track whether to show add user form

  // State for image
  const [newPath, setNewPath] = useState(null); // Initialize as null
  const [uploadStatus, setUploadStatus] = useState('');

  // State for update user
  const [editId, setEditId] = useState(null); // Track which ID is being edited
  const [editName, setEditName] = useState(""); // Track edited name
  const [editDesc, setEditDesc] = useState(""); // Track edited description
  const [editPath, setEditPath] = useState("");
  const [showUpdateForm, setshowUpdateForm] = useState(false);




  // Resetting add user form
  const resetAddUserForm = () => {
    setShowAddUserForm(false);
    setNewName("");
    setNewDesc("");
    setNewPath(null); // Reset the file input
  };

  // Resetting update form
  const resetUpdateForm = () => {
    setEditId(null);
    setEditName("");
    setEditDesc("");
    setEditPath("");
    setshowUpdateForm(false);
  };

  // Fetch data when the page loads
  useEffect(() => {
    getAllData();
  }, []);

  // Function to fetch all users
  const getAllData = async () => {
    try {
      const response = await axios.get("https://localhost:7236/api/firstApi");
      console.log("response from getAllData --------->", response);
      setTableData(response.data);
      console.log("response from setTableData --------->", tableData);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch users.");
    }
  };

  // Function to add a new user
  const addUser = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const newUser = { name: newName, description: newDesc, path: "" };
      const response = await axios.post(
        "https://localhost:7236/api/firstApi",
        newUser
      );

      const userId = response.data.id; // Get the newly created user's ID
      console.log("new user response---->",response.data);
      console.log("new User Id--------->" ,userId);
      // Upload the file for the new user using the userId
      await handleUpload(userId);

      // Update the table data state with the new user
      setTableData((prevData) => [...prevData, response.data]);

      // Reset form fields after adding
      resetAddUserForm();
      setNewPath(null);
      toast.success("New User Added!");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("UserName already Exists");
    }
  };

  // Function to delete a user by ID
  const deleteDataById = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return; // Exit if the user cancels

    try {
      await axios.delete(`https://localhost:7236/api/firstApi/${id}`);
      setTableData((prevData) => prevData.filter((item) => item.id !== id)); // Remove deleted item from state
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete user.");
    }
  };

  // Function to update a user by ID
  const updateDataById = async (id) => {
    if(editPath != null){
      await handleUpload(id);;
    }

    try {
      const updatedData = {
        id,
        name: editName,
        description: editDesc,
        path: editPath || '' // Preserve existing path or update as needed
      };
      await axios.put(
        `https://localhost:7236/api/firstApi/update/${id}`,
        updatedData
      );
      setTableData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedData : item))
      );
      toast.success("User updated successfully!"); // Show success message
      resetUpdateForm(); // Reset the update form fields after updating
      // setEditPath("");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update user.");
    }
  };

  // Handler for file input change
  const handleFileChange = (event) => {
    // setNewPath(event.target.files[0]); // Set the selected file
    const file = event.target.files[0];
    setNewPath(file);
    if (editId) {
      // If editing a user, set the editPath to the new file
      setEditPath(file);
    }
    console.log("Selected file:", file);
    
  };

  // Function to handle file upload

  const handleUpdateSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    updateDataById(editId); // Call the existing update function
};


  const handleUpload = async (userId) => {
    if (!newPath) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', newPath); // Append the selected file

    try {
      // Make an API call to the backend with the provided userId
      const response = await axios.put(
        `https://localhost:7236/api/firstApi/uploadFile/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 204) {
        setUploadStatus('File uploaded successfully!');
        // Optionally, refresh the user data to display the uploaded image
        getAllData();
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      setUploadStatus('Failed to upload the file. Please try again.');
      toast.error('Failed to upload the file.');
    }
  };

  // Generate table rows for users
  const tableValues = tableData.map((item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>
        {
          // Split the images string into an array and display all images
          item.path && item.path.split(",").map((image, idx) => (
            <img
              key={idx}
              src={`${config.uploadsFilePath}${image}`}
              alt={`Image ${idx + 1}`}
              style={{ margin: "5px", width: "15%" }}
            />
          ))
        }
      </td>
      <td>
        <button
          className="btn btn-warning p-2 m-2"
          onClick={() => {
            setEditId(item.id);
            setEditName(item.name);
            setEditDesc(item.description);
            setEditPath(item.path);
            setshowUpdateForm(true);
          }}
        >
          Update
        </button>
      </td>
      <td>
        <button
          className="btn btn-danger p-2 m-2"
          onClick={() => deleteDataById(item.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  //Export data
  const handleOnExport = () =>{
      var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(tableData);

      XLSX.utils.book_append_sheet(wb,ws,"UserSheet");

      XLSX.writeFile(wb,"UserExcel.xlsx");
  }


  const generatePDF = () => {
    const input = document.getElementById("user-table"); // Get the table by ID
    if (!input) {
      toast.error("Table not found!");
      return;
    }

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("UserData.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF.");
      });
  };



  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

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
            <img
              src={require("../assets/Iteos.jpeg")}
              className="logo"
              width="30px"
              height="30px"
              alt="logo"
            />
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
                <h1>{tableData.length}</h1>
                <span>Users</span>
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
                  <button onClick={() => setShowAddUserForm(!showAddUserForm)}>
                    {showAddUserForm ? "Close Form" : "Create New User"}{" "}
                    <span className="las la-user"></span>
                  </button>

                  <button onClick={handleOnExport}>Download Excel Data</button>
                  <button onClick={generatePDF}>Download PDF Data</button>
                </div>

                {/* Add User Form */}
                {showAddUserForm && (
                  <div
                    className={`card-body add-user-form ${
                      showAddUserForm ? "visible" : "hidden"
                    }`}
                  >
                    <form onSubmit={addUser}>
                      <div className="form-fields">
                        <div className="form-field">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            id="name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="description">Description</label>
                          <input
                            type="text"
                            id="description"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="file">File</label>
                          <input
                            type="file"
                            id="file"
                            onChange={handleFileChange} // Removed 'value'
                            required
                          />
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                          Add User
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetAddUserForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Update Form */}
                {editId && (
                  <div className={`card-body add-user-form visible`}>
                    <form onSubmit={handleUpdateSubmit}>
                      <div className="form-fields">
                        <div className="form-field">
                          <label htmlFor="editName">Edit Name</label>
                          <input
                            type="text"
                            id="editName"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="editDescription">
                            Edit Description
                          </label>
                          <input
                            type="text"
                            id="editDesc"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)} // Corrected to setEditDesc
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="file">File</label>
                          <input
                            type="file"
                            id="file"
                            onChange={handleFileChange} // Removed 'value'
                            
                          />
                        </div>
                       
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                          Update User
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetUpdateForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="card-body">
                  <div className="table-responsive">
                    <table id="user-table" width="100%">
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>User Name</th>
                          <th>User Description</th>
                          <th>Images</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>{tableValues}</tbody>
                    </table>
                    {tableData.length === 0 && (
                      <p>No users available. Please add a new user.</p>
                    )}
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
};

export default User;
