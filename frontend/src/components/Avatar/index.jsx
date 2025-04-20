import React from 'react';
import './Avatar.css';

function Avatar({ name, imageUrl}) {
 function getRandomColor(name) {
  // Kiểm tra xem name có phải là chuỗi không
  if (typeof name !== 'string' || name.length === 0) {
    return `hsl(0, 0%, 50%)`; // fallback nếu name không hợp lệ
  }

  const hue = Math.floor(name.charCodeAt(0) / 256 * 360);
  const saturation = Math.floor(name.charCodeAt(0) / 256 * 360);
  const lightness = 50; 
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const randomColor = getRandomColor(name);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Avatar"
      className="uy-avatar"
      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
    />
  ) : (
    <div
      className="uy-avatar-placeholder"
      style={{ width: '100%', height: '100%', backgroundColor: randomColor, borderRadius: '50%' }}
    >
      {initial}
    </div>
  );
}


export default Avatar;
