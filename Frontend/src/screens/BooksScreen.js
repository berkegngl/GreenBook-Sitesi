import React from 'react';
import BookList from '../components/BookList';

export default function BooksScreen({
  books,
  filterSearch,
  setFilterSearch,
  filters,
  setFilters,
  sort,
  setSort,
  allCategories,
  allAuthors,
  allPublishers,
  handleAddToCart
}) {
  // allSubcategories hesaplaması burada yapılmalı
  const allSubcategories = React.useMemo(() => {
    if (!filters.category) return [];
    // megaCategories'den bulmak için App.js'den import gerekebilir
    return [];
  }, [filters.category]);

  return (
    <div className="books-page-container">
      {/* Sol filtre paneli */}
      <div style={{width: '260px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '24px 18px', height: 'fit-content'}}>
        <h3 style={{fontSize: '1.1rem', marginBottom: '18px'}}>Filtrele</h3>
        <div style={{marginBottom: '18px'}}>
          <label style={{fontWeight: 500}}>Arama</label>
          <input type="text" value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder="Kitap, yazar veya yayınevi..." style={{width: '100%', marginTop: '6px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc'}} />
        </div>
        <div style={{marginBottom: '18px'}}>
          <label style={{fontWeight: 500}}>Kategori</label>
          <select value={filters.category} onChange={e => { setFilters(f => ({...f, category: e.target.value, subcategory: ''})); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{width: '100%', marginTop: '6px', padding: '6px', borderRadius: '6px'}}>
            <option value="">Tümü</option>
            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        {/* Tür (subcategory) dropdown */}
        <div style={{marginBottom: '18px'}}>
          <label style={{fontWeight: 500}}>Tür</label>
          <select value={filters.subcategory} onChange={e => { setFilters(f => ({...f, subcategory: e.target.value})); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{width: '100%', marginTop: '6px', padding: '6px', borderRadius: '6px'}} disabled={!filters.category}>
            <option value="">Tümü</option>
            {allSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
        <div style={{marginBottom: '18px'}}>
          <label style={{fontWeight: 500}}>Yazar</label>
          <select value={filters.author} onChange={e => { setFilters(f => ({...f, author: e.target.value})); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{width: '100%', marginTop: '6px', padding: '6px', borderRadius: '6px'}}>
            <option value="">Tümü</option>
            {allAuthors.map(author => <option key={author} value={author}>{author}</option>)}
          </select>
        </div>
        <div style={{marginBottom: '18px'}}>
          <label style={{fontWeight: 500}}>Yayınevi</label>
          <select value={filters.publisher} onChange={e => { setFilters(f => ({...f, publisher: e.target.value})); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{width: '100%', marginTop: '6px', padding: '6px', borderRadius: '6px'}}>
            <option value="">Tümü</option>
            {allPublishers.map(pub => <option key={pub} value={pub}>{pub}</option>)}
          </select>
        </div>
        <button onClick={() => { setFilters({ category: '', subcategory: '', minPrice: '', maxPrice: '', author: '', publisher: '' }); setFilterSearch(''); }} style={{marginTop: '12px', width: '100%', background: '#e0e0e0', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer'}}>Filtreleri Temizle</button>
      </div>
      {/* Kitap listesi */}
      <div style={{flex: 1}}>
        <BookList 
          onAddToCart={handleAddToCart}
          books={books}
          search={filterSearch}
          setSearch={setFilterSearch}
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          allCategories={allCategories}
          allAuthors={allAuthors}
          allPublishers={allPublishers}
        />
      </div>
    </div>
  );
} 