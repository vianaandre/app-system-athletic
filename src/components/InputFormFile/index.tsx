import { ActivityIndicator, Alert, Button, ButtonProps, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { styles } from "./styles";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { Platform } from "react-native";
import { requestApi } from "../../utils/requestApi";

interface IInputFormFile extends ButtonProps {
    label: string;
    defaultValue?: string;
    onChangeImage: (e?: string) => void;

}

const InputFormFile = ({ title, label, defaultValue, onChangeImage, ...rest }: IInputFormFile) => {
    const [file, setFile] = useState<string | undefined>(defaultValue);
    const [loading, setLoading] = useState<boolean>(false)

    const uploadImage = async (file: ImagePicker.ImagePickerAsset) => {
        try {
            const formData = new FormData()
                        
            formData.append('file', {
                uri: file.uri,
                name: file.fileName ?? 'profile.png',
                type: 'image/jpeg'
            } as any)

            setLoading(true)
            
            const response = await fetch('https://api.xyzonline.site/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            });

            const responseJson = await response.json()

            setFile(responseJson.url);
            onChangeImage(responseJson.url)

            setLoading(false)
        } catch(err) {
            setLoading(false)
            console.error('Upload error:', {
                error: err,
                message: err instanceof Error ? err.message : 'Unknown error',
                response: err instanceof axios.AxiosError ? err.response?.data : null
            });
            Alert.alert('Erro', 'Erro ao enviar imagem');
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        
        if(!result.canceled) {
            await uploadImage(result.assets[0])
        }
    };

    return (
            <View style={styles.boxInputs}>
                <Text testID="label" style={styles.labelInputs} >{label}</Text>
                {file ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Image 
                            source={{
                                uri: file,
                                height: 52,
                                width: 52
                            }}
                        />

                        <Button title="Excluir" onPress={() => {
                            setFile(undefined)
                            onChangeImage(undefined)
                        }} color={'#FF4848'} />
                    </View>
                ) : (
                    loading ? (
                        <ActivityIndicator 
                            color={'#48C445'}
                            size={'large'}
                        />
                    ) : (
                        <TouchableOpacity testID="button" style={{
                            backgroundColor: '#48C445',
                            height: 42,
                            flex: 1,
                            marginTop: 10,
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} {...rest} onPress={pickImage}>
                            <Text style={{ fontSize: 16, color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 'bold' }}>{title}</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
    )
}

export { InputFormFile }