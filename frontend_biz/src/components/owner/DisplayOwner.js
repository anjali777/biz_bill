import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';  // Import Link

const DisplayOwner = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from backend
    axios.get('http://localhost:8082/owner/display_owner')
      .then(response => {
        console.log(response.data); // Check this output
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
        setLoading(false);
      });

  }, []);

  // Define columns for the table
  const columns = [
    { name: 'Salutation', selector: row => row.salutation, sortable: true },
    { name: 'First Name', selector: row => row.owner_first_name, sortable: true },
    { name: 'Last Name', selector: row => row.owner_last_name, sortable: true },
    { name: 'Display Name', selector: row => row.owner_display_name, sortable: true },
    { name: 'Business Name', selector: row => row.owner_business_name, sortable: true },
    { name: 'Email', selector: row => row.owner_email, sortable: true },
    { name: 'Phone Number', selector: row => row.owner_phone_number },
    { name: 'Mobile Number', selector: row => row.owner_mobile_number },
    { name: 'Address', selector: row => row.owner_address },
    { name: 'Street Number', selector: row => row.owner_street_number },
    { name: 'Suburb', selector: row => row.owner_suburb },
    { name: 'State', selector: row => row.owner_state },
    { name: 'Postcode', selector: row => row.owner_postcode },
    { name: 'Country', selector: row => row.owner_country },
    {
      name: 'Business Logo',
      selector: row => row.owner_business_logo,
      cell: row => (
        <img 
          src={row.owner_business_logo} 
          alt={`${row.owner_business_name} Logo`} 
          style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
        />
      ),
      ignoreRowClick: true,
    },
    { name: 'Bank Name', selector: row => row.bank_name },
    { name: 'Account Name', selector: row => row.account_number },
    { name: 'BSB Number', selector: row => row.bsb },
    { name: 'Account Number', selector: row => row.account_number },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Link to={`/owner/edit_owner/${row.owner_id}`} className="btn btn-info btn-sm">Edit</Link>
          <button
            className="btn btn-danger btn-sm ml-2"
            onClick={() => handleDelete(row.owner_id)}
          >
            Delete
          </button>
        </div>
      ),
    }
  ];
  

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      axios
        .delete(`http://localhost:8082/owner/delete_owner/${id}`) // Correct API endpoint
        .then(response => {
          // Log the server response to inspect it
          console.log('Delete response:', response.data);
  
          // Check if the deletion was successful
          if (response.data.success) {
            // Optimistically update the state by filtering out the deleted owner
            setUsers(users.filter(user => user.owner_id !== id)); // Use owner_id instead of customer_id
  
            // Show success message
            alert('Owner deleted successfully');
          } else {
            // If there was an error returned from the backend
            alert('Error deleting owner. Backend returned: ' + response.data.message);
          }
        })
        .catch(error => {
          // Log the error for debugging
          console.error('There was an error deleting the owner!', error);
  
          // Show error message to the user
          alert('Error deleting owner. Please try again.');
        });
    }
  };
  
  return (
    <div className="container mt-5"> 
      <Link to="/owner/create_owner" className="btn btn-info btn-sm">Add Owner</Link> {/* Link to create a new owner */}
      <h2 className="text-center">Owners List</h2>
      <DataTable
        columns={columns}
        data={users}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default DisplayOwner;
