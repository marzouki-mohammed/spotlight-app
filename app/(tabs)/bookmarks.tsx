import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

// Définition du type pour un post sauvegardé
interface SavedPost {
  id: string;
  image: any; // Using any for require() image type
}

// Images de test pour la démo
const savedPosts: SavedPost[] = [
  { id: '1', image: require('../../assets/images/waterfall.jpg') },
  { id: '2', image: require('../../assets/images/waterfall.jpg') },
  { id: '3', image: require('../../assets/images/waterfall.jpg') },
  { id: '4', image: require('../../assets/images/waterfall.jpg') },
];

// Calcul pour la grille
const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns;

export default function Bookmarks() {
  const renderItem = ({ item, index }: { item: SavedPost; index: number }) => (
    <View style={[
      styles.imageContainer,
      // Ajoute une marge à droite pour les éléments de gauche
      index % 2 === 0 && styles.leftItem
    ]}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarks</Text>
      <FlatList
        data={savedPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
    fontFamily: 'JetBrainsMono-Medium',
  },
  gridContainer: {
    paddingBottom: 16,
  },
  imageContainer: {
    width: tileSize - 20, // -20 pour l'espacement
    height: tileSize - 20,
    marginBottom: 16,
  },
  leftItem: {
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
