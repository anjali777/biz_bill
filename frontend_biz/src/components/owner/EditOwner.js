import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const EditOwner = () => {
  const { id } = useParams(); // Get user ID from URL parameters
  const navigate = useNavigate(); // Use navigate instead of useHistory
  const [formData, setFormData] = useState({
    salutation: 'mr.',
    owner_first_name: '',
    owner_last_name: '',
    owner_display_name: '',
    owner_business_name: '',
    owner_email: '',
    owner_phone_number: '',
    owner_mobile_number: '',
    owner_address: '',
    owner_street_number: '',
    owner_suburb: '',
    owner_state: '',
    owner_postcode: '',
    owner_country: '',
    owner_business_logo: '',  // File upload
    bank_name: '',
    account_name: '',
    bsb: '',
    account_number: '',
  });
  const [previewLogo, setPreviewLogo] = useState('');  // Preview for logo
  useEffect(() => {
    axios.get(`http://localhost:8082/owner/edit_owner/${id}`)
      .then(response => {
        if (response.data.owner_business_logo) {
          setPreviewLogo(response.data.owner_business_logo);  // Set logo preview
        }
        setFormData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [id]);
  

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, owner_business_logo: e.target.files[0] });  // Handle file input separately
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8082/owner/update_owner/${id}`, formData);
      
      if (response.data.success) {
        alert('User updated successfully');
        navigate('/owner/display_owner'); // Use navigate to redirect after success
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
            <label htmlFor="owner_first_name">First Name</label>
            <input
              type="text"
              name="owner_first_name"
              id="owner_first_name"
              value={formData.owner_first_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_last_name">Last Name</label>
            <input
              type="text"
              name="owner_last_name"
              id="owner_last_name"
              value={formData.owner_last_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="owner_display_name">Customer Display Name</label>
            <input
              type="text"
              name="owner_display_name"
              id="owner_display_name"
              value={formData.owner_display_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_business_name">Business Name</label>
            <input
              type="text"
              name="owner_business_name"
              id="owner_business_name"
              value={formData.owner_business_name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="owner_email">Customer Email</label>
            <input
              type="text"
              name="owner_email"
              id="owner_email"
              value={formData.owner_email}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_phone_number">Customer Phone Number</label>
            <input
              type="text"
              name="owner_phone_number"
              id="owner_phone_number"
              value={formData.owner_phone_number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="owner_mobile_number">Customer Mobile Number</label>
            <input
              type="text"
              name="owner_mobile_number"
              id="owner_mobile_number"
              value={formData.owner_mobile_number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_address">Customer Address</label>
            <input
              type="text"
              name="owner_address"
              id="owner_address"
              value={formData.owner_address}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="owner_street_number">Owner Street Number</label>
            <input
              type="text"
              name="owner_street_number"
              id="owner_street_number"
              value={formData.owner_street_number}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_suburb">Customer Suburb</label>
            <input
              type="text"
              name="owner_suburb"
              id="owner_suburb"
              value={formData.owner_suburb}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="owner_state">Owner State</label>
            <input
              type="text"
              name="owner_state"
              id="owner_state"
              value={formData.owner_state}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_postcode">Owner Postcode</label>
            <input
              type="text"
              name="owner_postcode"
              id="owner_postcode"
              value={formData.owner_postcode}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="owner_country">Owner Country</label>
            <input
              type="text"
              name="owner_country"
              id="owner_country"
              value={formData.owner_country}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="owner_business_logo">Business Logo</label>
            {previewLogo && (
              <img
                src={previewLogo}
                alt="Owner Business Logo"
                style={{ width: '100px', height: '100px', marginTop: '10px' }}
              />
            )}
            <input
              type="file"
              name="owner_business_logo"
              id="owner_business_logo"
              onChange={handleFileChange}
              className="form-control"
              accept="image/*"
            />
          </div>
        </div>
        {/* Bank Details */}
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="bank_name">Bank Name</label>
            <input type="text" name="bank_name" id="bank_name" value={formData.bank_name} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label htmlFor="account_name">Account Name</label>
            <input type="text" name="account_name" id="account_name" value={formData.account_name} onChange={handleChange} className="form-control" />
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="bsb">BSB</label>
            <input type="text" name="bsb" id="bsb" value={formData.bsb} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label htmlFor="account_number">Account Number</label>
            <input type="text" name="account_number" id="account_number" value={formData.account_number} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="form-row mt-3">
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">Update User</button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={() => navigate('/owner/display_owner')} // Use navigate instead of history.push
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOwner;
