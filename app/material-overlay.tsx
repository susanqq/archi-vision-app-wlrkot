
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function MaterialOverlayScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('flooring');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      setGeneratedImage(null);
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const handleGenerate = () => {
    if (!uploadedImage) {
      Alert.alert('No Image', 'Please upload an image first');
      return;
    }
    if (!selectedMaterial) {
      Alert.alert('No Material', 'Please select a material first');
      return;
    }

    setIsGenerating(true);
    console.log('Generating with material:', selectedMaterial);

    // Simulate generation process
    setTimeout(() => {
      setGeneratedImage(uploadedImage); // In real app, this would be the AI-generated result
      setIsGenerating(false);
      Alert.alert('Success', 'Material overlay generated successfully!');
    }, 2000);
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

          {uploadedImage && (
            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>Uploaded Image</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: uploadedImage }} style={styles.image} resizeMode="cover" />
              </View>
            </View>
          )}

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
                    setSelectedMaterial(null);
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
                    setSelectedMaterial(material.id);
                    console.log('Material selected:', material.id);
                  }}
                  style={({ pressed }) => [
                    styles.materialCard,
                    selectedMaterial === material.id && styles.materialCardSelected,
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
                    {selectedMaterial === material.id && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol name="checkmark.circle.fill" color="#34C759" size={20} />
                      </View>
                    )}
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          {uploadedImage && selectedMaterial && (
            <Pressable
              onPress={handleGenerate}
              disabled={isGenerating}
              style={({ pressed }) => [
                styles.generateButton,
                pressed && !isGenerating && styles.generateButtonPressed,
                isGenerating && styles.generateButtonDisabled
              ]}
            >
              <GlassView 
                style={[
                  styles.generateButtonInner,
                  Platform.OS !== 'ios' && { backgroundColor: 'rgba(52, 199, 89, 0.95)' }
                ]}
                glassEffectStyle="regular"
              >
                {isGenerating ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.generateButtonText}>Generating...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol name="wand.and.stars" color="white" size={24} />
                    <Text style={styles.generateButtonText}>Generate Result</Text>
                  </>
                )}
              </GlassView>
            </Pressable>
          )}

          {generatedImage && (
            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>Generated Result</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: generatedImage }} style={styles.image} resizeMode="cover" />
                <View style={styles.resultBadge}>
                  <IconSymbol name="checkmark.circle.fill" color="white" size={20} />
                  <Text style={styles.resultBadgeText}>Generated</Text>
                </View>
              </View>
            </View>
          )}

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
                  Upload a photo, select a material category, choose a material, then tap Generate to see how it looks in your space
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
  imageSection: {
    marginBottom: 32,
  },
  imageSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.textSecondary,
    opacity: 0.1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
  },
  resultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  resultBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  materialCardSelected: {
    borderWidth: 3,
    borderColor: '#34C759',
  },
  materialCardInner: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
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
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  generateButtonPressed: {
    opacity: 0.8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#34C759',
    borderRadius: 16,
    gap: 12,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
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
