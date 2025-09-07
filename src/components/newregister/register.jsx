import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import './registercss.css';


function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
        
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
           
    //         await UserService.register(formData);

    //         setFormData({
    //             name: '',
    //             email: '',
    //             password: ''
               
    //         });

    //         alert('User registered successfully');
    //         navigate('/admin/user-management');
    //     } catch (error) {
    //         console.error('Error registering user:', error);
    //         alert('An error occurred while registering user');
    //     }
    // };
    // to check the user already exists function ..below previous is above
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await UserService.register(formData);

        if (response.statusCode === 400) {
            alert(response.message); // Show 'Email already exists. Unable to register.'
            return;
        }

        alert('User registered successfully');
        setFormData({ name: '', email: '', password: '' });
        navigate('/admin/user-management');
    } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred while registering user');
    }
};


    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2 className="registration-title">User Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                            <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                 
                   
                  
                    <button type="submit" className="register-button">Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationPage;
