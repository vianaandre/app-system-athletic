import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token: string):Promise<void> => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error('Error storing token:', error);
        throw error;
    }
};
