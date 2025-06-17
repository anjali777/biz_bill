import React, { useState } from 'react';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bizbill.4asolutions.com.au/test/index.php?rt=users/register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Registration successful! Please log in.');
        window.location.href = '/login'; // Redirect to frontend login page
      } else {
        alert(result.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed.');
    }
  };

  return (
    <div className="register_form_div">
      <form className="register_form" onSubmit={handleSubmit}>
        <h2>Register page update</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary" name="btn_save_register_details">Register</button>
      </form>

      {/* Link to Login Page */}
      <div className="login_link">
        <p>Already have an account?</p>
        <a href="/login">Login</a> {/* Link to frontend login page */}
      </div>
    </div>
  );
};

export default Register;
