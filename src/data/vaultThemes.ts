export interface VaultTheme {
  id: string;
  name: string;
  category: 'Triumph Monolith' | 'Sapphire' | 'Amethyst' | 'Gold Sovereign' | 'Ruby Crimson' | 'Emerald Jade' | 'Obsidian Titanium';
  primaryHex: string;
  secondaryHex: string;
  glowRgba: string;
  gradientTailwind: string;
  bgSpotlight: string;
  accentBorder: string;
  textAccent: string;
  description: string;
  foilTexture: 'sapphire' | 'amethyst' | 'gold' | 'ruby' | 'emerald' | 'obsidian';
}

export const VAULT_THEMES: VaultTheme[] = [
  {
    id: 'theme-triumph',
    name: 'Triumph Amber Monolith',
    category: 'Triumph Monolith',
    primaryHex: '#FF7A00',
    secondaryHex: '#FFA834',
    glowRgba: 'rgba(255, 122, 0, 0.45)',
    gradientTailwind: 'from-orange-600 via-amber-500 to-zinc-950',
    bgSpotlight: 'radial-gradient(circle at 50% 35%, rgba(255, 122, 0, 0.28) 0%, rgba(12, 10, 8, 0.95) 65%, #040302 100%)',
    accentBorder: 'border-orange-500/60',
    textAccent: 'text-orange-400',
    description: 'Matte black obsidian monolith with glowing vertical amber neon blades and dramatic overhead spotlight',
    foilTexture: 'gold',
  },
  {
    id: 'theme-sapphire',
    name: 'Cobalt Sapphire',
    category: 'Sapphire',
    primaryHex: '#0070F3',
    secondaryHex: '#00F0FF',
    glowRgba: 'rgba(0, 240, 255, 0.45)',
    gradientTailwind: 'from-blue-600 via-cyan-500 to-indigo-900',
    bgSpotlight: 'radial-gradient(circle at 50% 40%, rgba(0, 112, 243, 0.25) 0%, rgba(5, 7, 11, 0.95) 70%, #030407 100%)',
    accentBorder: 'border-cyan-400/50',
    textAccent: 'text-cyan-400',
    description: 'Electric oceanic azure with high-refraction crystalline sheen',
    foilTexture: 'sapphire',
  },
  {
    id: 'theme-amethyst',
    name: 'Royal Amethyst',
    category: 'Amethyst',
    primaryHex: '#9333EA',
    secondaryHex: '#E879F9',
    glowRgba: 'rgba(217, 70, 239, 0.45)',
    gradientTailwind: 'from-purple-600 via-fuchsia-500 to-indigo-950',
    bgSpotlight: 'radial-gradient(circle at 50% 40%, rgba(147, 51, 234, 0.25) 0%, rgba(5, 7, 11, 0.95) 70%, #030407 100%)',
    accentBorder: 'border-fuchsia-400/50',
    textAccent: 'text-fuchsia-400',
    description: 'Deep imperial violet with prism iridescent magenta highlights',
    foilTexture: 'amethyst',
  },
  {
    id: 'theme-gold',
    name: 'Gold Sovereign',
    category: 'Gold Sovereign',
    primaryHex: '#F59E0B',
    secondaryHex: '#FDE047',
    glowRgba: 'rgba(250, 204, 21, 0.45)',
    gradientTailwind: 'from-amber-500 via-yellow-400 to-amber-900',
    bgSpotlight: 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.25) 0%, rgba(5, 7, 11, 0.95) 70%, #030407 100%)',
    accentBorder: 'border-amber-400/50',
    textAccent: 'text-amber-400',
    description: '24K bullion luster with warm museum gallery pedestal illumination',
    foilTexture: 'gold',
  },
  {
    id: 'theme-ruby',
    name: 'Crimson Ruby',
    category: 'Ruby Crimson',
    primaryHex: '#E11D48',
    secondaryHex: '#FB7185',
    glowRgba: 'rgba(244, 63, 94, 0.45)',
    gradientTailwind: 'from-rose-600 via-red-500 to-rose-950',
    bgSpotlight: 'radial-gradient(circle at 50% 40%, rgba(225, 29, 72, 0.25) 0%, rgba(5, 7, 11, 0.95) 70%, #030407 100%)',
    accentBorder: 'border-rose-400/50',
    textAccent: 'text-rose-400',
    description: 'Vibrant scarlet diamond glow with high-intensity contrast',
    foilTexture: 'ruby',
  },
  {
    id: 'theme-emerald',
    name: 'Neon Emerald',
    category: 'Emerald Jade',
    primaryHex: '#10B981',
    secondaryHex: '#34D399',
    glowRgba: 'rgba(52, 211, 153, 0.45)',
    gradientTailwind: 'from-emerald-600 via-teal-400 to-emerald-950',
    bgSpotlight: 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.25) 0%, rgba(5, 7, 11, 0.95) 70%, #030407 100%)',
    accentBorder: 'border-emerald-400/50',
    textAccent: 'text-emerald-400',
    description: 'Luminous cyber jade with ultra-sharp laser refraction',
    foilTexture: 'emerald',
  },
  {
    id: 'theme-obsidian',
    name: 'Obsidian Titanium',
    category: 'Obsidian Titanium',
    primaryHex: '#64748B',
    secondaryHex: '#E2E8F0',
    glowRgba: 'rgba(255, 255, 255, 0.25)',
    gradientTailwind: 'from-zinc-700 via-slate-400 to-zinc-950',
    bgSpotlight: 'radial-gradient(circle at 50% 40%, rgba(148, 163, 184, 0.2) 0%, rgba(5, 7, 11, 0.95) 70%, #030407 100%)',
    accentBorder: 'border-slate-400/50',
    textAccent: 'text-slate-300',
    description: 'Stealth matte titanium with pure specular light reflection',
    foilTexture: 'obsidian',
  },
];
