import { useState } from 'react';
import { useAdminOptionSets } from '@/hooks/useOptionSets';
import { Plus, Trash2, Edit2, X, ChevronLeft, Layers } from 'lucide-react';

const OptionSetsManager = () => {
  const { optionSets, isLoading, addSet, updateSet, deleteSet, addItem, deleteItem } = useAdminOptionSets();

  const [newSetName, setNewSetName] = useState('');
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editSetName, setEditSetName] = useState('');
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null);
  const [newItemLabel, setNewItemLabel] = useState('');

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetName.trim()) return;
    await addSet.mutateAsync(newSetName.trim());
    setNewSetName('');
  };

  const handleUpdateSet = async (id: string) => {
    if (!editSetName.trim()) return;
    await updateSet.mutateAsync({ id, name: editSetName.trim() });
    setEditingSetId(null);
  };

  const handleAddItem = async (optionSetId: string) => {
    if (!newItemLabel.trim()) return;
    const set = optionSets.find((s) => s.id === optionSetId);
    await addItem.mutateAsync({
      option_set_id: optionSetId,
      label: newItemLabel.trim(),
      sort_order: (set?.items.length || 0) + 1,
    });
    setNewItemLabel('');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-xl">Option Sets ({optionSets.length})</h2>
      </div>

      {/* Add new set */}
      <form onSubmit={handleAddSet} className="flex gap-3 mb-8">
        <input
          value={newSetName}
          onChange={(e) => setNewSetName(e.target.value)}
          placeholder="New option set name (e.g. Standard Marble Sizes)"
          className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        <button type="submit" disabled={addSet.isPending} className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm tracking-[0.1em] uppercase font-medium hover:tracking-[0.14em] transition-all disabled:opacity-50">
          <Plus size={16} /> Add Set
        </button>
      </form>

      {isLoading ? (
        <div className="border border-white/10 p-12 text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : optionSets.length === 0 ? (
        <div className="border border-white/10 p-12 text-center">
          <Layers size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/50">No option sets yet. Create one to define size & thickness options.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {optionSets.map((set) => (
            <div key={set.id} className="border border-white/10 hover:border-white/20 transition-colors">
              {/* Set header */}
              <div className="p-4 flex items-center gap-4">
                <button onClick={() => setExpandedSetId(expandedSetId === set.id ? null : set.id)} className="flex-1 text-left min-w-0">
                  {editingSetId === set.id ? (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={editSetName}
                        onChange={(e) => setEditSetName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateSet(set.id)}
                        className="flex-1 bg-transparent border-b border-white/20 text-white py-1 outline-none focus:border-accent"
                      />
                      <button onClick={() => handleUpdateSet(set.id)} className="text-accent text-sm">Save</button>
                      <button onClick={() => setEditingSetId(null)} className="text-white/30 hover:text-white"><X size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium truncate">{set.name}</p>
                      <p className="text-white/40 text-sm">{set.items.length} option{set.items.length !== 1 ? 's' : ''}</p>
                    </>
                  )}
                </button>
                <button onClick={() => { setEditingSetId(set.id); setEditSetName(set.name); }} className="text-white/30 hover:text-white transition-colors shrink-0">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteSet.mutateAsync(set.id)} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Expanded: items list */}
              {expandedSetId === set.id && (
                <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                  {set.items.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {set.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2 px-3 bg-white/5">
                          <span className="flex-1 text-sm">{item.label}</span>
                          <button onClick={() => deleteItem.mutateAsync(item.id)} className="text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                      placeholder="e.g. 3200mm x 1500mm x 6mm"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(set.id))}
                      className="flex-1 bg-transparent border-b border-white/20 text-white py-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                    <button onClick={() => handleAddItem(set.id)} className="text-accent text-sm tracking-wider uppercase">Add</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OptionSetsManager;
