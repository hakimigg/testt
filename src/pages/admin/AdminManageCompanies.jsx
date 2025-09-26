import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { supabaseHelpers } from "../../lib/supabase";

export default function AdminManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

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
    if (!confirm(`Are you sure you want to delete "${companyName}"?`)) {
      return;
    }
    
    try {
      console.log('Attempting to delete company:', companyId, companyName);
      await supabaseHelpers.deleteCompany(companyId);
      
      // Only update local state if deletion was successful
      setCompanies(companies.filter(c => c.id !== companyId));
      alert(`Company "${companyName}" has been deleted successfully!`);
      console.log('Company deleted successfully from UI');
    } catch (error) {
      console.error('Error deleting company:', error);
      alert(`Error deleting company: ${error.message || 'Unknown error occurred'}`);
      
      // Reload companies to ensure UI is in sync with database
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
            <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Companies</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={loadCompanies}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Try Again
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
            Manage Companies
          </h1>
          <p className="text-lg text-slate-600">View and manage all companies</p>
        </div>
        <Link to={createPageUrl("admin/add-company")}>
          <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Add New Company
          </button>
        </Link>
      </div>


      {companies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No companies yet</h3>
          <p className="text-slate-600 mb-6">Get started by adding your first company</p>
          <Link to={createPageUrl("admin/add-company")}>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl">
              Add First Company
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Website</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
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
                          <p className="text-sm text-slate-500">ID: {company.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                        {company.description || "No description"}
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
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">No website</span>
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
                          className="px-3 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50 hover:border-red-300 text-sm"
                        >
                          Delete
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
          Total companies: {companies.length}
        </p>
      </div>
    </div>
  );
}
