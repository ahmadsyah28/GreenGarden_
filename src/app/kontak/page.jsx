'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Kontak = () => {
  const [contactMethod, setContactMethod] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      // This is a simulated API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setSubmitStatus({
        success: true,
        message: 'Pesan berhasil dikirim! Kami akan menghubungi Anda segera.'
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Gagal mengirim pesan. Silakan coba lagi nanti.'
      });
    } finally {
      setIsSubmitting(false);
      // Clear status message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-10 flex justify-center my-10">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[#50806B] rounded-2xl overflow-hidden shadow-lg">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <Image 
            src="/images/contact.png"
            alt="Contact Us"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 text-white">
          <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>

          {/* Contact Method Selector */}
          <div className="flex space-x-2 mb-6">
            <button 
              onClick={() => setContactMethod('email')} 
              className={`px-4 py-2 rounded transition-colors duration-200 ${
                contactMethod === 'email' 
                  ? 'bg-white text-[#50806B] font-medium' 
                  : 'bg-[#406954] hover:bg-[#385e4a]'
              }`}
              aria-pressed={contactMethod === 'email'}
            >
              Email
            </button>
            <button 
              onClick={() => setContactMethod('whatsapp')} 
              className={`px-4 py-2 rounded transition-colors duration-200 ${
                contactMethod === 'whatsapp' 
                  ? 'bg-white text-[#50806B] font-medium' 
                  : 'bg-[#406954] hover:bg-[#385e4a]'
              }`}
              aria-pressed={contactMethod === 'whatsapp'}
            >
              WhatsApp
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama Lengkap" 
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#404041] text-black"
                />
              </div>
              
              {contactMethod === 'email' ? (
                <div>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email" 
                    required
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#404041] text-black"
                  />
                </div>
              ) : (
                <div>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nomor WhatsApp" 
                    required
                    pattern="[0-9+\s]*"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#404041] text-black"
                  />
                </div>
              )}
              
              <div>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Pesan Anda" 
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#404041] text-black resize-none h-32"
                ></textarea>
              </div>
            </div>
            
            {submitStatus && (
              <div className={`mt-4 p-3 rounded ${
                submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full bg-[#404041] text-white py-3 rounded-lg font-semibold transition-all duration-200 
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2e2e2f] active:bg-[#252526]'}`}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Kontak;