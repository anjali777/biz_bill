import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';  // Import Link

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from backend
    axios.get('http://localhost:8082/users/display_users')
      .then(response => {
        setUsers(response.data); // Assuming the response contains the user array
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
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Display Name', selector: row => row.customer_display_name, sortable: true },
    { name: 'Company Name', selector: row => row.company_name, sortable: true },
    { name: 'Email', selector: row => row.customer_email, sortable: true },
    { name: 'Phone Number', selector: row => row.customer_phone_number },
    { name: 'Mobile Number', selector: row => row.customer_mobile_number },
    { name: 'Address', selector: row => row.customer_address },
    { name: 'Street Number', selector: row => row.customer_street_number },
    { name: 'Suburb', selector: row => row.customer_suburb },
    { name: 'State', selector: row => row.customer_state },
    { name: 'Postcode', selector: row => row.customer_postcode },
    { name: 'Country', selector: row => row.customer_country },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <a href={`/users/edit_user/${row.customer_id}`} className="btn btn-info btn-sm">Edit</a>
          <button
            className="btn btn-danger btn-sm ml-2"
            onClick={() => handleDelete(row.customer_id)}
          >
            Delete
          </button>
        </div>
      ),
    }
  ];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:8082/users/delete_user/${id}`)
        .then(response => {
          // Log the server response to inspect it
          console.log('Delete response:', response.data);
  
          // Check if the deletion was successful
          if (response.data.success) {
            // Optimistically update the state by filtering out the deleted user
            setUsers(users.filter(user => user.customer_id !== id));
  
            // Show success message
            alert('User deleted successfully');
          } else {
            // If there was an error returned from the backend
            alert('Error deleting user. Backend returned: ' + response.data.message);
          }
        })
        .catch(error => {
          // Log the error for debugging
          console.error('There was an error deleting the user!', error);
  
          // Show error message to the user
          alert('Error deleting user. Please try again.');
        });
    }
  };
  
  
  return (
    <div className="container mt-5"> 
      <Link to="/" className="btn btn-info btn-sm">Add User</Link>
      <h2 className="text-center">Users List</h2>
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

export default DisplayUsers;
