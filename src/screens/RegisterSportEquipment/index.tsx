import React, { useState } from 'react';
import { Alert, Keyboard, ScrollView, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';

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
import { InputFormText, InputFormTextMask } from '../../components/InputForm';
import { TextInputMask } from 'react-native-masked-text';
import { validatePhoneNumber } from '../../utils/validatePhoneNumber';

type routeParams = {
    sportEquipment: ISportsEquipments;
    isEditing: boolean;
};

export function RegisterSportEquipment() {

    const navigation = useNavigation();

    const route = useRoute();

    const isKeyboardVisible = useKeyboardVisibility();

    const { sportEquipment, isEditing } = route.params as routeParams;

    const [isEditMode] = useState<boolean>(isEditing);
    const [sportEquipmentName, setSportEquipmentName] = useState<string>(sportEquipment?.equipment_name ?? '');
    const [sport, setSport] = useState<string>(sportEquipment?.sport ?? '');
    const [materialCarrier, setMaterialCarrier] = useState<string>(sportEquipment?.material_carrier ?? '');
    const [phone, setPhone] = useState<string>(sportEquipment?.phone ?? '');
    const [price, setPrice] = useState<string>(sportEquipment?.price ? String(Number(sportEquipment?.price ?? 0) * 100) : '');
    const [image, setImage] = useState<string | undefined>(sportEquipment?.image ?? '');
    const [priceUnmasked, setPriceUnmasked] = useState<any>();
    const [isSportEquipmentActive, setIsSportEquipmentActive] = useState<boolean>(isEditMode && sportEquipment ? Boolean(sportEquipment.is_active) : true);
    const [on, off] = useState(isEditMode && sportEquipment ? Boolean(sportEquipment.is_active) : true);

    const validatedForm = () => {
        let isValid = true;

        if(sportEquipmentName === '' || sportEquipmentName === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DESCRIÇÃO', 'A descrição do material esportivo é obrigatória.');
        }

        if(materialCarrier === '' || materialCarrier === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM O PORTADOR', 'O portador do material é obrigatório.');
        }
        
        if(phone === '' || phone === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM O NÚMERO', 'O número de telefone é obrigatório.');
        }

        if(price === '' || price === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM O PREÇO', 'O preço do material esportivo é obrigatório.');
        }

        return isValid;
    }

    const handleSubmit = async () => {
        if(!validatedForm()) {
            return;
        }

        const unmaskedPrice = priceUnmasked.getRawValue()

        const sportEquipmentPayload = {
            equipment_name: sportEquipmentName,
            sport: sport,
            price: Number(unmaskedPrice ?? 0),
            image: image,
            is_active: isSportEquipmentActive,
            phone: phone,
            material_carrier: materialCarrier
        };

        try {
            const token = await getToken();

            if (isEditMode) {
                await requestApi(`/sport-equipments/${sportEquipment.id}`, 'PUT', sportEquipmentPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Equipamento esportivo atualizado com sucesso!', [
                    {
                        text: 'OK', onPress: () => { navigation.navigate('ListSportsEquipments', {}) }
                    },
                ]);
            } else {
                await requestApi('/sport-equipments/', 'POST', sportEquipmentPayload,
                    {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                );
                Alert.alert('SUCESSO', 'Equipamento esportivo cadastrado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.goBack()
                    },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar equipamento esportivo:', error);
            Alert.alert('Erro', 'Preencha os campos obrigatorios !');
        }
    };

    const toggleSwitch = () => {
        off(!on);
        setIsSportEquipmentActive(previousState => !previousState);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>
                    <Header
                        title={isEditMode ? 'Alterar Material Esportivo' : 'Cadastrar Material Esportivo'}
                        subtitle={isEditMode ? 'Alterar material esportivo' : 'Adicionar material esportivo'}
                        userImage={require('../../assets/img/Logos/logo3.png')}
                        handleClickDisconnect={logout}
                    />
                    <View style={styles.containerInputs}>
                        <InputFormText
                            label='Descrição:*'
                            value={sportEquipmentName}
                            onChangeText={setSportEquipmentName}
                        />

                        <InputFormText
                            label='Portador do material:*'
                            value={materialCarrier}
                            onChangeText={setMaterialCarrier}
                        />

                        <InputFormTextMask label='Número para contato:*'
                            value={phone}
                            onChangeText={setPhone}
                            onBlur={() => validatePhoneNumber(phone)}
                            placeholder='(00) 00000-0000'
                        />

                        <InputFormText
                            label='Esporte:'
                            value={sport}
                            onChangeText={setSport}
                        />

                        <View style={styles.boxInputs}>
                            <Text style={styles.labelInputs}>Estimativa de valor:*</Text>
                            <TextInputMask style={styles.placeholderInput}
                            placeholder='R$ 0,00'
                                type={'money'}
                                options={{
                                    precision: 2,
                                    separator: ',',
                                    delimiter: '.',
                                    unit: 'R$ ',
                                    suffixUnit: ''
                                }}
                                value={price}
                                onChangeText={setPrice}
                                ref={(ref) => setPriceUnmasked(ref)}
                            />
                        </View>
                            

                        <View style={styles.inputs}>
                            <InputFormFile
                                label='Imagem: '
                                title='Selecione uma imagem'
                                onChangeImage={setImage}
                                defaultValue={image}
                            />
                        </View>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Material ativo</Text>
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
            </SafeAreaView>
        </TouchableWithoutFeedback >
    );
}