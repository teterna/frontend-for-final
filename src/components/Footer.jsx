// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Pet Clinic & Store. Все права защищены.</p>
        {/* Add more footer content or links here if needed */}
      </div>
    </footer>
  );
}