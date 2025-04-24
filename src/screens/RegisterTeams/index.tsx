import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, Switch, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

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
import { ITeam } from '../../Models/Teams';

type routeParams = {
    sport: ISport;
    team?: ITeam;
    isEditing: boolean;
};

export function RegisterTeams() {
    const navigation = useNavigation();

    const route = useRoute();

    const isKeyboardVisible = useKeyboardVisibility();

    const { sport, isEditing, team } = route.params as routeParams;

    const [isEditMode, setIsEditMode] = useState<boolean>(isEditing ? isEditing : false); //estado do modo de edição
    const [on, off] = useState(isEditMode && team ? Boolean(team.is_active) : true);//estado do switch

    const [teamName, setTeamName] = useState<string>(isEditing && team ? team.name ?? '' : '');
    const [maxTeams, setMaxTeams] = useState<number>(isEditing && team ? team.maximum_athletes ?? 0 : 0);
    const [isTeamActive, setIsTeamActive] = useState<boolean>(isEditMode && team ? Boolean(team.is_active) : true);

    const handleSubmit = async () => {
        const teamPayload = {
            name: teamName,
            maximum_athletes: maxTeams,
            is_active: isTeamActive,
            sport_id: sport.id
        };

        try {
            const token = await getToken();

            if (isEditMode && team) {
                await requestApi(`/teams/${team.id}`, 'PUT', teamPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Equipe atualizada com sucesso!', [
                    {
                        text: 'OK', onPress: () => {navigation.navigate('ListTeams', { sport: sport })}
                    },
                ]);
            } else {
                await requestApi('/teams', 'POST', teamPayload,
                    {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                );
                Alert.alert('SUCESSO', 'Equipe cadastrada com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.navigate('ListTeams', { sport: sport })
                    },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar equipe:', error);
            Alert.alert('Erro', 'Preencha os campos obrigatorios !');
        }

    };

    const toggleSwitch = () => {
        off(!on);
        setIsTeamActive(previousState => !previousState);
    }

    const typeSportViewList =  useMemo(() => {
        switch(sport.type) {
            case 'SportMasculine':
                return 'Masculinos';
            case 'SportFeminine':
                return 'Femininos';
            case 'ESport':
                return 'E-Sports';
            case 'Sport':
                return 'Mistos';
        }
    }, [sport])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header
                    title={isEditMode ? 'Alterar Equipe' : 'Cadastrar Equipe'}
                    subtitle={isEditMode ? 'Alterar equipe' : 'Adicionar equipe'}
                    userImage={require('../../assets/img/Logos/logo3.png')}
                    handleClickDisconnect={logout}
                />
                <View style={styles.container}>
                    <View style={styles.containerText}>
                        <Text style={styles.titleText}>{isEditMode ? 'Alterando a equipe' : 'Criando a equipe'}</Text>
                        <Text style={styles.titleTypeText}>{`Esporte: ${sport.name}`}</Text>
                        <Text style={[styles.titleTypeText, {
                            marginTop: 17
                        }]}>{`Categoria: ${typeSportViewList}`}</Text>
                    </View>

                    <View style={styles.containerInputs}>
                        <View style={styles.boxInputs}>
                            <Text style={styles.labelInputs} >Nome da Equipe:</Text>
                            <TextInput style={styles.placeholderInput}
                                placeholder='Nome da equipe'
                                placeholderTextColor={'#706f6f74'}
                                value={teamName}
                                onChangeText={setTeamName}
                                autoCorrect={false}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.boxInputs}>
                            <Text style={styles.labelInputs} >Quantidade de atletas:</Text>
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
                                <Text style={styles.switchLabel}>Manter equipe ativa</Text>
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