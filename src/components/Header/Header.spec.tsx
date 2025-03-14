import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Header } from '.';

jest.mock('../../hook/useAuth', () => ({
    useAuth: () => ({
        user: {
            logo: 'https://example.com/user.png',
        },
    }),
}));

describe('Header', () => {
    it('renders title and subtitle', () => {
        const { getByText } = render(
            <Header
                title="Bem-vindo"
                subtitle="Subtítulo aqui"
                handleClickDisconnect={jest.fn()}
            />
        );

        expect(getByText('Bem-vindo')).toBeTruthy();
        expect(getByText('Subtítulo aqui')).toBeTruthy();
    });

    it('calls handleClickEditUser when clicking the image', () => {
        const mockEdit = jest.fn();

        const { getByTestId } = render(
            <Header
                title="Olá"
                subtitle="Teste"
                handleClickDisconnect={jest.fn()}
                handleClickEditUser={mockEdit}
            />
        );

        const button = getByTestId('edit-user');
        fireEvent.press(button);

        expect(mockEdit).toHaveBeenCalled();
    });

    it('calls handleClickDisconnect when clicking "Desconectar"', () => {
        const mockDisconnect = jest.fn();

        const { getByText } = render(
            <Header
                title="Olá"
                subtitle="Teste"
                handleClickDisconnect={mockDisconnect}
            />
        );

        const btn = getByText('Desconectar');
        fireEvent.press(btn);

        expect(mockDisconnect).toHaveBeenCalled();
    });
}); 