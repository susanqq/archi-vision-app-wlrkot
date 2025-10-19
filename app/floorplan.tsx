
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors } from '@/styles/commonStyles';

export default function FloorplanScreen() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

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

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={() => {
              console.log('Create blank floor plan');
              Alert.alert('Coming Soon', 'Blank floor plan creation will be available soon!');
            }}
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed
            ]}
          >
            <GlassView 
              style={[
                styles.createButtonInner,
                Platform.OS !== 'ios' && { backgroundColor: 'rgba(175, 82, 222, 0.95)' }
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="plus.circle.fill" color="white" size={24} />
              <Text style={styles.createButtonText}>Create Blank Floor Plan</Text>
            </GlassView>
          </Pressable>

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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary,
    opacity: 0.2,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  createButtonPressed: {
    opacity: 0.8,
  },
  createButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#AF52DE',
    borderRadius: 16,
    gap: 12,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
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
