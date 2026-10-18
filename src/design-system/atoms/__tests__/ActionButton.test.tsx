
import React from 'react';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';

import {ActionButton} from '../ActionButton';
import {designTokens} from '../../tokens/generated';

describe('ActionButton', () => {
  it('renders the secondary variant with the correct label and style', async () => {
    await render(
      <ActionButton
        label="Use reference"
        variant="secondary"
        onPress={jest.fn()}
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Use reference',
    });

    expect(button).toBeOnTheScreen();
    expect(button).toBeEnabled();
    expect(button).toHaveStyle({
      backgroundColor: 'transparent',
      borderColor: designTokens.primitives.orange[500],
    });
  });

  it('calls onPress when the primary button is pressed', async () => {
    const onPress = jest.fn();

    await render(
      <ActionButton
        label="Continue"
        onPress={onPress}
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Continue',
    });

    expect(button).toHaveStyle({
      backgroundColor: designTokens.primitives.orange[500],
    });

    await fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction when disabled', async () => {
    const onPress = jest.fn();

    await render(
      <ActionButton
        label="Continue"
        onPress={onPress}
        disabled
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Continue',
    });

    expect(button).toBeDisabled();

    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
  });
});
