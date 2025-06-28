import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
import { format, isAfter, isEqual, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DropDownPicker from 'react-native-dropdown-picker';
import { SportType, Teams } from '../RegisterFriendly';

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
    const [championshipStartDate, setChampionshipStartDate] = useState<string>(isEditing ? format(new Date(championship.start_date), 'dd/MM/yyyy') : '');
    const [championshipEndDate, setChampionshipEndDate] = useState<string>(isEditing ? format(new Date(championship.end_date), 'dd/MM/yyyy') : '');
    const [championshipLocation, setChampionshipLocation] = useState<string>(isEditing ? championship.location : '');
    const [championshipResult, setChampionshipResult] = useState<string>(isEditing ? championship.results : '');
    const [on, off] = useState(isEditing && championship ? Boolean(championship.is_active) : true);//estado do switch
    const [isChampionshipActive, setIsChampionshipActive] = useState<boolean>(isEditing && championship ? Boolean(championship.is_active) : true);
    const [open, setOpen] = useState<boolean>(false);
    const [teamsSelected, setTeamsSelected] = useState<string[]>(isEditing ? JSON.parse(championship.teams) : []);
    const [teams, setTeams] = useState<Teams[]>([]);

    function parseDate(dateStr: string) {
        return parse(dateStr, 'dd/MM/yyyy', new Date());
    }
    
    function isValidDate(dateStr: string) {
        const date = parseDate(dateStr);
        return isValid(date) && dateStr.length === 10; // Garante formato dd/MM/yyyy
    }
    
    function isEndDateAfterStart(startStr: string, endStr: string) {
        const startDate = parseDate(startStr);
        const endDate = parseDate(endStr);
    
        return isAfter(endDate, startDate) || isEqual(endDate, startDate);
    }

    const validatedForm = () => {
        let isValid = true;

        if(championshipDescription === '' || championshipDescription === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DESCRIÇÃO', 'A descrição do campeonato é obrigatória.');
        }

        if(teamsSelected.length === 0) {
            isValid = false;
            return Alert.alert('PROBLEMA COM AS EQUIPES', 'As equipes do campeonato são obrigatórias.');
        }

        if(championshipStartDate === '' || championshipStartDate === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA INICIAL', 'A data inicial do campeonato é obrigatória.');
        }

        if(!isValidDate(championshipStartDate)) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA INICIAL', 'A data inicial do campeonato é inválida.');
        }
        

        if(championshipEndDate === '' || championshipEndDate === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA FINAL', 'A data final do campeonato é obrigatória.');
        }

        if(!isValidDate(championshipEndDate)) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA FINAL', 'A data final do campeonato é inválida.');
        }

        if(!isEndDateAfterStart(championshipStartDate, championshipEndDate)) {
            isValid = false;
            return Alert.alert('PROBLEMA COM A DATA FINAL', 'A data final do campeonato é menor que a data inicial.');
        }

        if(championshipLocation === '' || championshipLocation === undefined) {
            isValid = false;
            return Alert.alert('PROBLEMA COM O LOCAL', 'O local do campeonato é obrigatório.');
        }

        return isValid;
    }

    const handleSubmit = async () => {
        if(!validatedForm()) {
            return;
        }

        const startDate = parse(championshipStartDate, 'dd/MM/yyyy', new Date(), { locale: ptBR });
        const endDate = parse(championshipEndDate, 'dd/MM/yyyy', new Date(), { locale: ptBR });

        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        const clientPayload = {
            description: championshipDescription,
            teams: teamsSelected,
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
        setIsChampionshipActive(previousState => !previousState);
    }

    useEffect(() => {
        loadTeams();
    }, []);

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
                            <InputFormText label='Descrição:*'
                                autoCorrect={false}
                                value={championshipDescription}
                                onChangeText={setChampionshipDescription} />

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
                                                    setTeamsSelected(current => {
                                                        if(current.includes(String(props.value))) {
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

                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <View style={[styles.inputs, {
                                    flex: 1
                                }]}>
                                    <Text style={styles.labelInputs} >Data Inicial:*</Text>
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
                                    <Text style={styles.labelInputs} >Data Final:*</Text>
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
                                <InputFormText label='Local:*'
                                    autoCorrect={false}
                                    value={championshipLocation}
                                    onChangeText={setChampionshipLocation} />
                            </View>

                            <View style={styles.inputs} >
                                <InputFormText label='Observação/Ocorrência:'
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