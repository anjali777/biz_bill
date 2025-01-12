import React, { useState } from 'react';

const CreateOwner = () => {
  const [formData, setFormData] = useState({
    owner_id: '',
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
    owner_registeration_completed: "1",
    owner_registeration_email_sent: "0",
    owner_account_enabled: "1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, owner_business_logo: e.target.files[0] });  // Handle file input separately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Use FormData to handle multipart/form-data
    const formDataToSubmit = new FormData();
  
    // Append form data fields
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
  
    try {
      const response = await fetch('http://localhost:8082/owner/create_owner', {
        method: 'POST',
        body: formDataToSubmit,  // FormData object automatically handles multipart form data
      });
  
      const text = await response.text(); // Read the response as text
      console.log('Server Response:', text); // Log response
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = JSON.parse(text); // Parse the response as JSON
  
      if (result.success) {
        alert(result.message);
        window.location.href = '/owner/display_owner'; // Redirect after success
      } else {
        alert('Error creating owner');
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <h2 className="text-center">Add Your Details</h2>
              <p className="text-center">Please complete all fields</p>
              
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_id">Business Owner ID<span className="text-danger">*</span></label>
                  <input type="text" name="owner_id" placeholder="Owner ID" className="form-control" id="owner_id" required onChange={handleChange} />
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
                  <label htmlFor="owner_first_name">First Name of Business Owner<span className="text-danger">*</span></label>
                  <input type="text" name="owner_first_name" placeholder="First Name of Customer" className="form-control" id="owner_first_name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_last_name">Last Name of Business Owner<span className="text-danger">*</span></label>
                  <input type="text" name="owner_last_name" placeholder="Last Name of Customer" className="form-control" id="owner_last_name" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_display_name">Business Owner Display Name<span className="text-danger">*</span></label>
                  <input type="text" name="owner_display_name" placeholder="Business Owner Display Name" className="form-control" id="owner_display_name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_business_name">Business Name<span className="text-danger">*</span></label>
                  <input type="text" name="owner_business_name" placeholder="Business Name" className="form-control" id="owner_business_name" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_email">Email address<span className="text-danger">*</span></label>
                  <input type="email" name="owner_email" placeholder="Email Address" className="form-control" id="owner_email" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_phone_number">Phone Number<span className="text-danger">*</span></label>
                  <input type="text" name="owner_phone_number" placeholder="Phone Number" className="form-control" id="owner_phone_number" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_mobile_number">Mobile Number<span className="text-danger">*</span></label>
                  <input type="text" name="owner_mobile_number" placeholder="Mobile Number" className="form-control" id="owner_mobile_number" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_address">Address<span className="text-danger">*</span></label>
                  <input type="text" name="owner_address" placeholder="Address" className="form-control" id="owner_address" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_street_number">Street Number<span className="text-danger">*</span></label>
                  <input type="text" name="owner_street_number" placeholder="Street Number" className="form-control" id="owner_street_number" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_suburb">Suburb<span className="text-danger">*</span></label>
                  <input type="text" name="owner_suburb" placeholder="Suburb" className="form-control" id="owner_suburb" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_state">State<span className="text-danger">*</span></label>
                  <input type="text" name="owner_state" placeholder="State" className="form-control" id="owner_state" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_postcode">Postcode<span className="text-danger">*</span></label>
                  <input type="text" name="owner_postcode" placeholder="Postcode" className="form-control" id="owner_postcode" required onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="owner_country">Country<span className="text-danger">*</span></label>
                  <input type="text" name="owner_country" placeholder="Country" className="form-control" id="owner_country" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="owner_business_logo">Business Logo<span className="text-danger">*</span></label>
                  <input type="file" name="owner_business_logo" className="form-control" id="owner_business_logo" onChange={handleFileChange} accept="image/*" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="bank_name">Bank Name<span className="text-danger">*</span></label>
                  <input type="text" name="bank_name" placeholder="Bank Name" className="form-control" id="bank_name" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="account_name">Account Name<span className="text-danger">*</span></label>
                  <input type="text" name="account_name" placeholder="Account Name" className="form-control" id="account_name" required onChange={handleChange} />
                </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label htmlFor="bsb">BSB<span className="text-danger">*</span></label>
                <input type="text" name="bsb" placeholder="BSB" className="form-control" id="bsb" required onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="account_number">Account Number<span className="text-danger">*</span></label>
                <input type="text" name="account_number" placeholder="Account Number" className="form-control" id="account_number" required onChange={handleChange} />
              </div>
            </div>

              {/* Hidden fields */}
              <input type="hidden" name="owner_registeration_completed" value="1" onChange={handleChange} />
              <input type="hidden" name="owner_registeration_email_sent" value="0" onChange={handleChange} />
              <input type="hidden" name="owner_account_enabled" value="1" onChange={handleChange} />
              <br /><br />
              <div className="row">
                <div className="col-md-12">
                  <button className="btn btn-primary" name="btn_save_user" type="submit">Create Business Owner</button>
                  <a href="/owner/display_owner" className="btn btn-dark">Cancel</a>
                </div>
              </div><br /><br />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOwner;