import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function handleImgError(e) {
  const placeholder = 'https://via.placeholder.com/120x170?text=Kitap+Kapak';
  if (e.target.src !== placeholder) {
    e.target.onerror = null;
    e.target.src = placeholder;
  }
}

export default function BookSection({ title, books, onAddToCart, onToggleFavorite, favorites, showDiscountBadge, showDiscountPrice }) {
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
            // Sadece discount_Rate alanını kullan
            const discount = book.discount_Rate || 0;
            const hasDiscount = typeof discount === 'number' && discount > 0;
            // Gelen price normal fiyat, indirimli fiyatı hesapla
            let originalPrice = book.price;
            let discountedPrice = book.price;
            if (hasDiscount) {
              discountedPrice = Math.round(book.price * (1 - discount / 100));
            }
            return (
              <SwiperSlide key={book.id}>
                <div className="book-card" style={{position:'relative'}}>
                  {showDiscountBadge && hasDiscount && (
                    <div className="discount-badge" style={{position:'absolute',top:8,right:8,background:'#e53935',color:'#fff',fontWeight:700,padding:'4px 10px',borderRadius:'8px',fontSize:'1em',zIndex:2}}>%{discount}</div>
                  )}
                  <img src={book.image || 'https://via.placeholder.com/120x170?text=Kitap+Kapak'} alt={book.title} className="book-img" onError={handleImgError} />
                  <h3>{book.title}</h3>
                  <div className="price-container" style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
                    {showDiscountPrice && hasDiscount ? (
                      <>
                        <span className="original-price" style={{textDecoration:'line-through', color:'#888', fontSize:'1em'}}>{originalPrice} TL</span>
                        <span className="price" style={{color:'#1a7f37', fontWeight:700, fontSize:'1.25em'}}>{discountedPrice} TL</span>
                      </>
                    ) : (
                      <span className="price" style={{color:'#1a7f37', fontWeight:700, fontSize:'1.15em'}}>{book.price} TL</span>
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