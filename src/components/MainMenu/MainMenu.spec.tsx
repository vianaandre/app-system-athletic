import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { MainMenu } from '.';

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        MaterialIcons: ({ name }: { name: string }) => <Text>{`MockedIcon: ${name}`}</Text>,
    };
});

describe('MainMenu', () => {
    it('renders button texts', () => {
        const { getByText } = render(
            <MainMenu
                labelMenuSports="Esportes"
                labelMenuInfo="Informações"
                handleClickAdd={jest.fn()}
                handleClickMenu={jest.fn()}
            />
        );

        expect(getByText('Esportes')).toBeTruthy();
        expect(getByText('MockedIcon: add-circle-outline')).toBeTruthy();
    });

    it('triggers handleClickMenu when clicking menu button', () => {
        const mockMenu = jest.fn();

        const { getByText } = render(
            <MainMenu
                labelMenuSports="Esportes"
                labelMenuInfo="Informações"
                handleClickAdd={jest.fn()}
                handleClickMenu={mockMenu}
            />
        );

        const btn = getByText('Esportes');
        fireEvent.press(btn);

        expect(mockMenu).toHaveBeenCalled();
    });

    it('triggers handleClickAdd when clicking add button', () => {
        const mockAdd = jest.fn();

        const { getByText } = render(
            <MainMenu
                labelMenuSports="Esportes"
                labelMenuInfo="Informações"
                handleClickAdd={mockAdd}
                handleClickMenu={jest.fn()}
            />
        );

        const icon = getByText('MockedIcon: add-circle-outline');
        fireEvent.press(icon);

        expect(mockAdd).toHaveBeenCalled();
    });
});