import React, { useState, useEffect } from "react";
import { Company } from "../../entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "../../components/ui/button";

export default function AdminManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const companiesData = await Company.getAll();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const handleDelete = async (companyId, companyName) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"?`)) {
      return;
    }

    try {
      await Company.delete(companyId);
      setCompanies(companies.filter(c => c.id !== companyId));
      alert(`Company "${companyName}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting company:', error);
      alert(`Error deleting company: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-48 mx-auto"></div>
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
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Add New Company
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error loading companies: {error}</p>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No companies yet</h3>
          <p className="text-slate-600 mb-6">Get started by adding your first company</p>
          <Link to={createPageUrl("admin/add-company")}>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl">
              Add First Company
            </Button>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(company.id, company.name)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          Delete
                        </Button>
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
