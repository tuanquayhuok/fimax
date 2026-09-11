import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { LANGUAGES } from '../locales/translations';

export const LanguageModal = ({ visible, onClose }) => {
  const { currentLanguage, setLanguage, themeMode, accentColor, t } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  return (
    <Modal
      visible={visible}
      transparent
      animationType=fade
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {/* Header */}
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <View style={styles.titleWrap}>
                  <View style={[styles.titleIconBadge, { backgroundColor: ${accentColor}20 }]}>
                    <Ionicons name=globe-outline size={20} color={accentColor} />
                  </View>
                  <View>
                    <Text style={[styles.titleText, { color: theme.textPrimary }]}>
                      {t('select_language')}
                    </Text>
                    <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
                      {t('language_desc')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name=close size={18} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Languages List */}
              <ScrollView
                style={styles.langList}
                contentContainerStyle={styles.langListContent}
                showsVerticalScrollIndicator={false}
              >
                {LANGUAGES.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.langItem,
                        {
                          backgroundColor: isSelected
                            ? ${accentColor}15
                            : theme.surfaceSecondary,
                          borderColor: isSelected ? accentColor : 'transparent'
                        }
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setLanguage(lang.code);
                        onClose();
                      }}
                    >
                      <View style={styles.langLeft}>
                        <View style={[styles.flagBadge, { backgroundColor: theme.surface }]}>
                          <Text style={styles.flagText}>{lang.flag}</Text>
                        </View>
                        <View style={styles.langInfo}>
                          <Text
                            style={[
                              styles.langName,
                              {
                                color: isSelected ? accentColor : theme.textPrimary,
                                fontWeight: isSelected ? '700' : '600'
                              }
                            ]}
                          >
                            {lang.name}
                          </Text>
                          <Text style={[styles.nativeName, { color: theme.textSecondary }]}>
                            {lang.nativeName}
                          </Text>
                        </View>
                      </View>

                      {isSelected ? (
                        <View style={[styles.checkBadge, { backgroundColor: accentColor }]}>
                          <Ionicons name=checkmark size={15} color=#FFFFFF />
                        </View>
                      ) : (
                        <View style={[styles.radioCircle, { borderColor: theme.border }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  titleIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700'
  },
  subtitleText: {
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  langList: {
    maxHeight: 380
  },
  langListContent: {
    padding: 16,
    gap: 10
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  flagBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  flagText: {
    fontSize: 22
  },
  langInfo: {
    justifyContent: 'center'
  },
  langName: {
    fontSize: 15
  },
  nativeName: {
    fontSize: 12,
    marginTop: 2
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2
  }
});
