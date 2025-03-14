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
import { ISportsEquipments } from '../../Models/SportsEquipments';
import { AddButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';

type routeParams = {
    isAdmUser: boolean;
}

export function SportsEquipments() {
    const navigation = useNavigation();

    const route = useRoute();
    const { isAdmUser } = route.params as routeParams;

    const [isAdm] = useState<boolean>(isAdmUser);
    const [sportsEquipments, setSportsEquipments] = useState<ISportsEquipments[]>([]);
    const [on, off] = useState(true);
    const [isSportEquipmentsActive, setIsSportEquipmentsActive] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            fetchCountSportEquipments();
        }, [])
    );

    const fetchCountSportEquipments = async () => {
        const token = await getToken();

        try {
            setLoading(true);
            const response = await requestApi('/sport-equipments', 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            const data = response.data;

            setSportsEquipments(data)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Erro ao buscar os materiais esportivos:', error);
        }
    };

    function handleDeleteClick(item: ISportsEquipments) {
        Alert.alert(
            `DESATIVAR MATERIAL ${(item.equipment_name).toUpperCase()}`,
            'O material selecionado será desativado. Deseja continuar?',
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

                            await requestApi(`/sport-equipments/${item.id}`, 'DELETE', undefined, {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            });

                            await fetchCountSportEquipments();
                            Alert.alert('Sucesso', 'Equipamento desativado com sucesso.');
                        } catch (error) {
                            console.error('Erro ao excluir material:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o material.');
                        }
                    }
                }
            ]
        );
    }
    function handleEditClick(item: ISportsEquipments) {
        navigation.navigate('RegisterSportEquipment', {
            isEditing: true,
            sportEquipment: item
        })
    }

    const toggleSwitch = () => {
        off(!on);
        setIsSportEquipmentsActive(previousState => !previousState);
    }

    const filterTeams = useMemo(() => {
        return sportsEquipments.filter(sport => sport.is_active === isSportEquipmentsActive);
    }, [isSportEquipmentsActive, sportsEquipments]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header isAdm={isAdm}
                title='Materiais Esportivos'
                subtitle='Lista Materiais esportivos'
                userImage={require('../../assets/img/cerberus.png')}
                handleClickDisconnect={() => {
                    logout();
                    navigation.navigate("Login");
                }}
                handleClickEditUser={() => navigation.navigate('RegisterUser', { isEditing: true })} 
                />
                <View style={styles.container}>
                    {sportsEquipments && sportsEquipments.length > 0 && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Materiais {isSportEquipmentsActive ? 'Ativas' : 'Inativas'}</Text>
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
                            data={filterTeams}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.containerList} >
                                    <View style={styles.containerImageAthlete}>
                                        {item.image && (
                                            <Image 
                                                style={styles.containerLogo}
                                                resizeMode='contain'
                                                source={{
                                                uri: item.image
                                                }} 
                                            />
                                        )}
                                        <View style={{ gap: 10 }}>
                                            <Text style={styles.textNameAthlete}>{item.equipment_name}</Text>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#FFFFFF',
                                            }}>{item.material_carrier}</Text>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#FFFFFF',
                                            }}>{item.phone}</Text>
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
                                    <Text style={styles.textNameAthlete}>Sem materiais cadastrados</Text>
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
                        label='Adicionar Material'
                        handleClick={() => navigation.navigate('RegisterSportEquipment', {
                        isEditing: false
                        })}
                    />
                    </View>
                </View>
        </SafeAreaView>
    );
}