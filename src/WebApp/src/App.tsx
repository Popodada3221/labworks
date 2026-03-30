import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Product {
    id: number;
    name: string;
    price: number;
    createdAt: string;
    description?: string;
    stock: number;
}

interface NodeInfo {
    node: string;
    timestamp: string;
}

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        description: '',
        stock: 0
    });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchNodeInfo, 3000); // Обновляем информацию о ноде каждые 3 секунды
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, nodeRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/node-info')
            ]);
            setProducts(productsRes.data);
            setNodeInfo(nodeRes.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const fetchNodeInfo = async () => {
        try {
            const response = await axios.get('/node-info');
            setNodeInfo(response.data);
        } catch (error) {
            console.error('Error fetching node info:', error);
        }
    };

    const createProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/products', {
                name: newProduct.name,
                price: newProduct.price,
                description: newProduct.description,
                stock: newProduct.stock
            });
            setNewProduct({ name: '', price: 0, description: '', stock: 0 });
            fetchData();
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Failed to create product');
        }
    };

    const deleteProduct = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
                setError('Failed to delete product');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="header">
                <h1>🛒 Product Management System</h1>
                {nodeInfo && (
                    <div className={`node-info node-${nodeInfo.node.split('-')[1] || '1'}`}>
                        <span className="node-badge">
                            📍 Current Node: <strong>{nodeInfo.node}</strong>
                        </span>
                        <span className="timestamp">
                            🕐 Last update: {new Date(nodeInfo.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                )}
            </header>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                    <button onClick={() => fetchData()}>Retry</button>
                </div>
            )}

            <div className="container">
                <div className="create-product">
                    <h2>Add New Product</h2>
                    <form onSubmit={createProduct}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Product Name *"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Price *"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                required
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Stock"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Add Product</button>
                    </form>
                </div>

                <div className="products-list">
                    <h2>Products ({products.length})</h2>
                    {products.length === 0 ? (
                        <p className="no-products">No products yet. Create your first product!</p>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-header">
                                        <h3>{product.name}</h3>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className="product-price">
                                        ${product.price.toFixed(2)}
                                    </div>
                                    {product.description && (
                                        <div className="product-description">
                                            {product.description}
                                        </div>
                                    )}
                                    <div className="product-footer">
                                        <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                                        </span>
                                        <span className="product-date">
                                            Added: {new Date(product.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;