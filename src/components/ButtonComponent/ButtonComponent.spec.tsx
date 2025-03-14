import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        MaterialIcons: ({ name }: { name: string }) => {
            return <Text>{`MockedIcon: ${name}`}</Text>;
        },
    };
});

import {
    PrimaryButton,
    AddButton,
    ReturnButton,
    RemoveButton,
    EditButton,
    AddSportsButton,
    DownloadButton,
} from '.';

describe('Buttons', () => {
    it('PrimaryButton renders text and triggers click', () => {
        const mockFn = jest.fn();
        const { getByText } = render(<PrimaryButton label="Salvar" handleClick={mockFn} />);
        const button = getByText('Salvar');

        fireEvent.press(button);
        expect(mockFn).toHaveBeenCalled();
    });

    it('AddButton renders text and triggers click', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(<AddButton label="Adicionar" handleClick={mockFn} />);
        
        const button = getByTestId('add-button');
        fireEvent.press(button);
        
        expect(mockFn).toHaveBeenCalled();
    });

    it('ReturnButton renders text and triggers click', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(
            <ReturnButton label="Voltar" handleClick={mockFn} />
        );

        const button = getByTestId('return-button');
        fireEvent.press(button);

        expect(mockFn).toHaveBeenCalled();
    });

    it('DownloadButton renders text and triggers click', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(
            <DownloadButton label="Download" handleClick={mockFn} />
        );

        const button = getByTestId('download-button');
        fireEvent.press(button);
    });

    it('RemoveButton triggers click', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(<RemoveButton handleClick={mockFn} />);
        const button = getByTestId('remove-button');

        fireEvent.press(button);
        expect(mockFn).toHaveBeenCalled();
    });

    it('EditButton triggers click', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(<EditButton handleClick={mockFn} />);
        const button = getByTestId('edit-button');

        fireEvent.press(button);
        expect(mockFn).toHaveBeenCalled();
    });

    it('AddSportsButton triggers click', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(<AddSportsButton handleClick={mockFn} />);
        const button = getByTestId('add-sports-button');

        fireEvent.press(button);
        expect(mockFn).toHaveBeenCalled();
    });
});