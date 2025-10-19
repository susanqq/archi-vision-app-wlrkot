
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';
import { useInteriorDesign, DesignTool } from '@/hooks/useInteriorDesign';

export default function InteriorDesignScreen() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<DesignTool | null>(null);
  
  const { generate, loading, error, data, reset } = useInteriorDesign();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      reset(); // Reset previous generation
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      reset(); // Reset previous generation
      console.log('Photo taken:', result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      Alert.alert('No Image', 'Please upload an image first');
      return;
    }
    if (!selectedTool) {
      Alert.alert('No Tool', 'Please select a design tool first');
      return;
    }

    console.log('Generating with tool:', selectedTool);

    const result = await generate({
      imageUri: uploadedImage,
      designTool: selectedTool,
    });

    if (result) {
      Alert.alert(
        'Success!', 
        `Interior design generated in ${(result.duration_ms / 1000).toFixed(1)}s`,
        [{ text: 'OK' }]
      );
    } else if (error) {
      Alert.alert(
        'Generation Failed', 
        error || 'An error occurred while generating the design. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const designTools = [
    {
      id: 'wall-color' as DesignTool,
      title: 'Wall Colors',
      description: 'Change wall colors and textures',
      icon: 'paintbrush.fill',
      color: colors.primary,
    },
    {
      id: 'furniture' as DesignTool,
      title: 'Furniture',
      description: 'Add and arrange furniture',
      icon: 'sofa.fill',
      color: colors.secondary,
    },
    {
      id: 'lighting' as DesignTool,
      title: 'Lighting',
      description: 'Adjust lighting and fixtures',
      icon: 'lightbulb.fill',
      color: colors.accent,
    },
    {
      id: 'flooring' as DesignTool,
      title: 'Flooring',
      description: 'Change floor materials',
      icon: 'square.grid.2x2.fill',
      color: '#34C759',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Interior Design',
          headerBackTitle: 'Back',
          presentation: 'card',
        }}
      />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get Started</Text>
            <Text style={styles.sectionDescription}>
              Upload a photo of your room or take a new one to begin designing
            </Text>

            <View style={styles.actionButtons}>
              <Pressable
                onPress={pickImage}
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]}
              >
                <GlassView 
                  style={[
                    styles.actionButtonInner,
                    Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                  ]}
                  glassEffectStyle="regular"
                >
                  <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="photo.fill" color="white" size={28} />
                  </View>
                  <Text style={styles.actionButtonText}>Upload Photo</Text>
                </GlassView>
              </Pressable>

              <Pressable
                onPress={takePhoto}
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed
                ]}
              >
                <GlassView 
                  style={[
                    styles.actionButtonInner,
                    Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
                  ]}
                  glassEffectStyle="regular"
                >
                  <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
                    <IconSymbol name="camera.fill" color="white" size={28} />
                  </View>
                  <Text style={styles.actionButtonText}>Take Photo</Text>
                </GlassView>
              </Pressable>
            </View>
          </View>

          {uploadedImage && (
            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>Uploaded Image</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: uploadedImage }} style={styles.image} resizeMode="cover" />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Design Tools</Text>
            <Text style={styles.sectionDescription}>
              Choose from our professional design tools powered by AI
            </Text>

            <View style={styles.toolsGrid}>
              {designTools.map((tool) => (
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
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                    {selectedTool === tool.id && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol name="checkmark.circle.fill" color="#34C759" size={20} />
                      </View>
                    )}
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" color="#FF3B30" size={24} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {uploadedImage && selectedTool && (
            <Pressable
              onPress={handleGenerate}
              disabled={loading}
              style={({ pressed }) => [
                styles.generateButton,
                pressed && !loading && styles.generateButtonPressed,
                loading && styles.generateButtonDisabled
              ]}
            >
              <GlassView 
                style={[
                  styles.generateButtonInner,
                  Platform.OS !== 'ios' && { backgroundColor: 'rgba(52, 199, 89, 0.95)' }
                ]}
                glassEffectStyle="regular"
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.generateButtonText}>Generating with AI...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol name="wand.and.stars" color="white" size={24} />
                    <Text style={styles.generateButtonText}>Generate with Gemini AI</Text>
                  </>
                )}
              </GlassView>
            </Pressable>
          )}

          {data && data.url && (
            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>AI Generated Result</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: data.url }} style={styles.image} resizeMode="cover" />
                <View style={styles.resultBadge}>
                  <IconSymbol name="checkmark.circle.fill" color="white" size={20} />
                  <Text style={styles.resultBadgeText}>Generated by Gemini AI</Text>
                </View>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultInfoText}>
                  Generated in {(data.duration_ms / 1000).toFixed(1)}s
                </Text>
                <Text style={styles.resultInfoText}>
                  Tool: {designTools.find(t => t.id === data.designTool)?.title}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <IconSymbol name="info.circle.fill" color={colors.primary} size={24} />
              <Text style={styles.infoText}>
                This feature uses Google&apos;s Gemini AI to transform your interior spaces. 
                Upload a photo, select a design tool, and let AI reimagine your room!
              </Text>
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
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonInner: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
    fontSize: 12,
    fontWeight: '600',
  },
  resultInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    gap: 4,
  },
  resultInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
    borderWidth: 3,
    borderColor: '#34C759',
  },
  toolCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
    position: 'relative',
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
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
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
