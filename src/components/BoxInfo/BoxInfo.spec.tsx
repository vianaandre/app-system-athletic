import React from 'react';
import { render } from '@testing-library/react-native';
import { BoxInfo } from '.';

describe('BoxInfo', () => {
    it('correctly renders the component', () => {
        const { getByTestId } = render(<BoxInfo text="Informação de teste" />);
        expect(getByTestId('container-info')).toBeTruthy();
    });

    it('displays the text passed by props', () => {
        const { getByText } = render(<BoxInfo text="Texto informativo" />);
        expect(getByText('Texto informativo')).toBeTruthy();
    });

    it('renders the icon image', () => {
        const { getByTestId } = render(<BoxInfo text="Teste" />);
        expect(getByTestId('info-icon')).toBeTruthy();
    });
});