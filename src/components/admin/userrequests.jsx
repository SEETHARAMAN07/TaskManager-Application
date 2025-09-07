import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserService from '../service/UserService';

const UserRequests = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

   const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await UserService.getAllUsers(token);
      //   console.log(response);
      setUsers(response.ourUsersList); // Assuming the list of users is under the key 'ourUsersList'
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        const token = localStorage.getItem('token'); // Optional: add JWT token if needed
        await axios.put(
            `http://localhost:8080/admin/updateuserstatus/${id}`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        alert('Status updated successfully!');
        fetchUsers(); // Refresh the list
    } catch (err) {
        console.error('Error updating status:', err);
        setError('Error updating status');
    }
};


    return (
        <div style={{ padding: '20px' }}>
            <h2>User Requests</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.status}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRequests;
