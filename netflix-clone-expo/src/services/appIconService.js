// App Icon & Avatar Service (Locket-style Icon Switcher for FIMAX Cinema)

export const APP_ICONS = [
  {
    id: 'classic_red',
    name: 'FIMAX Classic',
    category: 'Điện Ảnh',
    subtitle: 'Đỏ Rạp Phim Gốc',
    bg: '#E50914',
    bgGradient: ['#E50914', '#990000'],
    borderColor: '#FF4D4D',
    iconColor: '#FFFFFF',
    badge: 'Original',
    iconName: 'film',
    letter: 'F',
    glowColor: 'rgba(229, 9, 20, 0.4)'
  },
  {
    id: 'locket_gold',
    name: 'Locket Gold VIP',
    category: 'Locket VIP',
    subtitle: 'Hoàng Gia 24K Ánh Kim',
    bg: '#18140B',
    bgGradient: ['#FFD700', '#B8860B'],
    borderColor: '#FFE066',
    iconColor: '#1A1505',
    badge: 'Locket VIP',
    iconName: 'sparkles',
    letter: '✦',
    glowColor: 'rgba(255, 215, 0, 0.4)'
  },
  {
    id: 'sakura_locket',
    name: 'Sakura Sweet Heart',
    category: 'Locket VIP',
    subtitle: 'Hồng Trái Tim Locket Cute',
    bg: '#250B15',
    bgGradient: ['#FF6584', '#FF2D55'],
    borderColor: '#FFA8BD',
    iconColor: '#FFFFFF',
    badge: 'Sweet',
    iconName: 'heart',
    letter: '♥',
    glowColor: 'rgba(255, 45, 85, 0.4)'
  },
  {
    id: 'cyber_blue',
    name: 'Cyberpunk Neon',
    category: 'Neon & 3D',
    subtitle: 'Xanh Điện Quang Tương Lai',
    bg: '#051829',
    bgGradient: ['#00F0FF', '#0072FF'],
    borderColor: '#70E8FF',
    iconColor: '#031726',
    badge: 'Sci-Fi',
    iconName: 'flash',
    letter: '⚡',
    glowColor: 'rgba(0, 240, 255, 0.4)'
  },
  {
    id: 'velvet_purple',
    name: 'Velvet Midnight',
    category: 'Điện Ảnh',
    subtitle: 'Màn Nhung Tím Huyền Ảo',
    bg: '#180B26',
    bgGradient: ['#C084FC', '#6B21A8'],
    borderColor: '#E9D5FF',
    iconColor: '#FFFFFF',
    badge: 'Cinema',
    iconName: 'moon',
    letter: 'F',
    glowColor: 'rgba(192, 132, 252, 0.4)'
  },
  {
    id: 'emerald_diamond',
    name: 'Emerald Diamond',
    category: 'Neon & 3D',
    subtitle: 'Ngọc Lục Bảo Quyền Quý',
    bg: '#061D12',
    bgGradient: ['#34D399', '#059669'],
    borderColor: '#A7F3D0',
    iconColor: '#022C19',
    badge: 'Luxury',
    iconName: 'diamond',
    letter: '💎',
    glowColor: 'rgba(52, 211, 153, 0.4)'
  },
  {
    id: 'sunset_flame',
    name: 'Sunset Flame',
    category: 'Aesthetic',
    subtitle: 'Lửa Hoàng Hôn Rực Cháy',
    bg: '#261205',
    bgGradient: ['#FB923C', '#DC2626'],
    borderColor: '#FED7AA',
    iconColor: '#FFFFFF',
    badge: 'Hot Trend',
    iconName: 'flame',
    letter: '🔥',
    glowColor: 'rgba(251, 146, 60, 0.4)'
  },
  {
    id: 'stealth_black',
    name: 'Stealth Titanium',
    category: 'Aesthetic',
    subtitle: 'Titanium Đen Mờ Tối Thượng',
    bg: '#18181B',
    bgGradient: ['#3F3F46', '#18181B'],
    borderColor: '#71717A',
    iconColor: '#FAFAFA',
    badge: 'Stealth',
    iconName: 'shield-checkmark',
    letter: 'F',
    glowColor: 'rgba(255, 255, 255, 0.2)'
  },
  {
    id: 'galaxy_cosmic',
    name: 'Galaxy Cosmic Star',
    category: 'Aesthetic',
    subtitle: 'Ngân Hà Tinh Tú Vũ Trụ',
    bg: '#0F0E2A',
    bgGradient: ['#818CF8', '#312E81'],
    borderColor: '#C7D2FE',
    iconColor: '#FFFFFF',
    badge: 'Cosmic',
    iconName: 'planet',
    letter: '★',
    glowColor: 'rgba(129, 140, 248, 0.4)'
  },
  {
    id: 'popcorn_cinema',
    name: 'Golden Popcorn',
    category: 'Điện Ảnh',
    subtitle: 'Bắp Rang Rạp Chiếu Phim',
    bg: '#231804',
    bgGradient: ['#FDE047', '#CA8A04'],
    borderColor: '#FEF08A',
    iconColor: '#3A2703',
    badge: 'Popcorn',
    iconName: 'film',
    letter: '🍿',
    glowColor: 'rgba(253, 224, 71, 0.4)'
  },
  {
    id: 'retro_synthwave',
    name: 'Retro 80s Synth',
    category: 'Neon & 3D',
    subtitle: 'Hoài Niệm Neon Thập Niên 80',
    bg: '#1E0A24',
    bgGradient: ['#F43F5E', '#8B5CF6'],
    borderColor: '#FCA5A5',
    iconColor: '#FFFFFF',
    badge: 'Retro',
    iconName: 'videocam',
    letter: '80s',
    glowColor: 'rgba(244, 63, 94, 0.4)'
  },
  {
    id: 'dark_ghost_oled',
    name: 'Ghost OLED Infinite',
    category: 'Aesthetic',
    subtitle: 'Hắc Ám OLED Vô Cực',
    bg: '#000000',
    bgGradient: ['#27272A', '#000000'],
    borderColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    badge: 'Pure OLED',
    iconName: 'eye',
    letter: 'F',
    glowColor: 'rgba(255, 255, 255, 0.3)'
  }
];

