import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { supabaseHelpers } from "../../lib/supabase";
import { useTranslation } from "react-i18next";

export default function AdminAddCompany() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [company, setCompany] = useState({ 
    name: "", 
    description: "", 
    logo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t('adminAddCompany.errors.invalidImage'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t('adminAddCompany.errors.imageTooLarge'));
        return;
      }
      
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setCompany({ ...company, logo: e.target.result });
      };
      reader.readAsDataURL(file);
      setError(''); // Clear any previous errors
    }
  };

  const removePhoto = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setCompany({ ...company, logo: null });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!company.name || !company.name.trim()) {
      setError(t('adminAddCompany.errors.nameRequired'));
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const newCompany = await supabaseHelpers.createCompany(company);
      setSuccessMessage(t('adminAddCompany.success', { companyName: newCompany.name }));
      setCompany({ name: "", description: "", logo: null });
      setLogoPreview(null);
      setLogoFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        navigate(createPageUrl("admin/companies"));
      }, 2000);
      
    } catch (error) {
      console.error("Error creating company:", error);
      setError(error.message || t('adminAddCompany.errors.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('adminAddCompany.title')}
        </h1>
        <p className="text-lg text-slate-600">{t('adminAddCompany.subtitle')}</p>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-slate-200 rounded-2xl shadow-lg">
            {/* Company Logo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('adminAddCompany.logo')}</label>
              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-center">
                        <span className="font-medium text-purple-600">{t('adminAddCompany.form.clickToUpload')}</span>
                        <span className="text-slate-500"> {t('adminAddCompany.form.orDragAndDrop')}</span>
                      </div>
                      <p className="text-xs text-slate-400">{t('adminAddCompany.form.fileTypes')}</p>
                    </div>
                  </label>
                </div>
                {/* Photo Preview */}
                {logoPreview && (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt={t('adminAddCompany.form.logoPreview')}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('adminAddCompany.companyName')} *</label>
              <input 
                type="text"
                value={company.name} 
                onChange={e => setCompany({ ...company, name: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder={t('adminAddCompany.companyNamePlaceholder')}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('adminAddCompany.description')}</label>
              <textarea 
                value={company.description} 
                onChange={e => setCompany({ ...company, description: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                placeholder={t('adminAddCompany.descriptionPlaceholder')}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? t('adminAddCompany.creating') : t('adminAddCompany.submit')}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{t('adminAddCompany.preview')}</h3>
            <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white">
              {/* Logo Preview */}
              <div className="mb-4 flex justify-center">
                {logoPreview ? (
                    <img 
                    src={logoPreview} 
                    alt={t('adminAddCompany.form.companyLogoPreview')}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {company.name ? company.name.charAt(0).toUpperCase() : t('adminAddCompany.previewDefault.initial')}
                    </span>
                  </div>
                )}
              </div>
              
              <h4 className="font-bold text-slate-800 text-center mb-2">
                {company.name || t('adminAddCompany.previewDefault.name')}
              </h4>
              <p className="text-sm text-slate-600 text-center mb-3">
                {company.description || t('adminAddCompany.previewDefault.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
