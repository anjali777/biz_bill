import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateInvoice.css';

const CreateInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [logoBase64, setLogoBase64] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_date: '',
    due_date: '',
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
    subtotal: 0,
    gstTotal: 0,
    total: 0
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


  const [lineItems, setLineItems] = useState([
    { service_date: '', product_service: '', description: '', quantity: 1, rate: 0, amount: 0, gst: false }
  ]);

  // Format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    // Fetch customer data
    axios.get('http://localhost:8082/users/display_users')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching customer data!', error);
      });

     // Fetch business owner data
     axios.get('http://localhost:8082/owner/display_owner')
     .then(async (response) => {
       const ownerInfo = response.data;
       if (ownerInfo.length > 0 && ownerInfo[0].owner_business_logo) {
         const base64Logo = await fetchBase64Logo(`http://localhost:8082/images/${ownerInfo[0].owner_business_logo}`);
         setOwnerData([{ ...ownerInfo[0], base64Logo }]);
       } else {
         setOwnerData(ownerInfo);
       }
     })
     .catch(error => {
       console.error('Error fetching owner data:', error);
     });
     
    // Fetch next invoice number
    axios.get('http://localhost:8082/invoice/get_next_invoice_number')
      .then(response => {
        setFormData(prevFormData => ({
          ...prevFormData,
          invoice_number: response.data.next_invoice_number, // Ensure correct invoice number is fetched
          invoice_create_date: prevFormData.invoice_create_date ? formatDate(prevFormData.invoice_create_date) : '',
          invoice_due_date: prevFormData.invoice_due_date ? formatDate(prevFormData.invoice_due_date) : ''
        }));
      })
      .catch(error => {
        console.error('There was an error fetching invoice number!', error);
      });

    axios.get('http://localhost:8082/product/get_products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));

     axios.get('http://localhost:8082/service/get_services')
      .then(response => setServices(response.data))
      .catch(error => console.error(error));
      // Format invoice and due dates on load if they exist
  }, []);
  

  const handleCustomerChange = (e) => {
    
    const selectedCustomerId = e.target.value;
  
    // Find the selected customer by customer_id
    const selectedCustomer = customers.find(cust => cust.customer_id === selectedCustomerId);
    console.log('Selected Customer:', selectedCustomer);

    if (selectedCustomer) {
      // Update formData with selected customer's details
      setFormData(prevFormData => ({
        ...prevFormData,
        customer_id: selectedCustomer.customer_id,  // Save the customer_id
        customer_display_name: selectedCustomer.customer_display_name,
        company_name: selectedCustomer.company_name || '',  // Ensure the value is never undefined
        customer_email: selectedCustomer.customer_email || '',
        customer_phone_number: selectedCustomer.customer_phone_number || '',
        customer_mobile_number: selectedCustomer.customer_mobile_number || '',
        customer_address: selectedCustomer.customer_address || '',
        customer_street_number: selectedCustomer.customer_street_number || '',
        customer_suburb: selectedCustomer.customer_suburb || '',
        customer_state: selectedCustomer.customer_state || '',
        customer_postcode: selectedCustomer.customer_postcode || ''
      }));
    }
  };
  
