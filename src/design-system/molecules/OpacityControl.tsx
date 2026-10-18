
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {designTokens} from '../tokens/generated';

export const OPACITY_PRESETS = [25, 50, 100] as const;

export type OpacityPreset = (typeof OPACITY_PRESETS)[number];

interface OpacityControlProps {
  value: OpacityPreset;
  onChange: (value: OpacityPreset) => void;
  disabled?: boolean;
  testID?: string;
}

const tokens = designTokens;
const capture = tokens.workflow.repeatable.capture;

export function OpacityControl({
  value,
  onChange,
  disabled = false,
  testID = 'opacity-control',
}: OpacityControlProps) {
  return (
    <View
      testID={testID}
      style={styles.container}
      accessibilityLabel="Reference opacity controls">
      <View style={styles.header}>
        <Text style={styles.heading}>REFERENCE OPACITY</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>

      <View style={styles.options}>
        {OPACITY_PRESETS.map(preset => {
          const selected = preset === value;

          return (
            <Pressable
              key={preset}
              testID={`opacity-preset-${preset}`}
              accessibilityRole="button"
              accessibilityLabel={`Set reference opacity to ${preset}%`}
              accessibilityState={{
                selected,
                disabled,
              }}
              disabled={disabled}
              onPress={() => onChange(preset)}
              style={({pressed}) => [
                styles.option,
                selected ? styles.selected : styles.unselected,
                pressed && styles.pressed,
                disabled && styles.disabled,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  selected
                    ? styles.selectedText
                    : styles.unselectedText,
                ]}>
                {preset}%
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: capture.scrim,
    borderColor: capture.hairline,
    borderWidth: 1,
    borderRadius: tokens.dimensions.radius.xl,
    padding: tokens.dimensions.spacing.md,
    gap: tokens.dimensions.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: capture['foreground-muted'],
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: capture.foreground,
  },
  options: {
    flexDirection: 'row',
    gap: tokens.dimensions.spacing.sm,
  },
  option: {
    flex: 1,
    minHeight: tokens.dimensions.size.touch,
    borderRadius: tokens.dimensions.radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: capture.foreground,
    borderColor: capture.accent,
  },
  unselected: {
    backgroundColor: 'transparent',
    borderColor: capture.hairline,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    color: capture.accent,
  },
  unselectedText: {
    color: capture.foreground,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
