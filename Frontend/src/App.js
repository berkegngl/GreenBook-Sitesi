import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './App.css';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import DatePicker, { registerLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr';
import 'react-datepicker/dist/react-datepicker.css';
import 'swiper/css';
import 'swiper/css/navigation';
import { login, register } from './services/authService';
import bookStackIcon from './assets/book-stack-64.ico';
import HomeScreen from './screens/HomeScreen';
import BooksScreen from './screens/BooksScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';

const LoginForm = React.memo(function LoginForm({ onClose, onLoginSuccess, showToast }) {
  const [mode, setMode] = useState('login'); // 'login' veya 'register'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return !value.trim() ? 'Lütfen kullanıcı adınızı girin' : '';
      case 'password':
        return value.length < 6 ? 'Parola en az 6 karakter olmalı' : '';
      case 'confirmPassword':
        if (!value) return 'Lütfen parolanızı tekrar girin';
        if (value !== formData.password) return 'Parolalar eşleşmiyor';
        return '';
      case 'email':
        if (!value.trim()) return 'Lütfen e-posta adresinizi girin';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Geçerli bir e-posta adresi girin' : '';
      case 'firstName':
        return !value.trim() ? 'Lütfen adınızı girin' : '';
      case 'lastName':
        return !value.trim() ? 'Lütfen soyadınızı girin' : '';
      case 'phoneNumber':
        if (!value.trim()) return 'Lütfen telefon numaranızı girin';
        // Telefon numarası tam 11 hane olmalı (05 ile başlamalı)
        const phoneRegex = /^05\d{9}$/;
        return !phoneRegex.test(value) ? 'Geçerli bir format giriniz' : '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let newErrors = {};
    if (mode === 'login') {
      newErrors = {
        username: validateField('username', formData.username),
        password: validateField('password', formData.password),
      };
    } else {
      newErrors = {
        username: validateField('username', formData.username),
        password: validateField('password', formData.password),
        confirmPassword: validateField('confirmPassword', formData.confirmPassword),
        firstName: validateField('firstName', formData.firstName),
        lastName: validateField('lastName', formData.lastName),
        email: validateField('email', formData.email),
        phoneNumber: validateField('phoneNumber', formData.phoneNumber),
      };
    }
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(e => e);
    if (hasErrors) return;

    if (mode === 'login') {
      try {
        const userData = await login({
          username: formData.username,
          password: formData.password
        });
        setLoginError('');
        const userWithAdmin = {
          ...userData,
          isAdmin: userData.isAdmin || 0
        };
        localStorage.setItem('user', JSON.stringify(userWithAdmin));
        onLoginSuccess(userWithAdmin);
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (error) {
        setLoginError('Hatalı kullanıcı adı veya şifre!');
      }
    } else {
      try {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber
        });
        setLoginError('');
        showToast('Kayıt başarılı!', 'success');
        setTimeout(() => setMode('login'), 1500);
      } catch (error) {
        setLoginError('Bir hata oluştu, lütfen tekrar deneyin.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Kullanıcı yazmaya başladığında hata mesajını temizle
    if (loginError) {
      setLoginError('');
    }
  };

  return createPortal(
    <div className="login-form-backdrop" onClick={onClose}>
      <div className="login-form-container" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h2>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Kullanıcı Adı *</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder="Kullanıcı adınızı girin"
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>
              <div className="form-group">
                <label>Parola *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Parolanızı girin"
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <div className="form-group">
                <label>Parola Tekrar *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Parolanızı tekrar girin"
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
              <div className="form-group">
                <label>Ad *</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Adınızı girin"
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label>Soyad *</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Soyadınızı girin"
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
              <div className="form-group">
                <label>E-posta *</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="E-posta adresinizi girin"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label>Telefon Numarası *</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? 'error' : ''}
                  placeholder="05xxxxxxxxx"
                  maxLength="11"
                />
                {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
              </div>
            </>
          )}

          {mode === 'login' && (
            <>
              <div className="form-group">
                <label>Kullanıcı Adı *</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder="Kullanıcı adınızı girin"
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>
              <div className="form-group">
                <label>Parola *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Parolanızı girin"
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              {loginError && <div className="error-message" style={{textAlign: 'center', marginTop: '10px'}}>{loginError}</div>}
            </>
          )}

          <button type="submit" className="submit-btn">{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</button>
        </form>
        <div className="form-footer" style={{textAlign: 'center', marginTop: '12px'}}>
          {mode === 'login' ? (
            <span>Hesabınız yok mu? <button type="button" style={{color: '#1a7f37', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => {
              setMode('register');
              setFormData({ username: '', password: '', confirmPassword: '', email: '', firstName: '', lastName: '', phoneNumber: '' });
              setErrors({});
            }}>Kayıt Ol</button></span>
          ) : (
            <span>Zaten hesabınız var mı? <button type="button" style={{color: '#1a7f37', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => {
              setMode('login');
              setFormData({ username: '', password: '', confirmPassword: '', email: '', firstName: '', lastName: '', phoneNumber: '' });
              setErrors({});
            }}>Giriş Yap</button></span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
});


registerLocale('tr', tr);

// Body arka plan rengini yeşil yap
document.body.style.backgroundColor = '#e6f3eb';

function BookDetailWrapper({ onAddToCart, onToggleFavorite, favorites }) {
  const { id } = useParams();
  return <BookDetail bookId={id} onAddToCart={onAddToCart} onToggleFavorite={onToggleFavorite} favorites={favorites} />;
}

const categories = [
  'Tümü',
  'Edebiyat',
  'Kişisel Gelişim',
  'Çocuk',
  'Bilim Kurgu',
  'Tarih'
];

const books = [
  // Edebiyat Kitapları
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
  // Eğitim Kitapları
  { id: 11, title: 'TYT Türkçe Soru Bankası', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'TYT için kapsamlı Türkçe soru bankası.', category: 'Eğitim Kitapları', subcategory: 'TYT-AYT Kitapları', publisher: 'Pegem Akademi' },
  { id: 12, title: 'AYT Matematik Denemeleri', author: 'Kolektif', price: 65, image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', description: 'AYT için matematik denemeleri.', category: 'Eğitim Kitapları', subcategory: 'TYT-AYT Kitapları', publisher: 'Palme Yayınevi' },
  { id: 13, title: 'KPSS Genel Yetenek', author: 'Kolektif', price: 70, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'KPSS için genel yetenek kitabı.', category: 'Eğitim Kitapları', subcategory: 'KPSS Kitapları', publisher: 'Yargı Yayınevi' },
  { id: 14, title: 'DGS Sayısal Soru Bankası', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'DGS için sayısal soru bankası.', category: 'Eğitim Kitapları', subcategory: 'DGS Kitapları', publisher: 'Benim Hocam Yayınları' },
  { id: 15, title: 'LGS Fen Bilimleri', author: 'Kolektif', price: 50, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'LGS için fen bilimleri kitabı.', category: 'Eğitim Kitapları', subcategory: 'LGS Kitapları', publisher: 'Hız Yayınları' },
  { id: 16, title: 'YKS Kimya Soru Bankası', author: 'Kolektif', price: 58, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'YKS için kimya soru bankası.', category: 'Eğitim Kitapları', subcategory: 'YKS Kitapları', publisher: '345 Yayınları' },
  // Felsefe Kitapları
  { id: 17, title: 'Sokrates\'in Savunması', author: 'Platon', price: 40, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Felsefi akımların başlangıcı.', category: 'Felsefe Kitapları', subcategory: 'Felsefi Akımlar', publisher: 'İş Bankası Kültür Yayınları' },
  { id: 18, title: 'Felsefenin Kısa Tarihi', author: 'Nigel Warburton', price: 90, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Felsefe tarihi üzerine temel bir eser.', category: 'Felsefe Kitapları', subcategory: 'Felsefe Tarihi', publisher: 'Alfa Yayınları' },
  { id: 19, title: 'Din Felsefesi', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', description: 'Din felsefesi üzerine makaleler.', category: 'Felsefe Kitapları', subcategory: 'Din Felsefesi', publisher: 'Say Yayınları' },
  // Çocuk Kitapları
  { id: 20, title: 'Kırmızı Başlıklı Kız', author: 'Charles Perrault', price: 25, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Klasik masal.', category: 'Çocuk Kitapları', subcategory: 'Masallar', publisher: 'Yapı Kredi Yayınları' },
  { id: 21, title: 'Okul Öncesi Etkinlikler', author: 'Kolektif', price: 30, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'Okul öncesi çocuklar için etkinlik kitabı.', category: 'Çocuk Kitapları', subcategory: 'Okul Öncesi', publisher: 'Morpa Yayınları' },
  { id: 22, title: 'Çocuk Romanları', author: 'Kolektif', price: 35, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Çocuklar için romanlar.', category: 'Çocuk Kitapları', subcategory: 'Roman ve Öyküler', publisher: 'Can Çocuk Yayınları' },
  { id: 23, title: 'Hikaye Kitabı', author: 'Kolektif', price: 28, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Çocuklar için hikaye kitabı.', category: 'Çocuk Kitapları', subcategory: 'Hikayeler', publisher: 'Tudem Yayınları' },
  { id: 24, title: 'Boyama Kitabı', author: 'Kolektif', price: 20, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Çocuklar için boyama kitabı.', category: 'Çocuk Kitapları', subcategory: 'Boyama Kitapları', publisher: '1001 Çiçek Yayınları' },
  // Gezi ve Rehber Kitapları
  { id: 25, title: 'Türkiye Gezi Rehberi', author: 'Kolektif', price: 80, image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', description: 'Türkiye için kapsamlı gezi rehberi.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Türkiye Rehberleri', publisher: 'İletişim Yayınları' },
  { id: 26, title: 'İstanbul Rehberi', author: 'Kolektif', price: 75, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'İstanbul için rehber kitap.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Rehber', publisher: 'Boyut Yayın Grubu' },
  { id: 27, title: 'Dünya Gezi Kitabı', author: 'Kolektif', price: 95, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Dünya genelinde gezi önerileri.', category: 'Gezi ve Rehber Kitapları', subcategory: 'Gezi', publisher: 'Lonely Planet Türkiye' },
  // Sağlık Kitapları
  { id: 28, title: 'Beslenme ve Diyet', author: 'Kolektif', price: 50, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Sağlıklı yaşam için beslenme.', category: 'Sağlık Kitapları', subcategory: 'Beslenme', publisher: 'Nobel Akademik Yayıncılık' },
  { id: 29, title: 'Aile Sağlığı', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Aile sağlığı üzerine bilgiler.', category: 'Sağlık Kitapları', subcategory: 'Aile Sağlığı', publisher: 'Hayykitap' },
  { id: 30, title: 'Çocuk Gelişimi', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Çocuk gelişimi üzerine.', category: 'Sağlık Kitapları', subcategory: 'Çocuk Gelişimi', publisher: 'Remzi Kitabevi' },
  // İnsan ve Toplum Kitapları
  { id: 31, title: 'Kişisel Gelişim 101', author: 'Kolektif', price: 45, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Kişisel gelişim için temel bilgiler.', category: 'İnsan ve Toplum Kitapları', subcategory: 'Kişisel Gelişim', publisher: 'Destek Yayınları' },
  { id: 32, title: 'Kültür Tarihi', author: 'Kolektif', price: 70, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Kültür tarihi üzerine.', category: 'İnsan ve Toplum Kitapları', subcategory: 'Kültür', publisher: 'Metis Yayınları' },
  { id: 33, title: 'Popüler Kültür', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'Popüler kültür incelemeleri.', category: 'İnsan ve Toplum Kitapları', subcategory: 'Popüler Kültür', publisher: 'İletişim Yayınları' },
  // İnanç Kitapları ve Mitolojiler
  { id: 34, title: 'Mitolojiler', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Dünya mitolojileri üzerine.', category: 'İnanç Kitapları ve Mitolojiler', subcategory: 'Mitolojiler', publisher: 'İthaki Yayınları' },
  { id: 35, title: 'Dinler Tarihi', author: 'Kolektif', price: 65, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Dinler tarihi üzerine.', category: 'İnanç Kitapları ve Mitolojiler', subcategory: 'Dinler Tarihi', publisher: 'İnkılap Kitabevi' },
  { id: 36, title: 'İslam Kitapları', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', description: 'İslam tarihi ve kültürü.', category: 'İnanç Kitapları ve Mitolojiler', subcategory: 'İslam Kitapları', publisher: 'Timaş Yayınları' },
  // Psikoloji Kitapları
  { id: 37, title: 'Çocuk Psikolojisi', author: 'Kolektif', price: 55, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Çocuk psikolojisi üzerine.', category: 'Psikoloji Kitapları', subcategory: 'Çocuk Psikolojisi', publisher: 'Pegasus Yayınları' },
  { id: 38, title: 'Genel Psikoloji', author: 'Kolektif', price: 65, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'Genel psikoloji konuları.', category: 'Psikoloji Kitapları', subcategory: 'Genel Psikoloji', publisher: 'Epsilon Yayınevi' },
  { id: 39, title: 'Eğitim Psikolojisi', author: 'Kolektif', price: 60, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Eğitim psikolojisi üzerine.', category: 'Psikoloji Kitapları', subcategory: 'Eğitim Psikolojisi', publisher: 'Nobel Akademik Yayıncılık' },
  // Hukuk Kitapları
  { id: 40, title: 'Hukuk Başlangıcı', author: 'Kolektif', price: 70, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'Hukuka giriş.', category: 'Hukuk Kitapları', subcategory: 'Hukuk Üzerine', publisher: 'Seçkin Yayıncılık' },
  { id: 41, title: 'Ders Kitapları', author: 'Kolektif', price: 80, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Hukuk ders kitapları.', category: 'Hukuk Kitapları', subcategory: 'Ders Kitapları', publisher: 'On İki Levha Yayıncılık' },
  { id: 42, title: 'Kanun ve Uygulama', author: 'Kolektif', price: 90, image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg', description: 'Kanun ve uygulama kitapları.', category: 'Hukuk Kitapları', subcategory: 'Kanun ve Uygulama', publisher: 'Adalet Yayınevi' },
  // Yayınevleri
  { id: 43, title: 'Roman Seçkisi', author: 'Destek Yayınları', price: 90, image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', description: 'Destek Yayınları\'ndan romanlar.', category: 'Yayınevleri', subcategory: 'Destek Yayınları', publisher: 'Destek Yayınları' },
  { id: 44, title: 'Çocuk Kitapları', author: 'Artemis Yayınları', price: 60, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Artemis Yayınları\'ndan çocuk kitapları.', category: 'Yayınevleri', subcategory: 'Artemis Yayınları', publisher: 'Artemis Yayınları' },
  { id: 45, title: 'Biyografi Seçkisi', author: 'Sel Yayıncılık', price: 75, image: 'https://covers.openlibrary.org/b/id/240727-L.jpg', description: 'Sel Yayıncılık\'tan biyografi kitapları.', category: 'Yayınevleri', subcategory: 'Sel Yayıncılık', publisher: 'Sel Yayıncılık' },
  // Yazarlar
  { id: 46, title: 'Kürk Mantolu Madonna', author: 'Sabahattin Ali', price: 80, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Sabahattin Ali\'den başyapıt.', category: 'Yazarlar', subcategory: 'Sabahattin Ali', publisher: 'Yapı Kredi Yayınları' },
  { id: 47, title: 'Simyacı', author: 'Paulo Coelho', price: 95, image: 'https://covers.openlibrary.org/b/id/291479-M.jpg', description: 'Paulo Coelho\'dan Simyacı.', category: 'Yazarlar', subcategory: 'Paulo Coelho', publisher: 'Can Yayınları' },
  { id: 48, title: '1984', author: 'George Orwell', price: 120, image: 'https://covers.openlibrary.org/b/id/153541-L.jpg', description: 'George Orwell\'dan 1984.', category: 'Yazarlar', subcategory: 'George Orwell', publisher: 'Can Yayınları' },
  // Bilim Kurgu
  { id: 49, title: 'Dune', author: 'Frank Herbert', price: 110, image: 'https://covers.openlibrary.org/b/id/11153223-L.jpg', description: 'Bilim kurgu klasiği.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İthaki Yayınları' },
  { id: 50, title: 'Vakıf', author: 'Isaac Asimov', price: 100, image: 'https://covers.openlibrary.org/b/id/10594765-L.jpg', description: 'Bilim kurgu serisi.', category: 'Edebiyat Kitapları', subcategory: 'Roman', publisher: 'İthaki Yayınları' },
];

const placeholder = 'https://via.placeholder.com/120x170?text=Kitap+Kapak';
const bannerPlaceholder = 'https://via.placeholder.com/900x340?text=Banner+Görseli';

// Türkçe alfabesine göre sıralama fonksiyonu
const turkishSort = (a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' });

// megaCategories'i ve altındaki sub dizilerini Türkçe sıralı hale getir
const megaCategories = [
  {
    name: 'Edebiyat Kitapları',
    sub: ['Roman', 'Türk Edebiyatı', 'Şiir', 'Deneme', 'Öykü', 'Anı', 'Biyografi']
  },
  {
    name: 'Eğitim Kitapları',
    sub: ['TYT-AYT Kitapları', 'DGS Kitapları', 'KPSS Kitapları', 'LGS Kitapları', 'YKS Kitapları']
  },
  {
    name: 'Felsefe Kitapları',
    sub: ['Felsefi Akımlar', 'Din Felsefesi', 'Felsefe Tarihi']
  },
  {
    name: 'Çocuk Kitapları',
    sub: ['Masallar', 'Hikayeler', 'Roman ve Öyküler', 'Okul Öncesi']
  },
  {
    name: 'Gezi ve Rehber Kitapları',
    sub: ['Gezi', 'Rehber', 'Türkiye Rehberleri']
  },
  {
    name: 'Sağlık Kitapları',
    sub: ['Beslenme', 'Aile Sağlığı', 'Çocuk Gelişimi']
  },
  {
    name: 'İnsan ve Toplum Kitapları',
    sub: ['Kişisel Gelişim', 'Kültür', 'Popüler Kültür']
  },
  {
    name: 'İnanç Kitapları ve Mitolojiler',
    sub: ['Mitolojiler', 'Dinler Tarihi', 'İslam Kitapları']
  },
  {
    name: 'Psikoloji Kitapları',
    sub: ['Genel Psikoloji', 'Çocuk Psikolojisi', 'Eğitim Psikolojisi']
  },
  {
    name: 'Hukuk Kitapları',
    sub: ['Hukuk Üzerine', 'Ders Kitapları', 'Kanun ve Uygulama']
  }
]
  .map(cat => ({ ...cat, sub: cat.sub.slice().sort(turkishSort) }))
  .sort((a, b) => turkishSort(a.name, b.name));

function MegaMenu({ open, onClose, onSelectSubcat, anchorRef }) {
  const [hovered, setHovered] = React.useState(0);
  const [menuStyle, setMenuStyle] = React.useState({});
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (open && anchorRef && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'absolute',
        top: rect.bottom + 8, // only offset from sticky navbar
        left: rect.left,      // only offset from viewport
        zIndex: 1200
      });

      // Boş alana tıklandığında menüyü kapat
      const handleClickOutside = (event) => {
        if (!event.target.closest('.mega-menu') && !event.target.closest('.hamburger-btn')) {
          onClose();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open, anchorRef, onClose]);

  if (!open) return null;
  return (
    <div className={`mega-menu-backdrop open`} style={{zIndex:1199}}>
      <div className="mega-menu" style={menuStyle}>
        <div className="mega-menu-left">
          {megaCategories.map((cat, i) => (
            <div
              key={cat.name}
              className={`mega-menu-cat${hovered === i ? ' active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onClick={() => { navigate(`/books?category=${encodeURIComponent(cat.name)}`); onClose(); }}
              style={{ cursor: 'pointer' }}
            >
              {cat.name}
            </div>
          ))}
        </div>
        <div className="mega-menu-right">
          {megaCategories[hovered].sub.map(sub => (
            <div key={sub} className="mega-menu-subcat" onClick={() => { navigate(`/books?category=${encodeURIComponent(megaCategories[hovered].name)}&subcategory=${encodeURIComponent(sub)}`); onClose(); }} style={{ cursor: 'pointer' }}>{sub}</div>
          ))}
        </div>
      </div>
    </div>
  );
}



function Toast({ message, type = 'success', onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}





function Navbar({ cartCount, categories, selectedCategory, setSelectedCategory, search, setSearch, onMegaMenu, megaOpen, setMegaOpen, anchorRef, bestSellers, newReleases, handleSelectSubcat, handleAddToCart, handleToggleFavorite, favorites, showLoginForm, setShowLoginForm, user, onLogout }) {
  const [toast, setToast] = React.useState({ show: false, message: '' });
  const [currentSection, setCurrentSection] = React.useState('campaigns'); // 'campaigns' | 'bestsellers' | 'newreleases'
  const navigate = useNavigate();

  const handlePrevSection = () => {
    setCurrentSection(current => {
      switch(current) {
        case 'campaigns': return 'newreleases';
        case 'bestsellers': return 'campaigns';
        case 'newreleases': return 'bestsellers';
        default: return 'campaigns';
      }
    });
  };

  const handleNextSection = () => {
    setCurrentSection(current => {
      switch(current) {
        case 'campaigns': return 'bestsellers';
        case 'bestsellers': return 'newreleases';
        case 'newreleases': return 'campaigns';
        default: return 'campaigns';
      }
    });
  };
  // Autocomplete için
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [searchHistory, setSearchHistory] = React.useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = React.useState(false);
  const inputRef = React.useRef(null);

  // Arama geçmişini localStorage'a kaydet
  React.useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Autocomplete mantığı
  React.useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setShowHistory(false);
    // Kitaplardan arama sonuçlarını oluştur
    const searchResults = books.filter(book => {
      const searchLower = search.toLowerCase();
      return (
        book.title.toLowerCase().startsWith(searchLower) ||
        book.author.toLowerCase().startsWith(searchLower) ||
        (book.publisher && book.publisher.toLowerCase().startsWith(searchLower))
      );
    });
    // En fazla 8 sonuç göster
    setSuggestions(searchResults.slice(0, 8));
    setShowSuggestions(searchResults.length > 0);
  }, [search]);

  // Arama geçmişine ekle
  const addToSearchHistory = (searchTerm) => {
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      const newHistory = [searchTerm, ...searchHistory].slice(0, 5); // Son 5 aramayı tut
      setSearchHistory(newHistory);
    }
  };

  // Arama geçmişinden bir terimi sil
  const removeFromHistory = (term) => {
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
  };

  // Arama geçmişini temizle
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Dışarı tıklayınca öneri kutusunu ve geçmişi kapat
  React.useEffect(() => {
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Arama yapıldığında
  const handleSearch = (term) => {
    setSearch(term);
    addToSearchHistory(term);
    setShowHistory(false);
    setShowSuggestions(false);
  };

  // Kategori butonları için yardımcı fonksiyon
  const handleCategoryClick = (cat) => {
    navigate(`/books?category=${encodeURIComponent(cat)}`);
  };

  // Panel fonksiyonları kaldırıldı
  return (
    <nav className="navbar" style={{backgroundColor: '#000', margin: 0, padding: 0, width: '100%'}}>
      {/* Üst Navbar - Logo, Arama, Favoriler, Giriş */}
      <div className="navbar-top" style={{margin: 0, padding: '12px 0'}}>
        <div className="main-nav" style={{maxWidth: '1200px', margin: '0 auto', padding: '0 16px', width: '100%'}}>
        {/* Sol taraf - Logo */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <button onClick={() => window.location.href = '/'} className="logo logo-row" style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}>
            <img src={bookStackIcon} alt="GreenBook Logo" style={{width: '32px', height: '32px'}} />
            GreenBook
          </button>
        </div>

        {/* Orta - Arama */}
        <div style={{position: 'relative', flex: 1, maxWidth: '500px', margin: '0 40px'}}>
                      <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Kitap, yazar veya yayınevi ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                     width: '100%',
                     padding: '14px 48px',
                     border: '2px solid #e0e0e0',
                     borderRadius: '12px',
                     fontSize: '15px',
                     outline: 'none',
                     backgroundColor: '#fff',
                     color: '#333',
                     transition: 'all 0.3s ease',
                     boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                     '::placeholder': {
                       color: '#999'
                     }
                   }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#fff';
                     e.target.style.borderColor = '#1a7f37';
                     e.target.style.boxShadow = '0 0 0 4px rgba(26, 127, 55, 0.1)';
                     search ? setShowSuggestions(true) : setShowHistory(true);
                   }}
                   onBlur={(e) => {
                     e.target.style.backgroundColor = '#fff';
                     e.target.style.borderColor = '#e0e0e0';
                     e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                   }}
                  autoComplete="off"
                />
                <svg
                  style={{
                     position: 'absolute',
                     left: '16px',
                     width: '20px',
                     height: '20px',
                     color: '#999'
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setShowSuggestions(false);
                    }}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      cursor: 'pointer',
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              zIndex: 1000,
              margin: 0,
              padding: '8px',
              listStyle: 'none',
              maxHeight: '400px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
            }}>
              {suggestions.map((book, i) => (
                <li key={i} onMouseDown={() => handleSearch(book.title)} style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s',
                  ':hover': {
                    backgroundColor: '#f0f0f0'
                   }
                }}>
                  <img src={book.image || placeholder} alt={book.title} style={{
                    width: '45px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                  <div style={{flex: 1}}>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: '4px'
                    }}>{book.title}</div>
                    <div style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '4px'
                    }}>{book.author}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a7f37'
                      }}>{book.price} TL</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        backgroundColor: '#f0f0f0',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>{book.publisher}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {showHistory && searchHistory.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              zIndex: 1000,
              padding: '16px',
              color: '#333'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px'}}>
                <h4 style={{margin: 0, fontSize: '15px', color: '#333', fontWeight: '600'}}>Son Aramalar</h4>
                <button onClick={clearHistory} style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    backgroundColor: '#f0f0f0',
                    color: '#333'
                  }
                }}>Geçmişi Temizle</button>
              </div>
              {searchHistory.map((term, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease',
                  ':hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <svg style={{
                      width: '16px',
                      height: '16px',
                      color: '#999'
                    }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="12 19 5 12 12 5"></polyline>
                      <polyline points="19 12 5 12"></polyline>
                    </svg>
                    <span onClick={() => handleSearch(term)} style={{
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#666',
                      transition: 'color 0.2s ease',
                      ':hover': {
                        color: '#333'
                      }
                    }}>{term}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(term);
                      e.preventDefault();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#999',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: '#f0f0f0',
                        color: '#333'
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sağ taraf - Favoriler ve Giriş */}
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#1a7f37',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
          }}>Sepetim</button>
          {user ? (
            <>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                {user.firstName && user.lastName
                  ? `${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1).toLowerCase()} ${user.lastName.charAt(0).toUpperCase()}${user.lastName.slice(1).toLowerCase()}`
                  : ''}
              </span>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLogout();
                }}
              >
                Çıkış Yap
              </button>
              {String(user.isAdmin) === '1' && (
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1a7f37',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                  onClick={() => {
                    window.location.href = '/admin';
                  }}
                >
                  Yönetim Paneli
                </button>
              )}
            </>
          ) : (
            <button 
              style={{
                padding: '8px 16px',
                backgroundColor: '#1a7f37',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowLoginForm(true);
              }}
            >
              Giriş / Kayıt Ol
            </button>
          )}
        </div>
        </div>
      </div>

      {/* Alt Navbar - Hamburger Menü ve Kategoriler */}
      <div className="navbar-bottom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0',
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '800px',
          width: '100%',
          justifyContent: 'center'
        }}>
          <button 
            ref={anchorRef} 
            className={"hamburger-btn" + (megaOpen ? " open" : "")} 
            onClick={(e) => {
              e.stopPropagation();
              if (megaOpen) {
                setMegaOpen(false);
              } else {
                onMegaMenu();
              }
            }} 
            aria-label="Menüyü Aç/Kapat"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="hamburger-icon">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </button>
          
          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleCategoryClick('Edebiyat Kitapları')}
          >Edebiyat Kitapları</button>
          
          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleCategoryClick('Eğitim Kitapları')}
          >Eğitim Kitapları</button>
          
          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleCategoryClick('Felsefe Kitapları')}
          >Felsefe Kitapları</button>
          
          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleCategoryClick('Çocuk Kitapları')}
          >Çocuk Kitapları</button>
          
          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleCategoryClick('Hukuk Kitapları')}
          >Hukuk Kitapları</button>
          
          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleCategoryClick('Eğitim Kitapları')}
          >Eğitim Kitapları</button>
        </div>
      </div>
    </nav>
  );
}

function BookSection({ title, books, onAddToCart, onToggleFavorite, favorites, showDiscountBadge, showDiscountPrice }) {
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);
  let swiperRef = React.useRef();

  return (
    <div className="book-section" style={{backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '24px'}}>
      <h2>{title}</h2>
      <div className="book-slider-container">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: `.section-control-btn.next-${title.replace(/\s/g, '')}`,
            prevEl: `.section-control-btn.prev-${title.replace(/\s/g, '')}`
          }}
          spaceBetween={48}
          slidesPerView={4}
          style={{ width: '100%' }}
          onSwiper={swiper => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={swiper => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
        >
          {books.map(book => {
            const discount = book.discount || Math.floor(Math.random() * 30) + 10;
            book.discount = discount;
            const originalPrice = book.originalPrice || Math.floor(book.price * (100 / (100 - discount)));
            book.originalPrice = originalPrice;
            return (
              <SwiperSlide key={book.id}>
                <div className="book-card">
                  {showDiscountBadge && discount > 0 && (
                    <div className="discount-badge">%{discount}</div>
                  )}
                  <img src={book.image || placeholder} alt={book.title} className="book-img" onError={handleImgError} />
                  <h3>{book.title}</h3>
                  <div className="price-container">
                    {showDiscountPrice ? (
                      <>
                        <span className="original-price">{originalPrice} TL</span>
                        <span className="price">{book.price} TL</span>
                      </>
                    ) : (
                      <span className="price red">{book.price} TL</span>
                    )}
                  </div>
                  <button onClick={() => onAddToCart(book)} className="add-btn">Sepete Ekle</button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button 
          className={`section-control-btn prev prev-${title.replace(/\s/g, '')}`}
          aria-label="Önceki Kitaplar"
          style={{top: '50%', transform: 'translateY(-50%)'}}
        >
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button 
          className={`section-control-btn next next-${title.replace(/\s/g, '')}`}
          aria-label="Sonraki Kitaplar"
          style={{top: '50%', transform: 'translateY(-50%)', display: isEnd ? 'none' : undefined}}
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function BannerSlider() {
  const [currentSection, setCurrentSection] = React.useState('campaigns');
  const [paused, setPaused] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState('right'); // yeni eklenen
  const [prevSection, setPrevSection] = React.useState(currentSection);

  const sectionImages = {
    campaigns: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&w=900&q=80',
    bestsellers: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&w=900&q=80',
    newreleases: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&w=900&q=80',
  };

  const handlePrevSection = () => {
    setDirection('left');
    setPrevSection(currentSection);
    setAnimating(true);
    setTimeout(() => {
      setCurrentSection(current => {
        switch(current) {
          case 'campaigns': return 'newreleases';
          case 'bestsellers': return 'campaigns';
          case 'newreleases': return 'bestsellers';
          default: return 'campaigns';
        }
      });
      setAnimating(false);
    }, 500);
  };

  const handleNextSection = () => {
    setDirection('right');
    setPrevSection(currentSection);
    setAnimating(true);
    setTimeout(() => {
      setCurrentSection(current => {
        switch(current) {
          case 'campaigns': return 'bestsellers';
          case 'bestsellers': return 'newreleases';
          case 'newreleases': return 'campaigns';
          default: return 'campaigns';
        }
      });
      setAnimating(false);
    }, 500);
  };

  React.useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      handleNextSection();
    }, 7000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="banner-container">
      <button className="section-control-btn banner-control prev" onClick={handlePrevSection} aria-label="Önceki Bölüm">
        <svg viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="banner-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{display:'flex',alignItems:'stretch'}}>
        <div className={`banner-img-wrapper ${animating ? `slide-${direction}` : ''}`} style={{flex:1,position:'relative',overflow:'hidden',display:'flex'}}>
          {!animating && (
            <img
              src={sectionImages[currentSection]}
              alt={currentSection}
              className="banner-img"
              onError={e => handleImgError(e, 'banner')}
              style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',top:0,left:0,right:0,bottom:0}}
            />
          )}
          {animating && (
            <>
              <img
                src={sectionImages[prevSection]}
                alt={prevSection}
                className={`banner-img banner-img-prev`}
                style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',top:0,left:0,right:0,bottom:0}}
              />
              <img
                src={sectionImages[
                  direction === 'right'
                    ? (currentSection === 'campaigns' ? 'bestsellers' : currentSection === 'bestsellers' ? 'newreleases' : 'campaigns')
                    : (currentSection === 'campaigns' ? 'newreleases' : currentSection === 'bestsellers' ? 'campaigns' : 'bestsellers')
                ]}
                alt={currentSection}
                className={`banner-img banner-img-next`}
                style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',top:0,left:0,right:0,bottom:0}}
              />
            </>
          )}
        </div>
        <div className="banner-info" style={{alignSelf:'center'}}>
          <h2>
            {currentSection === 'campaigns' && 'Kampanyalı Kitaplar'}
            {currentSection === 'bestsellers' && 'Çok Satan Kitaplar'}
            {currentSection === 'newreleases' && 'Yeni Çıkan Kitaplar'}
          </h2>
          <p>
            {currentSection === 'campaigns' && 'Özel indirimli kitapları kaçırmayın'}
            {currentSection === 'bestsellers' && 'En çok tercih edilen kitapları keşfedin'}
            {currentSection === 'newreleases' && 'En son yayınlanan kitapları keşfedin'}
          </p>
        </div>
      </div>
      <button className="section-control-btn banner-control next" onClick={handleNextSection} aria-label="Sonraki Bölüm">
        <svg viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

function SectionBox({ title, onShowAll, children }) {
  return (
    <div className="section-box">
      <div className="section-header">
        <span className="section-title-ribbon">{title}</span>
        <span className="section-actions" onClick={onShowAll} tabIndex={0} role="button">
          Tümünü Göster
          <span className="arrow">&#x25B6;</span>
        </span>
      </div>
      {children}
    </div>
  );
}



function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-section">
              <h4>ÖNEMLİ BİLGİLER</h4>
              <a href="/teslimat-kosullari">Teslimat Koşulları</a>
              <a href="/uyelik-sozlesmesi">Üyelik Sözleşmesi</a>
              <a href="/kvkk">KVKK Aydınlatma Metni</a>
              <a href="/garanti-iade">Garanti Ve İade Koşulları</a>
              <a href="/gizlilik">Gizlilik Ve Güvenlik</a>
            </div>
            <div className="footer-section">
              <h4>HIZLI ERİŞİM</h4>
              <a href="/iletisim">İletişim</a>
              <a href="/yeni-cikanlar">Yeni Çıkan Kitaplar</a>
              <a href="/cok-satanlar">Çok Satan Kitaplar</a>
              <a href="/musteri-hizmetleri">Müşteri Hizmetleri</a>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-social">
              <h4>BİZİ TAKİP EDİN</h4>
              <div className="social-icons">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            {/* Customer Support Row - inside .footer-right */}
            <div style={{display:'flex',alignItems:'center',gap:'14px',marginTop:'28px',justifyContent:'center'}}>
              <img src="https://media.istockphoto.com/id/947163358/tr/vekt%C3%B6r/m%C3%BC%C5%9Fteri-destek-simgesi.jpg?s=612x612&w=0&k=20&c=NR9LX5cAMTYo9bK05-NmBwAunqs2G0JBS5hTNu7osTA=" alt="Müşteri Destek" style={{width:'44px',height:'44px',borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}/>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                <span style={{fontWeight:600,fontSize:'1.08rem',color:'#fff',letterSpacing:'0.5px'}}>Telefon Numarası</span>
                <span style={{fontWeight:500,fontSize:'1.05rem',color:'#e6f3eb',marginTop:'2px'}}>+90 123 456 78 90</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-copyright" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:'7px'}}>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/iyzico.svg" alt="iyzico" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/mastercard.svg" alt="mastercard" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/maestro.svg" alt="maestro" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/visa.svg" alt="visa" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/visa-electron.svg" alt="visa electron" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/american.svg" alt="american express" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/troy.svg" alt="troy" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
              <img src="https://asset.kitapsepeti.com/theme/v5-kitapsepeti/assets/footer/security.svg" alt="güvenli" height="28" style={{background:'#fff',borderRadius:'6px',padding:'2px'}}/>
            </span>
            <span style={{fontWeight:500,fontSize:'1.05rem',color:'#555',marginLeft:'auto'}}>
              © 2025 GreenBook. Tüm hakları saklıdır.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function BookList({ onAddToCart, books, search, setSearch, filters, setFilters, sort, setSort, allCategories, allAuthors, allPublishers }) {
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

function BookDetail({ bookId, onAddToCart, onToggleFavorite, favorites }) {
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

function Cart({ cart, onRemoveFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <div className="cart-page">
      <h2>Sepetim</h2>
      {cart.length === 0 ? <p>Sepetiniz boş.</p> : (
        <div>
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image || placeholder} alt={item.title} className="cart-img" onError={handleImgError} />
              <div>
                <h4>{item.title}</h4>
                <p>{item.author}</p>
                <p>Adet: {item.qty}</p>
                <p>Fiyat: {item.price} TL</p>
                <button onClick={() => onRemoveFromCart(item.id)} className="remove-btn">Kaldır</button>
              </div>
            </div>
          ))}
          <h3>Toplam: {total} TL</h3>
        </div>
      )}
    </div>
  );
}

// Kitap ve banner görseli için güvenli bir onError handler
function handleImgError(e, type) {
  if (type === 'banner') {
    if (e.target.src !== bannerPlaceholder) {
      e.target.onerror = null;
      e.target.src = bannerPlaceholder;
      // Banner resmi yüklenemezse animating'i false yap
      setTimeout(() => {
        const bannerSlider = e.target.closest('.banner-slider');
        if (bannerSlider && bannerSlider.classList.contains('animating')) {
          bannerSlider.classList.remove('animating');
        }
      }, 100);
    }
  } else {
    if (e.target.src !== placeholder) {
      e.target.onerror = null;
      e.target.src = placeholder;
    }
  }
}

// Toast Bileşeni (sağ üstte, animasyonlu)
function GlobalToast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 32,
      right: 32,
      zIndex: 9999,
      minWidth: 240,
      background: toast.type === 'success' ? '#1a7f37' : '#d32f2f',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      fontWeight: 500,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      animation: 'fadeIn 0.3s',
      transition: 'opacity 0.3s',
    }}>
      {toast.type === 'success' ? (
        <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4 4-2-2"/></svg>
      ) : (
        <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
      )}
      <span>{toast.message}</span>
      <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', marginLeft: 16, fontSize: 18, cursor: 'pointer'}}>×</button>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </div>
  );
}

// /books sayfasında kategori parametresini oku ve filtreyi ayarla
function BooksPageWrapper(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get('category');
  const subcategoryParam = params.get('subcategory');
  React.useEffect(() => {
    if (categoryParam && subcategoryParam) {
      props.setFilters(f => ({ ...f, category: categoryParam, subcategory: subcategoryParam }));
    } else if (categoryParam) {
      props.setFilters(f => ({ ...f, category: categoryParam, subcategory: '' }));
    }
  }, [categoryParam, subcategoryParam]);
  return props.children;
}

function App() {
  const [cart, setCart] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [toast, setToast] = React.useState(null);
  const [search, setSearch] = React.useState(""); // Navbar araması
  const [filterSearch, setFilterSearch] = React.useState(""); // Filtre paneli araması
  const [selectedCategory, setSelectedCategory] = React.useState('Tümü');
  const [selectedSubcat, setSelectedSubcat] = React.useState('');
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ category: '', subcategory: '', minPrice: '', maxPrice: '', author: '', publisher: '' });
  const [sort, setSort] = React.useState('');
  const anchorRef = React.useRef(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // isAdmin alanını kontrol et, yoksa varsayılan olarak 0 ata
      return {
        ...userData,
        isAdmin: userData.isAdmin || 0
      };
    }
    return null;
  });

  // Tüm kitaplardan benzersiz kategori, yazar, yayınevi listeleri
  const turkishSort = (a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' });
  // allCategories, allAuthors, allPublishers Türkçe sıralı
  const allCategories = Array.from(new Set(books.map(b => b.category).filter(Boolean)))
    .filter(cat => cat !== 'Yayınevleri' && cat !== 'Yazarlar')
    .sort(turkishSort);
  const allAuthors = Array.from(new Set(books.map(b => b.author).filter(Boolean))).sort(turkishSort);
  const allPublishers = Array.from(new Set(books.map(b => b.publisher).filter(Boolean))).sort(turkishSort);
  // Seçili kategoriye göre türler (subcategory)
  const allSubcategories = React.useMemo(() => {
    if (!filters.category) return [];
    // megaCategories'den bul
    const found = megaCategories.find(cat => cat.name === filters.category);
    if (found) return found.sub;
    // Yoksa kitaplardan çıkar
    return Array.from(new Set(books.filter(b => b.category === filters.category).map(b => b.subcategory).filter(Boolean))).sort();
  }, [filters.category]);

  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2000);
  };

  const handleAddToCart = (book) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === book.id);
      if (exists) {
        showToast('Sepetteki ürün adedi artırıldı');
        return prev.map(item => item.id === book.id ? { ...item, qty: item.qty + 1 } : item);
      }
      showToast('Ürün sepete eklendi');
      return [...prev, { ...book, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectSubcat = (cat, sub) => {
    setSelectedCategory(cat);
    setSelectedSubcat(sub);
  };

  const handleToggleFavorite = (id) => {
    setFavorites(favs => {
      if (favs.includes(id)) {
        showToast('Favorilerden çıkarıldı');
        return favs.filter(f => f !== id);
      } else {
        showToast('Favorilere eklendi');
        return [...favs, id];
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    showToast('Başarıyla çıkış yapıldı!');
  };

  // Filtreleme ve sıralama
  let filteredBooks = books.filter(book =>
    (filters.category === '' || book.category === filters.category) &&
    (filters.subcategory === '' || book.subcategory === filters.subcategory) &&
    (
      book.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (book.publisher && book.publisher.toLowerCase().includes(filterSearch.toLowerCase()))
    ) &&
    (!filters.minPrice || book.price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || book.price <= Number(filters.maxPrice)) &&
    (!filters.author || book.author === filters.author) &&
    (!filters.publisher || (book.publisher && book.publisher === filters.publisher))
  );
  if (sort === 'price-asc') filteredBooks = filteredBooks.slice().sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filteredBooks = filteredBooks.slice().sort((a, b) => b.price - a.price);
  if (sort === 'newest') filteredBooks = filteredBooks.slice().sort((a, b) => b.id - a.id);
  if (sort === 'popular') filteredBooks = filteredBooks.slice().sort((a, b) => (b.id % 7) - (a.id % 7)); // dummy popülerlik

  // Dummy: En çok satanlar ve yeni çıkanlar (rastgele kitaplar)
  const bestSellers = books.slice(0, 10);
  // newReleases: books dizisinden rastgele 5 kitap seç
  const shuffled = books.slice().sort(() => 0.5 - Math.random());
  const newReleases = shuffled.slice(0, 5);

  return (
    <>
      <Router>
        <Navbar 
          cartCount={cart.length} 
          categories={categories} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          search={search} 
          setSearch={setSearch} 
          onMegaMenu={() => setMegaOpen(!megaOpen)} 
          megaOpen={megaOpen} 
          setMegaOpen={setMegaOpen}
          anchorRef={anchorRef} 
          bestSellers={bestSellers} 
          newReleases={newReleases}
          handleSelectSubcat={handleSelectSubcat}
          handleAddToCart={handleAddToCart}
          handleToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
          user={user}
          onLogout={handleLogout}
        />
        {showLoginForm && (
          <LoginForm
            onClose={() => setShowLoginForm(false)}
            onLoginSuccess={(userData) => setUser(userData)}
            showToast={showToast}
          />
        )}
        <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} onSelectSubcat={handleSelectSubcat} anchorRef={anchorRef} />
        <GlobalToast toast={toast} onClose={() => setToast(null)} />
        <Routes>
          <Route path="/" element={
            <HomeScreen 
              books={books}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          } />
          <Route path="/books" element={
            <BooksScreen
              books={filteredBooks}
              filterSearch={filterSearch}
              setFilterSearch={setFilterSearch}
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              allCategories={allCategories}
              allAuthors={allAuthors}
              allPublishers={allPublishers}
              handleAddToCart={handleAddToCart}
            />
          } />
          <Route path="/book/:id" element={
            <BookDetailScreen 
              books={books}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          } />
          <Route path="/admin" element={<AdminPanelScreen />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;

