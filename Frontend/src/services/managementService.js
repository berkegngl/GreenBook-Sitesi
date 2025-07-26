// Yönetim paneli için API servisleri
const BASE_URL = 'http://localhost:5266/api';


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
      let data = null;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      console.log('[MANAGEMENT][RESPONSE] /ManagementPanel/add', data);
      return { status: response.status, ok: response.ok, data };
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
    let data = null;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    console.log('[MANAGEMENT][RESPONSE] /ManagementPanel/delete/' + id, data);
    return { status: response.status, ok: response.ok, data };
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
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    console.log('[MANAGEMENT][RESPONSE] /ManagementPanel/update', data);
    return { status: response.status, ok: response.ok, data };
  },
  getDashboardStats,
  // Sipariş ekle
  async addOrder(orderData) {
    console.log('[ORDER][REQUEST] /Order/TakeOrder', orderData);
    try {
      const requestBody = {
        Isim: orderData.isim,
        Soyisim: orderData.soyisim,
        UrunlerJson: JSON.stringify(orderData.urunler),
        ToplamTutar: orderData.toplam_tutar,
        Adres: orderData.adres
      };
      const response = await fetch(`${BASE_URL}/Order/TakeOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      let data = null;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      console.log('[ORDER][RESPONSE] /Order/TakeOrder', data);
      return { status: response.status, ok: response.ok, data };
    } catch (error) {
      console.error('❌ Sipariş ekleme hatası:', error);
      throw error;
    }
  },
  // Siparişleri listele
  async getOrders() {
    const response = await fetch(`${BASE_URL}/Order/ListOrders`);
    if (!response.ok) throw new Error('Siparişler alınamadı');
    return await response.json();
  },
}; 