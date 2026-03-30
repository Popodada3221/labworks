import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [node, setNode] = useState<string>('');

  useEffect(() => {
    fetchProducts();
    fetchNodeInfo();
    const interval = setInterval(fetchNodeInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNodeInfo = async () => {
    try {
      const res = await axios.get('/node-info');
      setNode(res.data.node);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📦 Product Manager</h1>
      <h2 style={{ color: '#2c3e50' }}>🖥️ Нода: <span style={{ color: '#e74c3c' }}>{node}</span></h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} — {p.price} ₽</li>
        ))}
      </ul>
      <p><small>Обновляйте страницу — номер ноды будет меняться (round‑robin)</small></p>
    </div>
  );
}

export default App;