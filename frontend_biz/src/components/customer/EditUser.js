import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const EditUser = () => {
  const { id } = useParams(); // Get user ID from URL parameters
  const navigate = useNavigate(); // Use navigate instead of useHistory
  const [formData, setFormData] = useState({
    salutation: '',
    first_name: '',
    last_name: '',
    customer_display_name: '',
    company_name: '',
    customer_email: '',
    customer_phone_number: '',
    customer_mobile_number: '',
    customer_address: '',
    customer_street_number: '',
    customer_suburb: '',
    customer_state: '',
    customer_postcode: '',
    customer_country: ''
  });

  // Fetch user data when component mounts
  useEffect(() => {
    axios.get(`http://localhost:8082/users/edit_user/${id}`)
      .then(response => {
        console.log("API Response: ", response.data); // Ensure valid JSON response
        setFormData(response.data); // Set the form data
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, [id]);
  

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8082/users/update_user/${id}`, formData);
      
      if (response.data.success) {
        alert('User updated successfully');
        navigate('/users/display_users'); // Use navigate to redirect after success
      } else {
        alert('Error updating user');
      }
    } catch (error) {
      console.error('There was an error updating the user!', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="customer_display_name">Customer Display Name</label>
            <input
              type="text"
              name="customer_display_name"
              id="customer_display_name"
              value={formData.customer_display_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="customer_email">Customer Email</label>
            <input
              type="text"
              name="customer_email"
              id="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="customer_phone_number">Customer Phone Number</label>
            <input
              type="text"
              name="customer_phone_number"
              id="customer_phone_number"
              value={formData.customer_phone_number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="customer_mobile_number">Customer Mobile Number</label>
            <input
              type="text"
              name="customer_mobile_number"
              id="customer_mobile_number"
              value={formData.customer_mobile_number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="customer_address">Customer Address</label>
            <input
              type="text"
              name="customer_address"
              id="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="customer_street_number">Customer Street Number</label>
            <input
              type="text"
              name="customer_street_number"
              id="customer_street_number"
              value={formData.customer_street_number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="customer_suburb">Customer Suburb</label>
            <input
              type="text"
              name="customer_suburb"
              id="customer_suburb"
              value={formData.customer_suburb}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="customer_state">Customer State</label>
            <input
              type="text"
              name="customer_state"
              id="customer_state"
              value={formData.customer_state}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="customer_postcode">Customer Postcode</label>
            <input
              type="text"
              name="customer_postcode"
              id="customer_postcode"
              value={formData.customer_postcode}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="customer_country">Customer Country</label>
            <input
              type="text"
              name="customer_country"
              id="customer_country"
              value={formData.customer_country}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-row mt-3">
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">Update User</button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={() => navigate('/users/display_users')} // Use navigate instead of history.push
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
