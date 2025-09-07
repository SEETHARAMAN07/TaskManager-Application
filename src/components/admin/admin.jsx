import React, { useEffect, useState } from "react";
import "./admin.css";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link,useNavigate} from 'react-router-dom';
import axios from 'axios'; // http client for api calls


const AdminPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("date");

  const navigate = useNavigate(); // to navigate between pages


  useEffect(() => {
    fetchTasks();
  }, []);

 

  const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("token"); // Assumes token is stored here
    const response = await axios.get("http://localhost:8080/admin/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    setTasks(response.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};


  // to delete the tasks

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");
    
    await axios.delete(`http://localhost:8080/admin/deleteTask/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    alert("Task deleted successfully");
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};




  // to update(edit) the tasks

  const handleEdit = (task) => {
    navigate("/posttask", { state: { task } });  // Pass selected task via 'state'
  };







  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase();
    if (filterBy === "date") return task.dueDate?.toLowerCase().includes(term);
    if (filterBy === "priority") return task.priority?.toLowerCase().includes(term);
    if (filterBy === "status") return task.status?.toLowerCase().includes(term);
    return true;
  });

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-title">Admin</div>
        <div className="admin-nav">
          <Link to='/userprofile'>
        <button>UserProfile</button>
        </Link>
         <Link to='/userrequests'>
        <button>User Requests</button>
        </Link>
          <button>Dashboard</button>
          <Link to="/posttask">
            <button>Post Task</button>
          </Link>
          <button>Logout</button>
        </div>
      </header>

      <div className="admin-search">
        <div className="search-controls">
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${filterBy}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      




      <div className="task-list-flex">
        {filteredTasks.map((task) => (
          <div className="task-box" key={task.id}>
            <h3>{task.title}</h3>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Due Date:</strong> {task.dueDate}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>status:</strong> {task.status}</p>
            <p><strong>Assigned To:</strong> {task.assignedTo}</p>
            {/* // to add the assigned by  */}
            <p><strong>Assigned By:</strong> {task.assignedBy}</p>
            <div className="task-icons">
              <FaEye className="icon view-icon" title="View" />

              <FaEdit className="icon edit-icon" title="Edit"
              onClick={() => handleEdit(task)}
              />

              <FaTrashAlt className="icon delete-icon" title="delete"
               onClick={() => handleDelete(task.id)}
              />

            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div style={{ padding: "20px", color: "#6b7280" }}>No tasks found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
