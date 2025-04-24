import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Keyboard, Platform, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, DownloadButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { logout } from '../../utils/logout';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { IAthlete } from '../../Models/Athlete';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ITeam } from '../../Models/Teams';

type routeParams = {
    team: ITeam;
    athlete: IAthlete;
};

const PDF_NAME = 'lista_atletas.pdf';


export function ListAthletes() {

    const navigation = useNavigation();

    const route = useRoute();
    const { team } = route.params as routeParams;

    const [listAthetesByTeams, setListAthetesByTeams] = useState<IAthlete[]>([]);
    const [on, off] = useState(true);
    const [isAthletesActive, setIsAthletesActive] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            getAthletesByTypeOfSports();
        }, [])
    );

    const getAthletesByTypeOfSports = async () => {
        try {
            const token = await getToken();

            setLoading(true);
            const response = await requestApi(`/athletes/${team.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response && response.data) {
                setListAthetesByTeams(response.data);

            } else {
                console.error('Nenhum dado recebido da API');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Erro ao listar atletas:', error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de atletas.');
        }
    };


    const handleDownloadPDF = async () => {
        try {
            const token = await getToken();

            const response = await requestApi(`/athletes/export/${team.id}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 'blob');

            if (response && response.data) {

                const base64data = await blobToBase64(response.data);
                const fileUri = FileSystem.cacheDirectory + PDF_NAME;

                await FileSystem.writeAsStringAsync(fileUri, base64data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                await fileSave(fileUri);
            } else {
                console.error('Nenhum dado recebido da API');
                Alert.alert('Erro', 'Não foi possível exportar a lista de atletas.');
            }
        } catch (error) {
            console.error('Erro ao exportar documento:', error);
            Alert.alert('Erro', 'Não foi possível exportar a lista de atletas.');
        }
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = (reader.result as string).split(',')[1];
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };


    const fileSave = async (uri: string) => {
        if (Platform.OS === 'android') {
            const base64File = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const directoryUri = FileSystem.cacheDirectory + PDF_NAME;
            await FileSystem.writeAsStringAsync(directoryUri, base64File, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await Sharing.shareAsync(directoryUri);
        } else {
            await Sharing.shareAsync(uri);
        }
    };

    const handleDeleteClick = (athlete: IAthlete) => {
        Alert.alert(
            `DESATIVAR ATLETA ${(athlete.name).toUpperCase()}`,
            'O atleta selecionado será desativado. Deseja continuar?',
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

                            await requestApi(`/athletes/${athlete.id}`, 'DELETE', undefined, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });

                            await getAthletesByTypeOfSports();
                            Alert.alert('Sucesso', 'Atleta desativado com sucesso.');

                        } catch (error) {
                            console.error('Erro ao excluir atleta:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o atleta.');
                        }
                    }
                }
            ]
        );
    };


    const handleEditClick = (athlete: IAthlete) => {
        navigation.navigate('RegisterAthlete', { isEditing: true, athlete: athlete, team });
    };

    const disconnect = () => {
        logout();
        navigation.navigate('Login');
    }

    const toggleSwitch = () => {
        off(!on);
        setIsAthletesActive(previousState => !previousState);
    }

    const filterAthletes = useMemo(() => {
        return listAthetesByTeams.filter(team => team.is_active === isAthletesActive);
    }, [isAthletesActive, listAthetesByTeams]);

    return (
        <SafeAreaView style={styles.safeArea}>

            <Header
                title={'Atletas'}
                subtitle={`(${team?.name})`}
                userImage={require('../../assets/img/Logos/logo3.png')}
                handleClickDisconnect={disconnect} />
            <View style={styles.container}>
                {listAthetesByTeams && listAthetesByTeams.length > 0 && (
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Atletas {isAthletesActive ? 'Ativos' : 'Inativos'}</Text>
                            <Switch
                                value={on}
                                onValueChange={toggleSwitch}
                                trackColor={{false: '#767577', true: '#48C445'}}
                                thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                            />
                    </View>
                )}
                {!loading ? (
                    <FlatList
                        data={filterAthletes}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.containerList} >
                                <View style={styles.containerImageAthlete}>
                                    {item.athlete_image && (
                                        <Image style={styles.imageAtleta} resizeMode='contain'
                                            source={{
                                            uri: item.athlete_image
                                        }} />
                                    )}
                                    <View >
                                        <Text style={styles.textNameAthlete}>{item.name}</Text>
                                        <Text style={styles.textCoursePeriodAthlete}>{item.course}</Text>
                                        <Text style={styles.textCoursePeriodAthlete}>{item.period} Período</Text>
                                    </View>
                                </View>

                                <View style={styles.containerEditRemoveButton}>
                                    {item.is_active && (
                                        <RemoveButton handleClick={() => { handleDeleteClick(item) }} />
                                    )}
                                    <EditButton handleClick={() => { handleEditClick(item) }} />
                                </View>

                            </View>
                        )}
                        ListEmptyComponent={() =>
                            <View style={{
                                alignItems: 'center',
                                marginVertical: 42
                            }}>
                                <Text style={styles.textEmpty}>Sem Atletas Cadastrados</Text>
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

                    <DownloadButton label='Exportar PDF'
                        handleClick={handleDownloadPDF} />

                    <AddButton label='Adicionar Atleta'
                        handleClick={() => { navigation.navigate('RegisterAthlete', { isEditing: false, team: team }) }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}