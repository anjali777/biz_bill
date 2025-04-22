import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateService = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    service_image: '',
    category: '',
    description: '',
    sales_price: '',
    income_account: 'income',
    gst_inclusive: false,
    purchase_from_supplier: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, seteditingServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const response = await axios.get('https://bizbill.4asolutions.com.au/service/get_services');
    setServices(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`https://bizbill.4asolutions.com.au/service/update_service/${editingServiceId}`, formData);
      setEditMode(false);
      seteditingServiceId(null);
    } else {
      await axios.post('http://localhost:8082/service/create_service', formData);
    }
    fetchServices();
    setFormData({
      name: '',
      sku: '',
      service_image: '',
      category: '',
      description: '',
      sales_price: '',
      income_account: 'income',
      gst_inclusive: false,
      purchase_from_supplier: false,
    });
  };

  const handleEdit = (service) => {
    setEditMode(true);
    seteditingServiceId(service.service_id);
    setFormData(service);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8082/service/delete_service/${id}`);
    fetchServices();
  };

  return (
    <div className="container mt-5">
      <h2>Services</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Service Name"
          required
        />
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleInputChange}
          placeholder="SKU"
          required
        />
        <input
          type="file"
          name="service_image"
          onChange={(e) => setFormData({ ...formData, service_image: e.target.files[0] })}
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="sales_price"
          value={formData.sales_price}
          onChange={handleInputChange}
          placeholder="Sales Price"
          required
        />
        <select
          name="income_account"
          value={formData.income_account}
          onChange={handleInputChange}
        >
          <option value="income">Income</option>
          <option value="cost">Cost</option>
          <option value="expenses">Expenses</option>
          <option value="current assets">Current Assets</option>
          <option value="fixed assets">Fixed Assets</option>
          <option value="current liabilities">Current Liabilities</option>
        </select>
        <label>
          <input
            type="checkbox"
            name="gst_inclusive"
            checked={formData.gst_inclusive}
            onChange={handleInputChange}
          />
          GST Inclusive
        </label>
        <label>
          <input
            type="checkbox"
            name="purchase_from_supplier"
            checked={formData.purchase_from_supplier}
            onChange={handleInputChange}
          />
          Purchase from Supplier
        </label>
        <button type="submit">{editMode ? 'Update' : 'Create'} Service</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.service_id}>
              <td>{service.name}</td>
              <td>{service.sku}</td>
              <td>{service.category}</td>
              <td>{service.sales_price}</td>
              <td>
                <button onClick={() => handleEdit(service)}>Edit</button>
                <button onClick={() => handleDelete(service.service_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateService;
