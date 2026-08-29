import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { MovieCard } from './MovieCard';

export const MovieRow = ({ title, movies, navigation }) => {
  const { themeMode, fontSizeScale } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  if (!movies || movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textPrimary, fontSize: 17 * fontSizeScale }]}>{title}</Text>
      <FlatList
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovieCard movie={item} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  title: {
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 10,
    letterSpacing: -0.3
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12
  }
});