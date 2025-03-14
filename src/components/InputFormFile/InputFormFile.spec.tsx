import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { InputFormFile } from '.';

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
    },
}));

jest.mock('axios');
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

describe('InputFormFile', () => {
    it('renders label and button', () => {
        const { getByTestId } = render(
            <InputFormFile label="Foto" title="Selecionar" onChangeImage={jest.fn()} />
        );

        expect(getByTestId('label')).toBeTruthy();
        expect(getByTestId('button')).toBeTruthy(); 
    });

    it('selects image and uploads it', async () => {
        const mockOnChangeImage = jest.fn();

        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
            canceled: false,
            assets: [
                {
                    uri: 'file://mocked-image.jpg',
                    fileName: 'mocked.jpg',
                    type: 'image/jpeg',
                },
            ],
        });

        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: { url: 'https://example.com/uploaded.jpg' },
        });

        const { getByTestId } = render(
            <InputFormFile label="Foto" title="Selecionar" onChangeImage={mockOnChangeImage} />
        );

        fireEvent.press(getByTestId('button'));

        await waitFor(() => {
            expect(mockOnChangeImage).toHaveBeenCalledWith('https://example.com/uploaded.jpg');
        });
    });

    it('deletes image and calls onChangeImage(undefined)', async () => {
        const mockOnChangeImage = jest.fn();

        const { getByText } = render(
            <InputFormFile
                label="Foto"
                title="Selecionar"
                onChangeImage={mockOnChangeImage}
                defaultValue="https://example.com/image.jpg"
            />
        );

        const deleteBtn = getByText('Excluir');
        fireEvent.press(deleteBtn);

        expect(mockOnChangeImage).toHaveBeenCalledWith(undefined);
    });
});