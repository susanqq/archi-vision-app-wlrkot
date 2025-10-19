
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function FloorplanScreen() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

    setIsGenerating(true);
    console.log('Generating floor plan');

    // Simulate generation process
    setTimeout(() => {
      setGeneratedImage(uploadedImage); // In real app, this would be the AI-generated result
      setIsGenerating(false);
      Alert.alert('Success', 'Floor plan generated successfully!');
    }, 2000);
  };

  const drawingTools = [
    {
      id: 'wall',
      title: 'Draw Walls',
      icon: 'square.fill',
      color: colors.text,
    },
    {
      id: 'door',
      title: 'Add Door',
      icon: 'door.left.hand.open',
      color: colors.primary,
    },
    {
      id: 'window',
      title: 'Add Window',
      icon: 'square.grid.2x2.fill',
      color: colors.secondary,
    },
    {
      id: 'furniture',
      title: 'Furniture',
      icon: 'sofa.fill',
      color: colors.accent,
    },
  ];

  const templates = [
    {
      id: 'studio',
      title: 'Studio',
      description: 'Open concept living',
      rooms: '1 Room',
    },
    {
      id: '1bed',
      title: '1 Bedroom',
      description: 'Cozy apartment layout',
      rooms: '2 Rooms',
    },
    {
      id: '2bed',
      title: '2 Bedroom',
      description: 'Family-friendly design',
      rooms: '3 Rooms',
    },
    {
      id: '3bed',
      title: '3 Bedroom',
      description: 'Spacious home layout',
      rooms: '4+ Rooms',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Floor Plan',
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
              <IconSymbol name="square.grid.3x3" color="#AF52DE" size={40} />
            </View>
            <Text style={styles.headerTitle}>Create Floor Plans</Text>
            <Text style={styles.headerDescription}>
              Design professional floor plans with easy-to-use tools
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
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(175, 82, 222, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="photo.fill" color="white" size={24} />
              <Text style={styles.uploadButtonText}>Upload Floor Plan Sketch</Text>
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

          {uploadedImage && (
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
                    <Text style={styles.generateButtonText}>Generate Floor Plan</Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start from Template</Text>
            <Text style={styles.sectionDescription}>
              Choose a template to get started quickly
            </Text>
            <View style={styles.templatesGrid}>
              {templates.map((template) => (
                <Pressable
                  key={template.id}
                  onPress={() => {
                    console.log('Template selected:', template.id);
                    Alert.alert('Coming Soon', `${template.title} template will be available soon!`);
                  }}
                  style={({ pressed }) => [
                    styles.templateCard,
                    pressed && styles.templateCardPressed
                  ]}
                >
                  <GlassView 
                    style={[
                      styles.templateCardInner,
                      Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                    ]}
                    glassEffectStyle="regular"
                  >
                    <Text style={styles.templateTitle}>{template.title}</Text>
                    <Text style={styles.templateDescription}>{template.description}</Text>
                    <View style={styles.templateBadge}>
                      <Text style={styles.templateBadgeText}>{template.rooms}</Text>
                    </View>
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drawing Tools</Text>
            <View style={styles.toolsGrid}>
              {drawingTools.map((tool) => (
                <Pressable
                  key={tool.id}
                  onPress={() => {
                    setSelectedTool(tool.id);
                    console.log('Tool selected:', tool.id);
                  }}
                  style={({ pressed }) => [
                    styles.toolCard,
                    selectedTool === tool.id && styles.toolCardSelected,
                    pressed && styles.toolCardPressed
                  ]}
                >
                  <GlassView 
                    style={[
                      styles.toolCardInner,
                      Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                    ]}
                    glassEffectStyle="regular"
                  >
                    <View style={[styles.toolIcon, { backgroundColor: tool.color }]}>
                      <IconSymbol name={tool.icon as any} color="white" size={24} />
                    </View>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                  </GlassView>
                </Pressable>
              ))}
            </View>
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
    backgroundColor: '#F3E5F5',
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
    backgroundColor: '#AF52DE',
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
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  templateCardPressed: {
    opacity: 0.7,
  },
  templateCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  templateBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  templateBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  toolCardPressed: {
    opacity: 0.7,
  },
  toolCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  toolCardInner: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
