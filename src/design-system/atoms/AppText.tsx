
import React from 'react';
import {
  Text,
  StyleSheet,
  type TextProps,
  type TextStyle,
} from 'react-native';
import {repeatableTheme as theme} from '../theme/repeatableTheme';

type TextVariant = 'title' | 'body' | 'caption';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  muted?: boolean;
}

const variants: Record<TextVariant, TextStyle> = {
  title: {
    fontSize: theme.typography.title,
    fontWeight: '600',
    lineHeight: 36,
  },
  body: {
    fontSize: theme.typography.body,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: theme.typography.caption,
    fontWeight: '400',
    lineHeight: 18,
  },
};

export function AppText({
  variant = 'body',
  muted = false,
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        variants[variant],
        muted && styles.muted,
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.color.text,
  },
  muted: {
    color: theme.color.muted,
  },
});
