import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { InputText, InputPassword } from '.';

describe('InputText', () => {
    it('renders label and placeholder', () => {
        const { getByText, getByPlaceholderText } = render(
            <InputText label="Nome" placeholder="Digite seu nome" />
        );

        expect(getByText('Nome')).toBeTruthy();
        expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
    });

    it('triggers onChangeText when typing', () => {
        const mockFn = jest.fn();

        const { getByPlaceholderText } = render(
            <InputText
                label="Email"
                placeholder="Digite seu email"
                onChangeText={mockFn}
            />
        );

        const input = getByPlaceholderText('Digite seu email');
        fireEvent.changeText(input, 'example@email.com');

        expect(mockFn).toHaveBeenCalledWith('example@email.com');
    });

    it('is disabled when `disabled` is true', () => {
        const { getByPlaceholderText } = render(
            <InputText
                label="Nome"
                placeholder="Nome completo"
                disabled
            />
        );

        const input = getByPlaceholderText('Nome completo');
        expect(input.props.editable).toBe(false);
    });
});

describe('InputPassword', () => {
    it('renders label and placeholder', () => {
        const { getByText, getByPlaceholderText } = render(
            <InputPassword
                label="Senha"
                placeholder="Digite sua senha"
            />
        );

        expect(getByText('Senha')).toBeTruthy();
        expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    });

    it('accepts typing with secureTextEntry', () => {
        const mockFn = jest.fn();

        const { getByPlaceholderText } = render(
            <InputPassword
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry
                onChangeText={mockFn}
            />
        );

        const input = getByPlaceholderText('Digite sua senha');
        fireEvent.changeText(input, '123456');

        expect(mockFn).toHaveBeenCalledWith('123456');
        expect(input.props.secureTextEntry).toBe(true);
    });
});