import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to fetch products');
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/products', 
        { name, description, price: parseFloat(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Product created successfully');
      setName('');
      setDescription('');
      setPrice('');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header-flex">
        <h2>Welcome, {username} ({role})</h2>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      {error && <div className="message message-error">{error}</div>}
      {success && <div className="message message-success">{success}</div>}

      {role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Product</h3>
          <form onSubmit={handleCreateProduct}>
            <div className="grid">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Price"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
              Add Product
            </button>
          </form>
        </div>
      )}

      <div className="grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{product.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>${product.price}</p>
            {role === 'admin' && (
              <button 
                onClick={() => handleDeleteProduct(product.id)} 
                className="btn btn-danger"
                style={{ width: '100%' }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {products.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No products available.</p>
        )}
      </div>
    </div>
  );
}
