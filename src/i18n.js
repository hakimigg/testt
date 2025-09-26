import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.products": "Products",
      "nav.addProduct": "Add Product",

      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.submit": "Submit",
      "common.required": "Required",
      "common.optional": "Optional",

      // Home Page
      "home.title": "Welcome to Product Plaza",
      "home.subtitle": "Discover amazing products from top companies",
      "home.cta": "Explore Products",
      "home.collections": "Collections",
      "home.featured": "Featured Collection",
      "home.connect": "Connect With Us",
      "home.connectSubtitle": "Follow us on social media and stay connected",
      "home.footerTitle": "Beta Website",
      "home.footerSubtitle": "A curated collection of amazing products. Discover quality and style in every piece.",
      "home.footerCopyright": "© 2024 Beta Website. All rights reserved.",

      // Products Page
      "products.title": "Our Products",
      "products.subtitle": "Browse our collection of amazing products",
      "products.noProducts": "No products found",
      "products.loadMore": "Load More",

      // Product Detail
      "product.addToCart": "Add to Cart",
      "product.price": "Price",
      "product.description": "Description",
      "product.company": "Company",
      "product.stock": "Stock",

      // Add Product (Public)
      "addProduct.title": "Add a New Product",
      "addProduct.subtitle": "Share your amazing product with the world",
      "addProduct.productName": "Product Name",
      "addProduct.productNamePlaceholder": "Enter product name",
      "addProduct.description": "Description",
      "addProduct.descriptionPlaceholder": "Describe your product",
      "addProduct.company": "Company",
      "addProduct.price": "Price (da)",
      "addProduct.pricePlaceholder": "0.00",
      "addProduct.photos": "Product Photos",
      "addProduct.creating": "Creating Product...",
      "addProduct.submit": "Add Product",

      // Admin Dashboard
      "admin.title": "Admin Panel",
      "admin.dashboard": "Dashboard",
      "admin.addProduct": "Add Product",
      "admin.manageProducts": "Manage Products",
      "admin.addCompany": "Add Company",
      "admin.manageCompanies": "Manage Companies",
      "admin.backToSite": "Back to Site",

      // Admin Add Product
      "adminAddProduct.title": "Add New Product",
      "adminAddProduct.subtitle": "Add a new product to your inventory",
      "adminAddProduct.productName": "Product Name",
      "adminAddProduct.productNamePlaceholder": "Enter product name",
      "adminAddProduct.description": "Description",
      "adminAddProduct.descriptionPlaceholder": "Describe your product",
      "adminAddProduct.company": "Company",
      "adminAddProduct.price": "Price (da)",
      "adminAddProduct.pricePlaceholder": "0.00",
      "adminAddProduct.preview": "Product Preview",
      "adminAddProduct.creating": "Creating Product...",
      "adminAddProduct.submit": "Create Product",

      // Admin Add Company
      "adminAddCompany.title": "Add New Company",
      "adminAddCompany.subtitle": "Create a new company profile",
      "adminAddCompany.companyName": "Company Name",
      "adminAddCompany.companyNamePlaceholder": "Enter company name",
      "adminAddCompany.description": "Description",
      "adminAddCompany.descriptionPlaceholder": "Describe the company...",
      "adminAddCompany.logo": "Company Logo",
      "adminAddCompany.creating": "Creating Company...",
      "adminAddCompany.submit": "Create Company",

      // Admin Manage Companies
      "adminCompanies.title": "Manage Companies",
      "adminCompanies.subtitle": "View and manage all companies",
      "adminCompanies.loading": "Loading companies...",
      "adminCompanies.noCompanies": "No companies found",
      "adminCompanies.confirmDelete": "Are you sure you want to delete \"{{companyName}}\"? This action cannot be undone.",
      "adminCompanies.deleted": "Company \"{{companyName}}\" has been permanently deleted!",
      "adminCompanies.deleteFailed": "Failed to delete \"{{companyName}}\". The company still exists in the database.",
      "adminCompanies.deleteError": "Failed to delete \"{{companyName}}\": {{error}}",

      // Admin Products
      "adminProducts.title": "Manage Products",
      "adminProducts.subtitle": "View and manage all products",
      "adminProducts.loading": "Loading products...",
      "adminProducts.noProducts": "No products found",

      // Error Messages
      "error.generic": "An error occurred. Please try again.",
      "error.network": "Network error. Please check your connection.",
      "error.validation": "Please fill in all required fields.",

      // Success Messages
      "success.productCreated": "Product \"{{productName}}\" created successfully!",
      "success.companyCreated": "Company \"{{companyName}}\" has been created successfully!",
      "success.companyDeleted": "Company \"{{companyName}}\" has been permanently deleted!",
    }
  },
  fr: {
    translation: {
      // Navigation
      "nav.home": "Accueil",
      "nav.products": "Produits",
      "nav.addProduct": "Ajouter un Produit",

      // Common
      "common.loading": "Chargement...",
      "common.save": "Enregistrer",
      "common.cancel": "Annuler",
      "common.delete": "Supprimer",
      "common.edit": "Modifier",
      "common.submit": "Soumettre",
      "common.required": "Obligatoire",
      "common.optional": "Optionnel",

      // Home Page
      "home.title": "Bienvenue sur Product Plaza",
      "home.subtitle": "Découvrez des produits exceptionnels des meilleures entreprises",
      "home.cta": "Explorer les Produits",
      "home.collections": "Collections",
      "home.featured": "Collection en Vedette",
      "home.connect": "Connectez-vous avec Nous",
      "home.connectSubtitle": "Suivez-nous sur les réseaux sociaux et restez connecté",
      "home.footerTitle": "Site Web Beta",
      "home.footerSubtitle": "Une collection sélectionnée de produits exceptionnels. Découvrez la qualité et le style dans chaque pièce.",
      "home.footerCopyright": "© 2024 Site Web Beta. Tous droits réservés.",

      // Products Page
      "products.title": "Nos Produits",
      "products.subtitle": "Parcourez notre collection de produits exceptionnels",
      "products.noProducts": "Aucun produit trouvé",
      "products.loadMore": "Charger Plus",

      // Product Detail
      "product.addToCart": "Ajouter au Panier",
      "product.price": "Prix",
      "product.description": "Description",
      "product.company": "Entreprise",
      "product.stock": "Stock",

      // Add Product (Public)
      "addProduct.title": "Ajouter un Nouveau Produit",
      "addProduct.subtitle": "Partagez votre produit exceptionnel avec le monde",
      "addProduct.productName": "Nom du Produit",
      "addProduct.productNamePlaceholder": "Entrez le nom du produit",
      "addProduct.description": "Description",
      "addProduct.descriptionPlaceholder": "Décrivez votre produit",
      "addProduct.company": "Entreprise",
      "addProduct.price": "Prix (da)",
      "addProduct.pricePlaceholder": "0.00",
      "addProduct.photos": "Photos du Produit",
      "addProduct.creating": "Création du Produit...",
      "addProduct.submit": "Ajouter le Produit",

      // Admin Dashboard
      "admin.title": "Panneau d'Administration",
      "admin.dashboard": "Tableau de Bord",
      "admin.addProduct": "Ajouter un Produit",
      "admin.manageProducts": "Gérer les Produits",
      "admin.addCompany": "Ajouter une Entreprise",
      "admin.manageCompanies": "Gérer les Entreprises",
      "admin.backToSite": "Retour au Site",

      // Admin Add Product
      "adminAddProduct.title": "Ajouter un Nouveau Produit",
      "adminAddProduct.subtitle": "Ajoutez un nouveau produit à votre inventaire",
      "adminAddProduct.productName": "Nom du Produit",
      "adminAddProduct.productNamePlaceholder": "Entrez le nom du produit",
      "adminAddProduct.description": "Description",
      "adminAddProduct.descriptionPlaceholder": "Décrivez votre produit",
      "adminAddProduct.company": "Entreprise",
      "adminAddProduct.price": "Prix (da)",
      "adminAddProduct.pricePlaceholder": "0.00",
      "adminAddProduct.preview": "Aperçu du Produit",
      "adminAddProduct.creating": "Création du Produit...",
      "adminAddProduct.submit": "Créer le Produit",

      // Admin Add Company
      "adminAddCompany.title": "Ajouter une Nouvelle Entreprise",
      "adminAddCompany.subtitle": "Créez un profil d'entreprise",
      "adminAddCompany.companyName": "Nom de l'Entreprise",
      "adminAddCompany.companyNamePlaceholder": "Entrez le nom de l'entreprise",
      "adminAddCompany.description": "Description",
      "adminAddCompany.descriptionPlaceholder": "Décrivez l'entreprise...",
      "adminAddCompany.logo": "Logo de l'Entreprise",
      "adminAddCompany.creating": "Création de l'Entreprise...",
      "adminAddCompany.submit": "Créer l'Entreprise",

      // Admin Manage Companies
      "adminCompanies.title": "Gérer les Entreprises",
      "adminCompanies.subtitle": "Voir et gérer toutes les entreprises",
      "adminCompanies.loading": "Chargement des entreprises...",
      "adminCompanies.noCompanies": "Aucune entreprise trouvée",
      "adminCompanies.confirmDelete": "Êtes-vous sûr de vouloir supprimer \"{{companyName}}\" ? Cette action ne peut pas être annulée.",
      "adminCompanies.deleted": "L'entreprise \"{{companyName}}\" a été supprimée définitivement !",
      "adminCompanies.deleteFailed": "Échec de la suppression de \"{{companyName}}\". L'entreprise existe toujours dans la base de données.",
      "adminCompanies.deleteError": "Échec de la suppression de \"{{companyName}}\" : {{error}}",

      // Admin Products
      "adminProducts.title": "Gérer les Produits",
      "adminProducts.subtitle": "Voir et gérer tous les produits",
      "adminProducts.loading": "Chargement des produits...",
      "adminProducts.noProducts": "Aucun produit trouvé",

      // Error Messages
      "error.generic": "Une erreur s'est produite. Veuillez réessayer.",
      "error.network": "Erreur de réseau. Veuillez vérifier votre connexion.",
      "error.validation": "Veuillez remplir tous les champs obligatoires.",

      // Success Messages
      "success.productCreated": "Le produit \"{{productName}}\" a été créé avec succès !",
      "success.companyCreated": "L'entreprise \"{{companyName}}\" a été créée avec succès !",
      "success.companyDeleted": "L'entreprise \"{{companyName}}\" a été supprimée définitivement !",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
