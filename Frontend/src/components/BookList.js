import React from 'react';

const placeholder = 'https://via.placeholder.com/120x170?text=Kitap+Kapak';

function handleImgError(e) {
  if (e.target.src !== placeholder) {
    e.target.onerror = null;
    e.target.src = placeholder;
  }
}

export default function BookList({ onAddToCart, books, search, setSearch, filters, setFilters, sort, setSort, allCategories, allAuthors, allPublishers }) {
  const [page, setPage] = React.useState(1);
  const booksPerPage = 40;
  const totalPages = Math.ceil(books.length / booksPerPage);
  React.useEffect(() => { setPage(1); }, [search, filters, sort]);
  const pagedBooks = books.slice((page - 1) * booksPerPage, page * booksPerPage);

  return (
    <div>
      <div className="book-list">
        {pagedBooks.length === 0 ? (
          <div style={{
            margin: '48px auto',
            color: '#4a5568',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '220px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '22px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            maxWidth: 700,
            width: '100%',
            fontSize: '1.1rem',
            fontWeight: 500,
            padding: '49px 48px',
            marginTop: 64,
            textAlign: 'center'
          }}>
            <div style={{fontSize: '1.45rem', fontWeight: 700, marginBottom: 10}}>Kitap bulunamadı</div>
            <div style={{fontSize: '1.08rem', color: '#888', fontWeight: 400, lineHeight: 1.6}}>Aradığınız kriterlere uygun kitap yok.<br/>Farklı bir arama veya filtre deneyin.</div>
          </div>
        ) : (
          <>
            {pagedBooks.map(book => (
              <div className="book-card" key={book.id}>
                <img src={book.image || placeholder} alt={book.title} className="book-img" onError={handleImgError} />
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <p className="price">{book.price} TL</p>
                <button onClick={() => window.location.href = `/book/${book.id}`} className="details-btn">Detay</button>
                <button onClick={() => onAddToCart(book)} className="add-btn">Sepete Ekle</button>
              </div>
            ))}
            {/* Eğer kitap sayısı 5'ten azsa, grid hizasını korumak için görünmez placeholderlar ekle */}
            {Array.from({length: Math.max(0, 5 - pagedBooks.length)}).map((_, i) => (
              <div key={"ph-"+i} className="bos-kart" />
            ))}
          </>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i+1}
              className={"page-btn" + (page === i+1 ? " active" : "")}
              onClick={() => {
                setPage(i+1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
} 