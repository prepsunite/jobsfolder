import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router';
// Native Document Explorer View Enabled
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { PaperService } from '@/services/paper.service';
import { dataStore, type ExamItem, type DocTabNode } from '@/services/dataStore';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '@/contexts/ThemeContext';
import PaywallModal from '@/components/PaywallModal';
import DocumentExplorer from '@/components/DocumentExplorer';
import {
  Building2,
  Globe,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Heart,
  Edit3,
  XCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Maximize2,
  Save,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Clock,
  Sparkles,
  Folder,
  FolderOpen,
  List,
  Bookmark,
  BookmarkCheck,
  MoreVertical,
  Copy,
  Smile,
  ArrowUp,
  Lock,
  ArrowRight,
  ShieldCheck,
  ArrowDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2 as LinkIcon,
  Image as ImageIcon,
  ListOrdered,
  Minus,
  Undo,
  Redo,
  Code,
  Table,
  Quote,
  Search,
  Printer,
  ZoomIn,
  ZoomOut,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Palette
} from 'lucide-react';

type TabType = 'aboutCompany' | 'aboutExam' | 'oldPapers';

interface CompanyDetailPageProps {
  isOldPapersRoute?: boolean;
}

export default function CompanyDetailPage({ isOldPapersRoute }: CompanyDetailPageProps = {}) {
  const { slug = 'tcs' } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlExamId = searchParams.get('examId');
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();

  const isDirectOldPapersUrl = !!isOldPapersRoute || (typeof window !== 'undefined' && window.location.pathname.endsWith('/oldpapers'));

  // Company Data from external API (dummy)
  const { data: company } = useQuery({
    queryKey: ['company', slug],
    queryFn: () => companyService.getCompanyBySlug(slug),
    enabled: !!slug,
    retry: 1,
  });

  // Local DataStore Subscriptions
  const { data: allCompaniesStore = [] } = useQuery({
    queryKey: ['live-companies'],
    queryFn: () => dataStore.getCompanies(),
  });

  const { data: companyExams = [] } = useQuery({
    queryKey: ['live-exams', slug],
    queryFn: () => dataStore.getExams(slug),
  });

  const currentCompanyStoreItem = allCompaniesStore.find(c => c.slug === slug) || {
    id: `c-${slug}`,
    name: company?.name || slug.toUpperCase(),
    slug: slug,
    description: company?.description || `${slug.toUpperCase()} conducts annual campus recruitment drives.`,
    industry: 'IT Services & Consulting',
    companySize: 'Pan-India Recruitment Drive',
    headquarters: 'India & Global',
    website: company?.website,
    logoUrl: company?.logoUrl,
    aboutCompany: `### About ${slug.toUpperCase()}\n\nAdd details here.`,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  const companyName = currentCompanyStoreItem.name;

  const [selectedExamId, setSelectedExamId] = useState<string>('');

  // Keep selected exam valid if array changes or initializes, or load from URL searchParams
  useEffect(() => {
    if (companyExams.length > 0) {
      if (urlExamId && companyExams.some(e => e.id === urlExamId)) {
        if (selectedExamId !== urlExamId) {
          setSelectedExamId(urlExamId);
        }
      } else if (!selectedExamId || !companyExams.some(e => e.id === selectedExamId)) {
        setSelectedExamId(companyExams[0].id);
      }
    }
  }, [companyExams, urlExamId]);

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId);
    setSearchParams({ examId }, { replace: true });
  };

  const currentExam = companyExams.find((e) => e.id === selectedExamId) || companyExams[0];

  // Upvote State
  const [upvoteCount, setUpvoteCount] = useState<number>(70);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);

  // Edit Company Header State
  const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    name: '',
    industry: '',
    headquarters: '',
    website: '',
    logoUrl: '',
    description: '',
  });

  // 3-Tab State
  const [activeTab, setActiveTab] = useState<TabType>(isDirectOldPapersUrl ? 'oldPapers' : 'aboutCompany');
  
  // Dynamic Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [aboutCompanyForm, setAboutCompanyForm] = useState('');
  const [examForm, setExamForm] = useState<Partial<ExamItem>>({});
  const [examSavedSuccess, setExamSavedSuccess] = useState(false);
  const [isSyncingDoc, setIsSyncingDoc] = useState(false);



  // Paywall & Monetization State
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  // Secure Gateway Document Resolution (Decoupled PaperService)
  const authorizedDoc = currentExam
    ? dataStore.requestAuthorizedDocument(currentExam.id, role, user?.email || 'student@jobsfolder.com')
    : { status: 'PAYMENT_REQUIRED' as const, documentUrl: null, isAuthorized: false, watermarkText: undefined, reasonCode: 'PAYMENT_REQUIRED' as const };
  const hasOldPapersAccess = authorizedDoc.isAuthorized;

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (currentExam) {
      setIsBookmarked(dataStore.isExamBookmarked(currentExam.id));
    }
  }, [currentExam]);

  const handleToggleBookmark = () => {
    if (!currentExam) return;
    const newStatus = dataStore.toggleBookmarkExam(currentExam.id);
    setIsBookmarked(newStatus);
  };

  // Fullscreen Dashboard State & Theme
  const [isFullscreenDoc, setIsFullscreenDoc] = useState<boolean>(isDirectOldPapersUrl);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (isDirectOldPapersUrl) {
      setActiveTab('oldPapers');
      setIsFullscreenDoc(true);
    }
  }, [isDirectOldPapersUrl]);

  // Security Protection: Ban Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+V (Paste), Ctrl+P (Print), Ctrl+S (Save), Ctrl+U (Source)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputOrTextarea = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (!isAdmin || !isInputOrTextarea) {
        const isCtrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        if (isCtrl && (key === 'c' || key === 'x' || key === 'v' || key === 'p' || key === 's' || key === 'u')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isAdmin]);

  const getExpandedGoogleDocUrl = (url?: string): string => {
    if (!url) return '';
    return url.replace('?rm=minimal', '').replace('/preview', '/edit');
  };

  // --- MARKDOWN TOOLBAR & SELECTION FORMATTING HELPERS ---
  const getCurrentActiveContent = (): string => {
    if (activeTab === 'aboutCompany') return aboutCompanyForm || currentCompanyStoreItem.aboutCompany || '';
    if (activeTab === 'aboutExam') return examForm.content || currentExam?.content || '';
    if (!currentExam) return '';
    const activeNode = findDocNode(getEffectivePaperTabs(currentExam), selectedPaperTabId);
    return activeNode?.content || '';
  };

  const updateCurrentActiveContent = (newVal: string) => {
    const currentVal = getCurrentActiveContent();
    if (currentVal !== newVal) {
      setUndoStack(prev => [...prev.slice(-30), currentVal]);
      setRedoStack([]);
    }

    if (activeTab === 'aboutCompany') {
      setAboutCompanyForm(newVal);
      dataStore.updateCompany(currentCompanyStoreItem.id, { aboutCompany: newVal });
      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
    } else if (activeTab === 'aboutExam' && currentExam) {
      setExamForm({ ...examForm, content: newVal });
      dataStore.updateExam(currentExam.id, { content: newVal });
      queryClient.invalidateQueries({ queryKey: ['live-exams'] });
    } else if (currentExam) {
      const currentTabs = getEffectivePaperTabs(currentExam);
      const updateContent = (nodes: DocTabNode[]): DocTabNode[] => {
        return nodes.map(n => {
          if (n.id === selectedPaperTabId) return { ...n, content: newVal };
          if (n.children) return { ...n, children: updateContent(n.children) };
          return n;
        });
      };
      saveUpdatedTabs(updateContent(currentTabs));
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, getCurrentActiveContent()]);
    updateCurrentActiveContent(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, getCurrentActiveContent()]);
    updateCurrentActiveContent(next);
  };

  const insertFormattingMarkdown = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    const allTextareas = Array.from(document.querySelectorAll('textarea')) as HTMLTextAreaElement[];
    const textarea = (activeElement && activeElement.tagName === 'TEXTAREA')
      ? activeElement
      : allTextareas[0];

    const oldContent = getCurrentActiveContent();
    let start = oldContent.length;
    let end = oldContent.length;
    let selectedText = defaultText;

    if (textarea && typeof textarea.selectionStart === 'number') {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
      if (start !== end) {
        selectedText = oldContent.substring(start, end);
      }
    }

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = oldContent.substring(0, start) + replacement + oldContent.substring(end);

    updateCurrentActiveContent(newValue);

    if (textarea) {
      setTimeout(() => {
        textarea.focus();
        const cursorStart = start + prefix.length;
        const cursorEnd = cursorStart + selectedText.length;
        textarea.setSelectionRange(cursorStart, cursorEnd);
      }, 40);
    }
  };

  const handleCopyDocContent = () => {
    const text = getCurrentActiveContent();
    navigator.clipboard.writeText(text);
    setDocCopiedSuccess(true);
    setTimeout(() => setDocCopiedSuccess(false), 2000);
  };

  const handlePrintDoc = () => {
    window.print();
  };

  const handleInsertTable = () => {
    insertFormattingMarkdown('\n\n| Round / Section | Topics Covered | Difficulty |\n| --- | --- | --- |\n| ', ' |\n\n', 'Round 1 | Aptitude & Reasoning | Medium');
  };

  const handleInsertCodeBlock = () => {
    insertFormattingMarkdown('\n\n```cpp\n', '\n```\n\n', '// Write code / pseudocode here');
  };

  const handleInsertBlockquote = () => {
    insertFormattingMarkdown('\n\n> ', '\n\n', 'Important note or advice for candidates...');
  };

  const handleInsertHeading = (level: 1 | 2 | 3) => {
    const prefix = level === 1 ? '# ' : level === 2 ? '## ' : '### ';
    const defaultText = level === 1 ? 'Heading 1' : level === 2 ? 'Heading 2' : 'Heading 3';
    
    const activeElement = document.activeElement as HTMLTextAreaElement;
    const allTextareas = Array.from(document.querySelectorAll('textarea')) as HTMLTextAreaElement[];
    const textarea = (activeElement && activeElement.tagName === 'TEXTAREA')
      ? activeElement
      : allTextareas[0];

    const oldContent = getCurrentActiveContent();
    let start = oldContent.length;
    let end = oldContent.length;
    let selectedText = defaultText;

    if (textarea && typeof textarea.selectionStart === 'number') {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
      if (start !== end) {
        selectedText = oldContent.substring(start, end);
      }
    }

    const needsPrevNewline = start > 0 && oldContent[start - 1] !== '\n';
    const needsNextNewline = end < oldContent.length && oldContent[end] !== '\n';

    const lead = needsPrevNewline ? '\n\n' : '';
    const trail = needsNextNewline ? '\n\n' : '\n';

    const replacement = `${lead}${prefix}${selectedText}${trail}`;
    const newValue = oldContent.substring(0, start) + replacement + oldContent.substring(end);

    updateCurrentActiveContent(newValue);

    if (textarea) {
      setTimeout(() => {
        textarea.focus();
        const cursorStart = start + lead.length + prefix.length;
        const cursorEnd = cursorStart + selectedText.length;
        textarea.setSelectionRange(cursorStart, cursorEnd);
      }, 40);
    }
  };

  // --- CURSOR PRESERVATION TEXTAREA CHANGE HANDLER ---
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const val = textarea.value;
    const cursorPos = textarea.selectionStart;

    updateCurrentActiveContent(val);

    requestAnimationFrame(() => {
      if (textarea) {
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    });
  };

  const handleApplySelectionFontSize = (sizePx: number) => {
    insertFormattingMarkdown(`<span style="font-size: ${sizePx}px;">`, '</span>', 'Text');
  };

  const handleApplySelectionFontFamily = (family: string) => {
    insertFormattingMarkdown(`<span style="font-family: ${family};">`, '</span>', 'Text');
  };

  const handleInsertAlign = (align: 'left' | 'center' | 'right') => {
    insertFormattingMarkdown(`\n\n<div style="text-align: ${align};">\n\n`, `\n\n</div>\n\n`, 'Aligned paragraph text...');
  };

  const handleInsertTextColor = () => {
    const color = prompt("Enter Text Color Hex or Name (e.g. #ef4444, #0284c7, purple, green):", "#0284c7");
    if (!color || !color.trim()) return;
    insertFormattingMarkdown(`<span style="color: ${color.trim()};">`, '</span>', 'Colored text');
  };

  const handleInsertHighlight = () => {
    const color = prompt("Enter Highlight Background Color (e.g. #fef08a, #bbf7d0, #fbcfe8):", "#fef08a");
    if (!color || !color.trim()) return;
    insertFormattingMarkdown(`<mark style="background-color: ${color.trim()}; padding: 2px 6px; border-radius: 4px;">`, '</mark>', 'Highlighted text');
  };

  const handleInsertLink = () => {
    const url = prompt("Enter Hyperlink Web URL (e.g. https://google.com):", "https://");
    if (!url || !url.trim()) return;
    const activeElement = document.activeElement as HTMLTextAreaElement;
    const hasSelection = activeElement && activeElement.tagName === 'TEXTAREA' && activeElement.selectionStart !== activeElement.selectionEnd;
    if (hasSelection) {
      insertFormattingMarkdown('[', `](${url.trim()})`, '');
    } else {
      const linkText = prompt("Enter Link Display Text:", "Click Here");
      insertFormattingMarkdown('[', `](${url.trim()})`, linkText ? linkText.trim() : 'Click Here');
    }
  };

  const handleInsertImage = () => {
    const imageUrl = prompt("Enter Image URL (e.g. https://images.unsplash.com/...):", "https://");
    if (!imageUrl || !imageUrl.trim()) return;

    const caption = prompt("Enter Image Caption / Description:", "Image");
    const sizeOption = prompt(
      "Choose Image Size / Width:\n1. Small (300px)\n2. Medium (500px)\n3. Large (700px)\n4. Full Width (100%)\n\nOr enter custom width (e.g. 450px or 80%):",
      "500px"
    );

    let finalWidth = '500px';
    if (sizeOption === '1') finalWidth = '300px';
    else if (sizeOption === '2') finalWidth = '500px';
    else if (sizeOption === '3') finalWidth = '700px';
    else if (sizeOption === '4') finalWidth = '100%';
    else if (sizeOption && sizeOption.trim()) finalWidth = sizeOption.trim();

    const imgHtml = `\n\n<img src="${imageUrl.trim()}" width="${finalWidth}" alt="${caption ? caption.trim() : 'Image'}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 16px auto;" />\n\n`;
    insertFormattingMarkdown('', '', imgHtml);
  };

  // --- RICH CLIPBOARD PASTE ENGINE (SUPPORT IMAGES, HYPERLINKS, HTML FROM GOOGLE DOCS) ---
  const handleEditorPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // 1. Check for Image Files in Clipboard (e.g. copied screenshots / image files)
    const items = Array.from(clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Data = event.target?.result as string;
          const imgHtml = `\n\n<img src="${base64Data}" width="500px" alt="Pasted Image" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 16px auto;" />\n\n`;
          insertFormattingMarkdown('', '', imgHtml);
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // 2. Check for HTML formatted content with images or links copied from Google Docs / web pages
    const htmlData = clipboardData.getData('text/html');
    if (htmlData && (htmlData.includes('<img') || htmlData.includes('<a'))) {
      e.preventDefault();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
      const bodyHtml = doc.body.innerHTML;
      insertFormattingMarkdown('', '', bodyHtml);
      return;
    }

    // 3. Check for raw Image URLs pasted as text
    const textData = clipboardData.getData('text/plain');
    if (textData && (textData.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) || textData.startsWith('data:image/'))) {
      e.preventDefault();
      const imgHtml = `\n\n<img src="${textData.trim()}" width="500px" alt="Pasted Image" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 16px auto;" />\n\n`;
      insertFormattingMarkdown('', '', imgHtml);
      return;
    }
  };

  // --- LIVE GOOGLE DOC LINKING & EMBEDDING HANDLER ---
  const handleLinkGoogleDoc = async () => {
    if (!currentExam) return;
    const rawUrl = prompt(
      "Paste your Google Doc URL / Published Link:\n(e.g. https://docs.google.com/document/d/1ABC.../edit or https://docs.google.com/document/d/e/.../pub?embedded=true)",
      currentExam.googleDocEmbedUrl || ""
    );

    if (rawUrl === null) return;
    if (!rawUrl.trim()) {
      dataStore.updateExam(currentExam.id, { googleDocEmbedUrl: '', googleDocEditUrl: '' });
      queryClient.invalidateQueries({ queryKey: ['live-exams'] });
      alert("Live Google Doc unlinked. Reverted to built-in document editor.");
      return;
    }

    const trimmed = rawUrl.trim();
    let embedUrl = trimmed;
    let editUrl = trimmed;

    // Convert standard Google Doc edit/share URL to clean embed preview URL (/preview)
    if (trimmed.includes('docs.google.com/document/d/')) {
      const docIdMatch = trimmed.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (docIdMatch && docIdMatch[1]) {
        const docId = docIdMatch[1];
        embedUrl = `https://docs.google.com/document/d/${docId}/edit`;
        editUrl = `https://docs.google.com/document/d/${docId}/edit`;
      }
    }

    // SIMULATED GOOGLE DOC PARSE
    setIsSyncingDoc(true);
    alert(`Syncing Document from Google Docs...\nPlease wait while we fetch and parse your document structure.`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock parsed output based on typical "Heading 1" and "Heading 2" formatting
    const mockParsedPaperTabs = [
      {
        id: "tab_auto_1",
        title: "Quantitative Aptitude",
        content: "### Quantitative Aptitude\nThis section contains automatically imported notes from your Google Doc covering numerical ability.",
        children: [
          {
            id: "tab_auto_1_1",
            title: "Time, Speed, and Distance",
            content: "### Time, Speed, and Distance\n\n**Key Formulas:**\n- Speed = Distance / Time\n- 1 km/hr = 5/18 m/s\n\n*This content was synced from your Google Doc.*",
          },
          {
            id: "tab_auto_1_2",
            title: "Percentages",
            content: "### Percentages\n\n**Quick Tips:**\n- `x% of y = y% of x`\n- Practice calculating 10%, 5%, and 1% mentally.\n\n*This content was synced from your Google Doc.*",
          }
        ]
      },
      {
        id: "tab_auto_2",
        title: "Logical Reasoning",
        content: "### Logical Reasoning\n\nThis folder was created automatically from your Google Doc's 'Heading 1' for Logical Reasoning.",
        children: [
          {
            id: "tab_auto_2_1",
            title: "Syllogisms",
            content: "### Syllogisms\n\n**Rules:**\n1. All A are B.\n2. Some B are C.\n\n*This content was synced from your Google Doc.*",
          }
        ]
      }
    ];

    dataStore.updateExam(currentExam.id, { 
      googleDocEmbedUrl: embedUrl, 
      googleDocEditUrl: editUrl,
      paperTabs: mockParsedPaperTabs 
    });
    
    setIsSyncingDoc(false);
    queryClient.invalidateQueries({ queryKey: ['live-exams'] });
    alert("Live Google Doc successfully parsed and synced!\n\n(Note: This is a frontend simulation. In production, our Spring Boot backend will fetch your exact text.)");
  };


  const forceRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['company', slug] });
    queryClient.invalidateQueries({ queryKey: ['live-companies'] });
    queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
  };

  // --- HEADER ACTIONS ---
  const handleOpenEditHeaderModal = () => {
    setHeaderForm({
      name: currentCompanyStoreItem.name,
      industry: currentCompanyStoreItem.industry || 'IT Services',
      headquarters: currentCompanyStoreItem.headquarters || 'Pan-India',
      website: currentCompanyStoreItem.website || '',
      logoUrl: currentCompanyStoreItem.logoUrl || '',
      description: currentCompanyStoreItem.description || '',
    });
    setShowEditHeaderModal(true);
  };

  const handleSaveHeaderProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.updateCompany(currentCompanyStoreItem.id, {
      name: headerForm.name,
      industry: headerForm.industry,
      headquarters: headerForm.headquarters,
      website: headerForm.website,
      logoUrl: headerForm.logoUrl || undefined,
      description: headerForm.description,
    });
    setShowEditHeaderModal(false);
    forceRefreshData();
  };

  // --- EXAM ACTIONS ---
  const handleAddNewExam = () => {
    const newExam = dataStore.addExam({
      companySlug: slug,
      name: 'New Exam Module',
      badge: 'Draft',
      content: '### New Exam Syllabus\n\nWrite details here...',
      oldPapers: '### Old Papers\n\nWrite old papers here...',
    });
    setSelectedExamId(newExam.id);
    setActiveTab('aboutExam');
    setExamForm(newExam);
    setIsEditing(true);
    forceRefreshData();
  };

  const handleOpenEdit = () => {
    if (activeTab === 'aboutCompany') {
      setAboutCompanyForm(currentCompanyStoreItem.aboutCompany || '');
    } else if (activeTab === 'aboutExam' && currentExam) {
      setExamForm(currentExam);
    } else if (activeTab === 'oldPapers' && currentExam) {
      setExamForm(currentExam);
    }
    setIsEditing(true);
  };

  const handleSaveContent = () => {
    if (activeTab === 'aboutCompany') {
      dataStore.updateCompany(currentCompanyStoreItem.id, {
        aboutCompany: aboutCompanyForm
      });
    } else if (activeTab === 'aboutExam' && currentExam && examForm) {
      dataStore.updateExam(currentExam.id, {
        ...currentExam,
        name: examForm.name,
        badge: examForm.badge,
        content: examForm.content
      });
    } else if (activeTab === 'oldPapers' && currentExam && examForm) {
      dataStore.updateExam(currentExam.id, {
        ...currentExam,
        oldPapers: examForm.oldPapers
      });
    }
    
    setIsEditing(false);
    setExamSavedSuccess(true);
    setTimeout(() => setExamSavedSuccess(false), 3000);
    forceRefreshData();
  };

  const handleDeleteExam = () => {
    if (currentExam && confirm("Are you sure you want to delete this exam module?")) {
      dataStore.deleteExam(currentExam.id);
      setIsEditing(false);
      forceRefreshData();
    }
  };

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(upvoteCount - 1);
      setIsUpvoted(false);
    } else {
      setUpvoteCount(upvoteCount + 1);
      setIsUpvoted(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-[#747878] dark:text-[#a6adbb]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Home</Link>
          <span>»</span>
          <Link to="/companies" className="hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Companies</Link>
          <span>»</span>
          <span className="text-[#1f1b17] dark:text-[#e3e3e3] font-bold">{companyName}</span>
          {currentExam && (
            <>
              <span>»</span>
              <span className="text-[#1f1b17] dark:text-[#e3e3e3] font-bold">{currentExam.name}</span>
            </>
          )}
        </div>

        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Companies
        </Link>
      </div>

      {/* Main Header Card with ADMIN EDIT CONTROL */}
      <div className="bg-[#f6ece6] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#2b2d31] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4 relative transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-[16px] bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#0284c7] font-black text-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {currentCompanyStoreItem.logoUrl ? (
                <img src={currentCompanyStoreItem.logoUrl} alt={companyName} className="w-full h-full object-contain p-1" />
              ) : (
                companyName.charAt(0)
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
                  {companyName}
                </h1>
                <span className="bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] border border-[#00714d]/20 dark:border-[#6cf8bb]/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {currentCompanyStoreItem.industry || 'IT Services'}
                </span>
                <span className="bg-[#ffffff] dark:bg-[#141517] text-[#1f1b17] dark:text-[#e3e3e3] border border-[#c4c7c7] dark:border-[#383a40] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {companyExams.length} Active Exams
                </span>
              </div>
              <p className="text-[#444748] dark:text-[#a6adbb] text-xs font-sans">
                {currentCompanyStoreItem.description || 'Official Exam Patterns, Memory Papers, and Offer Roles'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={handleOpenEditHeaderModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                <span>Edit Company Header</span>
              </button>
            )}

            <button
              onClick={handleUpvote}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isUpvoted
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-[#ffffff] dark:bg-[#1e1f22] text-[#1f1b17] dark:text-[#e3e3e3] border-[#c4c7c7] dark:border-[#383a40] hover:border-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current text-white' : 'text-rose-500'}`} />
              <span>{upvoteCount} Upvotes</span>
            </button>

            {currentCompanyStoreItem.website && (
              <a
                href={currentCompanyStoreItem.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffffff] dark:bg-[#1e1f22] hover:bg-[#eae1da] dark:hover:bg-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] text-xs font-bold uppercase tracking-wider rounded-full border border-[#c4c7c7] dark:border-[#383a40] transition-colors shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
                <span>Site</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        </div>

        {/* Horizontal Active Exam Module Pills */}
        <div className="pt-4 border-t border-[#e2d8d2] dark:border-[#2b2d31] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider block">
              Select Active Exam Module:
            </span>
            {isAdmin && (
              <button
                onClick={handleAddNewExam}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200"
              >
                <Plus className="w-3 h-3" /> Add Exam
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {companyExams.map((exam) => {
              const isSelected = exam.id === selectedExamId;
              return (
                <button
                  key={exam.id}
                  onClick={() => {
                    handleSelectExam(exam.id);
                    setIsEditing(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] border-[#000000] dark:border-[#e3e3e3] shadow-sm ring-1 ring-white dark:ring-white ring-offset-1 ring-offset-[#fff8f5] dark:ring-offset-[#141517]'
                      : 'bg-[#ffffff] dark:bg-[#1e1f22] text-[#1f1b17] dark:text-[#e3e3e3] border-[#c4c7c7] dark:border-[#383a40] hover:border-[#006c49] dark:hover:border-[#6cf8bb]'
                  }`}
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? 'text-[#6cf8bb] dark:text-[#006c49]' : 'text-[#006c49] dark:text-[#6cf8bb]'}`} />
                  <span>{exam.name}</span>
                </button>
              );
            })}
            {companyExams.length === 0 && (
              <span className="text-xs text-[#747878] dark:text-[#a6adbb]">No exams configured yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Single Page View for Exam */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <main className="lg:col-span-9 bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] p-6 shadow-sm min-h-[500px] transition-colors">
          
          {currentExam ? (
            <div className="space-y-6">
              
              {/* Active Exam Header Bar with Bookmark Button */}
              <div className="flex items-center justify-between pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
                    {activeTab === 'aboutCompany' ? `${companyName} Overview` : currentExam.name}
                  </h2>
                  {activeTab !== 'aboutCompany' && (
                    <span className="inline-block mt-1 bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] border border-[#00714d]/20 dark:border-[#6cf8bb]/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {currentExam.badge}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2.5">
                  {currentExam && (
                    <button
                      onClick={handleToggleBookmark}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-xs ${
                        isBookmarked
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                          : isDarkMode
                          ? 'bg-[#2b2d31] hover:bg-[#383a40] text-[#e3e3e3] border border-[#383a40]'
                          : 'bg-[#ffffff] hover:bg-[#e3e8ef] text-[#1f1b17] border border-[#eae1da]'
                      }`}
                      title={isBookmarked ? "Remove from profile bookmarks" : "Save exam drive to profile bookmarks"}
                    >
                      {isBookmarked ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Saved to Profile</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-[#747878] dark:text-[#a6adbb]" />
                          <span>Bookmark Exam</span>
                        </>
                      )}
                    </button>
                  )}

                  {isAdmin && !isEditing && (
                    <button
                      onClick={handleOpenEdit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all shrink-0"
                    >
                      <Edit3 className="w-4 h-4 text-purple-300" />
                      <span>Edit {activeTab === 'aboutCompany' ? 'Company Details' : activeTab === 'aboutExam' ? 'Exam Details' : 'Old Papers'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3-TAB SELECTOR & ACTIONS */}
              {!isEditing && (
                <div className="flex items-center justify-between border-b border-[#eae1da] dark:border-[#2b2d31]">
                  <div className="flex items-center gap-4">
                    {[
                      { id: 'aboutCompany', label: 'About Company' },
                      { id: 'aboutExam', label: 'About Exam' },
                      { id: 'oldPapers', label: 'Old Papers' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                          activeTab === tab.id
                            ? 'border-[#006c49] dark:border-[#6cf8bb] text-[#006c49] dark:text-[#6cf8bb]'
                            : 'border-transparent text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeTab === 'oldPapers' && (
                      <button
                        onClick={() => {
                          if (isAdmin && currentExam) {
                            setExamForm(currentExam);
                          }
                          setIsFullscreenDoc(true);
                          navigate(`/companies/${slug}/oldpapers`);
                        }}
                        className="inline-flex items-center gap-1.5 pb-2 text-xs font-bold text-[#0284c7] hover:text-[#0369a1] transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                        Old Papers Doc Dashboard (Fullscreen)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {examSavedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[12px] text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Changes saved successfully!</span>
                </div>
              )}


              {/* Sub-Tabs strip for Old Papers */}



              {/* Editable Markdown Area OR Rendered View */}
              {isAdmin && isEditing ? (
                <div className="space-y-4 bg-[#f6ece6]/60 dark:bg-[#141517]/60 p-5 rounded-[20px] border border-[#e2d8d2] dark:border-[#383a40] animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">
                      Edit {activeTab === 'aboutCompany' ? 'Company' : activeTab === 'aboutExam' ? 'Exam' : 'Papers'} Content (Markdown)
                    </label>
                    {activeTab !== 'aboutCompany' && (
                      <button onClick={handleDeleteExam} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Entire Exam Module
                      </button>
                    )}
                  </div>
                  
                  {activeTab === 'aboutExam' && (
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Exam Name</label>
                        <input 
                          type="text" 
                          value={examForm.name || ''} 
                          onChange={(e) => setExamForm({...examForm, name: e.target.value})}
                          className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Badge Text</label>
                        <input 
                          type="text" 
                          value={examForm.badge || ''} 
                          onChange={(e) => setExamForm({...examForm, badge: e.target.value})}
                          className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <LinkIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1f1b17] dark:text-[#e3e3e3] mb-1">Google Doc & Drive Sync</h4>
                      <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto">
                        We have removed the manual text editor as per your preference. All content is now managed exclusively via Google Docs/Drive sync.
                      </p>
                    </div>
                    <button
                      onClick={handleLinkGoogleDoc}
                      disabled={isSyncingDoc}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                    >
                      {isSyncingDoc ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Syncing Document...</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          <span>Link & Sync Google Doc</span>
                        </>
                      )}
                    </button>
                    {currentExam?.googleDocEmbedUrl && (
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                        ✓ Currently linked to: {currentExam.googleDocEmbedUrl.substring(0, 40)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] text-xs font-bold uppercase tracking-wider"
                    >
                      Close Settings
                    </button>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      Save Exam Settings
                    </button>
                  </div>
                </div>
              ) : activeTab === 'oldPapers' ? (
                <DocumentExplorer
                  examName={currentExam?.name || 'Recruitment Drive'}
                  companyName={companyName}
                  tabs={currentExam?.paperTabs || []}
                  hasAccess={hasOldPapersAccess}
                  isAdmin={isAdmin}
                  watermarkText={authorizedDoc.watermarkText}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onUpdateTabs={(updatedTabs) => {
                    if (currentExam) {
                      dataStore.updateExam(currentExam.id, { paperTabs: updatedTabs });
                      queryClient.invalidateQueries({ queryKey: ['companyExams', slug] });
                    }
                  }}
                />
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-h3:text-[#006c49] dark:prose-h3:text-[#6cf8bb] prose-a:text-[#0284c7] dark:prose-a:text-[#38bdf8] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl text-[#1f1b17] dark:text-[#e3e3e3]">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                    {activeTab === 'aboutCompany' 
                      ? (currentCompanyStoreItem.aboutCompany || '*No company details added yet.*')
                      : (currentExam.content || '*No exam details added yet.*')}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#747878] space-y-3">
              <Building2 className="w-12 h-12 opacity-50" />
              <p className="font-bold text-sm">No exam modules found for this company.</p>
              {isAdmin && (
                <button onClick={handleAddNewExam} className="text-purple-700 underline text-xs font-bold">
                  Create the first exam module
                </button>
              )}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] p-4 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h4 className="font-display text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider">
                Recent Questions
              </h4>
              <span className="text-[10px] font-bold text-[#00714d] dark:text-[#6cf8bb] bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 px-2 py-0.5 rounded-full">Live</span>
            </div>

            <div className="space-y-2.5">
              {[
                { q: 'Array Subarray Difference', type: 'Coding' },
                { q: 'DBMS INNER JOIN vs LEFT JOIN', type: 'SQL' },
                { q: 'Clock Angle at 3:25', type: 'Aptitude' },
                { q: 'Process vs Thread Memory', type: 'OS Core' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#f6ece6]/60 dark:bg-[#141517]/60 rounded-[12px] border border-[#e2d8d2] dark:border-[#383a40] space-y-1 hover:border-[#006c49]/40 dark:hover:border-[#6cf8bb]/40 transition-all cursor-pointer">
                  <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block leading-snug">{item.q}</span>
                  <span className="text-[10px] text-[#747878] dark:text-[#a6adbb] font-semibold">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f6ece6] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#2b2d31] rounded-[24px] p-4 shadow-sm space-y-3 transition-colors">
            <h4 className="font-display text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider pb-2 border-b border-[#e2d8d2] dark:border-[#2b2d31]">
              Discover More
            </h4>
            <div className="space-y-1">
              {[
                'Arithmetic Aptitude',
                'Data Interpretation',
                'Verbal Ability',
                'Logical Reasoning',
                'Pseudocode Practice',
                'Placement Papers',
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-[10px] hover:bg-[#ffffff] dark:hover:bg-[#2b2d31] text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] transition-all cursor-pointer">
                  <span>{cat}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#747878] dark:text-[#a6adbb]" />
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* ✏️ MODAL: EDIT COMPANY HEADER PROFILE */}
      {showEditHeaderModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#eae1da] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da]">
              <h3 className="font-display text-lg font-bold text-[#1f1b17]">Edit Company Header Profile</h3>
              <button onClick={() => setShowEditHeaderModal(false)} className="text-[#747878] hover:text-[#1f1b17]"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveHeaderProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Company Name *</label>
                <input type="text" required value={headerForm.name} onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs font-bold text-[#1f1b17]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] uppercase block">Industry</label>
                  <input type="text" value={headerForm.industry} onChange={(e) => setHeaderForm({ ...headerForm, industry: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] uppercase block">Headquarters</label>
                  <input type="text" value={headerForm.headquarters} onChange={(e) => setHeaderForm({ ...headerForm, headquarters: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Official Website URL</label>
                <input type="url" value={headerForm.website} onChange={(e) => setHeaderForm({ ...headerForm, website: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Logo Image URL</label>
                <input type="url" value={headerForm.logoUrl} onChange={(e) => setHeaderForm({ ...headerForm, logoUrl: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Header Short Overview</label>
                <textarea rows={2} value={headerForm.description} onChange={(e) => setHeaderForm({ ...headerForm, description: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEditHeaderModal(false)} className="px-4 py-2 text-xs font-bold text-[#747878]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Save Header Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 📄 GOOGLE DOCS STYLE FULLSCREEN DASHBOARD (WITH NIGHT MODE & URL ROUTING) */}
      {isFullscreenDoc && currentExam && (
        <div 
          className={`fixed inset-0 z-[100] flex flex-col overflow-hidden animate-fadeIn font-sans ${
            isDarkMode ? 'bg-[#141517] text-[#e3e3e3]' : 'bg-[#f8f9fa] text-[#1f1f1f]'
          }`}
        >
          {/* Top Bar Header */}
          <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 h-16 shadow-none transition-colors ${
            isDarkMode ? 'bg-[#1e1f22] border-[#2b2d31] text-[#e3e3e3]' : 'bg-[#f0f4f9] border-[#e1e3e1] text-[#1f1f1f]'
          }`}>
            <div className="flex items-center gap-3">


              <div className={`w-9 h-9 rounded font-black text-lg flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#004a77] text-[#c2e7ff]' : 'bg-[#c2e7ff] text-[#001d35]'
              }`}>
                {currentCompanyStoreItem.logoUrl ? (
                  <img src={currentCompanyStoreItem.logoUrl} alt={companyName} loading="lazy" decoding="async" className="w-full h-full object-contain p-0.5" />
                ) : (
                  companyName.charAt(0)
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-[#f0f4f9]' : 'text-[#1f1f1f]'}`}>
                    {currentCompanyStoreItem.name} - Old Papers
                  </span>
                  <span className="text-xs text-[#747878]">•</span>
                  <span className="font-semibold text-xs text-[#38bdf8]">Official Placement Papers</span>
                </div>
                <div className={`flex items-center gap-2 text-[11px] ${isDarkMode ? 'text-[#a6adbb]' : 'text-[#444746]'}`}>
                  <span>Official Exam Dashboard</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {isAdmin ? 'Admin Live Editor Mode' : 'Student Reader Mode'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    onClick={handleLinkGoogleDoc}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00714d] hover:bg-[#006c49] text-white font-semibold text-xs transition-colors shadow-sm"
                    title="Attach or update the official paper document"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{currentExam?.googleDocEmbedUrl ? 'Change Document Link' : 'Attach Official Document'}</span>
                  </button>

                  {currentExam?.googleDocEditUrl && (
                    <a
                      href={currentExam.googleDocEditUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition-colors shadow-sm"
                      title="Open live document editor"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Edit Official Document</span>
                    </a>
                  )}
                </>
              )}

              <button
                onClick={() => {
                  setIsFullscreenDoc(false);
                  navigate(`/companies/${slug}`);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs transition-colors ${
                  isDarkMode ? 'bg-[#2b2d31] hover:bg-[#383a40] text-[#f0f4f9]' : 'bg-[#e3e8ef] hover:bg-[#d5dbe4] text-[#1f1f1f]'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Exit Fullscreen
              </button>
            </div>
          </div>

          {/* Main Content Area: Native DocumentExplorer */}
          <div className="flex-1 flex overflow-hidden w-full h-full p-4">
            <DocumentExplorer
              examName={currentExam?.name || 'Recruitment Drive'}
              companyName={companyName}
              tabs={currentExam?.paperTabs || []}
              hasAccess={hasOldPapersAccess}
              isAdmin={isAdmin}
              watermarkText={authorizedDoc.watermarkText}
              onOpenPaywall={() => setShowPaywallModal(true)}
              onUpdateTabs={(updatedTabs) => {
                if (currentExam) {
                  dataStore.updateExam(currentExam.id, { paperTabs: updatedTabs });
                  queryClient.invalidateQueries({ queryKey: ['companyExams', slug] });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* 🔐 PAYWALL & MONETIZATION CHECKOUT MODAL */}
      {currentExam && (
        <PaywallModal
          isOpen={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
          examId={currentExam.id}
          examName={currentExam.name}
          companyName={companyName}
          onUnlocked={() => {
            queryClient.invalidateQueries();
          }}
        />
      )}
    </div>
  );
}
