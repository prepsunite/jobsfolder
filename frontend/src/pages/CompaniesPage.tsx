import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CompanyCard from '@/components/CompanyCard';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Building2, SlidersHorizontal, Loader2, Plus, XCircle } from 'lucide-react';
import type { Company } from '@/types/company';

import { companyService } from '@/services/company.service';

export default function CompaniesPage() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Add Company Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'IT Services & Consulting',
    description: '',
    logoUrl: '',
    website: '',
    headquarters: 'India & Global',
  });

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['live-companies', searchTerm],
    queryFn: async () => {
      const res = await companyService.getCompanies(searchTerm);
      return (res.content || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || `${c.name} recruitment drives and hiring patterns.`,
        industry: c.industry || 'IT Services & Consulting',
        companySize: c.companySize || '10,000+ employees',
        headquarters: c.headquarters || 'India & Global',
        website: c.website,
        logoUrl: c.logoUrl,
        examsList: [`${c.name} Placement Papers 2026`],
        isActive: c.isActive,
        createdAt: c.createdAt,
      }));
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name) return;

    try {
      await companyService.createCompany({
        name: newCompany.name,
        slug: newCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        industry: newCompany.industry,
        description: newCompany.description || `${newCompany.name} conducts annual recruitment drives.`,
        logoUrl: newCompany.logoUrl || undefined,
        website: newCompany.website || undefined,
        headquarters: newCompany.headquarters,
      });

      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setShowAddModal(false);
      setNewCompany({ name: '', industry: 'IT Services & Consulting', description: '', logoUrl: '', website: '', headquarters: 'India & Global' });
    } catch (err: any) {
      alert(`Failed to create company in Supabase: ${err.message || err}`);
    }
  };

  const handleSaveEditedCompany = async () => {
    if (!editingCompany) return;
    try {
      await companyService.updateCompany(editingCompany.slug || editingCompany.id, editingCompany);
      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setEditingCompany(null);
    } catch (err: any) {
      alert(`Failed to update company in Supabase: ${err.message || err}`);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await companyService.deleteCompany(id);
      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (err: any) {
      alert(`Failed to delete company in Supabase: ${err.message || err}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Clean Compact Search & Admin Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E9ECEF] dark:border-[#242424]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              Companies Directory ({companies.length})
            </h1>
            {isAdmin && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                Admin CRUD
              </span>
            )}
          </div>
          <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans mt-0.5">
            Explore recruitment drives, previous year papers, and hiring patterns.
          </p>
        </div>

        {/* Compact Search Bar & Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
            <input
              type="text"
              placeholder="Search TCS, Accenture, Amazon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] dark:placeholder-[#555555] focus:outline-none transition-colors font-sans"
            />
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] hover:border-[#121417] dark:hover:border-[#444444] text-[#121417] dark:text-[#FFFFFF] rounded-md text-xs font-display font-bold uppercase tracking-wider transition-colors shrink-0">
            <SlidersHorizontal className="w-3 h-3 text-[#FD4A32] dark:text-[#FD4A32]" />
            <span>Filters</span>
          </button>

          {/* ADMIN INLINE "+ ADD COMPANY" BUTTON */}
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-md text-xs font-display font-bold uppercase tracking-wider shadow-sm transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Company</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#FD4A32] dark:text-[#FD4A32] animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 bg-[#F8F9FA] dark:bg-[#141414] rounded-lg border border-[#E9ECEF] dark:border-[#242424]">
          <Building2 className="w-8 h-8 text-[#868E96] dark:text-[#555555] mx-auto mb-2" />
          <h3 className="font-display text-sm font-bold text-[#121417] dark:text-[#FFFFFF] mb-1">No companies found</h3>
          <p className="text-[#868E96] dark:text-[#555555] text-xs">
            Try adjusting your search query or add a company as admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company as Company}
              onEdit={() => setEditingCompany(company)}
              onDelete={handleDeleteCompany}
            />
          ))}
        </div>
      )}

      {/* ➕ MODAL: ADD COMPANY IN-PLACE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9ECEF] dark:border-[#242424]">
              <h3 className="font-display text-base font-bold text-[#121417] dark:text-[#FFFFFF]">Add New Company</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF]"><XCircle className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">Company Name *</label>
                <input type="text" required placeholder="e.g. Capgemini" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">Industry</label>
                <input type="text" placeholder="e.g. IT Services & Consulting" value={newCompany.industry} onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">Logo URL (Optional)</label>
                <input type="url" placeholder="https://..." value={newCompany.logoUrl} onChange={(e) => setNewCompany({ ...newCompany, logoUrl: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">Overview Description</label>
                <textarea rows={3} placeholder="Description..." value={newCompany.description} onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-xs font-semibold text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#121417] dark:bg-white text-white dark:text-black rounded-md text-xs font-display font-bold uppercase tracking-wider">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ MODAL: EDIT COMPANY IN-PLACE */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1f22] border border-[#E9ECEF] dark:border-[#2b2d31] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9ECEF] dark:border-[#2b2d31]">
              <h3 className="font-display text-lg font-bold text-[#121417] dark:text-[#e3e3e3]">Edit {editingCompany.name} Profile</h3>
              <button onClick={() => setEditingCompany(null)} className="text-[#747878] dark:text-[#6e7278] hover:text-[#121417] dark:hover:text-[#e3e3e3]"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Company Name</label>
                <input
                  type="text"
                  value={editingCompany.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    setEditingCompany({ ...editingCompany, name: newName, slug: autoSlug });
                  }}
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs font-bold text-[#121417] dark:text-[#e3e3e3]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Company Handle / Slug (@slug)</label>
                <input
                  type="text"
                  value={editingCompany.slug}
                  onChange={(e) => setEditingCompany({ ...editingCompany, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs font-mono text-purple-700 dark:text-purple-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Industry</label>
                <input type="text" value={editingCompany.industry} onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#121417] dark:text-[#e3e3e3]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Logo Image URL</label>
                <input type="url" value={editingCompany.logoUrl || ''} onChange={(e) => setEditingCompany({ ...editingCompany, logoUrl: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#121417] dark:text-[#e3e3e3]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Description Overview</label>
                <textarea rows={3} value={editingCompany.description} onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })} className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#121417] dark:text-[#e3e3e3]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingCompany(null)} className="px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#6e7278] hover:text-[#121417] dark:hover:text-[#e3e3e3]">Cancel</button>
              <button onClick={handleSaveEditedCompany} className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
