import React from 'react';
import { useParams } from 'react-router-dom';
import BookDetail from '../components/BookDetail';

export default function BookDetailScreen({ books, onAddToCart, onToggleFavorite, favorites }) {
  const { id } = useParams();
  return (
    <BookDetail 
      bookId={id} 
      books={books}
      onAddToCart={onAddToCart} 
      onToggleFavorite={onToggleFavorite} 
      favorites={favorites} 
    />
  );
} 