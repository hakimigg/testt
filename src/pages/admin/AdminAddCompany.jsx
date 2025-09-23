import React, { useState } from "react";
import { Company } from "../../entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import PhotoUpload from "../../components/ui/PhotoUpload";

export default function AdminAddCompany() {
  const navigate = useNavigate();
  const [company, setCompany] = useState({ 
    name: "", 
    description: "", 
    website: "",
    logo: null
  });
  const [logoPhoto, setLogoPhoto] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('AdminAddCompany form submitted');
    console.log('Company data:', company);
    console.log('Logo:', logoPhoto);
    
    // Basic validation
    if (!company.name || !company.name.trim()) {
      alert('Please enter a company name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert logo to base64 string for storage
      const logoUrl = logoPhoto.length > 0 ? logoPhoto[0].preview : null;
      
      const companyToCreate = { 
        ...company, 
        logo: logoUrl
      };
      
      console.log('Creating company with data:', companyToCreate);
      
      const newCompany = await Company.create(companyToCreate);
      setSuccessMessage(`Company "${newCompany.name}" created successfully!`);
      setCompany({ name: "", description: "", website: "", logo: null });
      setLogoPhoto([]);
      
      // Auto-redirect to manage companies after 2 seconds
      setTimeout(() => {
        navigate(createPageUrl("admin/companies"));
      }, 2000);
      
    } catch (error) {
      console.error("Error creating company:", error);
      alert(`Error creating company: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Add New Company
        </h1>
        <p className="text-lg text-slate-600">Create a new company profile</p>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 font-medium">{successMessage}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-slate-200 rounded-2xl shadow-lg">
            {/* Company Logo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Logo</label>
              <PhotoUpload 
                onPhotosChange={setLogoPhoto}
                maxFiles={1}
                maxSizeInMB={5}
                existingPhotos={logoPhoto}
              />
              <p className="text-xs text-slate-500 mt-1">Upload a company logo (optional)</p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
              <Input 
                value={company.name} 
                onChange={e => setCompany({ ...company, name: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="Enter company name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <Textarea 
                value={company.description} 
                onChange={e => setCompany({ ...company, description: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                placeholder="Describe the company..."
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
              <Input 
                type="url"
                value={company.website} 
                onChange={e => setCompany({ ...company, website: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="https://company.com"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? "Creating Company..." : "Create Company"}
            </Button>
          </form>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Company Preview</h3>
            <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white">
              {/* Logo Preview */}
              <div className="mb-4 flex justify-center">
                {logoPhoto.length > 0 ? (
                  <img 
                    src={logoPhoto[0].preview} 
                    alt="Company logo preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {company.name ? company.name.charAt(0).toUpperCase() : "C"}
                    </span>
                  </div>
                )}
              </div>
              
              <h4 className="font-bold text-slate-800 text-center mb-2">
                {company.name || "Company Name"}
              </h4>
              <p className="text-sm text-slate-600 text-center mb-3">
                {company.description || "Company description"}
              </p>
              {company.website && (
                <div className="text-center">
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
