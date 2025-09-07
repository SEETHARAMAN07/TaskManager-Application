import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './employee.css';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmployeePage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("date");

  const token = localStorage.getItem("token");

  // Decode JWT and extract username
  function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  const decoded = parseJwt(token);
  const email = decoded?.sub;
  const username = email?.split("@")[0] || '';
  console.log(username);

  // Fetch tasks
  const fetchTasks = useCallback(() => {
    if (token && username) {
      axios.get(`http://localhost:8080/user/employee/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(res => setTasks(res.data))
        .catch(err => console.error("Error fetching employee tasks:", err));
    }
  }, [token, username]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleEditClick = (index) => {
    setEditingTaskIndex(index);
  };

  const handleStatusChange = (index, newStatus) => {
    const confirmUpdate = window.confirm("Are you sure you want to update the status?");
    if (!confirmUpdate) return;

    const taskId = tasks[index].id;

    axios.put(
      `http://localhost:8080/user/updatestatus/${taskId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(() => {
      alert("Status updated successfully!");
      fetchTasks();
      setEditingTaskIndex(null);
    }).catch(err => {
      console.error("Error updating status:", err);
    });
  };

  // Handle Delete
  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/user/deletetask/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Task deleted successfully!");
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase();
    if (filterBy === "date") return task.dueDate?.toLowerCase().includes(term);
    if (filterBy === "priority") return task.priority?.toLowerCase().includes(term);
    if (filterBy === "status") return task.status?.toLowerCase().includes(term);
    return true;
  });

  return (
    <div className="employee-container">
      <header className="employee-header">
        <div className="employee-title">Employee</div>
        <div className="employee-actions">
          <button onClick={() => window.location.href = "/dashboard"}>Dashboard</button>
          <Link to="/Posttaskemp">
            <button>Post Task</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
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

      <h2 style={{ textAlign: "center", marginTop: "1rem" }}>My Tasks</h2>
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>No tasks found.</p>
        ) : (
          filteredTasks.map((task, idx) => (
            <div className="task-box" key={idx}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Due Date:</strong> {task.dueDate}</p>
              <p>
                <strong>Status:</strong>{" "}
                {editingTaskIndex === idx ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <>
                    {task.status}
                    <FaEdit
                      className="icon edit-icon"
                      title="Edit"
                      style={{ marginLeft: "8px", cursor: "pointer" }}
                      onClick={() => handleEditClick(idx)}
                    />
                  </>
                )}
              </p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Assigned By:</strong> {task.assignedBy}</p>
              <p><strong>Assigned To:</strong> {task.assignedTo}</p>

              {/* 🗑️ Delete shown only if assignedBy == assignedTo */}
              {task.assignedBy === task.assignedTo && (
                <button
                  onClick={() => handleDelete(task.id)}
                  title="Delete Task"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#e53935",
                    cursor: "pointer",
                    fontSize: "18px",
                    marginTop: "5px"
                  }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
