// src/services/bookService.js
const BASE_URL = 'http://localhost:5266/api';


export async function fetchBestsellers() {
  console.log('[BOOK][REQUEST] /Books/bestsellers');
  const response = await fetch(`${BASE_URL}/Books/bestsellers`);
  const data = await response.json();
  console.log('[BOOK][RESPONSE] /Books/bestsellers', data);
  if (!response.ok) {
    throw new Error('Çok satanlar alınamadı');
  }
  return data;
}

export async function fetchDiscountedBooks() {
  console.log('[BOOK][REQUEST] /Books/discounted');
  const response = await fetch(`${BASE_URL}/Books/discounted`);
  const data = await response.json();
  console.log('[BOOK][RESPONSE] /Books/discounted', data);
  if (!response.ok) {
    throw new Error('Kampanyalı kitaplar alınamadı');
  }
  return data;
}

export async function fetchBooksByFilter({ category, subcategory, author, publisher }) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (subcategory) params.append('subcategory', subcategory);
  if (author) params.append('author', author);
  if (publisher) params.append('publisher', publisher);
  const url = `${BASE_URL}/Books/filter?${params.toString()}`;
  console.log('[BOOK][REQUEST] /Books/filter', { category, subcategory, author, publisher });
  const response = await fetch(url);
  const data = await response.json();
  console.log('[BOOK][RESPONSE] /Books/filter', data);
  if (!response.ok) {
    throw new Error('Filtreli kitaplar alınamadı');
  }
  return data;
}

export async function fetchBooksBySearch(query) {
  console.log('[BOOK][REQUEST] /Books/search', { query });
  const response = await fetch(`${BASE_URL}/Books/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  console.log('[BOOK][RESPONSE] /Books/search', data);
  if (!response.ok) {
    throw new Error('Arama sonuçları alınamadı');
  }
  return data;
}

export async function fetchBookById(id) {
  console.log('[BOOK][REQUEST] /Books/getById', { id });
  try {
    // Backend'de /Books/{id} endpoint'i yok, bu yüzden tüm kitapları çekip filtreliyoruz
    const response = await fetch(`${BASE_URL}/Books/AllBooks`);
    if (!response.ok) {
      throw new Error('Kitaplar alınamadı');
    }
    const allBooks = await response.json();
    console.log('[BOOK][RESPONSE] /Books/getById - all books count:', allBooks.length);
    
    // ID'ye göre kitabı bul
    const book = allBooks.find(book => book.id === parseInt(id));
    if (!book) {
      throw new Error(`ID ${id} olan kitap bulunamadı`);
    }
    
    console.log('[BOOK][RESPONSE] /Books/getById - found book:', book);
    return book;
  } catch (error) {
    console.error('[BOOK][ERROR] /Books/getById:', error);
    throw new Error('Kitap detayı alınamadı');
  }
}

export const bookService = {
  async getAllBooks() {
    const response = await fetch(`${BASE_URL}/Books/AllBooks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Kitaplar yüklenemedi');
    }
    return await response.json();
  }
};

 