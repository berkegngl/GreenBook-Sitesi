import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookDetail from '../components/BookDetail';
import { fetchBookById } from '../services/bookService';

export default function BookDetailScreen({ onAddToCart, onToggleFavorite, favorites, cart }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchBookById(parseInt(id))
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Kitap detayı alınamadı');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!book) return <div>Kitap bulunamadı.</div>;

  return (
    <BookDetail 
      bookId={id} 
      books={[book]}
      onAddToCart={onAddToCart} 
      onToggleFavorite={onToggleFavorite} 
      favorites={favorites}
      cart={cart}
    />
  );
} 