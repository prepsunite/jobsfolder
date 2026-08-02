import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CompanyCard from '@/components/CompanyCard';
import { dataStore, type CompanyItem } from '@/services/dataStore';
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
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);

  // Add Company Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'IT Services & Consulting',
    description: '',
    logoUrl: '',
    website: '',
    headquarters: 'India & Global',
  });

  const { data: companies = [], isLoading, isError } = useQuery({
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
      const created = await companyService.createCompany({
        name: newCompany.name,
        slug: newCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        industry: newCompany.industry,
        description: newCompany.description || `${newCompany.name} conducts annual recruitment drives.`,
        logoUrl: newCompany.logoUrl || undefined,
        website: newCompany.website || undefined,
        headquarters: newCompany.headquarters,
      });

      dataStore.addCompany({
        id: created.id,
        name: created.name,
        slug: created.slug,
        industry: created.industry,
        description: created.description,
        logoUrl: created.logoUrl,
        website: created.website,
        headquarters: created.headquarters,
        examsList: [`${created.name} Recruitment Drive 2026`],
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
      dataStore.updateCompany(editingCompany.id, editingCompany);
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
      dataStore.deleteCompany(id);
      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (err: any) {
      alert(`Failed to delete company in Supabase: ${err.message || err}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Clean Compact Search & Admin Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
              Companies Directory ({companies.length})
            </h1>
            {isAdmin && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-900 text-white shadow-sm">
                Admin CRUD Enabled
              </span>
            )}
          </div>
          <p className="text-xs text-[#747878] dark:text-[#6e7278] font-sans">
            Explore recruitment drives, exam patterns, and role packages.
          </p>
        </div>

        {/* Compact Search Bar & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747878] dark:text-[#6e7278]" />
            <input
              type="text"
              placeholder="Search TCS, NQT, Ninja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] focus:border-[#006c49] dark:focus:border-[#6cf8bb] rounded-full pl-10 pr-4 py-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] focus:outline-none focus:ring-2 focus:ring-[#006c49]/20 transition-all font-sans"
            />
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] hover:border-[#006c49] dark:hover:border-[#6cf8bb] text-[#1f1b17] dark:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#141517] rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
            <span>Filters</span>
          </button>

          {/* ADMIN INLINE "+ ADD COMPANY" BUTTON */}
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-purple-300" />
              <span>Add Company</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#006c49] dark:text-[#6cf8bb] animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 bg-[#ffffff] dark:bg-[#1e1f22] rounded-[24px] border border-[#e2d8d2] dark:border-[#2b2d31]">
          <Building2 className="w-10 h-10 text-[#747878] dark:text-[#6e7278] mx-auto mb-3" />
          <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3] mb-1">No companies found</h3>
          <p className="text-[#444748] dark:text-[#a6adbb] text-xs">
            Try adjusting your search query or add a company as admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h3 className="font-display text-lg font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Add New Company Live</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Company Name *</label>
                <input type="text" required placeholder="e.g. Capgemini" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Industry</label>
                <input type="text" placeholder="e.g. IT Services & Consulting" value={newCompany.industry} onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Logo URL (Optional - skyblue initial used if empty)</label>
                <input type="url" placeholder="https://..." value={newCompany.logoUrl} onChange={(e) => setNewCompany({ ...newCompany, logoUrl: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Overview Description</label>
                <textarea rows={3} placeholder="Description..." value={newCompany.description} onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Publish Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ MODAL: EDIT COMPANY IN-PLACE */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h3 className="font-display text-lg font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Edit {editingCompany.name} Profile</h3>
              <button onClick={() => setEditingCompany(null)} className="text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]"><XCircle className="w-5 h-5" /></button>
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
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Company Handle / Slug (@slug)</label>
                <input
                  type="text"
                  value={editingCompany.slug}
                  onChange={(e) => setEditingCompany({ ...editingCompany, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs font-mono text-purple-700 dark:text-purple-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Industry</label>
                <input type="text" value={editingCompany.industry} onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Logo Image URL</label>
                <input type="url" value={editingCompany.logoUrl || ''} onChange={(e) => setEditingCompany({ ...editingCompany, logoUrl: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Description Overview</label>
                <textarea rows={3} value={editingCompany.description} onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingCompany(null)} className="px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Cancel</button>
              <button onClick={handleSaveEditedCompany} className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
