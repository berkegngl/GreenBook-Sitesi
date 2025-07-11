import React from 'react';
import BannerSlider from '../components/BannerSlider';
import BookSection from '../components/BookSection';

export default function HomeScreen({ books, onAddToCart, onToggleFavorite, favorites }) {
  // Dummy: En çok satanlar ve yeni çıkanlar (rastgele kitaplar)
  const bestSellers = books.slice(0, 10);
  const newReleases = books.slice().sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <div className="container">
      <BannerSlider />
      <BookSection 
        title="Kampanyalar" 
        books={books.slice(0, 10)} 
        onAddToCart={onAddToCart} 
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        showDiscountBadge={true}
        showDiscountPrice={true}
      />
      <BookSection 
        title="Çok Satanlar" 
        books={books.slice(10, 20)} 
        onAddToCart={onAddToCart} 
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        showDiscountBadge={false}
        showDiscountPrice={false}
      />
      <BookSection 
        title="Yeni Çıkanlar" 
        books={books.slice(20, 30)} 
        onAddToCart={onAddToCart} 
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
        showDiscountBadge={false}
        showDiscountPrice={false}
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
          onClick={() => window.location.href = '/books'}
        >
          Tüm ürünlere göz atın
        </button>
      </div>
    </div>
  );
} 