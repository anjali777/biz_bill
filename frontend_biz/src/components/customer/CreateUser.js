import React, { useState } from 'react';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    salutation: 'mr.',
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
    customer_country: '',
    customer_registeration_completed: "1",
    customer_registeration_email_sent: "0",
    Customer_account_enabled: "1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Submitting form data:', formData); // Debugging the form data
  
    try {
      const response = await fetch('http://localhost:8082/users/save_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const text = await response.text(); // Read the response as text first
      console.log('Server Response:', text); // Log response to check its format
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = JSON.parse(text); // Parse the response as JSON
  
      if (result.success) {
        alert(result.message);
        // Redirect to display users page after successful user creation
        window.location.href = '/users/display_users'; // Perform frontend redirect
      } else {
        alert('Error creating user');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Unable to submit form.');
    }
  };
  

  return (
    <div className="wrapper">
      <div className="container-fluid" style={{ boxShadow: '0 3px 10px rgb(0,0,0,0.2)' }}>
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <h2 className="text-center">Add a new Customer</h2>
              <p className="text-center">Please complete all fields in order to create a new user for your organisation.</p>
              
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_id">Customer ID<span className="text-danger">*</span></label>
                  <input type="text" name="customer_id" placeholder="Customer ID" className="form-control" id="customer_id" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label>Salutation<span className="text-danger">*</span></label>
                  <select name="salutation" className="form-control" required onChange={handleChange}>
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr.</option>
                    <option value="Ms">Ms.</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="first_name">First Name of Customer<span className="text-danger">*</span></label>
                  <input type="text" name="first_name" placeholder="First Name of Customer" className="form-control" id="first_name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="last_name">Last Name of Customer<span className="text-danger">*</span></label>
                  <input type="text" name="last_name" placeholder="Last Name of Customer" className="form-control" id="last_name" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_display_name">Customer Display Name<span className="text-danger">*</span></label>
                  <input type="text" name="customer_display_name" placeholder="Customer Display Name" className="form-control" id="customer_display_name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="company_name">Company Name<span className="text-danger">*</span></label>
                  <input type="text" name="company_name" placeholder="Company Name" className="form-control" id="company_name" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_email">Email address<span className="text-danger">*</span></label>
                  <input type="email" name="customer_email" placeholder="Email Address" className="form-control" id="customer_email" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="customer_phone_number">Phone Number<span className="text-danger">*</span></label>
                  <input type="text" name="customer_phone_number" placeholder="Customer Phone Number" className="form-control" id="customer_phone_number" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_mobile_number">Mobile Number<span className="text-danger">*</span></label>
                  <input type="text" name="customer_mobile_number" placeholder="Mobile Number" className="form-control" id="customer_mobile_number" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="customer_address">Customer Address<span className="text-danger">*</span></label>
                  <input type="text" name="customer_address" placeholder="Customer Address" className="form-control" id="customer_address" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_street_number">Street Number<span className="text-danger">*</span></label>
                  <input type="text" name="customer_street_number" placeholder="Street Number" className="form-control" id="customer_street_number" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="customer_suburb">Suburb<span className="text-danger">*</span></label>
                  <input type="text" name="customer_suburb" placeholder="Suburb" className="form-control" id="customer_suburb" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_state">State<span className="text-danger">*</span></label>
                  <input type="text" name="customer_state" placeholder="State" className="form-control" id="customer_state" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="customer_postcode">Postcode<span className="text-danger">*</span></label>
                  <input type="text" name="customer_postcode" placeholder="Postcode" className="form-control" id="customer_postcode" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customer_country">Country<span className="text-danger">*</span></label>
                  <input type="text" name="customer_country" placeholder="Country" className="form-control" id="customer_country" required onChange={handleChange} />
                </div>
              </div>

              {/* Hidden fields */}
              <input type="hidden" name="customer_registeration_completed" value="1" onChange={handleChange} />
              <input type="hidden" name="customer_registeration_email_sent" value="0" onChange={handleChange} />
              <input type="hidden" name="Customer_account_enabled" value="1" onChange={handleChange} />
              <br /><br />
              <div className="row">
                <div className="col-md-12">
                  <button className="btn btn-primary" name="btn_save_user" type="submit">Create User</button>
                  <a href="/users/display_users" className="btn btn-dark">Cancel</a>
                </div>
              </div><br /><br />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
