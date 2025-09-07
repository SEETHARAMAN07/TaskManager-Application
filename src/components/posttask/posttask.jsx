import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct ES module import
import './posttask.css';

const PostTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskData = location.state?.task || null;

  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [dueDate, setduedate] = useState("");
  const [priority, setpriority] = useState("");
  const [status, setstatus] = useState("");
  const [assignedTo, setassignto] = useState("");
  const [employees, setEmployees] = useState([]);

  // ✅ Extract username (before '@') from JWT token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      const email = decoded.sub || decoded.username || decoded.email;
      if (email && email.includes("@")) {
        return email.split("@")[0]; // Return only the part before '@'
      }
      return email;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/admin/getusernames", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (taskData) {
      settitle(taskData.title || "");
      setdescription(taskData.description || "");
      setduedate(taskData.dueDate || "");
      setpriority(taskData.priority || "");
      setstatus(taskData.status || "");
      setassignto(taskData.assignedTo || "");
    }
  }, [taskData]);

  async function handleSubmit(event) {
    event.preventDefault();

    const assignedBy = getUsernameFromToken(); // Automatically fetched from token

    const taskPayload = {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      assignedBy,
    };

    try {
      const token = localStorage.getItem("token");

      if (taskData) {
        await axios.put(`http://localhost:8080/admin/updateTask/${taskData.id}`, taskPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert("Task updated successfully!");
      } else {
        await axios.post("http://localhost:8080/admin/posttask", taskPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert("Task inserted successfully!");
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error submitting task:", err.response?.data || err.message);
      alert("Error occurred while saving task.");
    }
  }

  return (
    <div className="post-task-container">
      <h2 style={{ textAlign: "center" }}>{taskData ? "Edit Task" : "Post New Task"}</h2>
      <form className="post-task-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter your title"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Description"
          rows="4"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          required
        />

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setduedate(e.target.value)}
          required
        />

        <label>Priority</label>
        <select
          value={priority}
          onChange={(e) => setpriority(e.target.value)}
          required
        >
          <option value="" disabled>Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setstatus(e.target.value)}
          required
        >
          <option value="" disabled>Select status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <label>Assign To</label>
        <select
          value={assignedTo}
          onChange={(e) => setassignto(e.target.value)}
          required
        >
          <option value="" disabled>Select employee</option>
          {employees.map((emp, index) => (
            <option key={index} value={emp}>{emp}</option>
          ))}
        </select>

        <button type="submit">{taskData ? "Update Task" : "Post Task"}</button>
      </form>
    </div>
  );
};

export default PostTaskPage;
