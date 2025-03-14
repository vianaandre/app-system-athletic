import React, { useEffect, useState } from 'react';
import { Image, Keyboard, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { InputPassword, InputText } from '../../components/Inputs';
import { PrimaryButton } from '../../components/ButtonComponent';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';

export function NewPaswd() {

    const navigation = useNavigation();

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const isKeyboardVisible = useKeyboardVisibility();


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <View style={isKeyboardVisible ? [styles.container, { justifyContent: 'flex-start' }] : styles.container}>

                    <View style={styles.containerImage}>
                        <Image source={require("../../assets/img/logo-login.png")}
                            style={isKeyboardVisible ? styles.imageSmall : styles.imageLarge}
                            resizeMode='contain' />
                    </View>

                    <View style={styles.containerTitle}>
                        <Text style={styles.titleText}>Informe sua nova senha</Text>
                        <Text style={styles.subTitleText}>Informe suas credenciais</Text>
                    </View>

                    <View style={styles.containerInputs}>
                        <InputText
                            label='Nova senha'
                            placeholder='Informe sua senha'
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            autoCorrect={false}
                        />

                        <InputPassword
                            label='Repetir senha'
                            placeholder='Repita sua nova senha'
                            secureTextEntry={true}
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            autoCorrect={false}
                        />

                        {/* Botão para alternar visibilidade da senha */}
                        <TouchableOpacity
                            style={styles.showPasswordButton}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Text style={styles.showPasswordText}>
                                {isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.containerButtons}>
                        <PrimaryButton label='Cancelar'
                            handleClick={() => { navigation.navigate('Login') }} />
                        <PrimaryButton label='Confirmar'
                            handleClick={() => { navigation.navigate('Login') }} />
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}