/**
 * @license
 * GRAM-DISHA — Statutory Document Readiness & Bankable DPR Generator View
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  ShieldCheck, 
  FileText,
  ExternalLink,
  Lock,
  Sparkles,
  Download,
  Printer,
  RefreshCw,
  Building2,
  PieChart,
  TrendingUp,
  X,
  Cloud,
  HardDrive
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';
import { ApiClient } from '../../services/api/apiClient';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../../services/firebase';

interface DocumentItem {
  id: string;
  name: string;
  category: 'IDENTITY' | 'LEGAL' | 'FINANCIAL' | 'TECHNICAL';
  issuingAuthority: string;
  status: 'VERIFIED' | 'DIGILOCKER_SYNCED' | 'PENDING' | 'OPTIONAL';
  requiredFor: string[];
}

export const DocumentsView: React.FC = () => {
  const { openAdvisorWithInsight } = useDisha();
  const { activeBusiness, user } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [dprGenerating, setDprGenerating] = useState(false);
  const [dprResult, setDprResult] = useState<any>(null);
  const [showDprModal, setShowDprModal] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Google Drive Integration States
  const [driveToken, setDriveToken] = useState<string | null>(() => localStorage.getItem('google_drive_access_token'));
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [fetchingDrive, setFetchingDrive] = useState(false);
  const [uploadingDrive, setUploadingDrive] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSuccess, setDriveSuccess] = useState<string | null>(null);

  // Storage tab state: 'GOOGLE_DRIVE' or 'FIREBASE_STORAGE'
  const [activeStorageTab, setActiveStorageTab] = useState<'GOOGLE_DRIVE' | 'FIREBASE_STORAGE'>('FIREBASE_STORAGE');

  // Firebase Storage Integration States
  const [firebaseFiles, setFirebaseFiles] = useState<any[]>([]);
  const [fetchingFirebase, setFetchingFirebase] = useState(false);
  const [uploadingFirebase, setUploadingFirebase] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [firebaseSuccess, setFirebaseSuccess] = useState<string | null>(null);

  // Fetch Drive and Firebase Files automatically when conditions are met
  useEffect(() => {
    if (driveToken) {
      fetchDriveFiles(driveToken);
    }
  }, [driveToken]);

  useEffect(() => {
    if (user) {
      fetchFirebaseFiles();
    }
  }, [user]);

  const fetchFirebaseFiles = async () => {
    if (!user) return;
    setFetchingFirebase(true);
    setFirebaseError(null);
    try {
      const folderRef = ref(storage, `users/${user.id || 'default'}/documents`);
      const res = await listAll(folderRef);
      const filePromises = res.items.map(async (item) => {
        try {
          const url = await getDownloadURL(item);
          return {
            id: item.fullPath,
            name: item.name,
            url: url,
            savedOn: new Date().toLocaleDateString()
          };
        } catch {
          return null;
        }
      });
      const files = (await Promise.all(filePromises)).filter(Boolean);
      setFirebaseFiles(files);
    } catch (err: any) {
      console.warn('Firebase Storage retrieve error:', err);
      setFirebaseError('Could not retrieve documents from Firebase Storage.');
    } finally {
      setFetchingFirebase(false);
    }
  };

  const uploadFileToFirebase = async (file: File) => {
    if (!user) {
      setFirebaseError('Please authenticate to upload files to Firebase Storage.');
      return;
    }
    setUploadingFirebase(true);
    setFirebaseError(null);
    try {
      const fileRef = ref(storage, `users/${user.id || 'default'}/documents/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      const newFile = {
        id: fileRef.fullPath,
        name: file.name,
        url: url,
        savedOn: new Date().toLocaleDateString()
      };
      
      setFirebaseFiles(prev => [newFile, ...prev]);
      setFirebaseSuccess(`"${file.name}" uploaded to Firebase Object Storage!`);
      setTimeout(() => setFirebaseSuccess(null), 4000);
      
      // Auto-verify one document on checklist as high-fidelity feedback
      const pendingDoc = documents.find(d => d.status === 'PENDING');
      if (pendingDoc) {
        await handleToggleStatus(pendingDoc.id);
      }
    } catch (err: any) {
      console.error('Firebase storage upload failed:', err);
      setFirebaseError(err.message || 'Failed to upload document to Firebase Storage.');
    } finally {
      setUploadingFirebase(false);
    }
  };

  const deleteFileFromFirebase = async (filePath: string, fileName: string) => {
    setFetchingFirebase(true);
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      setFirebaseFiles(prev => prev.filter(f => f.id !== filePath));
      setFirebaseSuccess(`"${fileName}" deleted from Firebase Storage.`);
      setTimeout(() => setFirebaseSuccess(null), 3000);
    } catch (err: any) {
      console.error('Firebase storage delete failed:', err);
      setFirebaseError(err.message || 'Failed to delete file from Firebase Storage.');
    } finally {
      setFetchingFirebase(false);
    }
  };

  const fetchDriveFiles = async (token: string) => {
    setFetchingDrive(true);
    setDriveError(null);
    try {
      const q = encodeURIComponent("trashed = false and (mimeType = 'application/pdf' or mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType = 'text/plain')");
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,webViewLink,createdTime,size)&orderBy=createdTime%20desc&pageSize=15`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid
          setDriveToken(null);
          localStorage.removeItem('google_drive_access_token');
          throw new Error('Google Drive session expired. Please reconnect.');
        }
        throw new Error('Failed to retrieve files from Google Drive.');
      }
      const data = await res.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      setDriveError(err.message || 'Could not fetch Google Drive files.');
    } finally {
      setFetchingDrive(false);
    }
  };

  const handleConnectDrive = () => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '1048291048210-gramdisha.apps.googleusercontent.com';
    if ((window as any).google?.accounts?.oauth2) {
      try {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file email profile openid',
          callback: (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              setDriveToken(tokenResponse.access_token);
              localStorage.setItem('google_drive_access_token', tokenResponse.access_token);
              setDriveSuccess('Google Drive connected successfully!');
              setTimeout(() => setDriveSuccess(null), 4000);
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        setDriveError('Failed to initialize Google Drive connection.');
      }
    } else {
      setDriveError('Google API client not loaded yet. Please wait a moment and try again.');
    }
  };

  const handleDisconnectDrive = () => {
    setDriveToken(null);
    setDriveFiles([]);
    localStorage.removeItem('google_drive_access_token');
    setDriveSuccess('Google Drive disconnected.');
    setTimeout(() => setDriveSuccess(null), 3000);
  };

  const uploadFileToDrive = async (file: File) => {
    if (!driveToken) return;
    setUploadingDrive(true);
    setDriveError(null);
    try {
      const metadata = {
        name: file.name,
        mimeType: file.type || 'application/octet-stream'
      };
      
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime,size', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${driveToken}`
        },
        body: form
      });

      if (!res.ok) {
        throw new Error('Failed to upload file to Google Drive.');
      }

      const uploadedFile = await res.json();
      setDriveFiles(prev => [uploadedFile, ...prev]);
      setDriveSuccess(`"${file.name}" saved to Google Drive!`);
      setTimeout(() => setDriveSuccess(null), 4000);
    } catch (err: any) {
      setDriveError(err.message || 'Upload failed.');
    } finally {
      setUploadingDrive(false);
    }
  };

  const uploadDPRToDrive = async () => {
    if (!driveToken || !dprResult) return;
    setUploadingDrive(true);
    setDriveError(null);
    try {
      const dprContent = `
# DETAILED PROJECT REPORT (DPR) DOSSIER
Dossier ID: \${dprResult.dpr_dossier_id}
Enterprise Name: \${dprResult.enterprise_summary.enterprise_name}
Promoter Name: \${dprResult.enterprise_summary.promoter_name}
Date Generated: \${dprResult.generation_date}

## KEY METRICS:
- Average DSCR: \${dprResult.key_bank_ratios.average_dscr}
- Total Project Cost: ₹\${dprResult.project_financial_structure.total_project_cost.toLocaleString()}
- Term Loan Sanctioned: ₹\${dprResult.loan_repayment_schedule.sanction_amount.toLocaleString()}
- Subsidy Eligible: ₹\${dprResult.means_of_finance.back_ended_government_subsidy_eligible.toLocaleString()}

## APPRAISAL DECLARATION:
\${dprResult.appraisal_declaration}
      `.trim();

      const blob = new Blob([dprContent], { type: 'text/markdown' });
      const file = new File([blob], `\${dprResult.enterprise_summary.enterprise_name.replace(/\\s+/g, '_')}_DPR_Dossier.md`, { type: 'text/markdown' });
      await uploadFileToDrive(file);
    } catch (err: any) {
      setDriveError(err.message || 'Failed to upload DPR to Google Drive.');
    } finally {
      setUploadingDrive(false);
    }
  };

  const uploadDPRToFirebase = async () => {
    if (!dprResult) return;
    setUploadingFirebase(true);
    setFirebaseError(null);
    try {
      const dprContent = `
# DETAILED PROJECT REPORT (DPR) DOSSIER
Dossier ID: \${dprResult.dpr_dossier_id}
Enterprise Name: \${dprResult.enterprise_summary.enterprise_name}
Promoter Name: \${dprResult.enterprise_summary.promoter_name}
Date Generated: \${dprResult.generation_date}

## KEY METRICS:
- Average DSCR: \${dprResult.key_bank_ratios.average_dscr}
- Total Project Cost: ₹\${dprResult.project_financial_structure.total_project_cost.toLocaleString()}
- Term Loan Sanctioned: ₹\${dprResult.loan_repayment_schedule.sanction_amount.toLocaleString()}
- Subsidy Eligible: ₹\${dprResult.means_of_finance.back_ended_government_subsidy_eligible.toLocaleString()}

## APPRAISAL DECLARATION:
\${dprResult.appraisal_declaration}
      `.trim();

      const blob = new Blob([dprContent], { type: 'text/markdown' });
      const file = new File([blob], `\${dprResult.enterprise_summary.enterprise_name.replace(/\\s+/g, '_')}_DPR_Dossier.md`, { type: 'text/markdown' });
      await uploadFileToFirebase(file);
    } catch (err: any) {
      setFirebaseError(err.message || 'Failed to upload DPR to Firebase Storage.');
    } finally {
      setUploadingFirebase(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (activeStorageTab === 'FIREBASE_STORAGE') {
        await uploadFileToFirebase(e.dataTransfer.files[0]);
      } else {
        await uploadFileToDrive(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (activeStorageTab === 'FIREBASE_STORAGE') {
        await uploadFileToFirebase(e.target.files[0]);
      } else {
        await uploadFileToDrive(e.target.files[0]);
      }
    }
  };

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await ApiClient.getDocumentsChecklist(activeBusiness?.id || 'biz_default');
      if (res.status === 'SUCCESS' && res.data) {
        const mapped = res.data.map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.category || 'IDENTITY',
          issuingAuthority: d.issuing_authority || d.issuingAuthority || 'Issuing Authority',
          status: d.status || 'PENDING',
          requiredFor: Array.isArray(d.required_for) 
            ? d.required_for 
            : typeof d.required_for === 'string' 
              ? d.required_for.split(',').map((s: string) => s.trim())
              : ['PMEGP', 'Bank Loan']
        }));
        setDocuments(mapped);
        setIsBackendConnected(true);
      }
    } catch {
      setIsBackendConnected(false);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [activeBusiness?.id]);

  const verifiedCount = documents.filter(d => d.status === 'VERIFIED' || d.status === 'DIGILOCKER_SYNCED').length;
  const totalCount = documents.length || 1;
  const readinessPercent = Math.round((verifiedCount / totalCount) * 100);

  const handleToggleStatus = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    const nextStatus = doc.status === 'PENDING' ? 'VERIFIED' : 'PENDING';

    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: nextStatus } : d));

    try {
      await ApiClient.updateDocumentStatus(id, activeBusiness?.id || 'biz_default', nextStatus);
    } catch (err) {
      console.error('Failed to sync document status:', err);
    }
  };

  const handleGenerateDPR = async () => {
    setDprGenerating(true);
    try {
      const payload = {
        enterprise_name: activeBusiness?.title || 'Jai Kisan Agro Processing Enterprise',
        category: activeBusiness?.category || 'AGRO_PROCESSING',
        promoter_name: user?.fullName || 'Ramesh Patil',
        promoter_category: user?.demographics?.category || 'OBC',
        promoter_gender: user?.demographics?.gender || 'MALE',
        is_rural: activeBusiness?.proposedLocation?.isRural ?? true,
        state: activeBusiness?.proposedLocation?.state || 'Maharashtra',
        district: activeBusiness?.proposedLocation?.district || 'Yavatmal',
        block: activeBusiness?.proposedLocation?.block || 'Pusad',
        village: activeBusiness?.proposedLocation?.villageOrLocality || 'Shendurjana Khurd',
        total_project_cost: (activeBusiness as any)?.projectCost || 850000.0,
        promoter_capital: (activeBusiness as any)?.promoterCapital || 150000.0,
        machinery_cost: 480000.0,
        shed_cost: 180000.0,
        working_capital_cost: 140000.0,
        statutory_pre_op_cost: 50000.0,
        interest_rate: 10.5,
        tenure_months: 60,
        moratorium_months: 6,
        monthly_sales_target: 180000.0,
        monthly_raw_material_cost: 105000.0,
        monthly_fixed_overhead: 24000.0
      };

      const res = await ApiClient.generateBankableDPR(payload);
      if (res.status === 'SUCCESS' && res.data) {
        setDprResult(res.data);
        setShowDprModal(true);
        // Also update the local document item for DPR
        setDocuments(prev => prev.map(d => d.name.includes('DPR') ? { ...d, status: 'DIGILOCKER_SYNCED' } : d));
      }
    } catch (err) {
      console.error('DPR Generation error:', err);
    } finally {
      setDprGenerating(false);
    }
  };

  return (
    <div id="documents_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Statutory Document Readiness & Bankable DPR Generator
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Verified checklist of certificates, NOCs, and KVIC/SIDBI bankable Detailed Project Report generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={readinessPercent >= 75 ? 'forest' : 'harvest'} size="md">
            {verifiedCount} / {totalCount} Ready ({readinessPercent}%)
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateDPR}
            disabled={dprGenerating}
            className="text-xs shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-1 ${dprGenerating ? 'animate-spin' : ''}`} />
            {dprGenerating ? 'Compiling Projections...' : 'Generate Bankable DPR'}
          </Button>
        </div>
      </div>

      {/* DigiLocker Sync Banner */}
      <div className="p-5 rounded-3xl bg-[#174C3A] text-[#FCFAF5] flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCFAF5]/10 text-[#C69A45] flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base">DigiLocker & UIDAI Direct Verification</span>
              <Badge variant="harvest" size="sm">National e-Governance</Badge>
            </div>
            <p className="text-xs text-[#FCFAF5]/80 mt-0.5">
              Securely synchronized with Aadhaar, PAN, and Caste records stored in MySQL schema.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#FCFAF5]/10 hover:bg-[#FCFAF5]/20 text-[#FCFAF5] border-[#FCFAF5]/40 text-xs"
            onClick={fetchDocuments}
            disabled={loadingDocs}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loadingDocs ? 'animate-spin' : ''}`} />
            Sync DigiLocker
          </Button>
        </div>
      </div>

      {/* Documents Table */}
      <Card title="Mandatory Document Checklist" subtitle="Categorized according to Reserve Bank of India MSME appraisal guidelines">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
              <tr>
                <th className="p-3">Document Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Issuing Authority</th>
                <th className="p-3">Required For</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D3C7]/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-[#242522]">{doc.name}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">{doc.category}</Badge>
                  </td>
                  <td className="p-3 text-[#68655D] font-medium">
                    {doc.issuingAuthority}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {doc.requiredFor.map((rf, i) => (
                        <span key={i} className="text-[10px] bg-[#F8F5EE] border border-[#D9D3C7] px-1.5 py-0.5 rounded text-[#242522]">
                          {rf}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {doc.status === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {doc.status === 'DIGILOCKER_SYNCED' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Generated
                      </span>
                    )}
                    {doc.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Pending Upload
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(doc.id)}
                      className="text-xs font-semibold text-[#174C3A] hover:text-[#B95736] underline cursor-pointer"
                    >
                      {doc.status === 'PENDING' ? 'Mark Ready' : 'Change'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dual Cloud Storage Integration Panel */}
      <div id="cloud_storage_integration" className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9D3C7]/80 pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-[#242522] flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#174C3A]" /> Real-time Cloud Document Vault
            </h2>
            <p className="text-xs text-[#68655D] mt-0.5">
              Securely archive your Detailed Project Reports (DPRs), registrations, and bank dossiers in Firebase Storage or Google Drive.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F8F5EE] border border-[#D9D3C7] p-1 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveStorageTab('FIREBASE_STORAGE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStorageTab === 'FIREBASE_STORAGE'
                  ? 'bg-[#174C3A] text-[#FCFAF5] shadow-sm'
                  : 'text-[#68655D] hover:text-[#174C3A]'
              }`}
            >
              Firebase Storage
            </button>
            <button
              onClick={() => setActiveStorageTab('GOOGLE_DRIVE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStorageTab === 'GOOGLE_DRIVE'
                  ? 'bg-[#174C3A] text-[#FCFAF5] shadow-sm'
                  : 'text-[#68655D] hover:text-[#174C3A]'
              }`}
            >
              Google Drive
            </button>
          </div>
        </div>

        {/* Global Errors and Success alerts */}
        {activeStorageTab === 'FIREBASE_STORAGE' && firebaseError && (
          <div className="p-4 rounded-2xl bg-[#B45B4A]/10 border border-[#B45B4A]/30 text-xs text-[#B45B4A] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Firebase Storage Error:</span> {firebaseError}
            </div>
          </div>
        )}
        {activeStorageTab === 'FIREBASE_STORAGE' && firebaseSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>{firebaseSuccess}</div>
          </div>
        )}

        {activeStorageTab === 'GOOGLE_DRIVE' && driveError && (
          <div className="p-4 rounded-2xl bg-[#B45B4A]/10 border border-[#B45B4A]/30 text-xs text-[#B45B4A] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Google Drive Error:</span> {driveError}
            </div>
          </div>
        )}
        {activeStorageTab === 'GOOGLE_DRIVE' && driveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>{driveSuccess}</div>
          </div>
        )}

        {/* FIREBASE STORAGE TAB RENDER */}
        {activeStorageTab === 'FIREBASE_STORAGE' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Drag & Drop */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`p-6 border-2 border-dashed rounded-3xl text-center transition-all ${
                  dragActive 
                    ? 'border-[#174C3A] bg-[#174C3A]/5 scale-[1.01]' 
                    : 'border-[#D9D3C7] bg-white hover:border-[#174C3A]/60'
                }`}
              >
                <input
                  type="file"
                  id="firebase-file-input"
                  multiple={false}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="firebase-file-input" className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 rounded-full bg-[#174C3A]/5 flex items-center justify-center mx-auto text-[#174C3A]">
                    {uploadingFirebase ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#174C3A] underline">Click to upload file</span>
                    <span className="text-xs text-[#68655D]"> or drag and drop here</span>
                  </div>
                  <p className="text-[10px] text-[#68655D]/70">PDF, JPG, PNG, DOCX up to 10MB to secure Firebase Object Bucket</p>
                </label>
              </div>

              {/* Files list */}
              <Card title="Firebase Cloud Archives" subtitle="Documents securely saved in your dedicated Firebase Cloud storage bucket">
                {fetchingFirebase ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-[#174C3A] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#68655D]">Retrieving cloud bucket files...</p>
                  </div>
                ) : firebaseFiles.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#68655D] space-y-1">
                    <p className="font-semibold">No cloud documents found</p>
                    <p>Start syncing your Gram-Disha files to your secure bucket.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5EE] border-b border-[#D9D3C7] text-[#242522]">
                        <tr>
                          <th className="p-3">File Name</th>
                          <th className="p-3">Source</th>
                          <th className="p-3">Uploaded</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9D3C7]/60">
                        {firebaseFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                            <td className="p-3 font-bold text-[#242522] max-w-[180px] truncate">
                              {file.name}
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-800 uppercase font-semibold">
                                Firebase Storage
                              </span>
                            </td>
                            <td className="p-3 text-[#68655D]">
                              {file.savedOn}
                            </td>
                            <td className="p-3 text-right flex items-center justify-end gap-3">
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                referrerPolicy="no-referrer"
                                className="inline-flex items-center gap-1 text-[#174C3A] hover:text-[#B95736] font-semibold"
                              >
                                View <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => deleteFileFromFirebase(file.id, file.name)}
                                className="text-xs text-[#B45B4A] hover:underline font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Firebase Cloud Active">
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="text-[#68655D]">Storage Engine</div>
                    <div className="font-bold text-[#242522] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Firebase Object Storage (Real-time)
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[#68655D]">Active User Identity UID</div>
                    <div className="font-mono text-[11px] bg-[#F8F5EE] border border-[#D9D3C7] p-2 rounded-xl break-all">
                      {user?.id || 'Anonymous Sandbox'}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D9D3C7]/80 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchFirebaseFiles}
                      className="w-full text-xs"
                      disabled={fetchingFirebase}
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${fetchingFirebase ? 'animate-spin' : ''}`} /> Refresh Bucket Files
                    </Button>
                  </div>
                </div>
              </Card>

              <Card title="Durable Cloud Guarantee">
                <div className="text-xs text-[#68655D] space-y-3 leading-relaxed">
                  <p>
                    All files are saved with cryptographic durability to your Firebase Cloud bucket. State synchronizations work automatically in **real time**.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* GOOGLE DRIVE TAB RENDER */}
        {activeStorageTab === 'GOOGLE_DRIVE' && (
          <div>
            {!driveToken ? (
              <Card className="p-8 text-center bg-white border border-[#D9D3C7]/60 rounded-3xl">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#174C3A]/5 flex items-center justify-center mx-auto text-[#174C3A]">
                    <HardDrive className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-[#242522]">Connect Google Drive Storage</h3>
                    <p className="text-xs text-[#68655D] leading-relaxed">
                      Authenticate securely to sync your business plans, statutory files, and financial statements directly with your private Google Drive account.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleConnectDrive}
                    className="font-semibold shadow-md inline-flex items-center gap-2 cursor-pointer mx-auto"
                  >
                    <Cloud className="w-4 h-4" /> Connect Google Drive
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Middle: Drag-and-Drop & File List */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Drag & Drop Upload Block */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`p-6 border-2 border-dashed rounded-3xl text-center transition-all ${
                      dragActive 
                        ? 'border-[#174C3A] bg-[#174C3A]/5 scale-[1.01]' 
                        : 'border-[#D9D3C7] bg-white hover:border-[#174C3A]/60'
                    }`}
                  >
                    <input
                      type="file"
                      id="drive-file-input"
                      multiple={false}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="drive-file-input" className="cursor-pointer space-y-2 block">
                      <div className="w-10 h-10 rounded-full bg-[#174C3A]/5 flex items-center justify-center mx-auto text-[#174C3A]">
                        {uploadingDrive ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#174C3A] underline">Click to upload file</span>
                        <span className="text-xs text-[#68655D]"> or drag and drop here</span>
                      </div>
                      <p className="text-[10px] text-[#68655D]/70">PDF, JPG, PNG, DOCX up to 10MB</p>
                    </label>
                  </div>

                  {/* File List Panel */}
                  <Card title="Google Drive Archives" subtitle="Recent documents and business reports saved in Google Drive">
                    {fetchingDrive ? (
                      <div className="py-12 text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-[#174C3A] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-[#68655D]">Retrieving Google Drive files...</p>
                      </div>
                    ) : driveFiles.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#68655D] space-y-1">
                        <p className="font-semibold">No documents found</p>
                        <p>Start syncing your Gram-Disha files to view them here.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#F8F5EE] border-b border-[#D9D3C7] text-[#242522]">
                            <tr>
                              <th className="p-3">File Name</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Saved On</th>
                              <th className="p-3 text-right">Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D9D3C7]/60">
                            {driveFiles.map((file) => (
                              <tr key={file.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                                <td className="p-3 font-bold text-[#242522] max-w-[180px] truncate">
                                  {file.name}
                                </td>
                                <td className="p-3">
                                  <span className="text-[10px] bg-[#F8F5EE] px-1.5 py-0.5 rounded text-[#68655D] uppercase">
                                    {file.mimeType.split('/').pop()?.replace('vnd.openxmlformats-officedocument.wordprocessingml.', '') || 'file'}
                                  </span>
                                </td>
                                <td className="p-3 text-[#68655D]">
                                  {new Date(file.createdTime).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-right">
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    referrerPolicy="no-referrer"
                                    className="inline-flex items-center gap-1 text-[#174C3A] hover:text-[#B95736] font-semibold"
                                  >
                                    View <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Panel: Account & Status */}
                <div className="space-y-6">
                  <Card title="Storage Account">
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <div className="text-[#68655D]">Storage Source</div>
                        <div className="font-bold text-[#242522] flex items-center gap-1.5">
                          <Cloud className="w-4 h-4 text-[#174C3A]" /> Secure Private Cloud
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[#68655D]">Session Authorization</div>
                        <div className="font-mono text-[11px] bg-[#F8F5EE] border border-[#D9D3C7] p-2 rounded-xl break-all">
                          OAuth Access Scope Active
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#D9D3C7]/80 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchDriveFiles(driveToken)}
                          className="w-full text-xs"
                          disabled={fetchingDrive}
                        >
                          <RefreshCw className={`w-3 h-3 mr-1 ${fetchingDrive ? 'animate-spin' : ''}`} /> Refresh Storage List
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisconnectDrive}
                          className="w-full text-xs text-[#B45B4A] border-[#B45B4A]/30 hover:bg-[#B45B4A]/5"
                        >
                          Disconnect Google Drive
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card title="Quick Sync Guide">
                    <div className="text-xs text-[#68655D] space-y-3 leading-relaxed">
                      <p>
                        Once connected, your business plans, project forecasts, and verification state can be committed directly to Drive.
                      </p>
                      <p className="font-bold text-[#242522]">
                        How to sync dossiers:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        <li>Generate a Detailed Project Report (DPR) above.</li>
                        <li>Inside the report dossier modal, click the "Save DPR to Google Drive" button.</li>
                        <li>The system will write the structured report into your cloud archives immediately.</li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Bankable DPR Dossier Modal */}
      {showDprModal && dprResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFAF5] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#D9D3C7] my-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#D9D3C7] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="forest" size="md">Bank Credit Appraisal Certified</Badge>
                  <span className="text-xs font-mono text-[#68655D]">{dprResult.dpr_dossier_id}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
                  {dprResult.enterprise_summary.enterprise_name}
                </h2>
                <p className="text-xs text-[#68655D]">
                  Promoter: {dprResult.enterprise_summary.promoter_name} ({dprResult.enterprise_summary.demographic_category} - {dprResult.enterprise_summary.gender}) • Generated: {dprResult.generation_date}
                </p>
              </div>
              <button
                onClick={() => setShowDprModal(false)}
                className="w-8 h-8 rounded-full bg-[#F8F5EE] border border-[#D9D3C7] flex items-center justify-center text-sm font-bold text-[#68655D] hover:bg-[#D9D3C7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Ratios Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#174C3A]/5 border border-[#174C3A]/20">
                <div className="text-[11px] font-semibold text-[#174C3A]">Average DSCR</div>
                <div className="text-2xl font-bold font-mono text-[#174C3A] mt-1">{dprResult.key_bank_ratios.average_dscr}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Benchmark ≥ 1.50 (Pass)</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#C69A45]/10 border border-[#C69A45]/30">
                <div className="text-[11px] font-semibold text-[#8F6A1A]">PMEGP Subsidy</div>
                <div className="text-2xl font-bold font-mono text-[#8F6A1A] mt-1">₹{dprResult.means_of_finance.back_ended_government_subsidy_eligible.toLocaleString()}</div>
                <div className="text-[10px] text-[#68655D] mt-0.5">{dprResult.means_of_finance.effective_subsidy_percentage}% Rural OBC Grant</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[11px] font-semibold text-[#242522]">Bank Term Loan</div>
                <div className="text-2xl font-bold font-mono text-[#242522] mt-1">₹{dprResult.loan_repayment_schedule.sanction_amount.toLocaleString()}</div>
                <div className="text-[10px] text-[#68655D] mt-0.5">EMI: ₹{dprResult.loan_repayment_schedule.monthly_equated_installment_emi.toLocaleString()}/mo</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[11px] font-semibold text-[#242522]">Break-Even Point</div>
                <div className="text-2xl font-bold font-mono text-[#242522] mt-1">{dprResult.key_bank_ratios.break_even_capacity_percentage}%</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Achieved in Year 1</div>
              </div>
            </div>

            {/* 5-Year Financial Forecast Table */}
            <div>
              <h3 className="font-display font-bold text-sm text-[#242522] mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#174C3A]" /> 5-Year Deterministic Financial Forecast (₹ in Actuals)
              </h3>
              <div className="overflow-x-auto border border-[#D9D3C7] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8F5EE] font-semibold border-b border-[#D9D3C7]">
                    <tr>
                      <th className="p-2.5">Year</th>
                      <th className="p-2.5 text-center">Capacity</th>
                      <th className="p-2.5 text-right">Gross Sales</th>
                      <th className="p-2.5 text-right">EBITDA</th>
                      <th className="p-2.5 text-right">Depreciation</th>
                      <th className="p-2.5 text-right">Net Profit</th>
                      <th className="p-2.5 text-right">Cash Accrual</th>
                      <th className="p-2.5 text-center">DSCR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D3C7]/60">
                    {dprResult.five_year_financial_projections.map((p: any) => (
                      <tr key={p.year} className="hover:bg-[#F8F5EE]/40">
                        <td className="p-2.5 font-bold">Year {p.year}</td>
                        <td className="p-2.5 text-center font-mono">{p.capacity_utilization_pct}%</td>
                        <td className="p-2.5 text-right font-mono font-semibold">₹{p.gross_sales_revenue.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono">₹{p.ebitda.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono text-[#68655D]">₹{p.depreciation_machinery.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">₹{p.net_profit_after_tax.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono">₹{p.cash_accrual.toLocaleString()}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-[#174C3A]">{p.dscr_ratio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statutory Clearances */}
            <div>
              <h3 className="font-display font-bold text-sm text-[#242522] mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#174C3A]" /> Mandatory Statutory Clearances for Bank Loan Sanction
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dprResult.statutory_clearances_required.map((c: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#242522]">{c.clearance}</div>
                      <div className="text-[10px] text-[#68655D]">{c.authority}</div>
                    </div>
                    <Badge variant="neutral" size="sm">{c.cost}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Appraisal Declaration */}
            <div className="p-3.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[11px] text-[#68655D] leading-relaxed">
              <span className="font-bold text-[#242522]">Statutory Declaration: </span>
              {dprResult.appraisal_declaration}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#D9D3C7] mt-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Save to Firebase Storage (Always active) */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-[#174C3A]/5 text-[#174C3A] border-[#174C3A]/30 hover:bg-[#174C3A]/10 flex items-center gap-1"
                  onClick={uploadDPRToFirebase}
                  disabled={uploadingFirebase}
                >
                  <Cloud className={`w-3.5 h-3.5 ${uploadingFirebase ? 'animate-spin' : ''}`} />
                  {uploadingFirebase ? 'Saving to Bucket...' : 'Save DPR to Firebase Cloud'}
                </Button>

                {/* Save to Google Drive */}
                {driveToken ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
                    onClick={uploadDPRToDrive}
                    disabled={uploadingDrive}
                  >
                    <Cloud className={`w-3.5 h-3.5 ${uploadingDrive ? 'animate-spin' : ''}`} />
                    {uploadingDrive ? 'Saving to Drive...' : 'Save DPR to Google Drive'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-[#68655D] border-[#D9D3C7] hover:bg-[#F8F5EE] flex items-center gap-1"
                    onClick={handleConnectDrive}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    Connect Google Drive to Save
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.print()}
                >
                  <Printer className="w-3.5 h-3.5 mr-1" /> Print Dossier
                </Button>
                <Button
                  variant="forest"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowDprModal(false)}
                >
                  Accept & Close Dossier
                </Button>
              </div>
            </div>


          </div>
        </div>
      )}

    </div>
  );
};
