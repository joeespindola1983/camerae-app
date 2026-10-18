
import {designTokens} from '../tokens/generated';

const workflow = designTokens.workflow.repeatable;

export const repeatableTheme = {
  color: {
    background: workflow.theme.background,
    surface: workflow.theme.card,
    text: workflow.theme.text,
    muted: workflow.theme.muted,
    accent: workflow.theme.accent,
    onAccent: workflow.theme['on-accent'],
    border: workflow.theme.border,
    cameraForeground: workflow.capture.foreground,
  },
  spacing: designTokens.dimensions.spacing,
  radius: designTokens.dimensions.radius,
  size: designTokens.dimensions.size,
  typography: {
    body: 16,
    title: 28,
    caption: 13,
  },
} as const;