export const getAppIconById = (id) => {
  return APP_ICONS.find((i) => i.id === id) || APP_ICONS[0];
};

export const updateDynamicAppIcon = (iconIdOrObj) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const icon = typeof iconIdOrObj === 'object' ? iconIdOrObj : getAppIconById(iconIdOrObj);
  if (!icon) return;

  try {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw rounded squircle
    const r = 32;
    const w = size;
    const h = size;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // Fill background with gradient
    if (icon.bgGradient && icon.bgGradient.length >= 2) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, icon.bgGradient[0]);
      grad.addColorStop(1, icon.bgGradient[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = icon.bg || '#E50914';
    }
    ctx.fillRect(0, 0, w, h);

    // Border highlight
    if (icon.borderColor) {
      ctx.lineWidth = 6;
      ctx.strokeStyle = icon.borderColor;
      ctx.stroke();
    }

    // Draw central Letter / Emblem
    ctx.fillStyle = icon.iconColor || '#FFFFFF';
    ctx.font = '900 64px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon.letter || 'F', w / 2, h / 2 + 2);

    const dataUrl = canvas.toDataURL('image/png');

    // 1. Update Favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = dataUrl;

    // 2. Update Apple Touch Icon (For iOS Home Screen PWA)
    let appleLink = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleLink);
    }
    appleLink.href = dataUrl;

    // 3. Update Shortcut icon
    let shortcutLink = document.querySelector("link[rel='shortcut icon']");
    if (shortcutLink) {
      shortcutLink.href = dataUrl;
    }

    // 4. Update Theme color meta tag
    let metaTheme = document.querySelector("meta[name='theme-color']");
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = icon.bgGradient ? icon.bgGradient[0] : (icon.bg || '#000000');
  } catch (err) {
    console.warn('Could not update dynamic app icon:', err);
  }
};
