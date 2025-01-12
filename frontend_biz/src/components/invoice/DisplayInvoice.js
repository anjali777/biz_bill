import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../header/Header.js';

const DisplayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // All, unpaid, paid
  const [filterDate, setFilterDate] = useState('all'); // last_quarter, last_six_months, last_twelve_months, all

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus, filterDate]);

  const fetchInvoices = () => {
    const token = localStorage.getItem('auth_token');
  
    const params = {
      status: filterStatus !== 'all' ? filterStatus : undefined,
      dateRange: filterDate !== 'all' ? filterDate : undefined,
    };
  
    axios
      .get('http://localhost:8082/invoice/display_invoices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        setInvoices(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      });
  };
  

  const handleStatusChange = (invoiceId, newStatus) => {
    axios
      .put(`http://localhost:8082/invoice/update_status/${invoiceId}`, { status: newStatus })
      .then((response) => {
        if (response.data.success) {
          setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) =>
              invoice.invoice_id === invoiceId ? { ...invoice, invoice_status: newStatus } : invoice
            )
          );
          alert('Status updated successfully!');
        } else {
          alert('Failed to update status.');
        }
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        alert('An error occurred while updating the status.');
      });
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">All Invoices List</h2>
        <p className="create_invoice_link">
          <Link to="/invoice/create_invoice" className="btn btn-primary">
            Create Invoice
          </Link>
        </p>
        <div className="row">
          <div className="filters col-md-3">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unpaid">Unpaid (Overdue, Not Due)</option>
              <option value="paid">Paid (Not Deposited, Deposited)</option>
            </select>
          </div>
          <div className="filters col-md-3">
            <select
              className="form-select ms-2"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="last_six_months">Last 6 Months</option>
              <option value="last_twelve_months">Last 12 Months</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading invoices...</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice Number</th>
                <th>Customer Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.invoice_id}>
                  <td>{new Date(invoice.invoice_create_date).toLocaleDateString()}</td>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.customer_display_name}</td>
                  <td>${parseFloat(invoice.invoice_total).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        parseInt(invoice.invoice_status) === 1 ? 'bg-success' : 'bg-warning'
                      }`}
                    >
                      {parseInt(invoice.invoice_status) === 1 ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link
                        to={`/invoice/edit_invoice/${invoice.invoice_id}`}
                        className="btn btn-info btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-primary btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Status
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleStatusChange(invoice.invoice_id, 1)} // Paid
                          >
                            Mark as Paid
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleStatusChange(invoice.invoice_id, 0)} // Pending
                          >
                            Mark as Pending
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default DisplayInvoice;
