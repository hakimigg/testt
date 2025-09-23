import React, { useState, useEffect } from 'react';
import { supabaseHelpers, supabase } from '../lib/supabase';

export default function DebugInfo() {
  const [debugData, setDebugData] = useState({
    supabaseConfigured: false,
    companies: [],
    error: null,
    envVars: {}
  });

  useEffect(() => {
    async function checkDebugInfo() {
      try {
        // Check environment variables
        const envVars = {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET'
        };

        // Check if Supabase is configured
        const supabaseConfigured = !!supabase;

        // Try to get companies
        const companies = await supabaseHelpers.getCompanies();

        setDebugData({
          supabaseConfigured,
          companies,
          envVars,
          error: null
        });
      } catch (error) {
        setDebugData(prev => ({
          ...prev,
          error: error.message
        }));
      }
    }

    checkDebugInfo();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🐛 Debug Info</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Supabase Configured:</strong> 
          <span className={debugData.supabaseConfigured ? 'text-green-400' : 'text-red-400'}>
            {debugData.supabaseConfigured ? ' ✅ YES' : ' ❌ NO'}
          </span>
        </div>

        <div>
          <strong>Environment Variables:</strong>
          <div className="ml-2">
            {Object.entries(debugData.envVars).map(([key, value]) => (
              <div key={key}>
                {key}: <span className={value === 'NOT SET' ? 'text-red-400' : 'text-green-400'}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <strong>Companies Count:</strong> {debugData.companies.length}
        </div>

        <div>
          <strong>Companies:</strong>
          <div className="ml-2 max-h-32 overflow-y-auto">
            {debugData.companies.map((company, i) => (
              <div key={i} className="text-xs">
                {i + 1}. {company.name} (ID: {company.id})
              </div>
            ))}
          </div>
        </div>

        {debugData.error && (
          <div>
            <strong className="text-red-400">Error:</strong>
            <div className="text-red-300 text-xs">{debugData.error}</div>
          </div>
        )}
      </div>
    </div>
  );
}
