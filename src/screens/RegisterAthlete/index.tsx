import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { styles } from './styles';
import { InputFormText, InputFormTextMask } from '../../components/InputForm';
import { BoxInfo } from '../../components/BoxInfo';
import { AddButton, ReturnButton } from '../../components/ButtonComponent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import { logout } from '../../utils/logout';
import { getToken } from '../../utils/getToken';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';
import { IAthlete } from '../../Models/Athlete';
import { validatePhoneNumber } from '../../utils/validatePhoneNumber';
import { TextInputMask } from 'react-native-masked-text';
import { InputFormFile } from '../../components/InputFormFile';
import { ITeam } from '../../Models/Teams';
import { InputText } from '../../components/Inputs';
import { BG_DEFAULT } from '../../utils/styleDefaults';

type routeParams = {
    team: ITeam;
    athlete: IAthlete;
    isEditing: boolean;
};


export function RegisterAthlete() {
    const navigation = useNavigation();

    const route = useRoute();
    const { athlete: athlete, isEditing, team } = route.params as routeParams;

    const [athleteName, setAthleteName] = useState<string>(isEditing ? athlete?.name : '');
    const [athleteNumber, setAthleteNumber] = useState<string>(isEditing ? athlete?.number : '');
    const [athleteCourse, setAthleteCourse] = useState<string>(isEditing ? athlete?.course : '');
    const [athletePeriod, setAthletePeriod] = useState<number>(isEditing ? athlete?.period : 0);
    const [athleteImage, setAthleteImage] = useState<string | undefined>(athlete?.athlete_image);
    const [athleteProofRegistration, setAthleteProofRegistration] = useState<string | undefined>(athlete?.proof_registration);
    const [athleteRegistration, setAthleteRegistration] = useState<string | undefined>(isEditing ? (athlete?.registration === '1' ? undefined : athlete?.registration) : '');
    const [athleteCpf, setAthleteCpf] = useState<string>(isEditing ? athlete?.cpf : '');
    const [cpfUnmasked, setCpfUnmasked] = useState<any>();
    const [isAthleteActive, setIsAthleteActive] = useState<boolean>(isEditing && athlete ? Boolean(athlete.is_active) : true);
    const [on, off] = useState(isEditing && athlete ? Boolean(athlete.is_active) : true);

    const handleSubmit = async () => {
        const unmaskedCpfAthlete = cpfUnmasked.getRawValue()

        const clientPayload = {
            name: athleteName,
            number: athleteNumber,
            course: athleteCourse,
            period: athletePeriod,
            athlete_image: athleteImage ?? undefined,
            proof_registration: athleteProofRegistration ?? undefined,
            registration: athleteRegistration ?? undefined,
            cpf: unmaskedCpfAthlete,
            team_id: team.id,
            is_active: isAthleteActive
        };

        console.log('clientPayload', clientPayload)

        try {
            const token = await getToken();

            if (isEditing) {
                await requestApi(`/athletes/${athlete.id}`, 'PUT', clientPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Atleta atualizado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.navigate('ListAthletes', { isEditing: false })
                    },
                ]);
            } else {
                console.log('clientPayload 222', clientPayload)

                await requestApi('/athletes', 'POST', clientPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('SUCESSO', 'Atleta cadastrado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.goBack()
                    },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar atleta:', error);
            Alert.alert('Erro', 'Preencha os campos obrigatorios !');
        }
    }

    const toggleSwitch = () => {
        off(!on);
        setIsAthleteActive(previousState => !previousState);
    }


    return (
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ backgroundColor: BG_DEFAULT }}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: BG_DEFAULT }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <SafeAreaView style={styles.safeArea}>
                    <Header
                        title={isEditing ? 'Alterar Atleta' : 'Cadastrar Atleta'}
                        subtitle={isEditing ? 'Alterar atleta no sistema' : 'Cadastrar atleta no sistema'}
                        userImage={require('../../assets/img/Logos/logo3.png')}
                        handleClickDisconnect={logout}
                    />
                    <View style={styles.container}>
                        <ScrollView style={{ maxWidth: '100%' }}>
                            <View style={styles.containerInputs}>
                                
                                <InputText 
                                    label='Nome do atleta:*'
                                    autoCorrect={true}
                                    placeholder='Digite o nome do atleta'
                                    onChangeText={setAthleteName}
                                    value={athleteName}
                                />

                                <InputFormTextMask label='Número:*'
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    value={athleteNumber}
                                    onChangeText={setAthleteNumber}
                                    onBlur={() => validatePhoneNumber(athleteNumber)} />

                                <View style={styles.inputs} >
                                    <View style={{ width: '70%', paddingRight: 21  }}>
                                        <InputFormText label='Curso:*'
                                            autoCorrect={false}
                                            value={athleteCourse}
                                            onChangeText={setAthleteCourse} />
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <InputFormText label='Período:*'
                                        keyboardType='numeric'
                                        autoCorrect={false}
                                        value={athletePeriod.toString()}
                                        onChangeText={(text) => setAthletePeriod(Number(text))} />
                                    </View>
                                </View>

                                <View style={{ marginTop: 24, gap: 24, marginBottom: 24 }}>
                                    <InputFormFile 
                                        label='Imagem do atleta:'
                                        onChangeImage={setAthleteImage}
                                        title='Carregar Imagem'
                                        defaultValue={athleteImage}
                                    />

                                    <InputFormFile 
                                        label='Comprovante de matrícula:'
                                        onChangeImage={setAthleteProofRegistration}
                                        title='Comprovante de matrícula'
                                        defaultValue={athleteProofRegistration}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    <View style={{ flexDirection: 'column', gap: 16, width: '50%' }}>
                                        <Text style={styles.labelInputs} >CPF:*</Text>
                                        <TextInputMask 
                                            style={styles.placeholderInput}
                                            value={athleteCpf}
                                            onChangeText={setAthleteCpf}
                                            placeholder='xxx.xxx.xxx-xx'
                                            type={'cpf'}
                                            ref={(ref) => setCpfUnmasked(ref)}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <InputFormText 
                                            label='Número matrícula:'
                                            value={athleteRegistration}
                                            placeholder='xxxxxxxxxxxxxx'
                                            onChangeText={setAthleteRegistration} />
                                    </View>
                                </View>

                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchLabel}>Atleta Ativo</Text>
                                    <Switch
                                        value={on}
                                        onValueChange={toggleSwitch}
                                        trackColor={{false: '#767577', true: '#48C445'}}
                                        thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                                    />
                                </View>
                            </View>
                            <View style={styles.containerButtons}>
                                <ReturnButton label="Cancelar" handleClick={() => navigation.goBack()} />
                                <AddButton label={isEditing ? 'Confirmar' : 'Cadastrar'} handleClick={handleSubmit} />
                            </View>
                        </ScrollView>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        // </TouchableWithoutFeedback>
    );
}