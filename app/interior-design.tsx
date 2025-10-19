
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function InteriorDesignScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
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
      setSelectedImage(result.assets[0].uri);
      console.log('Photo taken:', result.assets[0].uri);
    }
  };

  const designTools = [
    {
      id: 'wall-color',
      title: 'Wall Colors',
      description: 'Change wall colors and textures',
      icon: 'paintbrush.fill',
      color: colors.primary,
    },
    {
      id: 'furniture',
      title: 'Furniture',
      description: 'Add and arrange furniture',
      icon: 'sofa.fill',
      color: colors.secondary,
    },
    {
      id: 'lighting',
      title: 'Lighting',
      description: 'Adjust lighting and fixtures',
      icon: 'lightbulb.fill',
      color: colors.accent,
    },
    {
      id: 'flooring',
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Design Tools</Text>
            <Text style={styles.sectionDescription}>
              Choose from our professional design tools
            </Text>

            <View style={styles.toolsGrid}>
              {designTools.map((tool) => (
                <Pressable
                  key={tool.id}
                  onPress={() => {
                    console.log('Tool selected:', tool.id);
                    Alert.alert('Coming Soon', `${tool.title} feature will be available soon!`);
                  }}
                  style={({ pressed }) => [
                    styles.toolCard,
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
  toolCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
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
});
