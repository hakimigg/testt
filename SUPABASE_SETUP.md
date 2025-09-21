# Supabase Integration Setup Guide

## 🚀 Quick Setup Steps

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project name: `product-plaza`
5. Enter a strong database password
6. Choose a region close to your users
7. Click "Create new project"

### 2. Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon Public Key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

### 3. Configure Environment Variables
1. Create a `.env` file in your project root:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

### 5. Install Dependencies
```bash
npm install
```

### 6. Update Your Code (Optional - for full integration)
Replace your current entity system with Supabase calls. Here's an example:

```javascript
// Instead of: const products = await Product.list()
// Use: const products = await supabaseHelpers.getProducts()

import { supabaseHelpers } from './lib/supabase'

// Get all products
const products = await supabaseHelpers.getProducts()

// Get single product
const product = await supabaseHelpers.getProduct(id)

// Create product
const newProduct = await supabaseHelpers.createProduct({
  name: 'Product Name',
  description: 'Description',
  company: 'c1',
  price: 99.99,
  stock: 50
})
```

## 🔐 Authentication Setup

### Enable Email Authentication
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Auth Providers**, make sure **Email** is enabled
3. Configure your site URL in **Site URL** (e.g., `http://localhost:5173`)

### Add Authentication to Your Components
```javascript
import { supabaseHelpers } from './lib/supabase'

// Sign up
const { user } = await supabaseHelpers.signUp(email, password)

// Sign in
const { user } = await supabaseHelpers.signIn(email, password)

// Sign out
await supabaseHelpers.signOut()

// Get current user
const user = await supabaseHelpers.getCurrentUser()
```

## 📊 Database Tables Created

### Products Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Required)
- `description` (TEXT)
- `company` (VARCHAR, Required)
- `price` (DECIMAL)
- `stock` (INTEGER)
- `tags` (TEXT[])
- `specs` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Wishlist Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `product_id` (UUID, Foreign Key to products)
- `created_at` (TIMESTAMP)

## 🔒 Security Features

- **Row Level Security (RLS)** enabled
- **Public read access** for products
- **Authenticated users** can manage products
- **Users can only access their own wishlist**
- **Automatic timestamps** with triggers

## 🎯 Admin Panel Features

Your admin panel (`/admin`) now includes:
- **Dashboard** with stats and recent products
- **Add Product** form with real-time preview
- **Manage Products** with filtering and deletion
- **Clean separation** from public site

## 🚀 Next Steps

1. **Set up authentication UI** for login/signup
2. **Add admin role checking** for enhanced security
3. **Implement real-time updates** using Supabase subscriptions
4. **Add image upload** using Supabase Storage
5. **Set up email templates** for user notifications

## 🛠️ Troubleshooting

### Common Issues:
- **Environment variables not loading**: Make sure `.env` is in project root and restart dev server
- **Database connection errors**: Check your Supabase URL and key
- **RLS policies blocking access**: Review the SQL policies in Supabase dashboard
- **CORS errors**: Add your domain to Supabase Auth settings

### Testing Your Setup:
1. Start your dev server: `npm run dev`
2. Go to `/admin` to access the admin panel
3. Try creating a product
4. Check if it appears in the public products page

## 📞 Support

If you need help:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Visit [Supabase Discord](https://discord.supabase.com)
3. Review the SQL logs in your Supabase dashboard
