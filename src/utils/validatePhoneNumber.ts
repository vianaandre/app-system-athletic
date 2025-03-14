import { Alert } from "react-native";

export const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!phoneRegex.test(number)) {
        Alert.alert('Número de telefone inválido', 'Formato esperado: (99) 9999-9999 ou (99) 99999-9999');
    }
};