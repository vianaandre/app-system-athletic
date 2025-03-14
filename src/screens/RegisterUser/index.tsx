import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { InputFormText, InputFormTextMask } from '../../components/InputForm';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, ReturnButton } from '../../components/ButtonComponent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import axios from 'axios';
import { InputFormFile } from '../../components/InputFormFile';
import { logout } from '../../utils/logout';
import { getToken } from '../../utils/getToken';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';
import { IUser } from '../../Models/Users';
import { useAuth } from '../../hook/useAuth';

type RouteParams = {
    user: IUser;
    isEditing?: boolean;
    isAdmUser?: boolean;
    firstRegister?: boolean;
}


export function RegisterUser() {

    const navigation = useNavigation();

    const route = useRoute();
    const { isAdmUser, isEditing, firstRegister, user } = route.params as RouteParams;

    //const { user } = useAuth()

    const isKeyboardVisible = useKeyboardVisibility();

    const [isAdm, setIsAdm] = useState<boolean>(isAdmUser ? isAdmUser : false); //estado da variável para 'Administrador'
    const [isEditMode, setIsEditMode] = useState<boolean>(isEditing ? isEditing : false);

    const userImage = firstRegister ? null : require('../../assets/img/imageAdm.png');

    const [userName, setUserName] = useState(isEditing ? user.athletic : '');
    const [userNumber, setUserNumber] = useState(isEditing ? user.number : '');
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');
    const [userLogo, setUserLogo] = useState<string | undefined>();
    const [isUserActive, setIsUserActive] = useState<boolean>(isEditMode && user ? Boolean(user.is_active) : true);
    const [on, off] = useState(isEditMode && user ? Boolean(user.is_active) : true);

    const handleSubmit = async () => {
        const clientPayload = {
            athletic: userName,
            number: userNumber,
            password: userPassword,
            confirmed_password: userConfirmPassword,
            logo: userLogo,
            is_active: isUserActive
        };

        if (userPassword !== userConfirmPassword) {
            return Alert.alert('PROBLEMA COM SENHAS', 'As senhas informadas não são iguais ou os campos estão vazios.',
                [
                    {
                        text: 'OK', onPress: () => setUserConfirmPassword('')
                    }
                ]);
        } else {
            try {
                const token = await getToken();

                if (isEditMode) {
                    if (isAdmUser) {
                        await requestApi(`/users/${user?.id}`, 'PUT', clientPayload, {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        });

                        Alert.alert('Sucesso', 'Atlética atualizada com sucesso!', [
                            {
                                text: 'OK', onPress: () => navigation.navigate('ListUsers', { isAdmUser: isAdm, updateList: true })
                            },
                        ]);
                    } else {
                        await requestApi(`/users/${user?.id}`, 'PUT', clientPayload, {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        });

                        Alert.alert('Sucesso', 'Atlética atualizada com sucesso!', [
                            {
                                text: 'OK', onPress: () => navigation.goBack()
                            },
                        ]);
                    }
                } else {
                    await requestApi('/users/', 'POST', clientPayload);
                    Alert.alert('SUCESSO', 'Atlética cadastrada com sucesso!', [
                        {
                            text: 'OK', onPress: () => navigation.navigate('Login')
                        },
                    ]);
                }
            } catch (error) {
                console.error('Erro ao salvar atlética:', error);
                Alert.alert('Erro', 'Essa atlética já foi cadastrada.');
            }
        }
    };

    const validatePhoneNumber = (number: string) => {
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!phoneRegex.test(number)) {
            Alert.alert('Número de telefone inválido', 'Formato esperado: (99) 9999-9999 ou (99) 99999-9999');
        }
    };

    const disconnect = () => {
        logout();
        navigation.navigate('Login');
    }

    const toggleSwitch = () => {
        off(!on);
        setIsUserActive(previousState => !previousState);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header
                    isAdm={isAdm}
                    title={isEditMode ? 'Alterar Atlética' : 'Cadastrar Atlética'}
                    subtitle={isEditMode ? 'Alterar atlética no sistema' : 'Cadastrar atlética no sistema'}
                    userImage={userImage}
                    handleClickDisconnect={disconnect}
                    isDisconect={user?.id ? true : false}
                />
                <ScrollView style={styles.container}>
                    <View style={styles.containerInputs}>
                        <InputFormText label='Atlética:'
                            value={userName}
                            onChangeText={setUserName} />

                        <InputFormTextMask label='Número:'
                            value={userNumber}
                            onChangeText={setUserNumber}
                            onBlur={() => validatePhoneNumber(userNumber)}
                        />

                        <InputFormText label='Senha:'
                            secureTextEntry={true}
                            autoCorrect={false}
                            value={userPassword}
                            onChangeText={setUserPassword} />

                        <InputFormText label='Confirmar senha:'
                            secureTextEntry={true}
                            autoCorrect={false}
                            value={userConfirmPassword}
                            onChangeText={setUserConfirmPassword} />

                        <InputFormFile
                            label='Logo:'
                            title='Selecione uma logo'
                            onChangeImage={setUserLogo}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Manter equipe ativa</Text>
                            <Switch
                                value={on}
                                onValueChange={toggleSwitch}
                                trackColor={{false: '#767577', true: '#48C445'}}
                                thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    {!isKeyboardVisible && (
                        <View style={styles.containerButtons}>
                            <ReturnButton label="Cancelar" handleClick={() => navigation.goBack()} />
                            <AddButton label={isEditMode ? 'Confirmar' : 'Cadastrar'} handleClick={handleSubmit} />
                        </View>
                    )}
                </ScrollView>

            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}