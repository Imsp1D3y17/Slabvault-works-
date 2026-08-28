import React, { useState } from 'react';
import { Slab, GradingCompany, CardCategory } from '../types';
import { PRESET_GRAIL_LIBRARY } from '../data/sampleGrails';
import { X, Plus, Sparkles, Shield, Search, Check, Camera, Upload } from 'lucide-react';

interface AddSlabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlab: (slab: Slab) => void;
  onOpenScanner?: () => void;
}

export const AddSlabModal: React.FC<AddSlabModalProps> = ({
  isOpen,
  onClose,
  onAddSlab,
  onOpenScanner,
}) => {
  const [tab, setTab] = useState<'custom' | 'catalog'>('custom');

  // Form Fields
  const [cardName, setCardName] = useState('');
  const [setName, setSetName] = useState('');
  const [year, setYear] = useState(2021);
  const [cardNumber, setCardNumber] = useState('');
  const [gradingCompany, setGradingCompany] = useState<GradingCompany>('PSA');
  const [grade, setGrade] = useState<number>(10);
  const [gradeModifier, setGradeModifier] = useState('GEM MT');
  const [certNumber, setCertNumber] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(5000);
  const [currentMarketValue, setCurrentMarketValue] = useState<number>(7500);
  const [category, setCategory] = useState<CardCategory>('Pokemon');
  const [isHolyGrail, setIsHolyGrail] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    const defaultImg =
      category === 'Pokemon'
        ? 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80'
        : category === 'Basketball'
        ? 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
        : category === 'Football'
        ? 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80';

    const newSlab: Slab = {
      id: `vault-slab-${Date.now()}`,
      cardName,
      setName: setName || 'Master Series',
      year: Number(year) || 2021,
      cardNumber: cardNumber || undefined,
      gradingCompany,
      grade: Number(grade),
      gradeModifier: (gradeModifier as any) || (Number(grade) === 10 ? 'GEM MT' : 'MINT'),
      certNumber: certNumber || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      purchasePrice: Number(purchasePrice),
      purchaseDate: new Date().toISOString().split('T')[0],
      currentMarketValue: Number(currentMarketValue),
      rarityTier: isHolyGrail ? 'Trophy' : 'Blue Chip',
      category,
      isHolyGrail,
      imageUrl: imageUrl.trim() || defaultImg,
      historicalComps: [
        {
          id: `comp-initial-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          price: Number(currentMarketValue),
          auctionHouse: 'PWCC',
          notes: 'Current baseline appraisal',
        },
      ],
      popReport: {
        popAtGrade: Math.floor(Math.random() * 200) + 10,
        popHigher: Number(grade) === 10 ? 0 : Math.floor(Math.random() * 40) + 5,
        totalPopulation: Math.floor(Math.random() * 3000) + 500,
      },
    };

    onAddSlab(newSlab);
    onClose();
  };

  const handleSelectPreset = (preset: (typeof PRESET_GRAIL_LIBRARY)[0]) => {
    const newSlab: Slab = {
      ...preset,
      id: `vault-slab-${Date.now()}`,
      purchasePrice: Math.round(preset.currentMarketValue * 0.75),
      purchaseDate: new Date().toISOString().split('T')[0],
    };
    onAddSlab(newSlab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0D18] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-white">Add Graded Slab to Vault</h3>
            <p className="text-xs text-zinc-400">Track real-time comps, cert authentication & museum display</p>
          </div>
        </div>

        {/* Tab Toggle & Scan Trigger */}
        <div className="flex flex-wrap gap-2 mb-6 text-xs font-mono">
          <div className="flex flex-1 bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTab('custom')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'custom' ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_10px_#00F0FF]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Custom Graded Slab
            </button>
            <button
              onClick={() => setTab('catalog')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'catalog' ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_10px_#00F0FF]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Catalog Presets
            </button>
          </div>

          {onOpenScanner && (
            <button
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/50 text-[#00F0FF] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AI Vision Scan</span>
            </button>
          )}
        </div>

        {tab === 'custom' ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-zinc-400 mb-1">Card Title / Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2003 Topps Chrome LeBron James Refractor"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:border-[#00F0FF] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Set Name</label>
                <input
                  type="text"
                  placeholder="e.g. Topps Chrome"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Card #</label>
                <input
                  type="text"
                  placeholder="e.g. #111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Grading Company</label>
                <select
                  value={gradingCompany}
                  onChange={(e) => setGradingCompany(e.target.value as GradingCompany)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                >
                  <option value="PSA">PSA</option>
                  <option value="BGS">BGS (Beckett)</option>
                  <option value="CGC">CGC</option>
                  <option value="SGC">SGC</option>
                  <option value="TAG">TAG</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Grade</label>
                <input
                  type="number"
                  step="0.5"
                  max="10"
                  min="1"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Cert Number #</label>
                <input
                  type="text"
                  placeholder="e.g. 48192039"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Purchase Price ($)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Est. Market Value ($)</label>
                <input
                  type="number"
                  value={currentMarketValue}
                  onChange={(e) => setCurrentMarketValue(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CardCategory)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                >
                  <option value="Pokemon">Pokémon</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Football">Football</option>
                  <option value="Magic: The Gathering">Magic: The Gathering</option>
                  <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
                  <option value="Marvel">Marvel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-mono text-zinc-200">
                  <input
                    type="checkbox"
                    checked={isHolyGrail}
                    onChange={(e) => setIsHolyGrail(e.target.checked)}
                    className="accent-[#00F0FF] rounded"
                  />
                  <span>Mark as Trophy Asset Priority</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black font-extrabold hover:opacity-90 shadow-lg cursor-pointer"
              >
                Deposit in Vault
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {PRESET_GRAIL_LIBRARY.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#00F0FF]/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={preset.imageUrl}
                    alt={preset.cardName}
                    className="w-12 h-12 rounded object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{preset.cardName}</p>
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      {preset.gradingCompany} {preset.grade} • {preset.setName}
                    </span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-[#00F0FF] shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
