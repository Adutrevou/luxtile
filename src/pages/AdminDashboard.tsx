import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminProducts, type AdminProduct } from '@/hooks/useAdminProducts';
import { Package, LogOut, Plus, Trash2, Edit2, Image, X, ChevronLeft } from 'lucide-react';
import luxtileLogo from '@/assets/luxtile-logo.png';

type View = 'list' | 'form';

const CATEGORIES = ['Marble', 'Stone', 'Concrete', 'Dark', 'Wood', 'Other'];

const AdminDashboard = () => {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sizes, setSizes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [featured, setFeatured] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setSizes('');
    setImages([]);
    setCoverIndex(0);
    setFeatured(false);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setView('form');
  };

  const openEdit = (p: AdminProduct) => {
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setSizes(p.sizes.join(', '));
    setImages(p.images);
    setCoverIndex(p.coverIndex);
    setFeatured(p.featured);
    setEditingId(p.id);
    setView('form');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (coverIndex >= idx && coverIndex > 0) setCoverIndex((c) => c - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      category,
      sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images,
      coverIndex,
      featured,
    };
    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }
    resetForm();
    setView('list');
  };

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={luxtileLogo} alt="Luxtile" className="h-8 w-auto brightness-0 invert" />
          <span className="text-white/30 text-sm">Admin</span>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {view === 'list' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="border border-white/10 p-5">
                <p className="text-white/50 text-xs tracking-[0.15em] uppercase mb-1">Total Products</p>
                <p className="text-3xl font-display">{products.length}</p>
              </div>
              <div className="border border-white/10 p-5">
                <p className="text-white/50 text-xs tracking-[0.15em] uppercase mb-1">Categories</p>
                <p className="text-3xl font-display">{uniqueCategories.length}</p>
              </div>
              <div className="border border-white/10 p-5">
                <p className="text-white/50 text-xs tracking-[0.15em] uppercase mb-1">Featured</p>
                <p className="text-3xl font-display">{products.filter((p) => p.featured).length}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Products</h2>
              <button onClick={openAdd} className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm tracking-[0.1em] uppercase font-medium hover:tracking-[0.14em] transition-all">
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Product List */}
            {products.length === 0 ? (
              <div className="border border-white/10 p-12 text-center">
                <Package size={40} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/50">No products yet. Add your first product.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="border border-white/10 p-4 flex items-center gap-4 group hover:border-white/20 transition-colors">
                    {p.images[p.coverIndex] ? (
                      <img src={p.images[p.coverIndex]} alt={p.name} className="w-16 h-16 object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 flex items-center justify-center shrink-0">
                        <Image size={20} className="text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-white/40 text-sm">{p.category} · {p.sizes.join(', ')}</p>
                    </div>
                    {p.featured && (
                      <span className="text-xs tracking-[0.1em] uppercase text-accent border border-accent/30 px-2 py-0.5">Featured</span>
                    )}
                    <button onClick={() => openEdit(p)} className="text-white/30 hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
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
              <div>
                <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">Product Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0F0F0F]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-2">Sizes (comma-separated)</label>
                  <input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="e.g. 1200×600, 600×600" className="w-full bg-transparent border-b border-white/20 text-white py-3 outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-white/60 text-xs tracking-[0.15em] uppercase block mb-3">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className={`relative w-24 h-24 border-2 ${idx === coverIndex ? 'border-accent' : 'border-white/10'} cursor-pointer group`} onClick={() => setCoverIndex(idx)}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === coverIndex && <span className="absolute bottom-0 left-0 right-0 bg-accent text-accent-foreground text-[10px] text-center py-0.5 uppercase tracking-wider">Cover</span>}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-24 h-24 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/30 hover:text-white/60 hover:border-white/40 transition-colors">
                    <Plus size={20} />
                    <span className="text-[10px] mt-1">Upload</span>
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-accent" />
                <label htmlFor="featured" className="text-white/60 text-sm">Mark as featured product</label>
              </div>

              <button type="submit" className="bg-accent text-accent-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:tracking-[0.19em] transition-all">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
