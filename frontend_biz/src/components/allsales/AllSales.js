import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../header/Header.js';

const AllSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstTotalAmount, setGstTotalAmount] = useState(0);

  useEffect(() => {
    fetchSales();
    fetchSalesTotal();
    fetchGstTotal();
  }, [filterStatus, filterDate, searchCustomer]);

  const fetchSales = () => {
    const token = localStorage.getItem('auth_token');

    const params = {
      status: filterStatus !== 'all' ? filterStatus : undefined,
      dateRange: filterDate !== 'all' ? filterDate : undefined,
      customer: searchCustomer || undefined,
    };

    axios
      .get('http://localhost:8082/sales/get_all_sales', {
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

  const fetchSalesTotal = () => {
    const token = localStorage.getItem('auth_token');
  
    const params = {
      status: filterStatus !== 'all' ? filterStatus : undefined,
      dateRange: filterDate !== 'all' ? filterDate : undefined,
      customer: searchCustomer || undefined,
    };
  
    axios
      .get('http://localhost:8082/sales/get_sales_total', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        const total = response.data.total ? parseFloat(response.data.total) : 0; // Ensure it's a number
        setTotalAmount(total);
      })
      .catch((error) => {
        console.error('Error fetching total amount:', error);
        setTotalAmount(0); // Default to 0 on error
      });
  };
  
  const fetchGstTotal = () => {
    const token = localStorage.getItem('auth_token');
  
    const params = {
      status: filterStatus !== 'all' ? filterStatus : undefined,
      dateRange: filterDate !== 'all' ? filterDate : undefined,
      customer: searchCustomer || undefined,
    };
  
    axios
      .get('http://localhost:8082/sales/get_gst_total', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        const total = response.data.total ? parseFloat(response.data.total) : 0; // Ensure it's a number
        setGstTotalAmount(total);
      })
      .catch((error) => {
        console.error('Error fetching total amount:', error);
        setGstTotalAmount(0); // Default to 0 on error
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
        <div className="row">
          <div className="col-md-3">
            <select
              className="form-select me-2"
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
          </div>
          <div className="col-md-3">
            <select
              className="form-select me-2"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="last_twelve_months">Last 12 Months</option>
              <option value="last_six_months">Last 6 Months</option>
              <option value="this_quarter">This Quarter</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Customer"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading sales...</p>
        ) : (
          <>
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
                  <tr key={sale.invoice_id}>
                    <td>{new Date(sale.invoice_create_date).toLocaleDateString()}</td>
                    <td>Invoice</td>
                    <td>{sale.invoice_number}</td>
                    <td>{sale.customer_display_name}</td>
                    <td>${parseFloat(sale.invoice_total).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          sale.invoice_status === 'paid'
                            ? 'bg-success'
                            : sale.invoice_status === 'overdue'
                            ? 'bg-danger'
                            : 'bg-warning'
                        }`}
                      >
                        {sale.invoice_status.charAt(0).toUpperCase() +
                          sale.invoice_status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/invoice/edit_invoice/${sale.invoice_id}`}
                        className="btn btn-info btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Amount */}
            <div className="text-end mt-3">
             <h5>GST Total: ${Number(gstTotalAmount).toFixed(2)}</h5>
             <h5>Total: ${Number(totalAmount).toFixed(2)}</h5>
            </div>

          </>
        )}
      </div>
    </>
  );
};

export default AllSales;
