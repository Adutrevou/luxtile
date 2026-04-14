import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useAdminPartners } from '@/hooks/usePartners';
import { useOptionSets } from '@/hooks/useOptionSets';
import { Package, LogOut, Plus, Trash2, Edit2, Image, X, ChevronLeft, Search, ToggleLeft, ToggleRight, RefreshCw, ArchiveRestore, Handshake, Layers } from 'lucide-react';
import { toast } from 'sonner';
import luxtileLogo from '@/assets/luxtile-logo.png';
import OptionSetsManager from '@/components/admin/OptionSetsManager';

type View = 'list' | 'form' | 'partners' | 'option-sets';

const CATEGORIES = ['Marble', 'Stone', 'Concrete', 'Dark', 'Wood', 'Other'];
const FIXED_SECTIONS = ['Collection', 'Best Sellers', 'On Sale'];

const AdminDashboard = () => {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();
  const {
    products, isLoading: productsLoading, error: productsError, refetch,
    addProduct, updateProduct, deleteProduct, uploadImages,
    isAdding, isUpdating,
  } = useAdminProducts();
  const {
    partners, isLoading: partnersLoading,
    addPartner, updatePartner, deletePartner,
    isAdding: partnerAdding, isUpdating: partnerUpdating,
  } = useAdminPartners();
  const { data: optionSets = [] } = useOptionSets();

  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'price'>('date');

  // Product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sizes, setSizes] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('');
  const [displaySection, setDisplaySection] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [optionSetId, setOptionSetId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Partner form state
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerDescription, setPartnerDescription] = useState('');
  const [partnerSectionValue, setPartnerSectionValue] = useState('');
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('');
  const [partnerSortOrder, setPartnerSortOrder] = useState(0);
  const [partnerUploading, setPartnerUploading] = useState(false);
  const partnerFileRef = useRef<HTMLInputElement>(null);

  // Combine fixed sections with dynamic partner sections
  const allSections = [...FIXED_SECTIONS, ...partners.map((p) => p.display_section_value)];

  const resetForm = () => {
    setName(''); setDescription(''); setCategory(CATEGORIES[0]); setSizes('');
    setTags(''); setPrice(''); setDisplaySection([]); setImages([]);
    setCoverIndex(0); setFeatured(false); setStatus('active'); setOptionSetId(''); setEditingId(null);
  };

  const resetPartnerForm = () => {
    setPartnerName(''); setPartnerDescription(''); setPartnerSectionValue('');
    setPartnerLogoUrl(''); setPartnerSortOrder(0); setEditingPartnerId(null);
    setPartnerFormOpen(false);
  };

  const openAdd = () => { resetForm(); setView('form'); };

  const openEdit = (p: typeof products[0]) => {
    setName(p.name); setDescription(p.description); setCategory(p.category);
    setSizes(p.sizes.join(', ')); setTags(p.tags.join(', '));
    setPrice(p.price != null ? String(p.price) : '');
    setDisplaySection(p.display_section); setImages(p.images);
    setCoverIndex(p.cover_index); setFeatured(p.featured);
    setStatus(p.status as 'active' | 'inactive'); setOptionSetId((p as any).option_set_id || ''); setEditingId(p.id); setView('form');
  };

  const openEditPartner = (p: typeof partners[0]) => {
    setPartnerName(p.name); setPartnerDescription(p.description);
    setPartnerSectionValue(p.display_section_value); setPartnerLogoUrl(p.logo_url || '');
    setPartnerSortOrder(p.sort_order); setEditingPartnerId(p.id);
    setPartnerFormOpen(true);
  };

  // Parallel upload with compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadImages(Array.from(files));
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err: any) {
      const msg = err.message || 'Upload failed';
      if (msg.includes('session') || msg.includes('sign in')) {
        toast.error('Session expired — please sign in again');
        navigate('/admin/login');
        return;
      }
      toast.error(msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePartnerLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setPartnerUploading(true);
    try {
      const urls = await uploadImages(Array.from(files));
      setPartnerLogoUrl(urls[0]);
      toast.success('Logo uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setPartnerUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Fix cover index after removal
      if (next.length === 0) {
        setCoverIndex(0);
      } else if (idx === coverIndex) {
        // Removed the cover — default to first image
        setCoverIndex(0);
      } else if (idx < coverIndex) {
        // Removed before cover — shift index down
        setCoverIndex((c) => c - 1);
      }
      return next;
    });
  };

  const toggleSection = (section: string) => {
    setDisplaySection((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }
    const data: any = {
      name,
      description,
      category,
      sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      price: price ? Number(price) : null,
      display_section: displaySection,
      images,
      cover_index: coverIndex,
      featured,
      status,
      sort_order: 0,
      option_set_id: optionSetId || null,
    };
    try {
      if (editingId) {
        await updateProduct(editingId, data);
      } else {
        await addProduct(data);
      }
      resetForm();
      setView('list');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('session') || msg.includes('sign in')) {
        toast.error('Session expired — please sign in again');
        navigate('/admin/login');
      }
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: partnerName,
      description: partnerDescription,
      display_section_value: partnerSectionValue,
      logo_url: partnerLogoUrl || null,
      sort_order: partnerSortOrder,
      status: 'active' as const,
    };
    try {
      if (editingPartnerId) {
        await updatePartner(editingPartnerId, data);
      } else {
        await addPartner(data);
      }
      resetPartnerForm();
    } catch {
      // toast handled in hook
    }
  };

  // Archive instead of delete
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch {
      // toast handled in hook
    }
    setDeleteConfirmId(null);
  };

  // Restore archived product
  const handleRestore = async (id: string) => {
    try {
      await updateProduct(id, { status: 'active' });
    } catch {
      // toast handled in hook
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'active' ? 'inactive' : 'active';
    await updateProduct(id, { status: newStatus });
  };

  // Filtering & sorting
  const filtered = products
    .filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterCategory !== 'All' && p.category !== filterCategory) return false;
      if (filterSection !== 'All' && !p.display_section.includes(filterSection)) return false;
      if (filterStatus !== 'All' && p.status !== filterStatus.toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const uniqueCategories = ['All', ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={luxtileLogo} alt="Luxtile" className="h-8 w-auto brightness-0 invert" />
          <span className="text-white/30 text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setView(view === 'partners' ? 'list' : 'partners'); resetPartnerForm(); }} className={`flex items-center gap-2 text-sm transition-colors ${view === 'partners' ? 'text-accent' : 'text-white/50 hover:text-white'}`}>
            <Handshake size={16} /> Partners
          </button>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {view === 'partners' ? (
          /* Partners Management View */
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl">Partners ({partners.length})</h2>
              <button onClick={() => { resetPartnerForm(); setPartnerFormOpen(true); }} className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm tracking-[0.1em] uppercase font-medium hover:tracking-[0.14em] transition-all">
                <Plus size={16} /> Add Partner
              </button>
            </div>

            {/* Partner Form Modal */}
            {partnerFormOpen && (
              <div className="border border-white/10 p-6 mb-8 bg-white/5">
                <h3 className="font-display text-lg mb-6">{editingPartnerId ? 'Edit Partner' : 'Add Partner'}</h3>
                <form onSubmit={handlePartnerSubmit} className="space-y-5 max-w-xl">
                  <FormField label="Partner Name">
                    <input required value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
                  </FormField>
                  <FormField label="Display Section Value (used to link products)">
                    <input
                      required
                      value={partnerSectionValue}
                      onChange={(e) => setPartnerSectionValue(e.target.value)}
                      placeholder="e.g. Dekton Partner"
                      disabled={!!editingPartnerId}
                      className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors disabled:opacity-50"
                    />
                    <p className="text-white/30 text-xs mt-1">This value appears as a section option when editing products.</p>
                  </FormField>
                  <FormField label="Description">
                    <textarea value={partnerDescription} onChange={(e) => setPartnerDescription(e.target.value)} rows={3} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors resize-none" />
                  </FormField>
                  <FormField label="Logo">
                    <div className="flex items-center gap-4 pt-2">
                      {partnerLogoUrl && (
                        <img src={partnerLogoUrl} alt="Logo" className="h-12 object-contain bg-white/10 p-2" />
                      )}
                      <button type="button" onClick={() => partnerFileRef.current?.click()} disabled={partnerUploading} className="border border-dashed border-white/20 px-4 py-2 text-sm text-white/50 hover:text-white hover:border-white/40 transition-colors disabled:opacity-50">
                        {partnerUploading ? 'Uploading...' : 'Upload Logo'}
                      </button>
                      <input ref={partnerFileRef} type="file" accept="image/*" onChange={handlePartnerLogoUpload} className="hidden" />
                    </div>
                  </FormField>
                  <FormField label="Sort Order">
                    <input type="number" value={partnerSortOrder} onChange={(e) => setPartnerSortOrder(Number(e.target.value))} className="w-24 bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
                  </FormField>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={partnerAdding || partnerUpdating} className="bg-accent text-accent-foreground px-6 py-3 text-sm tracking-[0.1em] uppercase font-medium transition-all disabled:opacity-50">
                      {partnerAdding || partnerUpdating ? 'Saving...' : editingPartnerId ? 'Update' : 'Add Partner'}
                    </button>
                    <button type="button" onClick={resetPartnerForm} className="border border-white/20 px-6 py-3 text-sm text-white/60 hover:text-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Partner List */}
            {partnersLoading ? (
              <div className="border border-white/10 p-12 text-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : partners.length === 0 ? (
              <div className="border border-white/10 p-12 text-center">
                <Handshake size={40} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/50">No partners yet. Add your first partner.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {partners.map((p) => (
                  <div key={p.id} className={`border p-4 flex items-center gap-4 transition-colors ${p.status === 'inactive' ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'}`}>
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={p.name} className="w-16 h-10 object-contain bg-white/10 p-1 shrink-0" />
                    ) : (
                      <div className="w-16 h-10 bg-white/5 flex items-center justify-center shrink-0">
                        <Handshake size={16} className="text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-white/40 text-sm truncate">Section: {p.display_section_value}</p>
                    </div>
                    <span className={`text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 shrink-0 ${p.status === 'active' ? 'text-green-400 border border-green-400/30' : 'text-red-400 border border-red-400/30'}`}>
                      {p.status}
                    </span>
                    <button onClick={() => openEditPartner(p)} className="text-white/30 hover:text-white transition-colors shrink-0">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deletePartner(p.id)} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : view === 'list' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Products" value={products.length} />
              <StatCard label="Active" value={products.filter((p) => p.status === 'active').length} />
              <StatCard label="Archived" value={products.filter((p) => p.status === 'inactive').length} />
              <StatCard label="Featured" value={products.filter((p) => p.featured).length} />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none">
                {uniqueCategories.map((c) => <option key={c} value={c} className="bg-[#0F0F0F]">{c}</option>)}
              </select>
              <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none">
                <option value="All" className="bg-[#0F0F0F]">All Sections</option>
                {allSections.map((s) => <option key={s} value={s} className="bg-[#0F0F0F]">{s}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none">
                <option value="All" className="bg-[#0F0F0F]">All Status</option>
                <option value="Active" className="bg-[#0F0F0F]">Active</option>
                <option value="Inactive" className="bg-[#0F0F0F]">Inactive</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none">
                <option value="date" className="bg-[#0F0F0F]">Newest</option>
                <option value="name" className="bg-[#0F0F0F]">Name</option>
                <option value="price" className="bg-[#0F0F0F]">Price</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Products ({filtered.length})</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => refetch()} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors border border-white/10 px-4 py-2.5">
                  <RefreshCw size={14} /> Refresh
                </button>
                <button onClick={openAdd} className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm tracking-[0.1em] uppercase font-medium hover:tracking-[0.14em] transition-all">
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {/* Error State */}
            {productsError && (
              <div className="border border-red-400/30 bg-red-400/5 p-6 mb-6 text-center">
                <p className="text-red-400 mb-3">Failed to load products</p>
                <button onClick={() => refetch()} className="text-sm text-white/60 hover:text-white border border-white/20 px-4 py-2 transition-colors">
                  Retry
                </button>
              </div>
            )}

            {/* Product List */}
            {productsLoading ? (
              <div className="border border-white/10 p-12 text-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="border border-white/10 p-12 text-center">
                <Package size={40} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/50">{products.length === 0 ? 'No products yet. Add your first product.' : 'No products match your filters.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p) => (
                  <div key={p.id} className={`border p-4 flex items-center gap-4 group transition-colors ${p.status === 'inactive' ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'}`}>
                    {p.images[p.cover_index] ? (
                      <img src={p.images[p.cover_index]} alt={p.name} className="w-16 h-16 object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 flex items-center justify-center shrink-0">
                        <Image size={20} className="text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-white/40 text-sm">
                        {p.category}
                        {p.price != null && ` · R${p.price.toLocaleString()}`}
                        {p.sizes.length > 0 && ` · ${p.sizes.join(', ')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.display_section.map((s) => (
                        <span key={s} className="text-[10px] tracking-[0.1em] uppercase text-white/50 border border-white/20 px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                    {p.featured && (
                      <span className="text-xs tracking-[0.1em] uppercase text-accent border border-accent/30 px-2 py-0.5 shrink-0">Featured</span>
                    )}
                    <span className={`text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 shrink-0 ${p.status === 'active' ? 'text-green-400 border border-green-400/30' : 'text-red-400 border border-red-400/30'}`}>
                      {p.status}
                    </span>
                    {p.status === 'inactive' && (
                      <button onClick={() => handleRestore(p.id)} className="text-white/30 hover:text-green-400 transition-colors shrink-0" title="Restore product">
                        <ArchiveRestore size={16} />
                      </button>
                    )}
                    <button onClick={() => handleToggleStatus(p.id, p.status)} className="text-white/30 hover:text-white transition-colors shrink-0" title="Toggle status">
                      {p.status === 'active' ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => openEdit(p)} className="text-white/30 hover:text-white transition-colors shrink-0">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirmId(p.id)} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Delete Confirmation — now archives */}
            {deleteConfirmId && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setDeleteConfirmId(null)}>
                <div className="bg-[#1a1a1a] border border-white/10 p-8 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg mb-2">Archive Product</h3>
                  <p className="text-white/60 text-sm mb-6">This will hide the product from the website. You can restore it later from the admin panel.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-white/20 py-2.5 text-sm hover:border-white/40 transition-colors">Cancel</button>
                    <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-500 text-white py-2.5 text-sm hover:bg-red-600 transition-colors">Archive</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Form View */
          <>
            <button onClick={() => { resetForm(); setView('list'); }} className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> Back to Products
            </button>
            <h2 className="font-display text-xl mb-8">{editingId ? 'Edit Product' : 'Add Product'}</h2>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
              <FormField label="Product Name">
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
              </FormField>
              <FormField label="Description">
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors resize-none" />
              </FormField>

              <div className="grid grid-cols-2 gap-6">
                <FormField label="Category">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0F0F0F]">{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Price (ZAR)">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Optional" className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField label="Sizes (comma-separated)">
                  <input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="e.g. 1200×600, 600×600" className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
                </FormField>
                <FormField label="Tags (comma-separated)">
                  <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. new, premium" className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
                </FormField>
              </div>

              {/* Display Section — dynamic */}
              <FormField label="Display Section">
                <div className="space-y-4 pt-2">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Pages</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={displaySection.includes('Collection')} onChange={() => toggleSection('Collection')} className="accent-accent" />
                        <span className="text-sm text-white/80">Collections Page</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Sales Page Sections</p>
                    <div className="flex flex-wrap gap-4">
                      {['Best Sellers', 'On Sale'].map((s) => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={displaySection.includes(s)} onChange={() => toggleSection(s)} className="accent-accent" />
                          <span className="text-sm text-white/80">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {partners.length > 0 && (
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Partner Sections</p>
                      <div className="flex flex-wrap gap-4">
                        {partners.map((p) => (
                          <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={displaySection.includes(p.display_section_value)} onChange={() => toggleSection(p.display_section_value)} className="accent-accent" />
                            <span className="text-sm text-white/80">{p.display_section_value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FormField>

              {/* Images */}
              <FormField label="Product Images">
                <div className="flex flex-wrap gap-3 mb-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className={`relative w-24 h-24 border-2 ${idx === coverIndex ? 'border-accent' : 'border-white/10'} cursor-pointer group`} onClick={() => setCoverIndex(idx)}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === coverIndex && <span className="absolute bottom-0 left-0 right-0 bg-accent text-accent-foreground text-[10px] text-center py-0.5 uppercase tracking-wider">Cover</span>}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-24 h-24 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/30 hover:text-white/60 hover:border-white/40 transition-colors disabled:opacity-50">
                    {uploading ? <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" /> : <><Plus size={20} /><span className="text-[10px] mt-1">Upload</span></>}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                {uploading && <p className="text-accent text-xs">Uploading images...</p>}
              </FormField>

              {/* Toggles */}
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-accent" />
                  <span className="text-white/60 text-sm">Featured product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={status === 'active'} onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')} className="accent-accent" />
                  <span className="text-white/60 text-sm">Active (visible on site)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isAdding || isUpdating || uploading}
                className="bg-accent text-accent-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:tracking-[0.19em] transition-all disabled:opacity-50"
              >
                {uploading ? 'Waiting for upload...' : isAdding || isUpdating ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="border border-white/10 p-5">
    <p className="text-white/50 text-xs tracking-[0.15em] uppercase mb-1">{label}</p>
    <p className="text-3xl font-display">{value}</p>
  </div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">{label}</label>
    {children}
  </div>
);

export default AdminDashboard;
