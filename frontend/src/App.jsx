import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const categories = ['', 'Books', 'Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];

    const fetchProducts = async (reset = false) => {
        setLoading(true);
        try {
            const currentCursor = reset ? null : cursor;
            const apiUrl = import.meta.env.VITE_API_URL || 'https://product-catalog-w1qo.onrender.com/products';
            const url = new URL(apiUrl);
            url.searchParams.append('limit', 20);
            if (currentCursor) url.searchParams.append('cursor', currentCursor);
            if (category) url.searchParams.append('category', category);

            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            setProducts(prev => reset ? data.data : [...prev, ...data.data]);
            setCursor(data.nextCursor);
            setHasMore(!!data.nextCursor);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(true);
    }, [category]);

    return (
        <div className="container">
            <h1>Product Catalog (200k Items)</h1>
            <div className="filters">
                <label>Filter by Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(c => (
                        <option key={c} value={c}>{c || 'All Categories'}</option>
                    ))}
                </select>
            </div>

            <div className="product-grid">
                {products.map(p => (
                    <div key={p.id} className="card">
                        <h3>{p.name}</h3>
                        <p className="category">{p.category}</p>
                        <p className="price">${parseFloat(p.price).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button className="load-more" onClick={() => fetchProducts(false)} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More Products'}
                </button>
            )}
            {!hasMore && <p>No more products left.</p>}
        </div>
    );
}

export default App;
