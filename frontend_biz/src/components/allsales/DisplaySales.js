import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../header/Header.js';

const DisplaySales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // Filters: All, Open, Paid, etc.
  const [filterDate, setFilterDate] = useState('all'); // Filters: Last 12 months, etc.
  const [searchCustomer, setSearchCustomer] = useState(''); // Customer search

  useEffect(() => {
    fetchSales();
  }, [filterStatus, filterDate, searchCustomer]);

  const fetchSales = () => {
    const token = localStorage.getItem('auth_token');

    const params = {
      status: filterStatus !== 'all' ? filterStatus : undefined,
      dateRange: filterDate !== 'all' ? filterDate : undefined,
      customer: searchCustomer || undefined,
    };

    axios
      .get('http://localhost:8082/sales/display_sales', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        setSales(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sales:', error);
        setLoading(false);
      });
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">All Sales</h2>
        <p className="create_invoice_link">
          <Link to="/invoice/create_invoice" className="btn btn-primary">
            Create Invoice
          </Link>
        </p>

        {/* Filters Section */}
        <div className="filters mb-3 d-flex justify-content-between">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
            <option value="voided">Voided</option>
          </select>
          <select
            className="form-select ms-2"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="last_twelve_months">Last 12 Months</option>
            <option value="last_six_months">Last 6 Months</option>
            <option value="this_quarter">This Quarter</option>
          </select>
          <input
            type="text"
            className="form-control ms-2"
            placeholder="Search Customer"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading sales...</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>No</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td>{sale.type}</td>
                  <td>{sale.sale_number}</td>
                  <td>{sale.customer_name}</td>
                  <td>${parseFloat(sale.amount).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        sale.status === 'paid' ? 'bg-success' : 'bg-warning'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/sales/edit/${sale.sale_id}`} className="btn btn-info btn-sm">
                      Edit
                    </Link>
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

export default DisplaySales;
