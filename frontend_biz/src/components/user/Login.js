import React, { useState } from 'react';
import './register.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8082/users/login_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if(result.success){
        alert('Login Successful');
        localStorage.setItem('auth_token', result.token); // Save token in localStorage
        window.location.href = '/invoice/display_invoices'; // Perform frontend redirect
      } else {
        setError(result.message || 'Invalid email or password');
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed.');
    }
  };

  return (
    <div class="login_form_div">
      <form class="login_form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
