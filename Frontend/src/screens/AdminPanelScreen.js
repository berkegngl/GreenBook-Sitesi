import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import megaCategories from '../constants/megaCategories';
import { managementService } from '../services/managementService';
import GlobalToast from '../components/GlobalToast';
import { bookService } from '../services/bookService';
import { fetchBooksBySearch } from '../services/bookService';

export default function AdminPanelScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [bookSort, setBookSort] = useState({ field: '', direction: 'asc' });
  const [orderSort, setOrderSort] = useState({ field: '', direction: 'asc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [selectedCategoryForType, setSelectedCategoryForType] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publisher: '',
    category: '',
    subcategory: '',
    price: '',
    image: ''
  });
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [editModal, setEditModal] = useState({ open: false, book: null });
  const [dashboardStats, setDashboardStats] = useState({ totalBooks: 0, totalUsers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeout = useRef();

  // Sistemdeki mevcut verilerden dinamik listeler oluştur
  const booksData = [
    { id: 1, title: 'Kürk Mantolu Madonna', author: 'Sabahattin Ali', price: 80, originalPrice: 101, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Modern Türk edebiyatının başyapıtlarından.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'Yapı Kredi Yayınları' },
    { id: 2, title: 'Tutunamayanlar', author: 'Oğuz Atay', price: 120, originalPrice: 144, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Türk edebiyatının kült romanı.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İletişim Yayınları' },
    { id: 3, title: 'Çile', author: 'Necip Fazıl Kısakürek', price: 60, originalPrice: 75, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Türk şiirinin önemli eserlerinden.', category: 'Edebiyat Kitapları', subcategory: 'Şiir', publisher: 'Büyük Doğu Yayınları' },
    { id: 4, title: 'Saatleri Ayarlama Enstitüsü', author: 'Ahmet Hamdi Tanpınar', price: 95, originalPrice: 119, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Modern Türk romanı.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'Dergah Yayınları' },
    { id: 5, title: 'Kuyucaklı Yusuf', author: 'Sabahattin Ali', price: 70, originalPrice: 91, image: 'https://img.kitapyurdu.com/v1/getImage/fn:1105919/wh:true/wi:220', description: 'Klasik Türk romanı.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'Yapı Kredi Yayınları' },
    { id: 6, title: 'Sefiller', author: 'Victor Hugo', price: 110, originalPrice: 137, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'Dünya edebiyatının başyapıtı.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İş Bankası Kültür Yayınları' },
    { id: 7, title: 'Suç ve Ceza', author: 'Fyodor Dostoyevski', price: 105, originalPrice: 127, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Rus edebiyatının en önemli romanlarından.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İş Bankası Kültür Yayınları' },
    { id: 8, title: 'Anna Karenina', author: 'Lev Tolstoy', price: 130, originalPrice: 156, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Dünya klasiklerinden.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'Can Yayınları' },
    { id: 9, title: 'İnce Memed', author: 'Yaşar Kemal', price: 90, originalPrice: 117, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Türk edebiyatının destansı romanı.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'Yapı Kredi Yayınları' },
    { id: 10, title: 'Aşk ve Gurur', author: 'Jane Austen', price: 85, originalPrice: 110, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'İngiliz edebiyatının başyapıtı.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'Can Yayınları' },
    { id: 11, title: 'TYT Türkçe Soru Bankası', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'TYT için kapsamlı Türkçe soru bankası.', category: 'Eğitim Kitapları', subcategory: 'TYT-AYT Kitapları', publisher: 'Pegem Akademi' },
    { id: 12, title: 'AYT Matematik Denemeleri', author: 'Kolektif', price: 65, image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', description: 'AYT için matematik denemeleri.', category: 'Eğitim Kitapları', subcategory: 'TYT-AYT Kitapları', publisher: 'Palme Yayınevi' },
    { id: 13, title: 'KPSS Genel Kültür', author: 'Kolektif', price: 70, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'KPSS için genel kültür kitabı.', category: 'Eğitim Kitapları', subcategory: 'KPSS Kitapları', publisher: 'Pegem Akademi' },
    { id: 14, title: 'LGS Matematik', author: 'Kolektif', price: 45, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'LGS için matematik kitabı.', category: 'Eğitim Kitapları', subcategory: 'LGS Kitapları', publisher: 'Palme Yayınevi' },
    { id: 15, title: 'DGS Matematik', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'DGS için matematik kitabı.', category: 'Eğitim Kitapları', subcategory: 'DGS Kitapları', publisher: 'Pegem Akademi' },
    { id: 16, title: 'Felsefe Tarihi', author: 'Ahmet Cevizci', price: 85, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Felsefe tarihi üzerine kapsamlı kitap.', category: 'Felsefe Kitapları', subcategory: 'Felsefe Tarihi', publisher: 'Say Yayınları' },
    { id: 17, title: 'Din Felsefesi', author: 'Kolektif', price: 75, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Din felsefesi üzerine.', category: 'Felsefe Kitapları', subcategory: 'Din Felsefesi', publisher: 'İz Yayıncılık' },
    { id: 18, title: 'Küçük Prens', author: 'Antoine de Saint-Exupéry', price: 40, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Dünya çocuk edebiyatının başyapıtı.', category: 'Çocuk Kitapları', subcategory: 'Roman ve Öyküler', publisher: 'Can Yayınları' },
    { id: 19, title: 'Pinokyo', author: 'Carlo Collodi', price: 35, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Klasik çocuk masalı.', category: 'Çocuk Kitapları', subcategory: 'Masallar', publisher: 'Can Yayınları' },
    { id: 20, title: 'Alice Harikalar Diyarında', author: 'Lewis Carroll', price: 45, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Fantastik çocuk romanı.', category: 'Çocuk Kitapları', subcategory: 'Roman ve Öyküler', publisher: 'İş Bankası Kültür Yayınları' },
    { id: 21, title: 'Kırmızı Başlıklı Kız', author: 'Grimm Kardeşler', price: 25, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Klasik masal.', category: 'Çocuk Kitapları', subcategory: 'Masallar', publisher: 'Tudem Yayınları' },
    { id: 22, title: 'Uyuyan Güzel', author: 'Grimm Kardeşler', price: 25, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Klasik masal.', category: 'Çocuk Kitapları', subcategory: 'Masallar', publisher: 'Tudem Yayınları' },
    { id: 23, title: 'Pamuk Prenses', author: 'Grimm Kardeşler', price: 25, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Klasik masal.', category: 'Çocuk Kitapları', subcategory: 'Masallar', publisher: 'Tudem Yayınları' },
    { id: 24, title: 'Anadolu Rehberi', author: 'Kolektif', price: 85, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Anadolu için rehber kitap.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Rehber', publisher: 'Boyut Yayın Grubu' },
    { id: 25, title: 'Kapadokya Rehberi', author: 'Kolektif', price: 65, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Kapadokya için rehber kitap.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Rehber', publisher: 'Boyut Yayın Grubu' },
    { id: 26, title: 'İstanbul Rehberi', author: 'Kolektif', price: 75, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'İstanbul için rehber kitap.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Rehber', publisher: 'Boyut Yayın Grubu' },
    { id: 27, title: 'Dünya Gezi Kitabı', author: 'Kolektif', price: 95, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Dünya genelinde gezi önerileri.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Gezi', publisher: 'Lonely Planet Türkiye' },
    { id: 28, title: 'Beslenme ve Diyet', author: 'Kolektif', price: 50, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Sağlıklı yaşam için beslenme.', category: 'Sağlık Kitapları', subcategory: 'Beslenme', publisher: 'Nobel Akademik Yayıncılık' },
    { id: 29, title: 'Aile Sağlığı', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Aile sağlığı üzerine bilgiler.', category: 'Sağlık Kitapları', subcategory: 'Aile Sağlığı', publisher: 'Hayykitap' },
    { id: 30, title: 'Çocuk Gelişimi', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Çocuk gelişimi üzerine.', category: 'Sağlık Kitapları', subcategory: 'Çocuk Gelişimi', publisher: 'Remzi Kitabevi' },
    { id: 31, title: 'Kişisel Gelişim 101', author: 'Kolektif', price: 45, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Kişisel gelişim için temel bilgiler.', category: 'İnsan ve Toplum Kitapları', subcategory: 'Kişisel Gelişim', publisher: 'Destek Yayınları' },
    { id: 32, title: 'Kültür ve Sanat', author: 'Kolektif', price: 70, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Kültür ve sanat üzerine.', category: 'İnsan ve Toplum Kitapları', subcategory: 'Kültür', publisher: 'İş Bankası Kültür Yayınları' },
    { id: 33, title: 'Popüler Kültür', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Popüler kültür üzerine.', category: 'İnsan ve Toplum Kitapları', subcategory: 'Popüler Kültür', publisher: 'Destek Yayınları' },
    { id: 34, title: 'Yunan Mitolojisi', author: 'Kolektif', price: 80, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Yunan mitolojisi üzerine.', category: 'İnanç Kitapları ve Mitolojiler', subcategory: 'Mitolojiler', publisher: 'İş Bankası Kültür Yayınları' },
    { id: 35, title: 'Dinler Tarihi', author: 'Kolektif', price: 90, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Dinler tarihi üzerine.', category: 'İnanç Kitapları ve Mitolojiler', subcategory: 'Dinler Tarihi', publisher: 'İz Yayıncılık' },
    { id: 36, title: 'İslam Tarihi', author: 'Kolektif', price: 85, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'İslam tarihi üzerine.', category: 'İnanç Kitapları ve Mitolojiler', subcategory: 'İslam Kitapları', publisher: 'İz Yayıncılık' },
    { id: 37, title: 'Genel Psikoloji', author: 'Kolektif', price: 75, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Genel psikoloji üzerine.', category: 'Psikoloji Kitapları', subcategory: 'Genel Psikoloji', publisher: 'Remzi Kitabevi' },
    { id: 38, title: 'Çocuk Psikolojisi', author: 'Kolektif', price: 65, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Çocuk psikolojisi üzerine.', category: 'Psikoloji Kitapları', subcategory: 'Çocuk Psikolojisi', publisher: 'Remzi Kitabevi' },
    { id: 39, title: 'Eğitim Psikolojisi', author: 'Kolektif', price: 70, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Eğitim psikolojisi üzerine.', category: 'Psikoloji Kitapları', subcategory: 'Eğitim Psikolojisi', publisher: 'Pegem Akademi' },
    { id: 40, title: 'Hukuk Üzerine', author: 'Kolektif', price: 85, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Hukuk üzerine genel bilgiler.', category: 'Hukuk Kitapları', subcategory: 'Hukuk Üzerine', publisher: 'Seçkin Yayıncılık' },
    { id: 41, title: 'Hukuk Ders Kitabı', author: 'Kolektif', price: 95, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Hukuk ders kitabı.', category: 'Hukuk Kitapları', subcategory: 'Ders Kitapları', publisher: 'Seçkin Yayıncılık' },
    { id: 42, title: 'Kanun ve Uygulama', author: 'Kolektif', price: 80, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Kanun ve uygulama üzerine.', category: 'Hukuk Kitapları', subcategory: 'Kanun ve Uygulama', publisher: 'Seçkin Yayıncılık' },
    { id: 43, title: 'Can Yayınları Seçkisi', author: 'Can Yayınları', price: 70, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Can Yayınları\'ndan seçki.', category: 'Yayınevleri', subcategory: 'Can Yayınları', publisher: 'Can Yayınları' },
    { id: 44, title: 'Çocuk Kitapları', author: 'Artemis Yayınları', price: 60, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Artemis Yayınları\'ndan çocuk kitapları.', category: 'Yayınevleri', subcategory: 'Artemis Yayınları', publisher: 'Artemis Yayınları' },
    { id: 45, title: 'Biyografi Seçkisi', author: 'Sel Yayıncılık', price: 75, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Sel Yayıncılık\'tan biyografi kitapları.', category: 'Yayınevleri', subcategory: 'Sel Yayıncılık', publisher: 'Sel Yayıncılık' },
    { id: 46, title: 'Kürk Mantolu Madonna', author: 'Sabahattin Ali', price: 80, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Sabahattin Ali\'den başyapıt.', category: 'Yazarlar', subcategory: 'Sabahattin Ali', publisher: 'Yapı Kredi Yayınları' },
    { id: 47, title: 'Simyacı', author: 'Paulo Coelho', price: 95, image: 'https://covers.openlibrary.org/b/id/291479-M.jpg', description: 'Paulo Coelho\'dan Simyacı.', category: 'Yazarlar', subcategory: 'Paulo Coelho', publisher: 'Can Yayınları' },
    { id: 48, title: '1984', author: 'George Orwell', price: 120, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'George Orwell\'dan 1984.', category: 'Yazarlar', subcategory: 'George Orwell', publisher: 'Can Yayınları' },
    { id: 49, title: 'Dune', author: 'Frank Herbert', price: 110, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Bilim kurgu klasiği.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İthaki Yayınları' },
    { id: 50, title: 'Vakıf', author: 'Isaac Asimov', price: 100, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Bilim kurgu serisi.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İthaki Yayınları' },
  ];

  // Türkçe alfabesine göre sıralama fonksiyonu
  const turkishSort = (a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' });

  // Dinamik listeler oluştur
  const allCategories = Array.from(new Set(books.map(b => b.category).filter(Boolean)))
    .filter(cat => cat !== 'Yayınevleri' && cat !== 'Yazarlar')
    .sort(turkishSort);
  
  const allAuthors = Array.from(new Set(books.map(b => b.author).filter(Boolean))).sort(turkishSort);
  const allPublishers = Array.from(new Set(books.map(b => b.publisher).filter(Boolean))).sort(turkishSort);
  const allTypes = Array.from(new Set(books.map(b => b.subcategory).filter(Boolean))).sort(turkishSort);
  
  // Seçili kategoriye göre türler (subcategory)
  const allSubcategories = React.useMemo(() => {
    if (!newBook.category) return [];
    // megaCategories'den bul
    const found = megaCategories.find(cat => cat.name === newBook.category);
    if (found) return found.sub;
    // Yoksa kitaplardan çıkar
    return Array.from(new Set(books.filter(b => b.category === newBook.category).map(b => b.subcategory).filter(Boolean))).sort();
  }, [newBook.category, books]);

  // Edit modalı için seçili kategoriye göre türler (subcategory)
  const allSubcategoriesEdit = React.useMemo(() => {
    if (!editModal.book || !editModal.book.category) return [];
    const found = megaCategories.find(cat => cat.name === editModal.book.category);
    if (found) return found.sub;
    return Array.from(new Set(books.filter(b => b.category === editModal.book.category).map(b => b.subcategory).filter(Boolean))).sort();
  }, [editModal.book, books]);

  const sortedBooks = React.useMemo(() => {
    if (!bookSort.field) return books;
    const sorted = [...books].sort((a, b) => {
      if (a[bookSort.field] < b[bookSort.field]) return bookSort.direction === 'asc' ? -1 : 1;
      if (a[bookSort.field] > b[bookSort.field]) return bookSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [bookSort, books]);

  const sortedOrders = React.useMemo(() => {
    if (!orderSort.field) return orders;
    const sorted = [...orders].sort((a, b) => {
      let aValue = a[orderSort.field];
      let bValue = b[orderSort.field];
      
      // Özel sıralama kuralları
      if (orderSort.field === 'musteri') {
        aValue = `${a.isim} ${a.soyisim}`.toLowerCase();
        bValue = `${b.isim} ${b.soyisim}`.toLowerCase();
      } else if (orderSort.field === 'urunler') {
        try {
          const aUrunler = JSON.parse(a.urunlerJson || '[]');
          const bUrunler = JSON.parse(b.urunlerJson || '[]');
          aValue = Array.isArray(aUrunler) ? aUrunler.join(', ').toLowerCase() : '';
          bValue = Array.isArray(bUrunler) ? bUrunler.join(', ').toLowerCase() : '';
        } catch {
          aValue = '';
          bValue = '';
        }
      } else if (orderSort.field === 'tarih') {
        aValue = new Date(a.orderTime || 0);
        bValue = new Date(b.orderTime || 0);
      } else if (orderSort.field === 'toplamTutar') {
        aValue = parseFloat(a.toplamTutar || 0);
        bValue = parseFloat(b.toplamTutar || 0);
      } else if (orderSort.field === 'siparisNo') {
        aValue = parseInt(a.siparisNo || 0);
        bValue = parseInt(b.siparisNo || 0);
      }
      
      if (aValue < bValue) return orderSort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return orderSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [orderSort, orders]);

  const handleBookSort = (field) => {
    setBookSort(prev => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
  };

  const handleOrderSort = (field) => {
    setOrderSort(prev => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yeni kategori eklendi:', newCategory.trim());
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category) => {
    const bookCount = booksData.filter(book => book.category === category).length;
    if (bookCount === 0) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Kategori silindi:', category);
    }
  };

  const handleAddType = () => {
    if (newType.trim() && selectedCategoryForType && !allTypes.includes(newType.trim())) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yeni tür eklendi:', newType.trim(), 'kategori:', selectedCategoryForType);
      setNewType('');
      setSelectedCategoryForType('');
    }
  };

  const handleDeleteType = (type) => {
    const bookCount = booksData.filter(book => book.subcategory === type).length;
    if (bookCount === 0) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Tür silindi:', type);
    }
  };

  const handleAddAuthor = () => {
    if (newAuthor.trim() && !allAuthors.includes(newAuthor.trim())) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yeni yazar eklendi:', newAuthor.trim());
      setNewAuthor('');
    }
  };

  const handleDeleteAuthor = (author) => {
    const bookCount = booksData.filter(book => book.author === author).length;
    if (bookCount === 0) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yazar silindi:', author);
    }
  };

  const handleAddPublisher = () => {
    if (newPublisher.trim() && !allPublishers.includes(newPublisher.trim())) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yeni yayınevi eklendi:', newPublisher.trim());
      setNewPublisher('');
    }
  };

  const handleDeletePublisher = (publisher) => {
    const bookCount = booksData.filter(book => book.publisher === publisher).length;
    if (bookCount === 0) {
      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yayınevi silindi:', publisher);
    }
  };

  // Kullanıcı sıralama fonksiyonu ve ilgili state/fonksiyonları kaldırıyorum

  // Admin kontrolü
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(savedUser);
    if (String(userData.isAdmin) !== '1') {
      navigate('/');
      return;
    }

    setUser(userData);
  }, [navigate]);

  // Kitap Yönetimi sekmesine tıklandığında kitapları çek
  useEffect(() => {
    if (activeTab === 'books') {
      if (searchTerm.trim() === '') {
        bookService.getAllBooks()
          .then(data => setBooks(data))
          .catch(() => setToast({ type: 'error', message: 'Kitaplar yüklenemedi' }));
      } else {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
          fetchBooksBySearch(searchTerm)
            .then(data => setBooks(data))
            .catch(() => setToast({ type: 'error', message: 'Arama başarısız' }));
        }, 100);
      }
    }
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [activeTab, searchTerm]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      managementService.getDashboardStats()
        .then(data => {
          console.log('Dashboard API response:', data);
          const stats = Array.isArray(data) && data.length > 0 ? data[0] : {};
          setDashboardStats({
            totalBooks: stats.total_books || 0,
            totalUsers: stats.total_users || 0
          });
        })
        .catch(() => setDashboardStats({ totalBooks: 0, totalUsers: 0 }));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'lastorders') {
      managementService.getOrders()
        .then(setOrders)
        .catch(() => setOrders([]));
    }
  }, [activeTab]);

  // Kategoriler sekmesine geçildiğinde kitapları çek
  useEffect(() => {
    if (activeTab === 'categories') {
      bookService.getAllBooks()
        .then(data => setBooks(data))
        .catch(() => setToast({ type: 'error', message: 'Kategoriler yüklenemedi' }));
    }
  }, [activeTab]);

  // Türler sekmesine geçildiğinde kitapları çek
  useEffect(() => {
    if (activeTab === 'type') {
      bookService.getAllBooks()
        .then(data => setBooks(data))
        .catch(() => setToast({ type: 'error', message: 'Türler yüklenemedi' }));
    }
  }, [activeTab]);

  // Yayınevleri sekmesine geçildiğinde kitapları çek
  useEffect(() => {
    if (activeTab === 'publishers') {
      bookService.getAllBooks()
        .then(data => setBooks(data))
        .catch(() => setToast({ type: 'error', message: 'Yayınevleri yüklenemedi' }));
    }
  }, [activeTab]);

  // Yazarlar sekmesine geçildiğinde kitapları çek
  useEffect(() => {
    if (activeTab === 'authors') {
      bookService.getAllBooks()
        .then(data => setBooks(data))
        .catch(() => setToast({ type: 'error', message: 'Yazarlar yüklenemedi' }));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (setUser) setUser(null);
    navigate('/');
    window.location.reload();
  };

  const handleDeleteBook = async (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });
    try {
      const response = await managementService.deleteBook(id);
      if (
        response && (
          response.ok ||
          response.status === 200 ||
          (response.data && typeof response.data === 'string' && response.data.toLowerCase().includes('başarı')) ||
          (response.data && typeof response.data === 'object' && response.data.message && response.data.message.toLowerCase().includes('başarı'))
        )
      ) {
        setToast({ type: 'success', message: 'Silme başarılı' });
        setBooks(prev => prev.filter(book => book.id !== id));
      } else {
        setToast({ type: 'error', message: 'Bir hata oluştu' });
      }
    } catch {
      setToast({ type: 'error', message: 'Bir hata oluştu' });
    }
  };

  const handleEditBook = (book) => {
    setEditModal({
      open: true,
      book: {
        ...book,
        discountRate: book.discount_Rate !== undefined ? book.discount_Rate : ''
      }
    });
  };

  const handleEditInputChange = (field, value) => {
    setEditModal((prev) => ({ ...prev, book: { ...prev.book, [field]: value } }));
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const book = editModal.book;
    // Validasyon (gerekirse eklenebilir)
    try {
      const response = await managementService.updateBook({
        id: book.id,
        title: book.title,
        author: book.author,
        price: parseFloat(book.price),
        image: book.image,
        description: book.description,
        category: book.category,
        subcategory: book.subcategory,
        publisher: book.publisher,
        discountRate: parseFloat(book.discountRate),
        bestseller: book.bestseller === 'evet' ? 1 : 0
      });
      if (
        response && (
          response.ok ||
          response.status === 200 ||
          (response.data && typeof response.data === 'string' && response.data.toLowerCase().includes('başarı')) ||
          (response.data && typeof response.data === 'object' && response.data.message && response.data.message.toLowerCase().includes('başarı'))
        )
      ) {
        setToast({ type: 'success', message: 'Güncelleme başarılı' });
        // Listeyi güncelle
        setBooks((prev) => prev.map((b) => b.id === book.id ? { ...book, discountRate: parseFloat(book.discountRate), bestseller: book.bestseller === 'evet' ? 1 : 0 } : b));
        setEditModal({ open: false, book: null });
      } else {
        setToast({ type: 'error', message: 'Bir hata oluştu' });
      }
    } catch {
      setToast({ type: 'error', message: 'Bir hata oluştu' });
    }
  };

  const renderDashboard = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1a7f37', marginBottom: '30px' }}>Genel Bilgiler</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #1a7f37'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Toplam Kitap</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1a7f37' }}>{dashboardStats.totalBooks}</p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #2196f3'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Toplam Kullanıcı</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#2196f3' }}>{dashboardStats.totalUsers}</p>
        </div>
      </div>
    </div>
  );

  const renderBooks = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a7f37', margin: 0 }}>Kitap Yönetimi</h2>
        <button style={{
          padding: '10px 24px',
          backgroundColor: '#1a7f37',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '15px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(26,127,55,0.10)'
        }}
        onClick={() => {
          setNewBook({
            title: '',
            author: '',
            publisher: '',
            category: '',
            subcategory: '',
            price: '',
            image: ''
          });
          setShowAddModal(true);
        }}
        >
          + Yeni Kitap Ekle
        </button>
      </div>
      <div style={{ marginBottom: '18px', maxWidth: 340 }}>
        <input
          type="text"
          placeholder="Kitap adına göre ara..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1.5px solid #e0e0e0',
            fontSize: '15px',
            outline: 'none',
            background: '#fff',
            color: '#222',
            boxSizing: 'border-box',
            marginBottom: 0
          }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => handleBookSort('title')}>
                Kitap Adı {bookSort.field === 'title' ? (bookSort.direction === 'asc' ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => handleBookSort('author')}>
                Yazar {bookSort.field === 'author' ? (bookSort.direction === 'asc' ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => handleBookSort('publisher')}>
                Yayınevi {bookSort.field === 'publisher' ? (bookSort.direction === 'asc' ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => handleBookSort('category')}>
                Kategori {bookSort.field === 'category' ? (bookSort.direction === 'asc' ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => handleBookSort('subcategory')}>
                Tür {bookSort.field === 'subcategory' ? (bookSort.direction === 'asc' ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => handleBookSort('price')}>
                Fiyat {bookSort.field === 'price' ? (bookSort.direction === 'asc' ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book, i) => (
              <tr key={i}>
                <td style={{ padding: '14px 16px', color: '#333' }}>{book.title}</td>
                <td style={{ padding: '14px 16px', color: '#333' }}>{book.author}</td>
                <td style={{ padding: '14px 16px', color: '#333' }}>{book.publisher}</td>
                <td style={{ padding: '14px 16px', color: '#333' }}>{book.category}</td>
                <td style={{ padding: '14px 16px', color: '#333' }}>{book.subcategory}</td>
                <td style={{ padding: '14px 16px', color: '#333' }}>{book.price} TL</td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{
                    padding: '6px 14px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginRight: '8px'
                  }} onClick={() => handleEditBook(book)}>Düzenle</button>
                  <button style={{
                    padding: '6px 14px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }} onClick={() => handleDeleteBook(book.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
            padding: '36px 32px 28px 32px',
            minWidth: 340,
            maxWidth: 420,
            width: '100%',
            position: 'relative'
          }}>
            <button onClick={() => {
              setNewBook({
                title: '',
                author: '',
                publisher: '',
                category: '',
                subcategory: '',
                price: '',
                image: '',
                description: '',
                discount_Rate: '',
                bestseller: ''
              });
              setShowAddModal(false);
            }} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ color: '#1a7f37', marginBottom: 18, fontSize: '1.25rem' }}>Yeni Kitap Ekle</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              // Validasyon: tüm alanlar dolu olmalı
              if (!newBook.title || !newBook.author || !newBook.publisher || !newBook.category || !newBook.subcategory || !newBook.price || !newBook.image || !newBook.description || newBook.discount_Rate === '' || newBook.bestseller === '') {
                alert('Lütfen tüm alanları doldurunuz!');
                return;
              }
              try {
                const bookData = {
                  title: newBook.title,
                  author: newBook.author,
                  price: parseFloat(newBook.price),
                  image: newBook.image,
                  description: newBook.description,
                  category: newBook.category,
                  subcategory: newBook.subcategory,
                  publisher: newBook.publisher,
                  discount_Rate: parseFloat(newBook.discount_Rate),
                  bestseller: newBook.bestseller === 'evet' ? 1 : 0
                };
                const response = await managementService.addBook(bookData);
                if (
                  response && (
                    response.ok ||
                    response.status === 200 ||
                    (typeof response.data === 'string' && response.data.toLowerCase().includes('başarı')) ||
                    (typeof response.data === 'object' && response.data.message && response.data.message.toLowerCase().includes('başarı'))
                  )
                ) {
                  setToast({ type: 'success', message: 'Ekleme başarılı' });
                  setNewBook({
                    title: '',
                    author: '',
                    publisher: '',
                    category: '',
                    subcategory: '',
                    price: '',
                    image: '',
                    description: '',
                    discount_Rate: '',
                    bestseller: ''
                  });
                  setShowAddModal(false);
                } else {
                  setToast({ type: 'error', message: 'Bir hata oluştu' });
                }
              } catch (err) {
                setToast({ type: 'error', message: 'Bir hata oluştu' });
              }
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Kitap Adı</label>
                <input type="text" value={newBook.title} onChange={e => setNewBook(b => ({ ...b, title: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} placeholder="Kitap adı" required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Yazar</label>
                <input type="text" value={newBook.author} onChange={e => setNewBook(b => ({ ...b, author: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} placeholder="Yazar adı" required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Yayınevi</label>
                <input type="text" value={newBook.publisher} onChange={e => setNewBook(b => ({ ...b, publisher: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} placeholder="Yayınevi" required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Kategori</label>
                <select value={newBook.category} onChange={e => setNewBook(b => ({ ...b, category: e.target.value, subcategory: '' }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required>
                  <option value="">Seçiniz</option>
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Tür</label>
                <select value={newBook.subcategory} onChange={e => setNewBook(b => ({ ...b, subcategory: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required disabled={!newBook.category}>
                  <option value="">Seçiniz</option>
                  {allSubcategories.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Fiyat</label>
                <input type="number" value={newBook.price} onChange={e => setNewBook(b => ({ ...b, price: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} placeholder="Fiyat (TL)" min="0" required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Ürün Fotoğrafı (Link)</label>
                <input type="text" value={newBook.image} onChange={e => setNewBook(b => ({ ...b, image: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} placeholder="https://..." required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Açıklama</label>
                <textarea value={newBook.description} onChange={e => setNewBook(b => ({ ...b, description: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4, minHeight: '80px', resize: 'vertical' }} placeholder="Kitap açıklaması..." required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>İndirim Oranı (%)</label>
                <input type="number" value={newBook.discount_Rate} onChange={e => setNewBook(b => ({ ...b, discount_Rate: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} placeholder="0" min="0" max="100" required />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 500 }}>Çok Satan</label>
                <select value={newBook.bestseller} onChange={e => setNewBook(b => ({ ...b, bestseller: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required>
                  <option value="">Seçiniz</option>
                  <option value="evet">Evet</option>
                  <option value="hayır">Hayır</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#1a7f37', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Kitap Ekle
              </button>
            </form>
          </div>
        </div>
      )}
      <GlobalToast toast={toast} onClose={() => setToast(null)} />
      {deleteConfirm.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.13)', padding: 32, minWidth: 320, textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#222', marginBottom: 24 }}>Bu kitabı silmek istediğinize emin misiniz?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button onClick={confirmDelete} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Sil</button>
              <button onClick={() => setDeleteConfirm({ open: false, id: null })} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Vazgeç</button>
            </div>
          </div>
        </div>
      )}
      {editModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.13)', padding: 32, minWidth: 340, maxWidth: 420, width: '100%', position: 'relative' }}>
            <button onClick={() => setEditModal({ open: false, book: null })} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ color: '#1a7f37', marginBottom: 18, fontSize: '1.25rem' }}>Kitap Düzenle</h2>
            <form onSubmit={handleUpdateBook}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Kitap Adı</label>
                <input type="text" value={editModal.book.title} onChange={e => handleEditInputChange('title', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Yazar</label>
                <input type="text" value={editModal.book.author} onChange={e => handleEditInputChange('author', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Yayınevi</label>
                <input type="text" value={editModal.book.publisher} onChange={e => handleEditInputChange('publisher', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Kategori</label>
                <select value={editModal.book.category} onChange={e => handleEditInputChange('category', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required>
                  <option value="">Seçiniz</option>
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Tür</label>
                <select value={editModal.book.subcategory} onChange={e => handleEditInputChange('subcategory', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required disabled={!editModal.book.category}>
                  <option value="">Seçiniz</option>
                  {allSubcategoriesEdit.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Fiyat</label>
                <input type="number" value={editModal.book.price} onChange={e => handleEditInputChange('price', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} min="0" required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Ürün Fotoğrafı (Link)</label>
                <input type="text" value={editModal.book.image} onChange={e => handleEditInputChange('image', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>Açıklama</label>
                <textarea value={editModal.book.description} onChange={e => handleEditInputChange('description', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4, minHeight: '80px', resize: 'vertical' }} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>İndirim Oranı (%)</label>
                <input type="number" value={editModal.book.discountRate} onChange={e => handleEditInputChange('discountRate', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} min="0" max="100" required />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 500 }}>Çok Satan</label>
                <select value={editModal.book.bestseller === 1 ? 'evet' : 'hayır'} onChange={e => handleEditInputChange('bestseller', e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, marginTop: 4 }} required>
                  <option value="hayır">Hayır</option>
                  <option value="evet">Evet</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#1a7f37', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1a7f37', marginBottom: '20px' }}>Kullanıcılar</h2>
      <p>Kullanıcı yönetimi için buraya özel bir içerik ekleyebilirsiniz.</p>
    </div>
  );

  const renderOrders = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1a7f37', marginBottom: '20px' }}>Sipariş Yönetimi</h2>
      
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Sipariş No</th>
              <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Müşteri</th>
              <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Ürünler</th>
              <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Toplam Tutar</th>
              <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Tarih</th>
              <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Adres</th>
            </tr>
          </thead>
          <tbody>
            {console.log('Gelen orders:', orders)}
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '15px' }}>
                  Hiç sipariş yok.
                </td>
              </tr>
            ) : (
              orders.map(order => {
                // JSON string'i parse et
                let urunler = [];
                try {
                  if (order.urunlerJson) {
                    urunler = JSON.parse(order.urunlerJson);
                  }
                } catch (e) {
                  console.error('Ürünler JSON parse hatası:', e);
                  urunler = [order.urunlerJson || 'Bilinmeyen ürün'];
                }
                
                // Tarih formatla
                let tarihText = '';
                if (order.orderTime) {
                  try {
                    const tarih = new Date(order.orderTime);
                    tarihText = tarih.toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  } catch (e) {
                    tarihText = 'Tarih bilgisi yok';
                  }
                }
                
                return (
                  <tr key={order.siparisNo}>
                    <td style={{ padding: '14px', fontWeight: 'bold', color: '#1a7f37' }}>#{order.siparisNo}</td>
                    <td style={{ padding: '14px' }}>{order.isim} {order.soyisim}</td>
                    <td style={{ padding: '14px' }}>
                      {Array.isArray(urunler) ? urunler.join(', ') : urunler}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 'bold', color: '#1a7f37' }}>{order.toplamTutar} TL</td>
                    <td style={{ padding: '14px', fontSize: '13px', color: '#666' }}>{tarihText}</td>
                    <td style={{ padding: '14px', fontSize: '13px', color: '#666' }}>{order.adres}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        backgroundColor: '#1a7f37', 
        color: 'white',
        padding: '20px 0'
      }}>
                 <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
           <h2 style={{ margin: 0, fontSize: '20px' }}>GreenBook Admin</h2>
           <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>Yönetim Paneli</p>
           {user && (
             <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
               <p style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.8 }}>Hoş geldiniz,</p>
               <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                 {user.firstName && user.lastName
                   ? `${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1).toLowerCase()} ${user.lastName.charAt(0).toUpperCase()}${user.lastName.slice(1).toLowerCase()}`
                   : user.email}
               </p>
             </div>
           )}
         </div>
        
        <nav style={{ padding: '20px 0' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Genel Bilgiler
          </button>
          <button
            onClick={() => setActiveTab('books')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'books' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Kitap Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('category')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'category' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Kategoriler
          </button>
          <button
            onClick={() => setActiveTab('type')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'type' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Türler
          </button>
          <button
            onClick={() => setActiveTab('publisher')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'publisher' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Yayınevleri
          </button>
          <button
            onClick={() => setActiveTab('author')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'author' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Yazarlar
          </button>
          <button
            onClick={() => setActiveTab('lastorders')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: activeTab === 'lastorders' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Son Siparişler
          </button>
        </nav>
        
                 <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
           <button
             onClick={() => navigate('/')}
             style={{
               width: '100%',
               padding: '10px',
               backgroundColor: 'rgba(255,255,255,0.1)',
               color: 'white',
               border: 'none',
               borderRadius: '6px',
               cursor: 'pointer',
               fontSize: '14px',
               marginBottom: '10px'
             }}
           >
              Ana Sayfa
           </button>
           <button
             onClick={handleLogout}
             style={{
               width: '100%',
               padding: '10px',
               backgroundColor: 'rgba(255,255,255,0.1)',
               color: 'white',
               border: 'none',
               borderRadius: '6px',
               cursor: 'pointer',
               fontSize: '14px'
             }}
           >
              Çıkış Yap
           </button>
         </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'books' && renderBooks()}
        {activeTab === 'category' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1a7f37', marginBottom: '24px' }}>Kategoriler</h2>
            
            {/* Kategori Listesi */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ color: '#333', margin: 0, fontSize: '1.1rem' }}>Mevcut Kategoriler</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Kategori Adı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Kitap Sayısı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allCategories.map((category, index) => {
                    const bookCount = books.filter(book => book.category === category).length;
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '14px 16px', color: '#333', fontWeight: 500 }}>{category}</td>
                        <td style={{ padding: '14px 16px', color: '#666' }}>{bookCount} kitap</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button style={{
                            padding: '6px 14px',
                            backgroundColor: bookCount > 0 ? '#ccc' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: bookCount > 0 ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleDeleteCategory(category)}
                          disabled={bookCount > 0}
                          >
                            {bookCount > 0 ? 'Kullanımda' : 'Sil'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'type' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1a7f37', marginBottom: '24px' }}>Türler</h2>
            {/* Tür Ekleme Formu kaldırıldı */}
            {/* Tür Listesi */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ color: '#333', margin: 0, fontSize: '1.1rem' }}>Mevcut Türler</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Tür Adı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Kitap Sayısı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTypes.map((type, index) => {
                    const bookCount = books.filter(book => book.subcategory === type).length;
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '14px 16px', color: '#333', fontWeight: 500 }}>{type}</td>
                        <td style={{ padding: '14px 16px', color: '#666' }}>{bookCount} kitap</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button style={{
                            padding: '6px 14px',
                            backgroundColor: bookCount > 0 ? '#ccc' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: bookCount > 0 ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleDeleteType(type)}
                          disabled={bookCount > 0}
                          >
                            {bookCount > 0 ? 'Kullanımda' : 'Sil'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'publisher' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1a7f37', marginBottom: '24px' }}>Yayınevleri</h2>
            {/* Yayınevi Ekleme Formu kaldırıldı */}
            {/* Yayınevi Listesi */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ color: '#333', margin: 0, fontSize: '1.1rem' }}>Mevcut Yayınevleri</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Yayınevi Adı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Kitap Sayısı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allPublishers.map((publisher, index) => {
                    const bookCount = books.filter(book => book.publisher === publisher).length;
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '14px 16px', color: '#333', fontWeight: 500 }}>{publisher}</td>
                        <td style={{ padding: '14px 16px', color: '#666' }}>{bookCount} kitap</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button style={{
                            padding: '6px 14px',
                            backgroundColor: bookCount > 0 ? '#ccc' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: bookCount > 0 ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleDeletePublisher(publisher)}
                          disabled={bookCount > 0}
                          >
                            {bookCount > 0 ? 'Kullanımda' : 'Sil'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'author' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1a7f37', marginBottom: '24px' }}>Yazarlar</h2>
            {/* Yazar Ekleme Formu kaldırıldı */}
            {/* Yazar Listesi */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ color: '#333', margin: 0, fontSize: '1.1rem' }}>Mevcut Yazarlar</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Yazar Adı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      Kitap Sayısı
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#222', borderBottom: '1.5px solid #eee' }}>
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allAuthors.map((author, index) => {
                    const bookCount = books.filter(book => book.author === author).length;
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '14px 16px', color: '#333', fontWeight: 500 }}>{author}</td>
                        <td style={{ padding: '14px 16px', color: '#666' }}>{bookCount} kitap</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button style={{
                            padding: '6px 14px',
                            backgroundColor: bookCount > 0 ? '#ccc' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: bookCount > 0 ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleDeleteAuthor(author)}
                          disabled={bookCount > 0}
                          >
                            {bookCount > 0 ? 'Kullanımda' : 'Sil'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'lastorders' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1a7f37', marginBottom: '20px' }}>Son Siparişler</h2>
            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th 
                      style={{ 
                        padding: '14px', 
                        textAlign: 'left', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleOrderSort('siparisNo')}
                    >
                      Sipariş No {orderSort.field === 'siparisNo' ? (orderSort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                    <th 
                      style={{ 
                        padding: '14px', 
                        textAlign: 'left', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleOrderSort('musteri')}
                    >
                      Müşteri {orderSort.field === 'musteri' ? (orderSort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                    <th 
                      style={{ 
                        padding: '14px', 
                        textAlign: 'left', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleOrderSort('urunler')}
                    >
                      Ürünler {orderSort.field === 'urunler' ? (orderSort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                    <th 
                      style={{ 
                        padding: '14px', 
                        textAlign: 'left', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleOrderSort('toplamTutar')}
                    >
                      Toplam Tutar {orderSort.field === 'toplamTutar' ? (orderSort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                    <th 
                      style={{ 
                        padding: '14px', 
                        textAlign: 'left', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleOrderSort('tarih')}
                    >
                      Tarih {orderSort.field === 'tarih' ? (orderSort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                    <th 
                      style={{ 
                        padding: '14px', 
                        textAlign: 'left', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleOrderSort('adres')}
                    >
                      Adres {orderSort.field === 'adres' ? (orderSort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '15px' }}>
                        Hiç sipariş yok.
                      </td>
                    </tr>
                  ) : (
                    sortedOrders.map(order => {
                      // JSON string'i parse et
                      let urunler = [];
                      try {
                        if (order.urunlerJson) {
                          urunler = JSON.parse(order.urunlerJson);
                        }
                      } catch (e) {
                        console.error('Ürünler JSON parse hatası:', e);
                        urunler = [order.urunlerJson || 'Bilinmeyen ürün'];
                      }
                      
                      // Tarih formatla
                      let tarihText = '';
                      if (order.orderTime) {
                        try {
                          const tarih = new Date(order.orderTime);
                          tarihText = tarih.toLocaleString('tr-TR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } catch (e) {
                          tarihText = 'Tarih bilgisi yok';
                        }
                      }
                      
                      return (
                        <tr key={order.siparisNo}>
                          <td style={{ padding: '14px', fontWeight: 'bold', color: '#1a7f37' }}>#{order.siparisNo}</td>
                          <td style={{ padding: '14px' }}>{order.isim} {order.soyisim}</td>
                          <td style={{ padding: '14px' }}>
                            {Array.isArray(urunler) ? urunler.join(', ') : urunler}
                          </td>
                          <td style={{ padding: '14px', fontWeight: 'bold', color: '#1a7f37' }}>{order.toplamTutar} TL</td>
                          <td style={{ padding: '14px', fontSize: '13px', color: '#666' }}>{tarihText}</td>
                          <td style={{ padding: '14px', fontSize: '13px', color: '#666' }}>{order.adres}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <GlobalToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
} 