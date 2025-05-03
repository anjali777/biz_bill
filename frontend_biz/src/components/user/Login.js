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
      const response = await fetch('/users/login_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        alert('Login Successful');
        localStorage.setItem('auth_token', result.token); // Save token in localStorage
        window.location.href = '/invoice/display_invoices'; // Redirect after login
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login_form_div">
      <form className="login_form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>} {/* Show error if any */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
