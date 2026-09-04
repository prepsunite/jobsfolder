import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  ShieldCheck,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Users,
  Plus,
  Calendar,
  Edit2,
  Sliders,
  Award,
  Lock,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import type { College, CollegeStudent } from '@/types/tpo';

export default function CollegesTpoManager() {
  const queryClient = useQueryClient();

  // Modal / Edit States
  const [isAddCollegeModalOpen, setIsAddCollegeModalOpen] = useState(false);
  const [editingLicenseCollege, setEditingLicenseCollege] = useState<{ id: string; name: string; currentCap: number } | null>(null);
  const [newCapValue, setNewCapValue] = useState<number>(1000);

  // New College State
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeCode, setNewCollegeCode] = useState('');
  const [newCollegeCity, setNewCollegeCity] = useState('');
  const [newCollegeLicenses, setNewCollegeLicenses] = useState(1500);
  const [isAddingCollege, setIsAddingCollege] = useState(false);

  // Assign TPO State
  const [tpoEmail, setTpoEmail] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [isAssigningTpo, setIsAssigningTpo] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Query: All Colleges with Real-Time Student Usage
  const { data: colleges = [], isLoading: collegesLoading } = useQuery({
    queryKey: ['admin-colleges-usage'],
    queryFn: () => tpoService.getAllCollegesWithUsage(),
  });

  // Query: TPO Admins
  const { data: tpoAdmins = [], isLoading: tpoLoading } = useQuery<(CollegeStudent & { college_name?: string })[]>({
    queryKey: ['admin-tpo-admins'],
    queryFn: () => tpoService.getTpoAdmins(),
  });

  // Calculate Global Institutional Totals
  const totalPartnerColleges = colleges.length;
  const totalSoldLicenses = colleges.reduce((acc, c) => acc + (c.max_licenses || 0), 0);
  const totalEnrolledStudents = colleges.reduce((acc, c) => acc + (c.enrolled_count || 0), 0);
  const totalActiveContracts = colleges.filter(c => c.contract_status === 'ACTIVE').length;

  // 1. Add New Partner College
  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim() || !newCollegeCode.trim()) {
      alert('Please provide College Name and College Code.');
      return;
    }

    setIsAddingCollege(true);
    try {
      await tpoService.createCollege({
        name: newCollegeName.trim(),
        code: newCollegeCode.trim().toUpperCase(),
        slug: newCollegeCode.trim().toLowerCase(),
        city: newCollegeCity.trim() || undefined,
        contract_status: 'ACTIVE',
        max_licenses: newCollegeLicenses || 1500,
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      setNewCollegeName('');
      setNewCollegeCode('');
      setNewCollegeCity('');
      setIsAddCollegeModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
      setStatusMessage({ text: `Partner College successfully registered with ${newCollegeLicenses} student seats!` });
    } catch (err: any) {
      setStatusMessage({ text: `Failed to create college: ${err.message}`, isError: true });
    } finally {
      setIsAddingCollege(false);
    }
  };

  // 2. Assign Email as TPO
  const handleAssignTpo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpoEmail.trim() || !selectedCollegeId) {
      alert('Please enter a user email and select a target college.');
      return;
    }

    setIsAssigningTpo(true);
    setStatusMessage(null);
    try {
      const res = await tpoService.assignTpoAdmin(tpoEmail.trim(), selectedCollegeId);
      if (res.success) {
        setStatusMessage({ text: res.message });
        setTpoEmail('');
        queryClient.invalidateQueries({ queryKey: ['admin-tpo-admins'] });
        queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
      } else {
        setStatusMessage({ text: res.message, isError: true });
      }
    } catch (err: any) {
      setStatusMessage({ text: `Error assigning TPO: ${err.message}`, isError: true });
    } finally {
      setIsAssigningTpo(false);
    }
  };

  // 3. Update College Student License Capacity
  const handleSaveLicenseCapacity = async () => {
    if (!editingLicenseCollege) return;

    try {
      await tpoService.updateCollegeLicenseLimit(editingLicenseCollege.id, newCapValue);
      setEditingLicenseCollege(null);
      queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
      setStatusMessage({ text: `Updated license quota for ${editingLicenseCollege.name} to ${newCapValue} students.` });
    } catch (err: any) {
      alert(`Error updating capacity: ${err.message}`);
    }
  };

  // 4. Toggle Contract Status (ACTIVE vs SUSPENDED)
  const handleToggleContractStatus = async (collegeId: string, currentStatus: string, collegeName: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const confirmMsg =
      nextStatus === 'SUSPENDED'
        ? `Are you sure you want to SUSPEND access for "${collegeName}"? Enrolled students will be blocked until re-activated.`
        : `Re-activate institutional access for "${collegeName}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      await tpoService.updateCollegeContractStatus(collegeId, nextStatus as any);
      queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
      setStatusMessage({ text: `Contract for ${collegeName} is now ${nextStatus}.` });
    } catch (err: any) {
      alert(`Error updating contract: ${err.message}`);
    }
  };

  // 5. Revoke TPO Access
  const handleRevoke = async (userId: string, email: string) => {
    if (!confirm(`Revoke TPO Admin privileges for ${email}?`)) return;

    try {
      await tpoService.revokeTpoAdmin(userId);
      queryClient.invalidateQueries({ queryKey: ['admin-tpo-admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
      setStatusMessage({ text: `Revoked TPO access for ${email}` });
    } catch (err: any) {
      setStatusMessage({ text: `Failed to revoke: ${err.message}`, isError: true });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
              Enterprise B2B Command Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            College Partnerships & License Allocation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control student seat capacity, enforce paid quotas, and authorize TPO administrators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddCollegeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20"
          >
            <Plus className="w-4 h-4" />
            Onboard New Partner College
          </button>
        </div>
      </div>

      {/* Global B2B Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Partner Institutions</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalPartnerColleges}
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">{totalActiveContracts} Active Contracts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Paid Student Seats</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalSoldLicenses.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across all signed colleges</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Currently Enrolled Students</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {totalEnrolledStudents.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {totalSoldLicenses > 0 ? Math.round((totalEnrolledStudents / totalSoldLicenses) * 100) : 0}% utilization rate
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active TPO Coordinators</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {tpoAdmins.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Authorized campus managers</p>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold ${
            statusMessage.isError
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* Section 1: Partner Colleges & Paid License Quota Allocation */}
      <div className="bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Partner Colleges & Seat Allocation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enforced student capacity: Colleges cannot import more students than their paid license limit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collegesLoading ? (
            <div className="col-span-3 py-12 text-center text-xs text-slate-400">Loading colleges...</div>
          ) : colleges.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-xs text-slate-400">
              No colleges onboarded yet. Click "Onboard New Partner College" to register your first institutional contract.
            </div>
          ) : (
            colleges.map(college => {
              const cap = college.max_licenses || 1000;
              const used = college.enrolled_count || 0;
              const percent = Math.min(100, Math.round((used / cap) * 100));
              const isSuspended = college.contract_status === 'SUSPENDED';

              let barColor = 'bg-emerald-500';
              if (percent > 90) barColor = 'bg-rose-500';
              else if (percent > 75) barColor = 'bg-amber-500';

              return (
                <div
                  key={college.id}
                  className={`rounded-2xl border p-5 space-y-4 transition-all flex flex-col justify-between ${
                    isSuspended
                      ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151618]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Name + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-slate-900 dark:text-white">{college.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {college.code}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">{college.city || 'Pan-India'}</span>
                      </div>

                      <button
                        onClick={() => handleToggleContractStatus(college.id, college.contract_status, college.name)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                          college.contract_status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-rose-100'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                        title="Click to toggle status"
                      >
                        {college.contract_status === 'ACTIVE' ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5" /> Active
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-2.5 h-2.5" /> Suspended
                          </>
                        )}
                      </button>
                    </div>

                    {/* Paid License Capacity Gauge */}
                    <div className="p-3 bg-white dark:bg-[#202225] rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold">Seat Capacity:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 dark:text-white font-mono">{used} / {cap}</strong>
                          <button
                            onClick={() => {
                              setEditingLicenseCollege({ id: college.id, name: college.name, currentCap: cap });
                              setNewCapValue(cap);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-[#FD4A32] hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Edit paid student license capacity"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${percent}%` }} />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{percent}% seats utilized</span>
                        <span>{Math.max(0, cap - used)} seats free</span>
                      </div>
                    </div>

                    {/* TPO Assignment info */}
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <div>
                        TPO Coordinator:{' '}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {college.tpo_email || 'None assigned yet'}
                        </strong>
                      </div>
                      <div>
                        Active Drives:{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{college.active_exams_count || 0} mock exams</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setEditingLicenseCollege({ id: college.id, name: college.name, currentCap: cap });
                        setNewCapValue(cap);
                      }}
                      className="text-[#FD4A32] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <Sliders className="w-3 h-3" /> Adjust Paid Seats
                    </button>

                    <button
                      onClick={() => setSelectedCollegeId(college.id)}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold text-[11px]"
                    >
                      Assign Coordinator →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Section 2: Assign TPO Coordinator to College */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form: Assign TPO Email */}
        <div className="bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Assign TPO Coordinator
              </h3>
              <p className="text-xs text-slate-500">
                Grant institutional portal access to a college faculty / placement officer email
              </p>
            </div>
          </div>

          <form onSubmit={handleAssignTpo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                TPO Account Email Address *
              </label>
              <input
                type="email"
                required
                value={tpoEmail}
                onChange={e => setTpoEmail(e.target.value)}
                placeholder="e.g. placements@cbit.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Select Partner College *
              </label>
              <select
                required
                value={selectedCollegeId}
                onChange={e => setSelectedCollegeId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-xs text-slate-900 dark:text-white"
              >
                <option value="">-- Choose Partner College --</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code}) — {c.max_licenses} Paid Seats
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isAssigningTpo}
              className="w-full py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isAssigningTpo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Granting Access...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Authorize TPO Coordinator
                </>
              )}
            </button>
          </form>
        </div>

        {/* Active TPO Coordinators Table */}
        <div className="bg-white dark:bg-[#1e1f22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Authorized TPO Admins ({tpoAdmins.length})
              </h3>
              <p className="text-xs text-slate-500">Staff with portal access</p>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-[#151618] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Campus</th>
                  <th className="p-3 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tpoAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-400">
                      No TPO coordinators assigned.
                    </td>
                  </tr>
                ) : (
                  tpoAdmins.map(admin => (
                    <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{admin.email}</td>
                      <td className="p-3 font-bold text-[#FD4A32]">{admin.college_name || 'Unassigned'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRevoke(admin.id, admin.email)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL 1: Adjust Paid License Capacity */}
      {editingLicenseCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Adjust Paid Student Seats
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingLicenseCollege.name}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Paid Student License Cap:
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={newCapValue}
                onChange={e => setNewCapValue(parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#151618] text-base font-black text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If college paid for 1,500 students, enter <strong>1500</strong>. The system will strictly reject any student import beyond this number.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingLicenseCollege(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLicenseCapacity}
                className="flex-1 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Save Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Onboard New College */}
      {isAddCollegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Onboard Partner College
              </h3>
              <button onClick={() => setIsAddCollegeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCollege} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  College Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={e => setNewCollegeName(e.target.value)}
                  placeholder="e.g. Chaitanya Bharathi Institute of Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Short Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCollegeCode}
                    onChange={e => setNewCollegeCode(e.target.value)}
                    placeholder="e.g. CBIT"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newCollegeCity}
                    onChange={e => setNewCollegeCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paid Student Seats Limit *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  step="50"
                  value={newCollegeLicenses}
                  onChange={e => setNewCollegeLicenses(parseInt(e.target.value) || 1500)}
                  placeholder="e.g. 1500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-mono font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  How many students this college has paid for. The system will enforce this cap strictly.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCollegeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCollege}
                  className="flex-1 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {isAddingCollege ? 'Registering...' : 'Register College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
