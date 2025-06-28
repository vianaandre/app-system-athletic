import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { logout } from '../../utils/logout';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { IChampionship } from '../../Models/Championship';
import { format, parseISO } from 'date-fns';


export function ListChampionships() {

    const navigation = useNavigation();

    const [listChampionships, setListChampionships] = useState<IChampionship[]>([]);
    const [on, off] = useState(true);
    const [isChampionshipActive, setIsChampionshipActive] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            getChampionships();
        }, [])
    );

    const getChampionships = async () => {
        try {
            const token = await getToken();

            setIsLoading(true);
            const response = await requestApi('/championships/', 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response && response.data) {
                setListChampionships(response.data);
            } else {
                console.error('Nenhum dado recebido da API');
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Erro ao listar campeonatos:', error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de atletas.');
        }
    };

    const handleDeleteClick = (championship: IChampionship) => {
        
        Alert.alert(
            `DESATIVAR ${(championship.description).toUpperCase()}`,
            'O campeonato selecionado será desativado. Deseja continuar?',
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

                            const response = await requestApi(`/championships/${championship.id}`, 'DELETE', undefined, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });

                            await getChampionships();
                            Alert.alert('Sucesso', 'Campeonato desativado com sucesso.');
                        } catch (error) {
                            console.error('Erro ao excluir campeonato:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o campeonato.');
                        }
                    }
                }
            ]
        );
    };


    const handleEditClick = (championship: IChampionship) => {
        navigation.navigate('RegisterChampionships', { isEditing: true, championship: championship });
    };

    const disconnect = () => {
        logout();
        navigation.navigate('Login');
    }

    const toggleSwitch = () => {
        off(!on);
        setIsChampionshipActive(previousState => !previousState);
    }

    const filterChampionship = useMemo(() => {
        return listChampionships.filter(sport => sport.is_active === isChampionshipActive);
    }, [isChampionshipActive, listChampionships]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header //isAdm={isAdm}
                    title={'Campeonatos'}
                    subtitle={'Lista de campeonatos'}
                    userImage={require('../../assets/img/Logos/logo3.png')}
                    handleClickDisconnect={disconnect} />
                <View style={styles.container}>
                    {listChampionships && listChampionships.length > 0 && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Campeonatos {isChampionshipActive ? 'Ativos' : 'Inativos'}</Text>
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
                            data={filterChampionship}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => {
                                const formattedStartDate = format(item.start_date, 'dd/MM/yyyy');
                                const formattedEndDate = format(item.end_date, 'dd/MM/yyyy');

                                return (
                                    <View style={styles.containerList} >
                                        <View style={{ gap: 4 }}>
                                            <Text style={styles.textNameChampionship}>{item.description}</Text>
                                            <Text style={styles.textCoursePeriodChampionship}>
                                                {formattedStartDate} à {formattedEndDate}
                                            </Text>
                                        </View>

                                        <View style={styles.containerEditRemoveButton}>
                                            {item.is_active && (
                                                <RemoveButton handleClick={() => { handleDeleteClick(item) }} />
                                            )}
                                            <EditButton handleClick={() => { handleEditClick(item) }} />
                                        </View>
                                    </View>
                                );
                            }}
                            ListEmptyComponent={() =>
                                <View style={{
                                    alignItems: 'center',
                                    marginVertical: 42
                                }}>
                                    <Text style={styles.textNameChampionship}>Sem Campeonatos Cadastrados</Text>
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
                        <AddButton label='Adicionar Competição'
                            handleClick={() => { navigation.navigate('RegisterChampionships', { isEditing: false }) }}
                        />
                    </View>

                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}