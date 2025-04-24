import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { InputFormText } from '../../components/InputForm';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, ReturnButton } from '../../components/ButtonComponent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import { logout } from '../../utils/logout';
import { getToken } from '../../utils/getToken';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';
import { TextInputMask } from 'react-native-masked-text';
import { IChampionship } from '../../Models/Championship';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type routeParams = {
    championship: IChampionship;
    isEditing: boolean;
};


export function RegisterChampionships() {



    const navigation = useNavigation();

    const route = useRoute();
    const { championship, isEditing } = route.params as routeParams;

    const isKeyboardVisible = useKeyboardVisibility();

    const [championshipDescription, setChampionshipDescription] = useState<string>(isEditing ? championship.description : '');
    const [championshipModality, setChampionshipModality] = useState<string>(isEditing ? championship.modality : '');
    const [championshipStartDate, setChampionshipStartDate] = useState<string>(isEditing ? championship.start_date.toString() : '');
    const [championshipEndDate, setChampionshipEndDate] = useState<string>(isEditing ? championship.end_date.toString() : '');
    const [championshipLocation, setChampionshipLocation] = useState<string>(isEditing ? championship.location : '');
    const [championshipResult, setChampionshipResult] = useState<string>(isEditing ? championship.results : '');
    const [on, off] = useState(isEditing && championship ? Boolean(championship.is_active) : true);//estado do switch
    const [isChampionshipActive, setIsChampionshipActive] = useState<boolean>(isEditing && championship ? Boolean(championship.is_active) : true);

    const handleSubmit = async () => {

        const startDate = parse(championshipStartDate, 'dd/MM/yyyy', new Date(), { locale: ptBR });
        const endDate = parse(championshipEndDate, 'dd/MM/yyyy', new Date(), { locale: ptBR });

        const formattedStartDate = format(!isEditing ? startDate : championshipStartDate, 'yyyy-MM-dd');
        const formattedEndDate = format(!isEditing ? endDate : championshipEndDate, 'yyyy-MM-dd');

        const clientPayload = {
            description: championshipDescription,
            modality: championshipModality,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            location: championshipLocation,
            results: championshipResult,
            is_active: isChampionshipActive
        };

        try {
            const token = await getToken();

            if (isEditing) {
                await requestApi(`/championships/${championship.id}`, 'PUT', clientPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Campeonato atualizado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.navigate('ListChampionships')
                    },
                ]);
            } else {
                await requestApi('/championships', 'POST', clientPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('SUCESSO', 'Campeonato cadastrado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.goBack()
                    },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar campeonato:', error);
            Alert.alert('Erro', 'Preencha os campos obrigatorios !');
        }
    }

    const toggleSwitch = () => {
        off(!on);
        setIsChampionshipActive(previousState => !previousState);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header
                    title={isEditing ? 'Alterar competição' : `Cadastro de competição`}
                    subtitle={isEditing ? 'Altereção no sistema' : 'Cadastro no sistema'}
                    userImage={require('../../assets/img/Logos/logo3.png')}
                    handleClickDisconnect={logout}
                />
                <View style={styles.container}>
                    <ScrollView style={{ width: '100%', paddingHorizontal: 20 }}>
                        <View style={styles.containerInputs}>
                            <InputFormText label='Descrição:'
                                autoCorrect={false}
                                value={championshipDescription}
                                onChangeText={setChampionshipDescription} />

                            <InputFormText label='Modalidade:'
                                autoCorrect={false}
                                value={championshipModality}
                                onChangeText={setChampionshipModality}
                            />

                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <View style={[styles.inputs, {
                                    flex: 1
                                }]}>
                                    <Text style={styles.labelInputs} >Data Inicial:</Text>
                                    <TextInputMask style={styles.placeholderInput}
                                        placeholder='DD/MM/YYYY'
                                        type={'datetime'}
                                        options={{
                                            format: 'DD/MM/YYYY'
                                        }}
                                        value={championshipStartDate}
                                        onChangeText={setChampionshipStartDate}
                                    />
                                </View>

                                <View style={[styles.inputs, { flex: 1 }]}>
                                    <Text style={styles.labelInputs} >Data Final:</Text>
                                    <TextInputMask style={styles.placeholderInput}
                                        placeholder='DD/MM/YYYY'
                                        type={'datetime'}
                                        options={{
                                            format: 'DD/MM/YYYY'
                                        }}
                                        value={championshipEndDate}
                                        onChangeText={setChampionshipEndDate}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputs} >
                                <InputFormText label='Local:'
                                    autoCorrect={false}
                                    value={championshipLocation}
                                    onChangeText={setChampionshipLocation} />
                            </View>

                            <View style={styles.inputs} >
                                <InputFormText label='Resultados:'
                                    autoCorrect={false}
                                    value={championshipResult}
                                    onChangeText={setChampionshipResult} />
                            </View>

                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Campeonato Ativo</Text>
                                <Switch
                                    value={on}
                                    onValueChange={toggleSwitch}
                                    trackColor={{false: '#767577', true: '#48C445'}}
                                    thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                                />
                            </View>
                        </View>
                        {!isKeyboardVisible && (
                            <View style={styles.containerButtons}>
                                <ReturnButton label="Cancelar" handleClick={() => navigation.goBack()} />
                                <AddButton label={isEditing ? 'Confirmar' : 'Cadastrar'} handleClick={handleSubmit} />
                            </View>
                        )}
                    </ScrollView>
                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}