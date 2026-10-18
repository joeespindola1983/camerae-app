
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {designTokens} from '../tokens/generated';
import {repeatableTheme as theme} from '../theme/repeatableTheme';

export type ActionButtonVariant = 'primary' | 'secondary';

interface ActionButtonProps {
  label: string;
  variant?: ActionButtonVariant;
  onPress: PressableProps['onPress'];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ActionButton({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  style,
  testID,
}: ActionButtonProps) {
  const primary = variant === 'primary';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          primary ? styles.primaryLabel : styles.secondaryLabel,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  primary: {
    backgroundColor: designTokens.primitives.orange[500],
    borderColor: designTokens.primitives.orange[500],
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: designTokens.primitives.orange[500],
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  primaryLabel: {
    color: theme.color.onAccent,
  },
  secondaryLabel: {
    color: designTokens.primitives.orange[500],
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
});
