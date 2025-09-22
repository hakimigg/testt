# Product Plaza

A modern React-based e-commerce platform for browsing and managing products.

## Features

- 🏠 **Homepage** - Welcome page with featured products and company navigation
- 🛍️ **Products Page** - Browse all products with company filtering
- 📱 **Product Details** - Detailed product information with photo gallery
- ➕ **Add Product** - Create new products with photo upload functionality
- 📸 **Photo Upload** - Drag & drop photo upload with mobile camera support
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🖼️ **Photo Gallery** - View multiple product photos with navigation

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/product-plaza.git
cd product-plaza
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── shared/          # Shared components
│   └── ui/              # Basic UI components (Button, Input, etc.)
├── pages/               # Page components
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   └── admin/           # Admin pages
│       ├── AdminDashboard.jsx
│       ├── AdminAddProduct.jsx
│       └── AdminProducts.jsx
├── entities/            # Data layer and API mocks
├── utils.js             # Utility functions
├── Layout.jsx           # Main layout component
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Features Overview

### Product Management
- Browse products by company (c1, c2, c3, c4)
- View detailed product information with photo galleries
- Add new products with drag & drop photo upload
- Support for multiple photos per product (up to 5)
- Photo preview and management

### Photo Upload Features
- **Drag & Drop**: Drag photos directly into the upload area
- **Browse Files**: Click to select photos from your device
- **Mobile Support**: Camera access and gallery selection on mobile
- **File Validation**: Automatic validation for file type and size
- **Preview**: Real-time photo previews with removal options
- **Multiple Formats**: Supports JPEG, PNG, WebP, and GIF

### User Interface
- Modern design with Tailwind CSS
- Loading states and animations
- Hover effects and transitions
- Responsive navigation
- Mobile-friendly bottom navigation
- Glassmorphism navigation bar

## Demo Data

The application includes sample data for demonstration:
- Sample products across different companies
- Photo upload and display functionality
- Admin product management interface

## Deployment

This project is configured for deployment to GitHub Pages using GitHub Actions. Push to the `main` branch to trigger automatic deployment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
