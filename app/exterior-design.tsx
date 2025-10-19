
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function ExteriorDesignScreen() {
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const designFeatures = [
    {
      id: 'siding',
      title: 'Siding & Paint',
      description: 'Change exterior colors and materials',
      icon: 'paintbrush.fill',
      color: colors.primary,
    },
    {
      id: 'roofing',
      title: 'Roofing',
      description: 'Visualize different roof styles',
      icon: 'house.fill',
      color: colors.secondary,
    },
    {
      id: 'windows',
      title: 'Windows & Doors',
      description: 'Update windows and entry doors',
      icon: 'door.left.hand.open',
      color: colors.accent,
    },
    {
      id: 'outdoor',
      title: 'Outdoor Features',
      description: 'Add decks, patios, and more',
      icon: 'square.grid.3x3.fill',
      color: '#34C759',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Exterior Design',
          headerBackTitle: 'Back',
          presentation: 'card',
        }}
      />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <IconSymbol name="building.2.fill" color={colors.secondary} size={48} />
            </View>
            <Text style={styles.heroTitle}>Transform Your Home&apos;s Exterior</Text>
            <Text style={styles.heroDescription}>
              Visualize changes to your home&apos;s exterior before making any commitments
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
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(0, 122, 255, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="photo.fill" color="white" size={24} />
              <Text style={styles.uploadButtonText}>Upload Exterior Photo</Text>
            </GlassView>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Design Features</Text>
            <View style={styles.featuresGrid}>
              {designFeatures.map((feature) => (
                <Pressable
                  key={feature.id}
                  onPress={() => {
                    console.log('Feature selected:', feature.id);
                    Alert.alert('Coming Soon', `${feature.title} feature will be available soon!`);
                  }}
                  style={({ pressed }) => [
                    styles.featureCard,
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDescription: {
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
    backgroundColor: colors.primary,
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
  featureCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
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
});