// Handle input changes for the form data
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.invoice_create_date || !formData.invoice_due_date || !formData.invoice_due_date || !formData.total) {
      alert('Please ensure all required fields are filled out.');
      return;
    }

    // Check required fields in each line item
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
  
    try {
      const response = await axios.post('http://localhost:8082/invoice/create_invoice', invoiceData);
      if (response.data.success) {
        alert('Invoice created successfully');
        await generatePDF(); // Wait for PDF generation
        window.location.href = '/invoice/display_invoices'; // Redirect after PDF is generated
      } else {
        alert('Error creating invoice');
      }
    } catch (error) {
      console.error('There was an error creating the invoice!', error);
    }
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

  // Handle changes in a line item
  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...lineItems];
    newLineItems[index][field] = value;

    if (field === 'quantity' || field === 'rate' || field === 'gst') {
      newLineItems[index].amount = calculateAmount(newLineItems[index]);
    }

    setLineItems(newLineItems);
    updateTotals(newLineItems);
  };

  // Calculate the amount for a line item
  const calculateAmount = (lineItem) => {
    const amount = lineItem.quantity * lineItem.rate;
    const gstAmount = lineItem.gst ? amount * 0.10 : 0;
    return amount + gstAmount;
  };

  const updateTotals = (newLineItems) => {
    // Calculate subtotal by excluding GST amounts for items without GST selected
    const subtotal = newLineItems.reduce((sum, item) => 
      sum + (item.gst ? item.amount / 1.1 : item.amount), 0);
    
    // Calculate gstTotal only for items with GST checked
    const gstTotal = newLineItems
      .filter(item => item.gst) // only include items with GST checked
      .reduce((sum, item) => sum + (item.amount - item.amount / 1.1), 0);
  
    const total = subtotal + gstTotal;
    
    setFormData({
      ...formData,
      subtotal,
      gstTotal,
      total
    });
  };
 
  const generatePDF = () => {
    return new Promise((resolve) => {
      const element = document.getElementById('invoice_information').innerHTML;
  
      const opt = {
        margin: [8, 15, 8, 15], // Top, right, bottom, left margins in pixels
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
      <h2 className="text-center">Invoice Number: {formData.invoice_number}</h2>  {/* Display invoice number */}
      <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="customer_display_name">Customer Display Name</label>
            <select
              id="customer_display_name"
              className="form-control"
              value={formData.customer_id || ""}  // Bind to customer_id, not customer_display_name
              onChange={handleCustomerChange}     // Update formData when selecting customer
            >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.customer_display_name}
              </option>
            ))}
          </select>
        </div>
        </div>
         <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="customer_email">Customer Email</label>
              <input type="email" id="customer_email" className="form-control" value={formData.customer_email} readOnly />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="invoice_number">Invoice Number</label>
            <input
              type="text"
              id="invoice_number"
              className="form-control"
              value={formData.invoice_number}  // Ensure this is properly bound
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
                value={formData.invoice_create_date}
                onChange={handleInputChange} // Update formData on change
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
                value={formData.invoice_due_date}
                onChange={handleInputChange} // Update formData on change
              />
            </div>
          </div>
      </div>

        <h3>Line Items</h3>
        {lineItems.map((item, index) => (
          <div key={index} className="row mb-3">
            <div className="col-md-1">
              <label>S.No</label>
              <input type="text" value={index + 1} className="form-control" readOnly />
            </div>
            <div className="col-md-2">
              <label>Service Date</label>
              <input type="date" className="form-control" value={item.service_date} onChange={(e) => handleLineItemChange(index, 'service_date', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label>Product/Service</label>
              <select
                  name="product_service"
                  value={item.product_service}
                  onChange={(e) => handleLineItemChange(index, 'product_service', e.target.value)}
                >
                  <option value="">Select Product/Service</option>
                  {products.map((product) => (
                    <option key={`product-${product.product_id}`} value={product.name}>
                      {product.name} (Product)
                    </option>
                  ))}
                  {services.map((service) => (
                    <option key={`service-${service.service_id}`} value={service.name}>
                      {service.name} (Service)
                    </option>
                  ))}
                </select>
            </div>
            <div className="col-md-2">
              <label>Description</label>
              <input type="text" className="form-control" value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} />
            </div>
            <div className="col-md-1">
              <label>Qty</label>
              <input type="number" className="form-control" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value))} />
            </div>
            <div className="col-md-1">
              <label>Rate</label>
              <input type="number" className="form-control" value={item.rate} onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value))} />
            </div>
            <div className="col-md-1">
              <label>GST</label>
              <input type="checkbox" className="form-check-input" checked={item.gst} onChange={(e) => handleLineItemChange(index, 'gst', e.target.checked)} />
            </div>
            <div className="col-md-1">
              <label>Amount</label>
              <input type="text" className="form-control" value={item.amount.toFixed(2)} readOnly />
            </div>
            <div className="col-md-1">
              <button type="button" className="btn btn-danger" onClick={() => removeLineItem(index)}>Remove</button>
            </div>
          </div>
        ))}
        <div className="row">
          <div className="col-md-4">
            <button type="button" className="btn btn-secondary mb-3" onClick={addLineItem}>Add Line</button>
          </div>
          <div className="col-md-4">
            
          </div>
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
          <div className="col-md-4">
            
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>GST Total</label>
              <input type="text" className="form-control" value={formData.gstTotal.toFixed(2)} readOnly />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            
          </div>
          <div className="col-md-4">
            
          </div>
          <div className="col-md-4">
            <div className="form-group">
            <label>Total</label>
            <input type="text" className="form-control" value={formData.total.toFixed(2)} readOnly />
        </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Invoice</button>
      </form>
         {/* Hidden element that will be converted into PDF */}
      <div id="invoice_information" style={{ display: 'none' , margin: '0', padding: '0'}}>
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
              <p>Invoice Date: {formData.invoice_create_date && formatDate(formData.invoice_create_date)}</p>
              <p>Due Date: {formData.invoice_due_date && formatDate(formData.invoice_due_date)}</p>
            </div>
          </div>
        </div><br /><br />
        {/* Line Items Table */}
        <table className="invoice_table_details">
          <thead className="invoice_heading_background">
              <tr>
                <th>Date</th>
                <th></th>
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
                <td>{item.service_date && formatDate(item.service_date)}</td>
                <td>{item.product_service}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.rate}</td>
                <td>{item.gst ? 'Yes' : 'No'}</td>
                <td>{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table><br /><br /><br />
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

export default CreateInvoice;
