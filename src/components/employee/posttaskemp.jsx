import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import './posttaskempcss.css'; // Your CSS styling

const EmployeePostTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'LOW',
    status: 'PENDING',
    assignedTo: '',
    assignedBy: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const fullUsername = decoded.sub || decoded.username || decoded.user || '';
        const username = fullUsername.split('@')[0]; // Get only part before "@"
        setFormData(prev => ({
          ...prev,
          assignedTo: username,
          assignedBy: username
        }));
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/user/posttask', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert("Task posted successfully!");
    } catch (error) {
      console.error("Error posting task:", error);
      alert("Failed to post task.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
      />
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Assigned To field (readonly, self-assigned) */}
      <select name="assignedTo" value={formData.assignedTo} disabled>
        {formData.assignedTo && (
          <option value={formData.assignedTo}>{formData.assignedTo}</option>
        )}
      </select>

      {/* Hidden assignedBy field (not editable, sent in payload) */}
      <input type="hidden" name="assignedBy" value={formData.assignedBy} />

      <button type="submit">Post Task</button>
    </form>
  );
};

export default EmployeePostTask;
