
import React from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';
import {designTokens} from '../tokens/generated';

interface IconButtonProps {
  icon: React.ReactNode;
  accessibilityLabel: string;
  onPress: PressableProps['onPress'];
  disabled?: boolean;
  testID?: string;
}

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  disabled = false,
  testID,
}: IconButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: designTokens.dimensions.size.touch,
    height: designTokens.dimensions.size.touch,
    borderRadius: designTokens.dimensions.radius.full,
    backgroundColor: designTokens.primitives.white[70],
    borderColor: designTokens.primitives.white[180],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: designTokens.primitives.white[180],
  },
  disabled: {
    opacity: 0.4,
  },
});
