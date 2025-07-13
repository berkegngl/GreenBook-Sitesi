import React, { useEffect, useState } from 'react';
import BannerSlider from '../components/BannerSlider';
import BookSection from '../components/BookSection';
import { fetchBestsellers, fetchDiscountedBooks } from '../services/bookService';

export default function HomeScreen({ books, onAddToCart, onToggleFavorite, favorites, onShowAllBooks, cart }) {
  const [bestsellers, setBestsellers] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchBestsellers(),
      fetchDiscountedBooks()
    ])
      .then(([bestsellerData, discountedData]) => {
        setBestsellers(bestsellerData);
        setDiscounted(discountedData);
        setLoading(false);
      })
      .catch(err => {
        setError('Veriler yüklenemedi');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <BannerSlider />
      <BookSection 
        title="Kampanyalar" 
        books={discounted} 
        onAddToCart={onAddToCart} 
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        showDiscountBadge={true}
        showDiscountPrice={true}
        cart={cart}
      />
      <BookSection 
        title="Çok Satanlar" 
        books={bestsellers} 
        onAddToCart={onAddToCart} 
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        showDiscountBadge={false}
        showDiscountPrice={false}
        cart={cart}
      />
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '32px 0'}}>
        <button 
          className="explore-all-btn"
          style={{
            background: '#1a7f37',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 36px',
            fontSize: '1.15rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(26,127,55,0.10)',
            transition: 'background 0.2s',
          }}
          onClick={onShowAllBooks}
        >
          Tüm ürünlere göz atın
        </button>
      </div>
      {loading && <div>Veriler yükleniyor...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
} 