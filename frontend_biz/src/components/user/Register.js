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
      const response = await fetch('https://bizbill.4asolutions.com.au/users/register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(result.message);
      window.location.href = '/users/login_user'; // Perform frontend redirect
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed.');
    }
  };

  return (
    <div class="register_form_div">
      <form class="register_form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      {/* Link to Login Page */}
      <div class="login_link">
        <p>Already have an account?</p>
        <a href="https://bizbill.4asolutions.com.au/users/login_user">Login</a>
      </div>
    </div>
  );
};

export default Register;
