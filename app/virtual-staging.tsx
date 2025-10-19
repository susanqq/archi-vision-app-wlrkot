
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function VirtualStagingScreen() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

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
    if (!selectedStyle) {
      Alert.alert('No Style', 'Please select a staging style first');
      return;
    }

    setIsGenerating(true);
    console.log('Generating with style:', selectedStyle);

    // Simulate generation process
    setTimeout(() => {
      setGeneratedImage(uploadedImage); // In real app, this would be the AI-generated result
      setIsGenerating(false);
      Alert.alert('Success', 'Virtual staging generated successfully!');
    }, 2000);
  };

  const stagingStyles = [
    {
      id: 'modern',
      title: 'Modern',
      description: 'Clean lines and minimalist design',
      icon: 'square.fill',
      color: colors.text,
    },
    {
      id: 'traditional',
      title: 'Traditional',
      description: 'Classic and timeless style',
      icon: 'house.fill',
      color: '#8B4513',
    },
    {
      id: 'contemporary',
      title: 'Contemporary',
      description: 'Current trends and styles',
      icon: 'sparkles',
      color: colors.primary,
    },
    {
      id: 'industrial',
      title: 'Industrial',
      description: 'Urban and raw aesthetic',
      icon: 'building.2.fill',
      color: colors.textSecondary,
    },
    {
      id: 'scandinavian',
      title: 'Scandinavian',
      description: 'Light, airy, and functional',
      icon: 'snow',
      color: colors.secondary,
    },
    {
      id: 'bohemian',
      title: 'Bohemian',
      description: 'Eclectic and artistic',
      icon: 'paintbrush.fill',
      color: '#FF2D55',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Virtual Staging',
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
              <IconSymbol name="sofa.fill" color={colors.accent} size={40} />
            </View>
            <Text style={styles.headerTitle}>Virtual Staging</Text>
            <Text style={styles.headerDescription}>
              Transform empty spaces into beautifully furnished rooms
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
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(255, 149, 0, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="photo.fill" color="white" size={24} />
              <Text style={styles.uploadButtonText}>Upload Room Photo</Text>
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
            <Text style={styles.sectionTitle}>Choose a Style</Text>
            <Text style={styles.sectionDescription}>
              Select a design style to virtually stage your space
            </Text>
            <View style={styles.stylesGrid}>
              {stagingStyles.map((style) => (
                <Pressable
                  key={style.id}
                  onPress={() => {
                    setSelectedStyle(style.id);
                    console.log('Style selected:', style.id);
                  }}
                  style={({ pressed }) => [
                    styles.styleCard,
                    selectedStyle === style.id && styles.styleCardSelected,
                    pressed && styles.styleCardPressed
                  ]}
                >
                  <GlassView 
                    style={[
                      styles.styleCardInner,
                      Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                    ]}
                    glassEffectStyle="regular"
                  >
                    <View style={[styles.styleIcon, { backgroundColor: style.color }]}>
                      <IconSymbol name={style.icon as any} color="white" size={24} />
                    </View>
                    <Text style={styles.styleTitle}>{style.title}</Text>
                    <Text style={styles.styleDescription}>{style.description}</Text>
                    {selectedStyle === style.id && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol name="checkmark.circle.fill" color="#34C759" size={20} />
                      </View>
                    )}
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          {uploadedImage && selectedStyle && (
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
              <Text style={styles.infoText}>
                Virtual staging helps sell properties faster by showing potential buyers how spaces can look when furnished
              </Text>
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
    backgroundColor: '#FFF3E0',
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
    backgroundColor: colors.accent,
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  styleCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  styleCardPressed: {
    opacity: 0.7,
  },
  styleCardSelected: {
    borderWidth: 3,
    borderColor: '#34C759',
  },
  styleCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
    position: 'relative',
  },
  styleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  styleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  styleDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
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
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
