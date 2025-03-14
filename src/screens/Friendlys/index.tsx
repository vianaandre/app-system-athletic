import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Image, Alert, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { logout } from '../../utils/logout';
import { getToken } from '../../utils/getToken';
import { requestApi } from '../../utils/requestApi';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';
import { IFriendlys } from '../../Models/Friendlys';
import { format } from 'date-fns';

type routeParams = {
    isAdmUser: boolean;
}

export function Friendlys() {
    const navigation = useNavigation();

    const route = useRoute();
    const { isAdmUser } = route.params as routeParams;

    const [isAdm] = useState<boolean>(isAdmUser);
    const [friendlys, setFriendlys] = useState<IFriendlys[]>([]);
    const [isFriendlyActive, setIsFriendlyActive] = useState<boolean>(true);
    const [on, off] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            fetchCountFriendlys();
        }, [])
    );

    const fetchCountFriendlys = async () => {
        const token = await getToken();

        try {
            setLoading(true);
            const response = await requestApi('/friendlys', 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            const data = response.data;

            setFriendlys(data)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Erro ao buscar os amistosos:', error);
        }
    };

    function handleDeleteClick(item: IFriendlys) {
        Alert.alert(
            `DESATIVAR AMISTOSO`,
            'O amistoso selecionado será desativado. Deseja continuar?',
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

                            await requestApi(`/friendlys/${item.id}`, 'DELETE', undefined, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });

                            await fetchCountFriendlys();
                            Alert.alert('Sucesso', 'Amistoso desativado com sucesso.');
                        } catch (error) {
                            console.error('Erro ao excluir amistoso:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o amistoso.');
                        }
                    }
                }
            ]
        );
    }
    function handleEditClick(item: IFriendlys) {
        navigation.navigate('RegisterFriendly', {
            isEditing: true,
            friendly: item
        })
    }

    const toggleSwitch = () => {
        off(!on);
        setIsFriendlyActive(previousState => !previousState);
    }

    const filterFriendlys = useMemo(() => {
        return friendlys.filter(sport => sport.is_active === isFriendlyActive);
    }, [isFriendlyActive, friendlys]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header isAdm={isAdm}
                title='Amistosos'
                subtitle='Esportes'
                userImage={require('../../assets/img/cerberus.png')}
                handleClickDisconnect={() => {
                    logout();
                    navigation.navigate("Login");
                }}
                handleClickEditUser={() => navigation.navigate('RegisterUser', { isEditing: true })} 
            />
                <View style={styles.container}>
                    {friendlys && friendlys.length > 0 && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Amistosos {isFriendlyActive ? 'Ativas' : 'Inativas'}</Text>
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
                            data={filterFriendlys}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.containerList} >
                                    <View style={styles.containerImageAthlete}>
                                        <View style={{ gap: 14 }}>
                                            <Text style={[styles.textNameAthlete, styles.fontBold, { fontSize: 20 }]}>{item.description}</Text>
                                            <Text style={styles.textNameAthlete}>{format(new Date(item.date), 'dd/MM/yyyy')}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.containerEditRemoveButton}>
                                        {item.is_active && (
                                            <RemoveButton handleClick={() => { handleDeleteClick(item) }} />
                                        )}
                                        <EditButton handleClick={() => handleEditClick(item)} />
                                    </View>

                                </View>
                            )}
                            ListEmptyComponent={() =>
                                <View style={{
                                    alignItems: 'center',
                                    marginVertical: 42
                                }}>
                                    <Text style={styles.textNameAthlete}>Sem amistosos cadastrados</Text>
                                </View>
                            }
                        />
                    ) : (
                        <View style={{ alignItems: 'center', marginVertical: 42 }}>
                            <ActivityIndicator size="large" color="#48C445" />
                        </View>
                    )}

                    <View style={styles.containerButtons}>
                        <ReturnButton 
                            label='Voltar'
                            handleClick={() => navigation.goBack()} 
                        />
                        <AddButton 
                            label='Adicionar Amistoso'
                            handleClick={() => navigation.navigate('RegisterFriendly', { isEditing: false })}
                        />
                    </View>
                </View>
        </SafeAreaView>
    );
}