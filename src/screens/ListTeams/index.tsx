import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { AddButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { logout } from '../../utils/logout';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { ISport } from '../../Models/Sports';
import { ITeam } from '../../Models/Teams';

type routeParams = {
    sport: ISport;
};

export function ListTeams() {
    const navigation = useNavigation();

    const route = useRoute();
    const { sport } = route.params as routeParams;

    const [teamsList, setTeamsList] = useState<ITeam[]>([]);
    const [on, off] = useState(true);
    const [isTeamsActive, setIsTeamsActive] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getTeamsBySport();
        }, [])
    );

    const getTeamsBySport = async () => {
        try {
            const token = await getToken();

            setIsLoading(true);
            const response = await requestApi(`/teams/sport/${sport.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            setTeamsList(response.data);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Erro ao listar as equipes:', error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de equipes.');
        }
    };

    const handleDeleteClick = (team: ITeam | null) => {
        Alert.alert(
            `DESATIVAR EQUIPE ${(team?.name ?? '').toUpperCase()}`,
            'A equipe selecionado será desativado. Deseja continuar?',
            [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            const token = await getToken();

                            await requestApi(`/teams/${team?.id}`, 'DELETE', undefined, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });

                            await getTeamsBySport();
                            Alert.alert('Sucesso', 'Equipe excluída com sucesso.');
                        } catch (error) {
                            console.error('Erro ao excluir equipe:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a equipe.');
                        }
                    }
                }
            ]
        );
    };

    const handleEditClick = (team: ITeam) => {
        navigation.navigate('RegisterTeams', { isEditing: true, team: team, sport: sport });
    };

    const navigateToListAthletes = (team: ITeam) => {
        navigation.navigate('ListAthletes', { team: team });
    }

    const disconnect = () => {
        logout();
        navigation.navigate('Login');
    }

    const toggleSwitch = () => {
        off(!on);
        setIsTeamsActive(previousState => !previousState);
    }

    const filterTeams = useMemo(() => {
        return teamsList.filter(sport => sport.is_active === isTeamsActive);
    }, [isTeamsActive, teamsList]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header
                    title={`Equipes ${sport.name}`}
                    subtitle={'Lista de equipes'}
                    userImage={require('../../assets/img/Logos/logo3.png')}
                    handleClickDisconnect={disconnect} 
                />
                <View style={styles.container}>
                    {teamsList && teamsList.length > 0 && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Equipes {isTeamsActive ? 'Ativas' : 'Inativas'}</Text>
                            <Switch
                                value={on}
                                onValueChange={toggleSwitch}
                                trackColor={{false: '#767577', true: '#48C445'}}
                                thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                            />
                        </View>
                    )}
                    {!isLoading ? (
                        <FlatList
                            data={filterTeams}
                            keyExtractor={(item: ITeam) => item.id ?? ''}
                            renderItem={({ item }) => (
                                <View style={styles.containerList} >
                                    <TouchableOpacity style={styles.containerTouchable}
                                        onPress={() => { navigateToListAthletes(item) }}>
                                        <View style={styles.containerName}>
                                            <Text style={styles.textLogo}>{item.name}</Text>
                                            <Text style={styles.textCountAthlete}>{item._count?.Athletes} Atleta(s)</Text>
                                        </View>

                                        <View style={styles.containerEditRemoveButton}>
                                            {item.is_active && (
                                                <RemoveButton handleClick={() => { handleDeleteClick(item) }} />
                                            )}
                                            <EditButton handleClick={() => { handleEditClick(item) }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListEmptyComponent={() =>
                                <View style={{
                                    alignItems: 'center',
                                    marginVertical: 42
                                }}>
                                    <Text style={styles.textLogo}>Sem Equipes Cadastradas</Text>
                                </View>
                            }
                        />
                    ) : (
                        <View style={{ alignItems: 'center', marginVertical: 42 }}>
                            <ActivityIndicator size="large" color="#48C445" />
                        </View>
                    )}

                    <View style={styles.containerButtons}>
                        <ReturnButton label='Voltar'
                            handleClick={() => { navigation.goBack() }} />
                        <AddButton label='Adicionar Equipe'
                            handleClick={() => { navigation.navigate('RegisterTeams', { isEditing: false, sport: sport }) }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}