// Yönetim paneli için API servisleri
const BASE_URL = 'https://greenbooksapi-production.up.railway.app/api';

// Yönetim paneli genel bilgiler (istatistikler) servisi
export async function getDashboardStats() {
  console.log('[MANAGEMENT][REQUEST] /Books/General');
  const response = await fetch(`${BASE_URL}/Books/General`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  console.log('[MANAGEMENT][RESPONSE] /Books/General', data);
  if (!response.ok) {
    throw new Error('Genel bilgiler alınamadı');
  }
  return data;
}

export const managementService = {
  // Yeni kitap ekle
  async addBook(bookData) {
    console.log('[MANAGEMENT][REQUEST] /ManagementPanel/add', bookData);
    try {
      const requestBody = {
        title: bookData.title,
        author: bookData.author,
        price: parseFloat(bookData.price),
        image: bookData.image,
        description: bookData.description,
        category: bookData.category,
        subcategory: bookData.subcategory,
        publisher: bookData.publisher,
        discount_Rate: parseFloat(bookData.discount_Rate || 0),
        bestseller: bookData.bestseller === 'evet' ? 1 : 0
      };

      const response = await fetch(`${BASE_URL}/ManagementPanel/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      console.log('[MANAGEMENT][RESPONSE] /ManagementPanel/add', data);
      
      if (!response.ok) {
        throw new Error('Kitap eklenemedi');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Kitap ekleme hatası:', error);
      throw error;
    }
  },
  async deleteBook(id) {
    console.log('[MANAGEMENT][REQUEST] /ManagementPanel/delete/' + id);
    const response = await fetch(`${BASE_URL}/ManagementPanel/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    console.log('[MANAGEMENT][RESPONSE] /ManagementPanel/delete/' + id, data);
    return response;
  },
  async updateBook(book) {
    console.log('[MANAGEMENT][REQUEST] /ManagementPanel/update', book);
    const response = await fetch(`${BASE_URL}/ManagementPanel/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(book)
    });
    const data = await response.json();
    console.log('[MANAGEMENT][RESPONSE] /ManagementPanel/update', data);
    return response;
  },
  getDashboardStats,
}; 