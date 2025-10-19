
import React from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const designModules = [
    {
      id: 'interior',
      title: "Interior Design",
      description: "Transform indoor spaces with style",
      icon: "house.fill",
      color: colors.primary,
      route: "/interior-design",
    },
    {
      id: 'exterior',
      title: "Exterior Design",
      description: "Enhance your home's curb appeal",
      icon: "building.2.fill",
      color: colors.secondary,
      route: "/exterior-design",
    },
    {
      id: 'landscaping',
      title: "Landscaping",
      description: "Design beautiful outdoor spaces",
      icon: "leaf.fill",
      color: "#34C759",
      route: "/landscaping",
    },
    {
      id: 'staging',
      title: "Virtual Staging",
      description: "Stage properties virtually",
      icon: "sofa.fill",
      color: colors.accent,
      route: "/virtual-staging",
    },
    {
      id: 'floorplan',
      title: "Floor Plan",
      description: "Create and edit floor plans",
      icon: "square.grid.3x3",
      color: "#AF52DE",
      route: "/floorplan",
    },
    {
      id: 'materials',
      title: "Material Overlay",
      description: "Visualize different materials",
      icon: "paintbrush.fill",
      color: "#FF2D55",
      route: "/material-overlay",
    }
  ];

  const renderDesignModule = (item: typeof designModules[0]) => (
    <Pressable
      key={item.id}
      onPress={() => router.push(item.route as any)}
      style={({ pressed }) => [
        styles.moduleCard,
        pressed && styles.moduleCardPressed
      ]}
    >
      <GlassView 
        style={[
          styles.moduleCardInner,
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.95)' }
        ]} 
        glassEffectStyle="regular"
      >
        <View style={[styles.moduleIcon, { backgroundColor: item.color }]}>
          <IconSymbol name={item.icon as any} color="white" size={32} />
        </View>
        <View style={styles.moduleContent}>
          <Text style={styles.moduleTitle}>{item.title}</Text>
          <Text style={styles.moduleDescription}>{item.description}</Text>
        </View>
        <IconSymbol name="chevron.right" color={colors.textSecondary} size={20} />
      </GlassView>
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Spatial Design Studio",
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appTitle}>Spatial Design Studio</Text>
            <Text style={styles.subtitle}>
              Professional design tools for homeowners, realtors, contractors, and designers
            </Text>
          </View>

          <View style={styles.modulesContainer}>
            {designModules.map(renderDesignModule)}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Select a module to get started
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  modulesContainer: {
    gap: 12,
  },
  moduleCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  moduleCardPressed: {
    opacity: 0.7,
  },
  moduleCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
