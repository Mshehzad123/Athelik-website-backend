import fs from 'fs';
import path from 'path';

// Create a simple SVG placeholder image
const createSVGPlaceholder = (width, height, text) => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
};

// Create placeholder images
const placeholders = [
  {
    filename: 'test-product-1.jpg',
    content: createSVGPlaceholder(400, 300, 'Product 1')
  },
  {
    filename: 'test-product-2.jpg', 
    content: createSVGPlaceholder(400, 300, 'Product 2')
  }
];

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create placeholder files
placeholders.forEach(placeholder => {
  const filePath = path.join(uploadsDir, placeholder.filename);
  fs.writeFileSync(filePath, placeholder.content);
  console.log(`Created: ${placeholder.filename}`);
});

console.log('Placeholder images created successfully!'); 