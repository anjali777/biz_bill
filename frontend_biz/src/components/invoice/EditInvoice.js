import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // To get the invoice ID from the URL
import './CreateInvoice.css';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ownerData, setOwnerData] = useState([]);
  const [logoBase64, setLogoBase64] = useState([]);
  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_create_date: '',
    invoice_due_date: '',
    customer_display_name: '',
    customer_email: '',
    company_name: '',
    customer_address: '',
    customer_street_number: '',
    customer_suburb: '',
    customer_state: '',
    customer_postcode: '',
    subtotal: 0,
    gstTotal: 0,
    total: 0,
  });

  const fetchBase64Logo = async () => {
    try {
        const response = await axios.get('http://localhost:8082/serve_image.php', { responseType: 'arraybuffer' });
        const base64 = `data:${response.headers['content-type']};base64,${btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )}`;
        setLogoBase64(base64);
    } catch (error) {
        console.error('Error fetching logo as base64:', error);
    }
};

  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8082/invoice/edit_invoice/${id}`)
      .then(response => {
        const invoice = response.data;
        const items = invoice.line_items || [];
  
        // Calculate subtotal and GST based on line items
        const subtotal = items.reduce((acc, item) => acc + (item.gst ? item.amount / 1.1 : item.amount), 0);
        const gstTotal = subtotal * 0.10;
        const total = subtotal + gstTotal;
  
        setFormData({
          invoice_number: invoice.invoice_number || '',
          invoice_create_date: invoice.invoice_create_date || '',
          invoice_due_date: invoice.invoice_due_date || '',
          customer_display_name: invoice.customer_display_name || '',
          customer_email: invoice.customer_email || '',
          company_name: invoice.company_name || '',
          customer_address: invoice.customer_address || '',
          customer_street_number: invoice.customer_street_number || '',
          customer_suburb: invoice.customer_suburb || '',
          customer_state: invoice.customer_state || '',
          customer_postcode: invoice.customer_postcode || '',
          subtotal,
          gstTotal,
          total,
        });
        setLineItems(items);
      })
      .catch(error => console.error('Error fetching invoice data:', error));
  
      axios.get('http://localhost:8082/owner/display_owner')
      .then(response => {
        setOwnerData(response.data);
        // Call fetchBase64Logo to set the logo
        fetchBase64Logo(); 
      })
      .catch(error => console.error('Error fetching owner data:', error));
  }, [id]);
  

  // Handle changes to the line items
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][field] = value;

    if (field === 'quantity' || field === 'rate' || field === 'gst') {
      updatedLineItems[index].amount = calculateAmount(updatedLineItems[index]);
    }

    setLineItems(updatedLineItems);
    updateTotals(updatedLineItems);
  };

  const calculateAmount = (lineItem) => {
    const baseAmount = lineItem.quantity * lineItem.rate;
    const gstAmount = lineItem.gst ? baseAmount * 0.10 : 0;
    return baseAmount + gstAmount;
  };
  
  const updateTotals = (newLineItems) => {
    const subtotal = newLineItems.reduce((sum, item) => sum + (item.gst ? item.amount / 1.1 : item.amount), 0);
    const gstTotal = newLineItems.filter(item => item.gst).reduce((sum, item) => sum + (item.amount - item.amount / 1.1), 0);
    const total = subtotal + gstTotal;

    setFormData({
      ...formData,
      subtotal,
      gstTotal,
      total,
    });
  };
  
  

  // Handle adding a new line item
  const addLineItem = () => {
    setLineItems([...lineItems, { service_date: '', product_service: '', description: '', quantity: 1, rate: 0, amount: 0, gst: false }]);
  };

  // Handle removing a line item
  const removeLineItem = (index) => {
    const newLineItems = [...lineItems];
    newLineItems.splice(index, 1);
    setLineItems(newLineItems);
    updateTotals(newLineItems);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.invoice_create_date || !formData.invoice_due_date || !formData.total) {
      alert('Please ensure all required fields are filled out.');
      return;
    }

    for (let item of lineItems) {
      if (!item.service_date || !item.product_service || !item.description || !item.quantity || !item.rate) {
        alert('Please ensure all fields in each line item are filled out (service date, product/service, description, quantity, and rate).');
        return;
      }
    }

    const invoiceData = {
      ...formData,
      line_items: lineItems,
    };

    axios.put(`http://localhost:8082/invoice/update_invoice/${id}`, invoiceData)
      .then(response => {
        if (response.data.success) {
          alert('Invoice updated successfully');
          generatePDF(); // Generate PDF after successful update
          navigate('/invoice/display_invoices'); // Use navigate to redirect after success
        } else {
          alert('Error updating invoice');
        }
      })
      .catch(error => {
        console.error('Error updating the invoice:', error);
      });
  };

  const generatePDF = () => {
    return new Promise((resolve) => {
      const element = document.getElementById('invoice_information');
  
      const opt = {
        margin: [3, 8, 3, 8], // Top, right, bottom, left margins in pixels
        filename: `invoice_${formData.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
        },
        jsPDF: { unit: 'pt', format: 'tabloid', orientation: 'portrait' }
      };
  
      // Introduce a delay to ensure the image has time to load
      setTimeout(() => {
        window.html2pdf().set(opt).from(element).save().then(() => resolve());
      }, 500); // 500ms delay
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Edit Invoice: {formData.invoice_number || ''}</h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="customer_display_name">Customer Display Name</label>
              <input
                type="text"
                id="customer_display_name"
                className="form-control"
                value={formData.customer_display_name || ''}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="customer_email">Customer Email</label>
              <input
                type="email"
                id="customer_email"
                className="form-control"
                value={formData.customer_email || ''}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-4">
            <label htmlFor="invoice_number">Invoice Number</label>
            <input
              type="text"
              id="invoice_number"
              className="form-control"
              value={formData.invoice_number || ''}
              readOnly
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="billing_address">Billing Address</label>
              <textarea
                id="billing_address"
                className="form-control"
                value={`${formData.company_name}\n${formData.customer_address} ${formData.customer_street_number}\n${formData.customer_suburb} ${formData.customer_state} ${formData.customer_postcode}`}
                readOnly
              ></textarea>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label>Invoice Date</label>
              <input
                type="date"
                name="invoice_create_date"
                className="form-control"
                value={formData.invoice_create_date || ''}
                onChange={(e) => setFormData({ ...formData, invoice_create_date: e.target.value })}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="invoice_due_date"
                className="form-control"
                value={formData.invoice_due_date || ''}
                onChange={(e) => setFormData({ ...formData, invoice_due_date: e.target.value })}
              />
            </div>
          </div>
        </div>

        <h3>Line Items</h3>
        {lineItems.length > 0 ? (
          lineItems.map((item, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-1">
                <label>S.No</label>
                <input type="text" value={index + 1} className="form-control" readOnly />
              </div>
              <div className="col-md-2">
                <label>Service Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={item.service_date}
                  onChange={(e) => handleLineItemChange(index, 'service_date', e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label>Product/Service</label>
                <input
                  type="text"
                  className="form-control"
                  value={item.product_service}
                  onChange={(e) => handleLineItemChange(index, 'product_service', e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="col-md-1">
                <label>Qty</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value))}
                />
              </div>
              <div className="col-md-1">
                <label>Rate</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.rate}
                  onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value))}
                />
              </div>
              <div className="col-md-1">
                <label>GST</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={item.gst}
                  onChange={(e) => handleLineItemChange(index, 'gst', e.target.checked)}
                />
              </div>
              <div className="col-md-1">
                <label>Amount</label>
                <input type="text" className="form-control" value={isNaN(parseFloat(item.amount)) ? '0.00' : parseFloat(item.amount).toFixed(2)} readOnly />
              </div>
              <div className="col-md-1">
                <button type="button" className="btn btn-danger" onClick={() => removeLineItem(index)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p>No line items available.</p>
        )}

        <div className="row">
          <div className="col-md-4">
            <button type="button" className="btn btn-secondary mb-3" onClick={addLineItem}>Add Line</button>
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Subtotal (excl. GST)</label>
              <input type="text" className="form-control" value={formData.subtotal.toFixed(2)} readOnly />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <div className="form-group">
              <label>GST Total</label>
              <input type="text" className="form-control" value={formData.gstTotal.toFixed(2)} readOnly />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Total</label>
              <input type="text" className="form-control" value={formData.total.toFixed(2)} readOnly />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Update Invoice</button>
      </form>

      {/* Hidden element for PDF generation */}
      <div id="invoice_information" style={{ display: 'block' }}>
      <div className="invoice-header">
      <div className="row">
            <div className="col-md-6">
              {/* Owner Information */}
              <div style={{ textAlign: 'left' }}>
                {ownerData.length > 0 && (
                  <> 
                    <h4><b>{ownerData[0].owner_business_name}</b></h4>
                    <p>{`${ownerData[0].owner_address}`}<br />
                    {`${ownerData[0].owner_suburb} ${ownerData[0].owner_state} ${ownerData[0].owner_postcode}`}<br />
                    Phone: {ownerData[0].owner_mobile_number}<br />
                    Email: {ownerData[0].owner_email}</p>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: 'right' }}>
                {logoBase64 && (
                  <img src={logoBase64} alt="Business Logo" style={{ width: '250px' }} />
                )}
              </div>
            </div>
          </div>
      </div><br /><br />

      {/* Customer Information */}
      <div className="row">
      <div className="col-md-6">
        <div className="customer-info" style={{ textAlign: 'left' }}>
        <h3 className='tax_invoice'>Tax Invoice</h3>
          <h4 className='tax_invoice_to'>Invoice To</h4>
          <p>{formData.customer_display_name}<br />
              {formData.company_name}<br />
              {`${formData.customer_address}`}<br />
              {`${formData.customer_suburb} ${formData.customer_state} ${formData.customer_postcode}`}</p>
        </div>
      </div>
      <div className="col-md-6">
        {/* Invoice Details */}
        <div className="invoice-details" style={{ textAlign: 'right' }}>
          <p>Invoice Number: {formData.invoice_number}</p>
          <p>Invoice Date: {formData.invoice_create_date}</p>
          <p>Due Date: {formData.invoice_due_date}</p>
        </div>
      </div>
    </div><br /><br />
    {/* Line Items Table */}
    <table className="invoice_table_details">
      <thead className="invoice_heading_background">
        <tr>
          <th>Date</th>
          <th>Product/Service</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>GST</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((item, index) => (
          <tr key={index}>
            <td>{item.service_date}</td>
            <td>{item.product_service}</td>
            <td>{item.description}</td>
            <td>{item.quantity}</td>
            <td>{item.rate}</td>
            <td>{item.gst ? 'Yes' : 'No'}</td>
            <td>{parseFloat(item.amount).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table><br /><br /><br />

    {/* Totals */}
    <div className="row">
      <div className="col-md-6">
        {/* Totals */}
        {ownerData.length > 0 && (
          <div style={{ textAlign: 'left' }}>
            <h4>Please make all payments to</h4>
            <p><b>Bank Name: {ownerData[0].bank_name}</b></p>
            <p><b>Account Name: {ownerData[0].account_name}</b></p>
            <p><b>BSB: {ownerData[0].bsb}</b></p>
            <p><b>Account Number: {ownerData[0].account_number}</b></p>
          </div>
        )}
      </div>
      <div className="col-md-6">
        <div style={{ textAlign: 'right' }}>
          <p>SUBTOTAL: {formData.subtotal.toFixed(2)}</p>
          <p>GST TOTAL: {formData.gstTotal.toFixed(2)}</p>
          <p>TOTAL: {formData.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default EditInvoice;
