import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  iat: number;
  exp: number;
}

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      return null;
    }

    const { iat, exp } = jwtDecode<TokenPayload>(token);

    const currentTime = Date.now() / 1000;

    return token;
  } catch (error) {
    console.error('Failed to retrieve or decode the token', error);
    return null;
  }
};
