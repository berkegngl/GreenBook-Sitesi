import React from 'react';

const placeholder = 'https://via.placeholder.com/120x170?text=Kitap+Kapak';

function handleImgError(e) {
  if (e.target.src !== placeholder) {
    e.target.onerror = null;
    e.target.src = placeholder;
  }
}

export default function BookDetail({ bookId, onAddToCart, onToggleFavorite, favorites, books }) {
  const book = books.find(b => b.id === parseInt(bookId));
  if (!book) return <div>Kitap bulunamadı.</div>;
  // Benzer kitaplar: aynı kategori ve farklı id
  const similar = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 3);
  const isFav = favorites.includes(book.id);
  return (
    <div className="book-detail">
      <img src={book.image || placeholder} alt={book.title} className="book-img-large" onError={handleImgError} />
      <div>
        <h2>{book.title}</h2>
        <p className="author">{book.author}</p>
        <p>{book.description}</p>
        <p className="price">{book.price} TL</p>
        <button onClick={() => onAddToCart(book)} className="add-btn">Sepete Ekle</button>
        <button onClick={() => onToggleFavorite(book.id)} className={isFav ? 'fav-btn active' : 'fav-btn'}>{isFav ? 'Favoriden Çıkar' : 'Favorilere Ekle'}</button>
      </div>
      {similar.length > 0 && (
        <div className="similar-books">
          <h4>Benzer Kitaplar</h4>
          <div className="book-list">
            {similar.map(sim => (
              <div className="book-card" key={sim.id}>
                <img src={sim.image || placeholder} alt={sim.title} className="book-img" onError={handleImgError} />
                <h3>{sim.title}</h3>
                <p className="author">{sim.author}</p>
                <p className="price">{sim.price} TL</p>
                <button onClick={() => window.location.href = `/book/${sim.id}`} className="details-btn">Detay</button>
                <button onClick={() => onAddToCart(sim)} className="add-btn">Sepete Ekle</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 