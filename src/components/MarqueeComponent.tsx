import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

const MarqueeComponent = () => {
  const [gradientWidth, setGradientWidth] = useState(150); // Default gradient width

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setGradientWidth(100); // Gradient width for mobile devices
      } else {
        setGradientWidth(600); // Gradient width for larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function initially to set the gradient width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='marquee-container flex h-18 !w-400%'>
      <Marquee
        gradient={true}
        gradientWidth={gradientWidth}
        speed={40}
        direction='left'
        pauseOnHover={true}
        play={true}
        delay={0}
        style={{ backgroundColor: '#4DD0E1', width: '400% !important' }}
      >
        <div className="marquee-content h-full w-auto flex flex-nowrap">
        <img src="/images/25.jpg" alt="Image 25" className="marquee-image" />
          <img src="/images/img3.jpg" alt="Image 3" className="marquee-image" />
          <img src="/images/turbosystems.jpg" alt="Image 2" className="marquee-image" />
          <img src="/images/img8.jpg" alt="Image 3" className="marquee-image" />
          <img src="/images/img12.jpg" alt="Image 4" className="marquee-image" />
          <img src="/images/img11.jpg" alt="Image 11" className="marquee-image" />
          <img src="/images/shop.png" alt="Image 1" className="marquee-image" />
          <img src="/images/22.jpg" alt="Image 22" className="marquee-image" />
          <img src="/images/23.jpg" alt="Image 23" className="marquee-image" />
          <img src="/images/pakosarjat.jpg" alt="Image 5" className="marquee-image" />
          <img src="/images/img6.jpg" alt="Image 6" className="marquee-image" />
          <img src="/images/20.jpg" alt="Image 20" className="marquee-image" />
          <img src="/images/img5.jpg" alt="Image 5" className="marquee-image" />
          <img src="/images/img10.jpg" alt="Image 10" className="marquee-image" />
          <img src="/images/img9.jpg" alt="Image 2" className="marquee-image" />
          <img src="/images/img13.jpg" alt="Image 5" className="marquee-image" />
          <img src="/images/img14.jpg" alt="Image 6" className="marquee-image" />
          <img src="/images/img15.jpg" alt="Image 7" className="marquee-image" />
          <img src="/images/24.jpg" alt="Image 24" className="marquee-image" />
          <img src="/images/21.jpg" alt="Image 21" className="marquee-image" />
        </div>
      </Marquee>
    </div>
  );
};

export default MarqueeComponent;