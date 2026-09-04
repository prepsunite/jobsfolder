import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Users,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import type { BulkStudentRow } from '@/types/tpo';

interface BulkStudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeId: string;
  collegeName: string;
  onSuccess: () => void;
}

export default function BulkStudentImportModal({
  isOpen,
  onClose,
  collegeId,
  collegeName,
  onSuccess,
}: BulkStudentImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<BulkStudentRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    updatedCount: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // 1. Download CSV Sample Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'roll_number,name,email,department,batch_year\n' +
      '22B91A0501,Rahul Sharma,rahul.sharma@example.com,CSE,2026\n' +
      '22B91A0502,Sneha Reddy,sneha.reddy@example.com,CSE,2026\n' +
      '22B91A0401,Vikram Varma,vikram.varma@example.com,ECE,2026\n' +
      '22B91A1201,Priya Patel,priya.patel@example.com,IT,2026\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `prepunite_${collegeName.toLowerCase().replace(/\s+/g, '_')}_student_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Parse uploaded CSV file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        alert('CSV file must have a header row and at least one student row.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rollIdx = headers.findIndex(h => h.includes('roll'));
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const deptIdx = headers.findIndex(h => h.includes('dept') || h.includes('branch'));
      const yearIdx = headers.findIndex(h => h.includes('year') || h.includes('batch'));

      if (emailIdx === -1) {
        alert('CSV file must include an "email" column.');
        return;
      }

      const rows: BulkStudentRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length === 0 || !cols[emailIdx]) continue;

        const email = cols[emailIdx];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        rows.push({
          roll_number: rollIdx !== -1 ? cols[rollIdx] || '' : '',
          name: nameIdx !== -1 ? cols[nameIdx] || email.split('@')[0] : email.split('@')[0],
          email,
          department: deptIdx !== -1 ? cols[deptIdx]?.toUpperCase() || 'CSE' : 'CSE',
          batch_year: yearIdx !== -1 ? parseInt(cols[yearIdx]) || 2026 : 2026,
          isValid,
          error: !isValid ? 'Invalid email format' : undefined,
        });
      }

      setParsedRows(rows);
    };

    reader.readAsText(selectedFile);
  };

  // 3. Commit Import
  const handleCommitImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    setIsProcessing(true);
    try {
      const res = await tpoService.bulkImportStudents(collegeId, validRows);
      setImportResult(res);
      onSuccess();
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Bulk Student Provisioning
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {collegeName} • Instant Batch Enrollment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Template Download Box */}
          <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-[#FD4A32]/5 border border-orange-200/60 dark:border-[#FD4A32]/20 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FD4A32]">
                Step 1: Download Standard CSV Template
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Includes Roll No, Full Name, Email, Department (CSE/ECE/IT), and Passout Year.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-[#232428] border border-gray-300 dark:border-[#383a40] text-xs font-bold text-gray-800 dark:text-gray-200 hover:border-[#FD4A32] transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-[#FD4A32]" />
              Download Template
            </button>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-[#383a40] hover:border-[#FD4A32] dark:hover:border-[#FD4A32] rounded-2xl p-8 text-center cursor-pointer transition-colors group bg-gray-50/50 dark:bg-[#18191c]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#2b2d31] group-hover:bg-[#FD4A32]/10 text-gray-500 group-hover:text-[#FD4A32] flex items-center justify-center mx-auto transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="mt-3">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {file ? file.name : 'Click to browse or drop student CSV here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Accepts standard .csv UTF-8 files</p>
            </div>
          </div>

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && !importResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validCount} Valid Students
                  </span>
                  {invalidCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {invalidCount} Invalid Emails
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">Showing first 5 entries</span>
              </div>

              <div className="border border-gray-200 dark:border-[#2e3035] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-[#2e3035]">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Dept</th>
                      <th className="p-2.5">Batch</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2e3035]">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#202225]">
                        <td className="p-2.5 font-mono text-gray-700 dark:text-gray-300">{row.roll_number || '—'}</td>
                        <td className="p-2.5 font-medium text-gray-900 dark:text-white">{row.name}</td>
                        <td className="p-2.5 text-gray-600 dark:text-gray-400">{row.email}</td>
                        <td className="p-2.5 uppercase font-bold text-[#FD4A32]">{row.department}</td>
                        <td className="p-2.5 text-gray-600 dark:text-gray-400">{row.batch_year}</td>
                        <td className="p-2.5">
                          {row.isValid ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                            </span>
                          ) : (
                            <span className="text-rose-500 font-semibold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> {row.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Result Notification */}
          {importResult && (
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Batch Enrollment Completed Successfully!
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                • <strong>{importResult.importedCount}</strong> new students provisioned.<br />
                • <strong>{importResult.updatedCount}</strong> existing accounts linked to {collegeName}.
              </p>
              {importResult.errors.length > 0 && (
                <div className="mt-3 text-xs text-rose-600 dark:text-rose-400">
                  <strong>Notices:</strong> {importResult.errors.slice(0, 3).join(', ')}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
          >
            {importResult ? 'Close' : 'Cancel'}
          </button>

          {!importResult && (
            <button
              onClick={handleCommitImport}
              disabled={validCount === 0 || isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Provisioning Accounts...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Enroll {validCount} Students
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
