
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function MaterialOverlayScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('flooring');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const materialCategories = [
    {
      id: 'flooring',
      title: 'Flooring',
      icon: 'square.grid.2x2.fill',
      color: '#8B4513',
    },
    {
      id: 'walls',
      title: 'Walls',
      icon: 'square.fill',
      color: colors.primary,
    },
    {
      id: 'countertops',
      title: 'Countertops',
      icon: 'rectangle.fill',
      color: colors.textSecondary,
    },
    {
      id: 'cabinets',
      title: 'Cabinets',
      icon: 'square.stack.fill',
      color: '#5D4037',
    },
  ];

  const materials = {
    flooring: [
      { id: 'hardwood', name: 'Hardwood', color: '#8B4513' },
      { id: 'tile', name: 'Tile', color: '#D3D3D3' },
      { id: 'carpet', name: 'Carpet', color: '#C19A6B' },
      { id: 'laminate', name: 'Laminate', color: '#A0826D' },
      { id: 'vinyl', name: 'Vinyl', color: '#B8B8B8' },
      { id: 'stone', name: 'Stone', color: '#696969' },
    ],
    walls: [
      { id: 'paint-white', name: 'White Paint', color: '#FFFFFF' },
      { id: 'paint-beige', name: 'Beige Paint', color: '#F5F5DC' },
      { id: 'paint-gray', name: 'Gray Paint', color: '#808080' },
      { id: 'wallpaper', name: 'Wallpaper', color: '#E6E6FA' },
      { id: 'brick', name: 'Brick', color: '#B22222' },
      { id: 'wood-panel', name: 'Wood Panel', color: '#8B4513' },
    ],
    countertops: [
      { id: 'granite', name: 'Granite', color: '#2F4F4F' },
      { id: 'marble', name: 'Marble', color: '#F8F8FF' },
      { id: 'quartz', name: 'Quartz', color: '#E8E8E8' },
      { id: 'butcher-block', name: 'Butcher Block', color: '#D2691E' },
      { id: 'concrete', name: 'Concrete', color: '#808080' },
      { id: 'laminate', name: 'Laminate', color: '#C0C0C0' },
    ],
    cabinets: [
      { id: 'white', name: 'White', color: '#FFFFFF' },
      { id: 'espresso', name: 'Espresso', color: '#3E2723' },
      { id: 'oak', name: 'Oak', color: '#B8860B' },
      { id: 'maple', name: 'Maple', color: '#DEB887' },
      { id: 'cherry', name: 'Cherry', color: '#8B0000' },
      { id: 'gray', name: 'Gray', color: '#808080' },
    ],
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Material Overlay',
          headerBackTitle: 'Back',
          presentation: 'card',
        }}
      />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <IconSymbol name="paintbrush.fill" color="#FF2D55" size={40} />
            </View>
            <Text style={styles.headerTitle}>Material Overlay</Text>
            <Text style={styles.headerDescription}>
              Visualize different materials in your space before making decisions
            </Text>
          </View>

          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [
              styles.uploadButton,
              pressed && styles.uploadButtonPressed
            ]}
          >
            <GlassView 
              style={[
                styles.uploadButtonInner,
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(255, 45, 85, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="photo.fill" color="white" size={24} />
              <Text style={styles.uploadButtonText}>Upload Space Photo</Text>
            </GlassView>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {materialCategories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    console.log('Category selected:', category.id);
                  }}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipSelected,
                    pressed && styles.categoryChipPressed
                  ]}
                >
                  <GlassView 
                    style={[
                      styles.categoryChipInner,
                      selectedCategory === category.id && { backgroundColor: category.color },
                      Platform.OS !== 'ios' && selectedCategory !== category.id && { backgroundColor: 'rgba(255,255,255,0.95)' }
                    ]}
                    glassEffectStyle="regular"
                  >
                    <IconSymbol 
                      name={category.icon as any} 
                      color={selectedCategory === category.id ? 'white' : category.color} 
                      size={20} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category.id && styles.categoryChipTextSelected
                    ]}>
                      {category.title}
                    </Text>
                  </GlassView>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {materialCategories.find(c => c.id === selectedCategory)?.title} Materials
            </Text>
            <View style={styles.materialsGrid}>
              {materials[selectedCategory as keyof typeof materials]?.map((material) => (
                <Pressable
                  key={material.id}
                  onPress={() => {
                    console.log('Material selected:', material.id);
                    Alert.alert('Material Selected', `${material.name} will be applied to your image`);
                  }}
                  style={({ pressed }) => [
                    styles.materialCard,
                    pressed && styles.materialCardPressed
                  ]}
                >
                  <GlassView 
                    style={[
                      styles.materialCardInner,
                      Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                    ]}
                    glassEffectStyle="regular"
                  >
                    <View style={[styles.materialSwatch, { backgroundColor: material.color }]} />
                    <Text style={styles.materialName}>{material.name}</Text>
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.infoSection}>
            <GlassView 
              style={[
                styles.infoCard,
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(209, 232, 255, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="info.circle.fill" color={colors.primary} size={24} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>How it works</Text>
                <Text style={styles.infoText}>
                  Upload a photo, select a material category, then tap on any material to see how it looks in your space
                </Text>
              </View>
            </GlassView>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  headerDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  uploadButtonPressed: {
    opacity: 0.8,
  },
  uploadButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FF2D55',
    borderRadius: 16,
    gap: 12,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  categoriesScroll: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryChipPressed: {
    opacity: 0.7,
  },
  categoryChipSelected: {
    // Selected state handled by backgroundColor
  },
  categoryChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  categoryChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  categoryChipTextSelected: {
    color: 'white',
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  materialCard: {
    width: '31%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  materialCardPressed: {
    opacity: 0.7,
  },
  materialCardInner: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  materialSwatch: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    opacity: 0.3,
  },
  materialName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  infoSection: {
    marginTop: 16,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
