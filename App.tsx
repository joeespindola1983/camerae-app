
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { AppText } from './src/design-system/atoms/AppText';
import { ActionButton } from './src/design-system/atoms/ActionButton';
import { IconButton } from './src/design-system/atoms/IconButton';
import { repeatableTheme as theme } from './src/design-system/theme/repeatableTheme';
import {
  OpacityControl,
  type OpacityPreset,
} from './src/design-system/molecules/OpacityControl';

function DesignSystemPreview() {
  const [referenceSelected, setReferenceSelected] = useState(false);
  const [referenceOpacity, setReferenceOpacity] =
    useState<OpacityPreset>(50);

  const handleNewCapture = () => {
    Alert.alert(
      'New Capture',
      'Camera integration is coming soon.',
    );
  };

  const handleSelectReference = () => {
    setReferenceSelected(true);
  };

  const handleAddProject = () => {
    Alert.alert(
      'New Project',
      'Project creation is coming soon.',
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <AppText variant="caption" muted>
          CAMERAE / DESIGN SYSTEM
        </AppText>

        <AppText variant="title">
          Capture Time.
        </AppText>

        <AppText muted>
          Recreate your photographs with precision using
          a previous image as reference.
        </AppText>

        <View style={styles.card}>
          <AppText variant="caption" muted>
            REPEATABLE PHOTOGRAPHY
          </AppText>


          <View style={styles.placeholder}>
            <View style={styles.referencePreview}>
              <View style={styles.cameraBackground}>
                <Text style={styles.previewSymbol}>◎</Text>
                <AppText variant="caption">
                  Current camera frame
                </AppText>
              </View>

              {referenceSelected && (
                <View
                  testID="reference-overlay"
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    styles.referenceOverlay,
                    { opacity: referenceOpacity / 100 },
                  ]}>
                  <Text style={styles.overlaySymbol}>◎</Text>
                  <Text style={styles.overlayLabel}>
                    Reference image
                  </Text>
                </View>
              )}
            </View>

            <AppText variant="caption" muted>
              {referenceSelected
                ? `Reference opacity: ${referenceOpacity}%`
                : 'No reference selected'}
            </AppText>
          </View>

          {referenceSelected && (
            <OpacityControl
              value={referenceOpacity}
              onChange={setReferenceOpacity}
            />
          )}


          <ActionButton
            testID="new-capture-button"
            label="New Capture"
            variant="primary"
            onPress={handleNewCapture}
          />

          <ActionButton
            testID="select-reference-button"
            label="Use Reference"
            variant="secondary"
            onPress={handleSelectReference}
          />
        </View>

        <View style={styles.toolbar}>
          <AppText variant="caption" muted>
            CONTROLS
          </AppText>

          <IconButton
            icon={<Text style={styles.icon}>+</Text>}
            accessibilityLabel="Add project"
            onPress={handleAddProject}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />

      <DesignSystemPreview />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
  },

  content: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.xl,
    borderColor: theme.color.border,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },

  placeholder: {
    height: 220,
    backgroundColor: theme.color.background,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },

  cameraSymbol: {
    fontSize: 52,
    color: theme.color.accent,
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },

  icon: {
    color: theme.color.text,
    fontSize: 24,
  },


  referencePreview: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    borderRadius: theme.radius.md,
  },
  cameraBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.color.background,
  },
  referenceOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.accent,
  },
  previewSymbol: {
    fontSize: 48,
    color: theme.color.accent,
  },
  overlaySymbol: {
    fontSize: 64,
    color: theme.color.onAccent,
  },
  overlayLabel: {
    fontSize: 14,
    color: theme.color.onAccent,
    fontWeight: '600',
  },

});

export default App;
