import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, Switch, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddButton, ReturnButton } from '../../components/ButtonComponent';
import { Header } from '../../components/Header';
import { logout } from '../../utils/logout';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { ISport } from '../../Models/Sports';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';

type routeParams = {
    sports: ISport;
    isEditing: boolean;
};

export function RegisterSports() {

    const navigation = useNavigation();

    const route = useRoute();

    const isKeyboardVisible = useKeyboardVisibility();

    const { sports, isEditing } = route.params as routeParams;

    const [isEditMode] = useState<boolean>(isEditing ? isEditing : false); //estado do modo de edição
    const [on, off] = useState(isEditMode && sports ? Boolean(sports.is_active) : true); //estado do switch

    const [sportName, setSportName] = useState<string>(isEditing ? sports.name ?? '' : '');
    const [maxTeams, setMaxTeams] = useState<number>(isEditing ? sports.maximum_teams ?? 0 : 0);
    const [isSportActive, setIsSportActive] = useState<boolean>(isEditMode && sports ? Boolean(sports.is_active) : true);
    const [typeSportRegister, setTypeSportRegister] = useState<string>('');

    useEffect(() => {        
        typeSport();
    }, []);

    const typeSport = () => {
        switch (sports.type) {
            case 'SportMasculine':
                setTypeSportRegister('Masculino');
                break;
            case 'SportFeminine':
                setTypeSportRegister('Feminino');
                break;
            case 'ESport':
                setTypeSportRegister('E-Sport');
                break;
            case 'Sport':
                setTypeSportRegister('Misto');
                break;
        }
    }

    const handleSubmit = async () => {
        const sportPayload = {
            name: sportName,
            maximum_teams: maxTeams,
            is_active: isSportActive,
            type: sports.type,
        };

        try {
            const token = await getToken();

            if (isEditMode) {
                await requestApi(`/sports/${sports.id}`, 'PUT', sportPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Esporte atualizado com sucesso!', [
                    {
                        text: 'OK', onPress: () => {navigation.navigate('ListSports', { })}
                    },
                ]);
            } else {
                await requestApi('/sports/', 'POST', sportPayload,
                    {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                );
                Alert.alert('SUCESSO', 'Esporte cadastrado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.navigate('SportsMenu', { isAdmUser: false})
                    },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar esporte:', error);
            Alert.alert('Erro', 'Preencha os campos obrigatorios !');
        }

    };

    const toggleSwitch = () => {
        off(!on);
        setIsSportActive(previousState => !previousState);
        sports.is_active = isSportActive;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header
                    title={isEditMode ? 'Alterar Esporte' : 'Cadastrar Esporte'}
                    subtitle={isEditMode ? 'Alterar Esporte' : 'Adicionar Esporte'}
                    userImage={require('../../assets/img/Logos/logo3.png')}
                    handleClickDisconnect={logout}
                />
                <View style={styles.container}>
                    <View style={styles.containerText}>
                        <Text style={styles.titleText}>{isEditMode ? 'Alterando o Esporte' : 'Criando seu Esporte'}</Text>
                        <Text style={styles.titleTypeText}>{`Tipo: ${typeSportRegister}`}</Text>
                    </View>

                    <View style={styles.containerInputs}>
                        <View style={styles.boxInputs}>
                            <Text style={styles.labelInputs} >Nome do Esporte:</Text>
                            <TextInput style={styles.placeholderInput}
                                placeholder='Nome do esporte'
                                placeholderTextColor={'#706f6f74'}
                                value={sportName}
                                onChangeText={setSportName}
                                autoCorrect={false}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.boxInputs}>
                            <Text style={styles.labelInputs} >Quantidade de equipes:</Text>
                            <TextInput style={styles.placeholderInput}
                                keyboardType='numeric'
                                placeholder='Quantidade de equipes'
                                placeholderTextColor={'#706f6f74'}
                                value={maxTeams.toString()}
                                onChangeText={(text) => setMaxTeams(Number(text))}
                                autoCorrect={false}
                            >
                            </TextInput>
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Manter esporte ativo</Text>
                                <Switch
                                    value={on}
                                    onValueChange={toggleSwitch}
                                    trackColor={{false: '#767577', true: '#48C445'}}
                                    thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                                />
                            </View>
                        </View>
                    </View>

                </View>

                {!isKeyboardVisible && (
                    <View style={!isKeyboardVisible ? styles.containerButtons : styles.containerButtonsKeyboardVisible}>
                        <ReturnButton label="Cancelar" handleClick={() => navigation.goBack()} />
                        <AddButton label={isEditMode ? 'Confirmar' : 'Cadastrar'} handleClick={handleSubmit} />
                    </View>
                )}

            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}