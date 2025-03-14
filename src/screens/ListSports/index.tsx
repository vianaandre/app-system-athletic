import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { logout } from '../../utils/logout';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { ISport } from '../../Models/Sports';

type routeParams = {
    sports: ISport;
};

export function ListSports() {
    const navigation = useNavigation();

    const route = useRoute();
    const { sports } = route.params as routeParams;

    const [sportsList, setSportsList] = useState<ISport[]>([]);
    const [typeSportView, setTypeSportView] = useState<string>('');
    const [on, off] = useState(true);
    const [isSportsActive, setIsSportsActive] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            getSportsByType();
        }, [])
    );

    useEffect(() => {
        typeSportViewList();
    }, [])

    const typeSportViewList = () => {
        switch (sports.type) {
            case 'SportMasculine':
                setTypeSportView('Masculinos');
                break;
            case 'SportFeminine':
                setTypeSportView('Femininos');
                break;
            case 'ESport':
                setTypeSportView('E-Sports');
                break;
            case 'Sport':
                setTypeSportView('Mistos');
                break;
        }
    }

    const getSportsByType = async () => {
        try {
            const token = await getToken();

            setIsLoading(true);
            const response = await requestApi(`/sports/list?type=${sports.type}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response && response.data) {
                const sportsWithAthleteCount = await Promise.all(response.data.map(async (sport: ISport) => {
                    const athleteResponse = await requestApi(`/athletes/${sport.id}`, 'GET', null, {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    });
                    return { ...sport, athleteCount: athleteResponse.data.length };
                }));

                setSportsList(sportsWithAthleteCount);
            } else {
                console.error('Nenhum dado recebido da API');
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Erro ao listar esportes:', error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de esportes.');
        }
    };

    const handleDeleteClick = (sport: ISport | null) => {
        Alert.alert(
            `DESATIVAR ESPORTE ${(sport?.name ?? '').toUpperCase()}`,
            'O esporte selecionado será desativado. Deseja continuar?',
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

                            await requestApi(`/sports/${sport?.id}`, 'DELETE', undefined, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });

                            await getSportsByType();
                            Alert.alert('Sucesso', 'Esporte desativado com sucesso.');
                        } catch (error) {
                            console.error('Erro ao excluir esporte:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o esporte.');
                        }
                    }
                }
            ]
        );
    };

    const handleEditClick = (sport: ISport) => {
        navigation.navigate('RegisterSports', { isEditing: true, sports: sport });
    };

    const navigateToListAthletes = (sport: ISport) => {
        navigation.navigate('ListTeams', { sport: sport });
    }

    const disconnect = () => {
        logout();
        navigation.navigate('Login');
    }

    const toggleSwitch = () => {
        off(!on);
        setIsSportsActive(previousState => !previousState);
    }

    const filterSports = useMemo(() => {
        return sportsList.filter(sport => sport.is_active === isSportsActive);
    }, [isSportsActive, sportsList]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header
                    title={`Esportes ${typeSportView}`}
                    subtitle={`Lista de Esportes ${typeSportView} cadastrados`}
                    userImage={require('../../assets/img/Logos/logo3.png')}
                    handleClickDisconnect={disconnect} 
                />
                <View style={styles.container}>
                    {sportsList && sportsList.length > 0 && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Esportes {isSportsActive ? 'Ativos' : 'Inativos'}</Text>
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
                            data={filterSports}
                            keyExtractor={(item: ISport) => item.id ?? ''}
                            renderItem={({ item }) => (
                                <View style={styles.containerList} >
                                    <TouchableOpacity style={styles.containerTouchable}
                                        onPress={() => { navigateToListAthletes(item) }}>
                                        <View style={styles.containerName}>
                                            <Text style={styles.textLogo}>{item.name}</Text>
                                            <Text style={styles.textCountAthlete}>{item._count?.Teams} Equipe(s)</Text>
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
                                    <Text style={styles.textLogo}>Sem Esportes Cadastrados</Text>
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
                        <AddButton label='Adicionar Esporte'
                            handleClick={() => { navigation.navigate('RegisterSports', { isEditing: false, sports: sports }) }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}