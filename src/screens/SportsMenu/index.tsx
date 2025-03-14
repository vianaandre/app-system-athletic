import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { ReturnButton } from '../../components/ButtonComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MainMenu } from '../../components/MainMenu';
import { logout } from '../../utils/logout';
import { useAuth } from '../../hook/useAuth';
import { IUser } from '../../Models/Users';

type routeParams = {
    //user: IUser;
    isAdmUser?: boolean;
}

export function SportsMenu() {
    const navigation = useNavigation();
    const { user, refreshUserData } = useAuth()

    const route = useRoute();
    const { isAdmUser } = route.params as routeParams;

    const [isAdm] = useState<boolean>(isAdmUser ? isAdmUser : false);

    useFocusEffect(
        useCallback(() => {
            refreshUserData();
        }, [])
    );

    const disconnect = () => {
        logout();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header 
                isAdm={isAdm}
                title='Menu Esportivo'
                subtitle='Adicionar Esportes'
                userImage={require('../../assets/img/cerberus.png')}
                handleClickDisconnect={disconnect}
                handleClickEditUser={() => { navigation.navigate('RegisterUser', { isEditing: true, user }) }} 
            />
            <ScrollView>
                <View style={[styles.container, {
                    paddingBottom: 56
                }]}>
                        <MainMenu 
                            labelMenuSports='Esportes Masculinos'
                            labelMenuInfo={`${user?.counts?.count_sports_masculine ?? 0} Esportes`}
                            handleClickMenu={() => { navigation.navigate('ListSports', { sports: { type: 'SportMasculine' } })}}
                            handleClickAdd={() => { navigation.navigate('RegisterSports', { isEditing: false, sports: { type: 'SportMasculine' } }) }} 
                        />

                        <MainMenu 
                            labelMenuSports='Esportes Femininos'
                            labelMenuInfo={`${user?.counts?.count_sports_feminine ?? 0} Esportes`}
                            handleClickMenu={() => { navigation.navigate('ListSports', { sports: { type: 'SportFeminine' } }) }}
                            handleClickAdd={() => { navigation.navigate('RegisterSports', { isEditing: false, sports: { type: 'SportFeminine' } }) }} 
                        />

                        <MainMenu 
                            labelMenuSports='E-Sports'
                            labelMenuInfo={`${user?.counts?.count_esports ?? 0} Esportes`}
                            handleClickMenu={() => { navigation.navigate('ListSports', { sports: { type: 'ESport' } }) }}
                            handleClickAdd={() => { navigation.navigate('RegisterSports', { isEditing: false, sports: { type: 'ESport' } }) }} 
                        />

                        <MainMenu 
                            labelMenuSports='Esportes Mistos'
                            labelMenuInfo={`${user?.counts?.count_sports ?? 0} Esportes`}
                            handleClickMenu={() => { navigation.navigate('ListSports', { sports: { type: 'Sport' } }) }}
                            handleClickAdd={() => { navigation.navigate('RegisterSports', { isEditing: false, sports: { type: 'Sport' } }) }} 
                        />

                        <MainMenu 
                            labelMenuSports='Amistosos'
                            labelMenuInfo={`${user?.counts?.count_friendly ?? 0} Registros`}
                            handleClickMenu={() => navigation.navigate('ListFrindlys', { isEditing: false })}
                            handleClickAdd={() => navigation.navigate('RegisterFriendly', { isEditing: false })} 
                        />

                        <MainMenu 
                            labelMenuSports='Campeonatos'
                            labelMenuInfo={`${user?.counts?.count_championship ?? 0} Registros`}
                            handleClickMenu={() => { navigation.navigate('ListChampionships') }}
                            handleClickAdd={() => { navigation.navigate('RegisterChampionships', { isEditing: false }) }} 
                        />

                        <MainMenu 
                            labelMenuSports='Materiais Esportivos'
                            labelMenuInfo={`${user?.counts?.count_sportEquipment ?? 0} Materiais`}
                            handleClickMenu={() => navigation.navigate('ListSportsEquipments', {})}
                            handleClickAdd={() => navigation.navigate('RegisterSportEquipment', {
                                isEditing: false
                            })} 
                        />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}