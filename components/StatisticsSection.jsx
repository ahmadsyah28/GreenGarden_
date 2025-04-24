'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FaCalendarAlt, FaDrawPolygon, FaLeaf, FaUsers } from 'react-icons/fa';

// Komponen untuk angka yang dihitung secara animasi
const CountUp = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef(null);
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        startAnimation();
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    startTimeRef.current = null;
    countRef.current = 0;
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      
      const progressRatio = Math.min(progress / duration, 1);
      const easedProgress = easeOutQuart(progressRatio);
      const nextCount = Math.floor(easedProgress * end);
      
      if (nextCount !== countRef.current) {
        countRef.current = nextCount;
        setCount(nextCount);
      }
      
      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const easeOutQuart = (x) => {
    return 1 - Math.pow(1 - x, 4);
  };

  return <span ref={elementRef}>{count}{suffix}</span>;
};

const StatItem = ({ icon, jumlah, suffix, label, isLast }) => {
  return (
    <div className="relative px-3 py-3 flex flex-col items-center transition-transform hover:transform hover:scale-105">
      <div className="text-white/80 mb-1 text-xl">
        {icon}
      </div>
      <p className="text-3xl font-bold text-white mb-0">
        <CountUp end={jumlah} suffix={suffix} />
      </p>
      <p className="text-white/90 text-sm text-center">{label}</p>
      
      {!isLast && (
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 h-10 w-[1px] bg-white/30"></div>
      )}
    </div>
  );
};

const StatisticsSection = () => {
  return (
    <section className="flex justify-center mb-5 px-4 relative">
      <div className="relative py-4 px-4 sm:px-8 bg-gradient-to-r from-[#3d6854] via-[#5a9078] to-[#4d8067] rounded-xl shadow-md w-full max-w-4xl border-b-2 border-[#358663] z-10 overflow-hidden">
        {/* Menggunakan file gambar leaf-pattern.jpg dari public folder */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ 
            backgroundImage: 'url("/images/leaf-pattern.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-10">
          <StatItem 
            icon={<FaCalendarAlt />}
            jumlah={5}
            suffix="+"
            label="Tahun Pengalaman"
            isLast={false}
          />
          <StatItem 
            icon={<FaDrawPolygon />}
            jumlah={20}
            suffix="+"
            label="Desain Taman"
            isLast={false}
          />
          <StatItem 
            icon={<FaLeaf />}
            jumlah={80}
            suffix="+"
            label="Tanaman Hias"
            isLast={false}
          />
          <StatItem 
            icon={<FaUsers />}
            jumlah={150}
            suffix="+"
            label="Pelanggan"
            isLast={true}
          />
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;