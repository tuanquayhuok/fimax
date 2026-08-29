export const getThemeColors = (themeMode = 'dark') => {
  const isLight = themeMode === 'light';
  return {
    isLight,
    background: isLight ? '#F2F2F7' : '#000000',
    surface: isLight ? '#FFFFFF' : '#121214',
    surfaceSecondary: isLight ? '#E5E5EA' : '#1C1C1E',
    card: isLight ? '#FFFFFF' : '#121214',
    cardHover: isLight ? '#EBEBF0' : '#1F1F24',
    border: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    borderLight: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
    textPrimary: isLight ? '#000000' : '#FFFFFF',
    textSecondary: isLight ? '#636366' : '#8E8E93',
    textMuted: isLight ? '#8E8E93' : '#636366',
    inputBg: isLight ? '#E5E5EA' : '#121214',
    tabBarBg: isLight ? '#FFFFFF' : '#000000',
    tabBarBorder: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    headerBg: isLight ? 'rgba(242, 242, 247, 0.95)' : 'rgba(0, 0, 0, 0.92)'
  };
};

export const Colors = {
  background: '#000000',
  surface: '#121214',
  surfaceSecondary: '#1C1C1E',
  card: '#121214',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  primary: '#E50914',
  gold: '#D4AF37'
};