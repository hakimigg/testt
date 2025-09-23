# Background Image Instructions

## How to Add Your Own Background Photo

1. **Choose your photo**: Select a high-quality image (recommended: 1920x1080 or larger)
2. **Rename your photo**: Rename it to `your-background-image.jpg` (or update the filename in HomePage.jsx)
3. **Place the photo**: Put your image file in this folder (`public/assets/`)
4. **Refresh**: Reload your website to see your background photo

## Recommended Image Specifications

- **Format**: JPG, PNG, or WebP
- **Size**: 1920x1080 pixels or larger
- **File size**: Under 2MB for faster loading
- **Content**: Choose images that work well with white text overlay

## Alternative: Update the Filename

If you prefer to keep your original filename, update line 43 in `src/pages/HomePage.jsx`:

```jsx
backgroundImage: "url('/assets/your-filename-here.jpg')",
```

## Current Setup

- ✅ Folder created: `public/assets/`
- ✅ Code ready for your image
- ✅ Fallback gradient in case image doesn't load
- ✅ Dark overlay for text readability
