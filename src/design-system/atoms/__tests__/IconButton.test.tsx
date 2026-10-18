
import React from 'react';
import {Text} from 'react-native';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';

import {IconButton} from '../IconButton';

describe('IconButton', () => {
  it('provides an accessible label and handles press events', async () => {
    const onPress = jest.fn();

    await render(
      <IconButton
        icon={<Text>+</Text>}
        accessibilityLabel="Add project"
        onPress={onPress}
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Add project',
    });

    expect(button).toBeOnTheScreen();
    expect(button).toBeEnabled();

    await fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction when disabled', async () => {
    const onPress = jest.fn();

    await render(
      <IconButton
        icon={<Text>+</Text>}
        accessibilityLabel="Add project"
        onPress={onPress}
        disabled
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Add project',
    });

    expect(button).toBeDisabled();

    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
  });
});
