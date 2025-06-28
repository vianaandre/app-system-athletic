import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, View, Text, TouchableOpacity } from 'react-native';

import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddButton, ReturnButton } from '../../components/ButtonComponent';
import { Header } from '../../components/Header';
import { logout } from '../../utils/logout';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import { getToken } from '../../utils/getToken';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';
import { InputFormText, InputFormTextMaskDatetime } from '../../components/InputForm';
// import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import { IFriendlys } from '../../Models/Friendlys';
import { format, isValid, parse } from 'date-fns';

type routeParams = {
    friendly: IFriendlys;
    isEditing: boolean;
};

export enum SportType {
    SportMasculine = 'Esporte Masculino',
    SportFeminine = 'Esporte Feminino',
    Sport = 'Esporte Misto',
    ESport = 'Esportes Eletrônicos'
}

export type Teams = {
    id: string;
    name: string;
    maximum_athletes: number;
    is_active: boolean;
    created_at: string;
    sport_id: string;
    sports: {
        id: string;
        name: string;
        maximum_teams: number;
        is_active: boolean;
        type: string;
        created_at: string;
        user_id: string;
    }
}

export function RegisterFriendly() {

    const navigation = useNavigation();

    const route = useRoute();

    const isKeyboardVisible = useKeyboardVisibility();

    const { friendly, isEditing } = route.params as routeParams;

    const [isEditMode] = useState<boolean>(isEditing);
    const [description, setDescription] = useState<string>(friendly?.description ?? '');
    const [date, setDate] = useState<string>(friendly?.date ? format(new Date(friendly.date), 'dd/MM/yyyy') : '');
    const [locale, setLocale] = useState<string>(friendly?.location ?? '');
    const [result, setResult] = useState<string | undefined>(friendly?.results ?? '');
    const [isFriendlyActive, setIsFriendlyActive] = useState<boolean>(isEditing && friendly ? Boolean(friendly.is_active) : true);
    const [on, off] = useState(isEditing && friendly ? Boolean(friendly.is_active) : true);
    const [open, setOpen] = useState<boolean>(false);
    const [teamsSelected, setTeamsSelected] = useState<string[]>(friendly?.teams && isEditing ? JSON.parse(friendly.teams) : []);
    const [teams, setTeams] = useState<Teams[]>([]);

    function parseDate(dateStr: string) {
        return parse(dateStr, 'dd/MM/yyyy', new Date());
    }

    function isValidDate(dateStr: string) {
        const date = parseDate(dateStr);
        return isValid(date) && dateStr.length === 10; // Garante formato dd/MM/yyyy
    }

    function validatedForm() {
        let isValid = true;

        if(description === '' || description === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DESCRIÇÃO', 'A descrição do amistoso é obrigatória.');
        }

        if(teamsSelected.length === 0) {
            isValid = false;
            return Alert.alert('PROBLEMA COM AS EQUIPES', 'As equipes do amistoso são obrigatórias.');
        }

        if(date === '' || date === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA', 'A data do amistoso é obrigatória.');
        }

        if(!isValidDate(date)) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA', 'A data do amistoso é inválida.');
        }

        if(locale === '' || locale === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM O LOCAL', 'O local do amistoso é obrigatório.');
        }

        return isValid;
    }

    const handleSubmit = async () => {
        if(!validatedForm()) {
            return;
        }

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
            teams: teamsSelected,
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

    const loadTeams = async () => {
        try {
            const token = await getToken();
            const response = await requestApi('/teams/user', 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });
            setTeams(response.data);
        } catch (error) {
            console.error('Erro ao carregar equipes:', error);
        }
    }

    const toggleSwitch = () => {
        off(!on);
        setIsFriendlyActive(previousState => !previousState);
    }

    useEffect(() => {
        loadTeams();
    }, []);

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

                        <View
                            style={{
                                marginBottom: 0,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#FFFFFF",
                                    paddingBottom: 16,
                                }}
                            >Equipes:* {teamsSelected.length > 0 ? `(${teamsSelected.length})` : ''}</Text>
                            <DropDownPicker
                                open={open}
                                value={teamsSelected}
                                items={teams.map((team) => ({
                                    label: `${team.name} (${team.name} - ${SportType[team.sports.type as keyof typeof SportType]})`,
                                    value: team.id,
                                }))}
                                renderListItem={(props) => {
                                    const findTeam = teams.find((team) => team.id === props.value);

                                    const label = `${findTeam?.name} (${findTeam?.name} - ${SportType[findTeam?.sports.type as keyof typeof SportType]})`;

                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTeamsSelected((current: string[]) => {
                                                    if(current && current.includes(String(props.value))) {
                                                        return current.filter((team) => team !== String(props.value));
                                                    }

                                                    return [...current, String(props.value)];
                                                });
                                            }}
                                            style={{
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                borderRadius: 10,
                                                backgroundColor: '#FFFFFF',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: '#000000',
                                                }}
                                            >{label}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                setOpen={setOpen}
                                setValue={setTeamsSelected}
                                setItems={setTeams}
                                theme="LIGHT"
                                listMode='SCROLLVIEW'
                                placeholder='Selecione as equipes'
                                multiple={true}
                                multipleText={`${teamsSelected.length} Equipes selecionadas`}
                                badgeStyle={{
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    marginRight: 6,
                                    marginBottom: 6,
                                    height: 'auto',
                                    paddingVertical: 4,
                                }}
                                badgeTextStyle={{
                                    flexWrap: 'nowrap',
                                    textAlign: 'left', 
                                }}
                                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                style={{
                                    width: '100%',
                                    alignItems: "center",
                                    height: 42,
                                    backgroundColor: "#FFFFFF",
                                    paddingLeft: 10,
                                    borderRadius: 20,
                                }}
                            />

                            {teams.length > 0 && (
                                <View style={{ flexDirection: 'column', marginTop: 18, gap: 12 }}>
                                    {teamsSelected.map((team) => {
                                        const findTeam = teams.find((t) => t.id === team);
                                        return (
                                            <View style={{ 
                                                flexDirection: 'row', alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                backgroundColor: '#FFFFFF',
                                                padding: 10,
                                                borderRadius: 20,
                                            }} key={team}>
                                                <Text>{`${findTeam?.name} (${findTeam?.name} - ${SportType[findTeam?.sports.type as keyof typeof SportType]})`}</Text>
                                                <TouchableOpacity onPress={() => {
                                                    setTeamsSelected(current => current.filter((t) => t !== team));
                                                }}>
                                                    <Text>X</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </View>

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
                                label='Observação/Ocorrência:'
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