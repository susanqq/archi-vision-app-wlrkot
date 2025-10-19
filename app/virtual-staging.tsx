
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

export default function VirtualStagingScreen() {
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
                    console.log('Style selected:', style.id);
                    Alert.alert('Coming Soon', `${style.title} staging will be available soon!`);
                  }}
                  style={({ pressed }) => [
                    styles.styleCard,
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
  styleCardInner: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
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
