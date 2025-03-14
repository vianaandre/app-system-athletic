import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { InputFormText, InputFormTextMask, InputFormTextMaskDatetime } from '.';

describe('InputFormText', () => {
    it('renders label and placeholder', () => {
        const { getByPlaceholderText, getByText } = render(
            <InputFormText label="Nome" placeholder="Digite seu nome" />
        );

        expect(getByText('Nome')).toBeTruthy();
        expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
    });

    it('triggers onChangeText when typing', () => {
        const mockFn = jest.fn();
        const { getByPlaceholderText } = render(
            <InputFormText placeholder="Digite" onChangeText={mockFn} />
        );

        const input = getByPlaceholderText('Digite');
        fireEvent.changeText(input, 'Andre');
        expect(mockFn).toHaveBeenCalledWith('Andre');
    });
});

describe('InputFormTextMask', () => {
    it('renders and triggers onChangeText', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(
            <InputFormTextMask label="Telefone" value="" onChangeText={mockFn} />
        );

        const input = getByTestId('input-mask');
        fireEvent.changeText(input, '(45) 99888-1122');
        expect(mockFn).toHaveBeenCalled();
    });
});

describe('InputFormTextMaskDatetime', () => {
    it('renders and triggers onChangeText', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(
            <InputFormTextMaskDatetime
                label="Data"
                value=""
                onChangeText={mockFn}
                placeholder="DD/MM/AAAA"
            />
        );

        const input = getByTestId('input-mask-datetime');
        fireEvent.changeText(input, '13/03/2025');

        expect(mockFn).toHaveBeenCalled();
        expect(mockFn.mock.calls[0][0]).toBe('13/03/2025');
    });
});