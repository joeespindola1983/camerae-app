
import React from 'react';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';

import {
  OpacityControl,
  OPACITY_PRESETS,
} from '../OpacityControl';

describe('OpacityControl', () => {
  it('provides the three opacity presets defined in Figma', async () => {
    const onChange = jest.fn();

    await render(
      <OpacityControl value={50} onChange={onChange} />,
    );

    expect(OPACITY_PRESETS).toEqual([25, 50, 100]);

    for (const preset of OPACITY_PRESETS) {
      expect(
        screen.getByRole('button', {
          name: `Set reference opacity to ${preset}%`,
        }),
      ).toBeOnTheScreen();
    }
  });

  it('indicates which opacity preset is selected', async () => {
    await render(
      <OpacityControl value={50} onChange={jest.fn()} />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Set reference opacity to 50%',
      }).props.accessibilityState.selected,
    ).toBe(true);

    expect(
      screen.getByRole('button', {
        name: 'Set reference opacity to 25%',
      }).props.accessibilityState.selected,
    ).toBe(false);
  });

  it('notifies the parent when a new preset is pressed', async () => {
    const onChange = jest.fn();

    await render(
      <OpacityControl value={50} onChange={onChange} />,
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Set reference opacity to 25%',
      }),
    );

    expect(onChange).toHaveBeenCalledWith(25);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('prevents changes when disabled', async () => {
    const onChange = jest.fn();

    await render(
      <OpacityControl
        value={50}
        onChange={onChange}
        disabled
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Set reference opacity to 100%',
    });

    expect(button).toBeDisabled();

    await fireEvent.press(button);

    expect(onChange).not.toHaveBeenCalled();
  });
});
