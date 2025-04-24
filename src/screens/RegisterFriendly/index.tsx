import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Switch, TouchableWithoutFeedback, View, Text } from 'react-native';

import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddButton, ReturnButton } from '../../components/ButtonComponent';
import { Header } from '../../components/Header';
import { logout } from '../../utils/logout';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';
import { ISportsEquipments } from '../../Models/SportsEquipments';
import { BoxInfo } from '../../components/BoxInfo';
import { InputFormFile } from '../../components/InputFormFile';
import { InputFormText, InputFormTextMask, InputFormTextMaskDatetime } from '../../components/InputForm';
import { IFriendlys } from '../../Models/Friendlys';
import { format, parse } from 'date-fns';

type routeParams = {
    friendly: IFriendlys;
    isEditing: boolean;
};

export function RegisterFriendly() {

    const navigation = useNavigation();

    const route = useRoute();

    const isKeyboardVisible = useKeyboardVisibility();

    const { friendly, isEditing } = route.params as routeParams;

    const [isEditMode] = useState<boolean>(isEditing);
    const [description, setDescription] = useState<string>(friendly?.description ?? '');
    const [modality, setModality] = useState<string>(friendly?.modality ?? '');
    const [date, setDate] = useState<string>(friendly?.date ? format(new Date(friendly.date), 'dd/MM/yyyy') : '');
    const [locale, setLocale] = useState<string>(friendly?.location ?? '');
    const [result, setResult] = useState<string | undefined>(friendly?.results ?? '');
    const [isFriendlyActive, setIsFriendlyActive] = useState<boolean>(isEditing && friendly ? Boolean(friendly.is_active) : true);
    const [on, off] = useState(isEditing && friendly ? Boolean(friendly.is_active) : true);

    const handleSubmit = async () => {
        const parserDate = parse(date, 'dd/MM/yyyy', new Date())
        const today = new Date()
        today.setHours(0, 0, 0, 0) 

        if(parserDate < today) {
            Alert.alert('ATENÇÃO', 'A data informada não pode ser anterior a data atual!');
            return
        }

        const formattedDate = format(parserDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

        const friendlyPayload = {
            description: description,
            modality: modality,
            date: formattedDate,
            location: locale,
            results: result,
            is_active: isFriendlyActive
        };

        try {
            const token = await getToken();

            if (isEditMode) {
                await requestApi(`/friendlys/${friendly.id}`, 'PUT', friendlyPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Amistoso atualizado com sucesso!', [
                    {
                        text: 'OK', onPress: () => {navigation.navigate('ListFrindlys', {})}
                    },
                ]);
            } else {
                await requestApi('/friendlys', 'POST', friendlyPayload,
                    {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                );
                Alert.alert('SUCESSO', 'Amistoso cadastrado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.goBack()
                    },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar amistoso:', error);
            Alert.alert('Erro', 'Preencha os campos obrigatorios !');
        }
    };

    const toggleSwitch = () => {
        off(!on);
        setIsFriendlyActive(previousState => !previousState);
    }

    return (
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                    flex: 1,
                }}
            >
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',                    
                }}>
                    <Header
                        title={isEditMode ? ' Alterar Amistoso' : `Cadastrar Amistoso`}
                        subtitle={isEditMode ? 'Alterar amistoso no sistema' : 'Cadastrar amistoso no sistema'}
                        userImage={require('../../assets/img/Logos/logo3.png')}
                        handleClickDisconnect={logout}
                    />

                    <View style={styles.containerInputs}>
                        <InputFormText 
                            label='Descrição:*'
                            value={description}
                            onChangeText={setDescription}
                        />

                        <InputFormText 
                            label='Modalidade:*'
                            value={modality}
                            onChangeText={setModality}
                        />

                        <View style={{ width: 142 }}>
                            <InputFormTextMaskDatetime
                                label=' Data:*'
                                value={date}
                                onChangeText={setDate}
                                placeholder="DD/MM/YYYY"
                            />
                        </View>

                        <InputFormText 
                            label='Local:*'
                            value={locale}
                            onChangeText={setLocale}
                        />

                        <View style={{ width: 182 }}>
                            <InputFormText 
                                label='Resultado:'
                                value={result}
                                onChangeText={setResult}
                            />
                        </View>


                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Amistoso Ativo</Text>
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
                            <AddButton label={isEditMode ? 'Confirmar' : 'Cadastrar'} handleClick={handleSubmit} />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
        // </TouchableWithoutFeedback >
    );
}