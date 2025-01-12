import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './createProduct.css';

const CreateProduct = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    product_image: '',
    category: '',
    description: '',
    sales_price: '',
    income_account: 'income',
    gst_inclusive: false,
    purchase_from_supplier: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:8082/product/get_products');
    setProducts(response.data || []);
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
      await axios.put(`http://localhost:8082/product/update_product/${editingProductId}`, formData);
      setEditMode(false);
      setEditingProductId(null);
    } else {
      await axios.post('http://localhost:8082/product/create_product', formData);
    }
    fetchProducts();
    setFormData({
      name: '',
      sku: '',
      product_image: '',
      category: '',
      description: '',
      sales_price: '',
      income_account: 'income',
      gst_inclusive: false,
      purchase_from_supplier: false,
    });
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditingProductId(product.product_id);
    setFormData(product);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8082/product/delete_product/${id}`);
    fetchProducts();
  };

  return (
    <div className="container mt-5">
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
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
          name="product_image"
          onChange={(e) => setFormData({ ...formData, product_image: e.target.files[0] })}
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
        <button type="submit">{editMode ? 'Update' : 'Create'} Product</button>
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
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>{product.sales_price}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.product_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateProduct;
