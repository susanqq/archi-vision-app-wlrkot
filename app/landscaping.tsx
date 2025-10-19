
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function LandscapingScreen() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
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
    if (!selectedFeature) {
      Alert.alert('No Feature', 'Please select a landscape feature first');
      return;
    }

    setIsGenerating(true);
    console.log('Generating with feature:', selectedFeature);

    // Simulate generation process
    setTimeout(() => {
      setGeneratedImage(uploadedImage); // In real app, this would be the AI-generated result
      setIsGenerating(false);
      Alert.alert('Success', 'Landscaping design generated successfully!');
    }, 2000);
  };

  const landscapeFeatures = [
    {
      id: 'plants',
      title: 'Plants & Trees',
      description: 'Add greenery and vegetation',
      icon: 'leaf.fill',
      color: '#34C759',
    },
    {
      id: 'hardscape',
      title: 'Hardscaping',
      description: 'Paths, patios, and structures',
      icon: 'square.grid.3x3.fill',
      color: colors.textSecondary,
    },
    {
      id: 'water',
      title: 'Water Features',
      description: 'Fountains, pools, and ponds',
      icon: 'drop.fill',
      color: colors.secondary,
    },
    {
      id: 'lighting',
      title: 'Outdoor Lighting',
      description: 'Illuminate your landscape',
      icon: 'lightbulb.fill',
      color: colors.accent,
    },
    {
      id: 'lawn',
      title: 'Lawn & Turf',
      description: 'Design grass and ground cover',
      icon: 'square.fill',
      color: '#8BC34A',
    },
    {
      id: 'garden',
      title: 'Garden Beds',
      description: 'Create beautiful flower beds',
      icon: 'sparkles',
      color: '#FF2D55',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Landscaping',
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
              <IconSymbol name="leaf.fill" color="#34C759" size={40} />
            </View>
            <Text style={styles.headerTitle}>Design Your Outdoor Space</Text>
            <Text style={styles.headerDescription}>
              Create stunning landscapes with professional design tools
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
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(52, 199, 89, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="photo.fill" color="white" size={24} />
              <Text style={styles.uploadButtonText}>Upload Yard Photo</Text>
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
            <Text style={styles.sectionTitle}>Landscape Elements</Text>
            <View style={styles.featuresGrid}>
              {landscapeFeatures.map((feature) => (
                <Pressable
                  key={feature.id}
                  onPress={() => {
                    setSelectedFeature(feature.id);
                    console.log('Feature selected:', feature.id);
                  }}
                  style={({ pressed }) => [
                    styles.featureCard,
                    selectedFeature === feature.id && styles.featureCardSelected,
                    pressed && styles.featureCardPressed
                  ]}
                >
                  <GlassView 
                    style={[
                      styles.featureCardInner,
                      Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                    ]}
                    glassEffectStyle="regular"
                  >
                    <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                      <IconSymbol name={feature.icon as any} color="white" size={24} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                    {selectedFeature === feature.id && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol name="checkmark.circle.fill" color="#34C759" size={20} />
                      </View>
                    )}
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          {uploadedImage && selectedFeature && (
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
    backgroundColor: '#E8F5E9',
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
    backgroundColor: '#34C759',
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
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureCardPressed: {
    opacity: 0.7,
  },
  featureCardSelected: {
    borderWidth: 3,
    borderColor: '#34C759',
  },
  featureCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
    position: 'relative',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
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
});
