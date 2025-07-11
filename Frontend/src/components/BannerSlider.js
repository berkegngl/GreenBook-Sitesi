import React from 'react';

function handleImgError(e, type) {
  const bannerPlaceholder = 'https://via.placeholder.com/900x340?text=Banner+Görseli';
  if (type === 'banner') {
    if (e.target.src !== bannerPlaceholder) {
      e.target.onerror = null;
      e.target.src = bannerPlaceholder;
    }
  }
}

export default function BannerSlider() {
  const [currentSection, setCurrentSection] = React.useState('campaigns');
  const [paused, setPaused] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState('right');
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