import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Keyboard, ScrollView, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, EditButton, RemoveButton, ReturnButton } from '../../components/ButtonComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { IUser } from '../../Models/Users';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { logout } from '../../utils/logout';

type RouteParams = {
  isAdmUser: boolean;
  updateList: boolean;
}


export function ListUsers() {

  const navigation = useNavigation();

  const route = useRoute();
  const { isAdmUser, updateList } = route.params as RouteParams;

  const [isAdm, setIsAdm] = useState<boolean>(isAdmUser);
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [on, off] = useState(true);
  const [isUsersActive, setIsUsersActive] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [])
  );

  const getUsers = async () => {
    try {
      const token = await getToken();
      
      setIsLoading(true);

      const response = await requestApi('/users/list/all', 'GET', null, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      if (response && response.data) {
        setUsersList(response.data);
      } else {
        console.error('Nenhum dado recebido da API');
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao listar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de usuários.');
    }
  };

  const handleDeleteClick = (user: IUser) => {
    Alert.alert(
      `DESATIVAR USUÁRIO ${(user.athletic).toUpperCase()}`,
      'O usuário selecionado será desativado. Deseja continuar?',
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

              const response = await requestApi(`/users/${user.id}`, 'DELETE', undefined, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              });

              await getUsers();
              Alert.alert('Sucesso', 'Usuário desativado com sucesso.');

            } catch (error) {
              console.error('Erro ao excluir usuário:', error);
              Alert.alert('Erro', 'Não foi possível excluir o usuário.');
            }
          }
        }
      ]
    );
  };

  const handleEditClick = (user: IUser) => {;
    navigation.navigate('RegisterUser', { user, isEditing: true, isAdmUser: isAdm });
  };

  const disconnect = () => {
    logout();
    navigation.navigate('Login');
  }

  const toggleSwitch = () => {
    off(!on);
    setIsUsersActive(previousState => !previousState);
  }

  const filterUsers = useMemo(() => {
    return usersList.filter(sport => sport.is_active === isUsersActive);
}, [isUsersActive, usersList]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>

        <Header
          isAdm={false}
          title='Usuários do Sistema'
          subtitle='Lista dos usuários do Sistema'
          userImage={require('../../assets/img/imageAdm.png')}
          handleClickDisconnect={disconnect} />
        <ScrollView style={styles.container}>
          {usersList && usersList.length > 0 && (
              <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Usuários {isUsersActive ? 'Ativos' : 'Inativos'}</Text>
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
              data={filterUsers}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.containerList} >

                  <View style={styles.containerLogoName}>
                    {item.logo && (
                      <Image style={styles.containerLogo} source={{
                        uri: item.logo
                      }} resizeMode='contain' />
                    )}
                    <Text style={styles.textLogo}>{item.athletic}</Text>
                  </View>

                  <View style={styles.containerEditRemoveButton}>
                    <RemoveButton handleClick={() => { handleDeleteClick(item) }} />
                    <EditButton handleClick={() => { handleEditClick(item) }} />
                  </View>

                </View>
              )}
              ListEmptyComponent={() =>
                <View style={{
                  width: '100%',
                  paddingVertical: 42,
                  alignItems: 'center',
                }}>
                  <Text style={styles.textLogo}>Sem Atléticas Cadastradas </Text>
                </View>
              }
            />
          ) : (
            <View style={{ alignItems: 'center', marginVertical: 42 }}>
              <ActivityIndicator size="large" color="#48C445" />
          </View>
          )}

          <View style={styles.containerButtons}>
            <AddButton label='Adicionar Athlética'
              handleClick={() => { navigation.navigate('RegisterUser', { isEditing: false, isAdmUser: isAdm }) }}
            />
          </View>
        </ScrollView>

      </SafeAreaView>
    </TouchableWithoutFeedback >
  );
}