import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createPageUrl } from "../../utils";
import { supabaseHelpers } from "../../lib/supabase";

export default function AdminManageCompanies() {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
    // Test Supabase connection on component mount
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      console.log('🧪 Testing Supabase connection...');
      const companies = await supabaseHelpers.getCompanies();
      console.log('✅ Supabase READ test successful, companies:', companies.length);
      
      // Test if we can access the supabase client directly
      const { supabase } = await import('../../lib/supabase');
      console.log('🔗 Direct Supabase client:', !!supabase);
      
      if (supabase) {
        // Test a simple query to check permissions
        const { data, error } = await supabase.from('companies').select('count', { count: 'exact' });
        console.log('📊 Company count query result:', { data, error });
      }
    } catch (error) {
      console.error('❌ Supabase connection test failed:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading companies...');
      const fetchedCompanies = await supabaseHelpers.getCompanies();
      console.log('Loaded companies:', fetchedCompanies);
      
      // Ensure we always have an array, even if empty
      const companiesArray = Array.isArray(fetchedCompanies) ? fetchedCompanies : [];
      setCompanies(companiesArray);
    } catch (error) {
      console.error('Error loading companies:', error);
      setError(error.message || 'Failed to load companies');
      // Set empty array on error to prevent blank page
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (companyId, companyName) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return;
    }
    
    console.log('🗑️ Starting deletion process for:', { companyId, companyName });
    
    // Show loading state
    const originalCompanies = [...companies];
    setCompanies(companies.map(c => 
      c.id === companyId ? { ...c, deleting: true } : c
    ));
    
    try {
      // Step 1: Delete from database
      console.log('🚀 Deleting company from database...');
      await supabaseHelpers.deleteCompany(companyId);
      console.log('✅ Database deletion successful');
      
      // Step 2: Verify deletion by reloading from database
      console.log('🔍 Verifying deletion...');
      const updatedCompanies = await supabaseHelpers.getCompanies();
      const stillExists = updatedCompanies.find(c => c.id === companyId);
      
      if (stillExists) {
        // Deletion failed - company still exists in database
        console.error('❌ Deletion verification failed - company still exists');
        setCompanies(originalCompanies);
        alert(`Failed to delete "${companyName}". The company still exists in the database.`);
        return;
      }
      
      // Step 3: Update UI with verified data
      console.log('✅ Deletion verified - updating UI');
      setCompanies(updatedCompanies);
      alert(`✅ Company "${companyName}" has been permanently deleted!`);
      console.log('🎉 Company successfully deleted and UI updated');
      
    } catch (error) {
      console.error('💥 Deletion failed:', error);
      
      // Restore original state on error
      setCompanies(originalCompanies);
      alert(`❌ Failed to delete "${companyName}": ${error.message || 'Unknown error occurred'}`);
      
      // Also reload to ensure UI is in sync
      console.log('🔄 Reloading companies after error...');
      loadCompanies();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add error boundary for better error handling
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">{t('adminCompanies.errorLoading')}</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={loadCompanies}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {t('adminCompanies.title')}
          </h1>
          <p className="text-lg text-slate-600">{t('adminCompanies.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => testSupabaseConnection()}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('adminCompanies.testConnection')}
          </button>
          <Link to={createPageUrl("admin/add-company")}>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              {t('adminCompanies.addNewCompany')}
            </button>
          </Link>
        </div>
      </div>


      {companies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">{t('adminCompanies.noCompanies')}</h3>
          <p className="text-slate-600 mb-6">{t('adminCompanies.getStarted')}</p>
          <Link to={createPageUrl("admin/add-company")}>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl">
              {t('adminCompanies.addFirstCompany')}
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">{t('adminCompanies.tableHeaders.company')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">{t('adminCompanies.tableHeaders.description')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">{t('adminCompanies.tableHeaders.website')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">{t('adminCompanies.tableHeaders.created')}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">{t('adminCompanies.tableHeaders.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`}
                            className="w-12 h-12 object-cover rounded-lg border-2 border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {company.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-800">{company.name}</h3>
                          <p className="text-sm text-slate-500">{t('common.id')}: {company.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                        {company.description || t('common.noDescription')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {company.website ? (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm underline"
                        >
                          {t('common.visitWebsite')}
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">{t('common.noWebsite')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {new Date(company.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(company.id, company.name)}
                          disabled={company.deleting}
                          className={`px-3 py-1 text-sm rounded border transition-all duration-200 ${
                            company.deleting 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
                          }`}
                        >
                          {company.deleting ? t('common.deleting') : t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          {t('adminCompanies.totalCompanies', { count: companies.length })}
        </p>
      </div>
    </div>
  );
}
