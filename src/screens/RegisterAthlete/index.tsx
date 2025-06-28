import React, { useEffect, useState } from 'react';
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
import { validationCPF } from '../../utils/validationCPF';

type routeParams = {
    team: ITeam;
    athlete: IAthlete;
    isEditing: boolean;
};


export function RegisterAthlete() {
    const navigation = useNavigation();

    const route = useRoute();
    const { athlete: athlete, isEditing, team } = route.params as routeParams;
    const [isEditingAthlete, setIsEditingAthlete] = useState<boolean>(isEditing);
    const [editAtthlete, setEditAthlete] = useState<IAthlete | undefined>(athlete);

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
    const [isDigitCPF, setIsDigitCPF] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            const unmaskedCpfAthlete = cpfUnmasked?.getRawValue()

            if(unmaskedCpfAthlete) {
                const isValid = validationCPF(unmaskedCpfAthlete);

                if(!isValid) {
                    Alert.alert('PROBLEMA COM O CPF', 'O CPF informado é inválido.');

                    return
                }
            }

            const clientPayload = {
                name: athleteName,
                number: athleteNumber,
                course: athleteCourse,
                period: athletePeriod,
                athlete_image: athleteImage ?? undefined,
                proof_registration: athleteProofRegistration ?? undefined,
                registration: athleteRegistration ?? undefined,
                cpf: unmaskedCpfAthlete,
                team_id: team?.id ?? athlete?.team_id,
                is_active: isAthleteActive
            };

            const token = await getToken();

            if (isEditingAthlete) {
                await requestApi(`/athletes/${editAtthlete?.id}`, 'PUT', clientPayload, {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });

                Alert.alert('Sucesso', 'Atleta atualizado com sucesso!', [
                    {
                        text: 'OK', onPress: () => navigation.navigate('ListAthletes', { isEditing: false })
                    },
                ]);
            } else {
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
        } catch (error: any) {
            if(error?.status === 400) {
                Alert.alert('Erro', 'Atleta já cadastrado em outra equipe desse esporte !');
            } else if(error?.status === 404) {
                Alert.alert('Erro', 'Atleta já cadastrado em outra equipe desse esporte !');
            } else {
                Alert.alert('Erro', 'Preencha os campos obrigatorios !');
            }
        }
    }

    const toggleSwitch = () => {
        off(!on);
        setIsAthleteActive(previousState => !previousState);
    }

    async function getAthletaByCPF(cpf: string) {
        try {
            const token = await getToken();

            const response = await requestApi(`/athletes/find/cpf/${cpf}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            })

            setIsDigitCPF(true);

            const athlete = response.data as  IAthlete; 

            setAthleteName(athlete.name);
            setAthleteNumber(athlete.number);
            setAthleteCourse(athlete.course);
            setAthletePeriod(athlete.period);
            setAthleteImage(athlete.athlete_image);
            setAthleteProofRegistration(athlete.proof_registration);
            setAthleteRegistration(athlete.registration);
            setIsAthleteActive(athlete.is_active);

            setEditAthlete(athlete);
            setIsEditingAthlete(true);
        } catch(err) {
            setIsDigitCPF(true);
            setAthleteName('');
            setAthleteNumber('');
            setAthleteCourse('');
            setAthletePeriod(0);
            setAthleteImage(undefined);
            setAthleteProofRegistration(undefined);
            setAthleteRegistration(undefined);

            setEditAthlete(undefined);
            setIsEditingAthlete(false);
        }
    }

    useEffect(() => {
        if(athleteCpf && athleteCpf !== '') {
            const cpf = athleteCpf.replace(/[^\d]/g, '');

            if(cpf.length === 11) {
                getAthletaByCPF(cpf)
            }
        }
    }, [athleteCpf])

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
                                <View
                                    style={{
                                        width: '100%',
                                        marginBottom: 12
                                    }}
                                >
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
                                <InputText 
                                    label='Nome do atleta:*'
                                    autoCorrect={true}
                                    placeholder='Digite o nome do atleta'
                                    onChangeText={setAthleteName}
                                    value={athleteName}
                                    disabled={!isDigitCPF}
                                />

                                <InputFormTextMask label='Número:*'
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    value={athleteNumber}
                                    onChangeText={setAthleteNumber}
                                    onBlur={() => validatePhoneNumber(athleteNumber)} 
                                    disabled={!isDigitCPF}
                                />

                                <View style={styles.inputs} >
                                    <View style={{ width: '70%', paddingRight: 21  }}>
                                        <InputFormText label='Curso:*'
                                            autoCorrect={false}
                                            value={athleteCourse}
                                            onChangeText={setAthleteCourse} 
                                            disabled={!isDigitCPF}
                                        />
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <InputFormText 
                                            label='Período:*'
                                            keyboardType='numeric'
                                            autoCorrect={false}
                                            value={athletePeriod.toString()}
                                            onChangeText={(text) => setAthletePeriod(Number(text))} 
                                            disabled={!isDigitCPF}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 24, gap: 24, marginBottom: 24 }}>
                                    <InputFormFile 
                                        label='Imagem do atleta:'
                                        onChangeImage={setAthleteImage}
                                        title='Carregar Imagem'
                                        defaultValue={athleteImage}
                                        disabled={!isDigitCPF}
                                    />

                                    <InputFormFile 
                                        label='Comprovante de matrícula:'
                                        onChangeImage={setAthleteProofRegistration}
                                        title='Comprovante de matrícula'
                                        defaultValue={athleteProofRegistration}
                                        disabled={!isDigitCPF}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    <View style={{ flex: 1 }} >
                                        <InputFormText 
                                            label='Número matrícula:*'
                                            value={athleteRegistration}
                                            placeholder='xxxxxxxxxxxxxx'
                                            onChangeText={setAthleteRegistration} 
                                            disabled={!isDigitCPF}
                                        />
                                    </View>
                                </View>

                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchLabel}>Atleta Ativo</Text>
                                    <Switch
                                        value={on}
                                        onValueChange={toggleSwitch}
                                        trackColor={{false: '#767577', true: '#48C445'}}
                                        thumbColor={on ? '#FFFFFF' : '#f4f3f4'}
                                        disabled={!isDigitCPF}
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