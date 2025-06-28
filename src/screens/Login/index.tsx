import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { styles } from './styles';
import { InputPassword, InputText } from '../../components/Inputs';
import { PrimaryButton } from '../../components/ButtonComponent';
import { useNavigation } from '@react-navigation/native';
import { requestApi } from '../../utils/requestApi';
import { storeToken } from '../../utils/storeToken';
import Toast from 'react-native-toast-message';
import { getToken } from '../../utils/getToken';
import { useKeyboardVisibility } from '../../utils/useKeyboardVisibility';
import { useAuth } from '../../hook/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Login() {
  const navigation = useNavigation()
  const { setUser } = useAuth()

  const isKeyboardVisible = useKeyboardVisibility();

  const [athleticName, setAthleticName] = useState('')
  const [password, setPassword] = useState('')

  const [isAdm, setIsAdm] = useState<boolean>(false)
  const [forgotPaswd, setForgotPasswd] = useState<boolean>(false)
  const [codeVerify, setCodeVerify] = useState<boolean>(false)
  const [codeConfirm, setCodeConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [sendCodeRequest, setSendCodeRequest] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>()

  const handleLogin = async () => {
    const loginData = {
      athletic: athleticName,
      password: password
    };

    try {
      const response = await requestApi('/authenticate', 'POST', loginData);
      const userData = response.data;

      await AsyncStorage.setItem('user_athletic', JSON.stringify(athleticName));

      await storeToken(userData.token);

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso!',
        visibilityTime: 1800,
      });

      checkIfUserIsAdmin();


    } catch (error) {
      Alert.alert('FALHA AO REALIZAR LOGIN', 'Verifique se digitou "Nome da Atlética" e "Senha" corretamente e tente novamente.');
    }
  };

  const handleSendCode = async () => {
    try {
      await requestApi('/users/send-code', 'POST', {
        athletic: athleticName
      }, {
        'Content-Type': 'application/json',
      })

      Alert.alert('Sucesso', 'Código enviado com sucesso!');

      setSendCodeRequest(true)
    } catch (error) {
      console.error('Erro ao enviar o código:', error);
      Alert.alert('Erro', 'Não foi possível enviar o código.');
    }
  }

  const handleVerifyCode = async () => {
    try {
      await requestApi('/users/verify-code', 'POST', {
        athletic: athleticName,
        code: codeConfirm
      }, {
        'Content-Type': 'application/json',
      })

      setCodeVerify(true)
    } catch (error) {
      setCodeVerify(false)
      console.error('Erro ao verificar o código:', error);
      Alert.alert('Erro', 'Código inválido.');
    }
  }

  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== newPasswordConfirm) {
        Alert.alert('Erro', 'As senhas digitadas não conferem.');
        return;
      }

      const payload = {
        athletic: athleticName,
        code: codeConfirm,
        password: newPassword
      }

      await requestApi('/users/recovery-password/update-password', 'PUT', payload, {
        'Content-Type': 'application/json',
      })

      Alert.alert('Sucesso', 'Senha alterada com sucesso!');

      setForgotPasswd(false)
      setCodeVerify(false)
      setSendCodeRequest(false)
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      Alert.alert('Erro', 'Não foi possível alterar a senha.');
    }
  }

  const checkIfUserIsAdmin = async () => {
    const token = await getToken();
    try {
      const response = await requestApi('/users', 'GET', null, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      if (response && response.data) {
        setUser(response.data);
        if (response.data.type === 'ADMIN') {
          setIsAdm(true);
          setAthleticName('');
          setPassword('');
          navigation.navigate('ListUsers', { isAdmUser: true });
        } else {
          setIsAdm(false);
          setAthleticName('');
          setPassword('');
          navigation.navigate('SportsMenu', { isAdmUser: false });
        }

      } else {
        console.error('Nenhum dado recebido da API');
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar o usuário.');
    }
  }

  async function getAthleticName() {
    const athleticName = await AsyncStorage.getItem('user_athletic');

    if(athleticName) {
      setAthleticName(JSON.parse(athleticName))
    }
  }

  useEffect(() => {
    getAthleticName()
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <View style={isKeyboardVisible ? [styles.container, { justifyContent: 'flex-start' }] : styles.container}>
            {!isKeyboardVisible && (
              <View style={styles.containerImage}>
                <Image source={require("../../assets/login.png")}
                  style={[isKeyboardVisible ? styles.smallImage : styles.largeImage, {
                    marginTop: -40
                  }]}
                  resizeMode='contain' height={100} />
              </View>
            )}

            {!forgotPaswd &&
              <>
                <View style={styles.containerTitle}>
                  <Text style={styles.titleText}>Login</Text>
                </View>
                <View style={styles.containerInputs}>
                  <InputText
                    label='Nome da atlética'
                    placeholder='Informe sua atlética'
                    value={athleticName}
                    onChangeText={setAthleticName}
                    keyboardType='default'
                    autoCorrect={false}
                  />

                  <InputPassword
                    label='Senha'
                    placeholder='Informe sua senha'
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
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
                  <PrimaryButton label='Cadastrar'
                    handleClick={() => { navigation.navigate('RegisterUser', { isEditing: false, firstRegister: true }) }} />
                  <PrimaryButton label='Entrar'
                    handleClick={handleLogin} />
                </View>

                <View style={styles.boxRememberPaswd}>
                  <TouchableOpacity style={styles.styleTouchable} onPress={() => { setForgotPasswd(true) }}>
                    <Text style={styles.rememberPasswd}>Esqueci minha senha</Text>
                  </TouchableOpacity>
                </View>
              </>
            }

            {/* Renderiza caso usuário esqueceu a senha */}
            {forgotPaswd &&
              <>
                <View style={styles.containerTitle}>
                  <Text style={styles.titleText}>{codeVerify ? 'TROCAR SENHA' : 'Recuperação de senha'}</Text>
                </View>

                {!codeVerify ? (
                  <>
                    <View style={styles.containerInputs}>
                      <InputText
                        label='Nome da atlética:'
                        placeholder='Informe sua atlética'
                        value={athleticName}
                        onChangeText={setAthleticName}
                        autoCorrect={false}
                        disabled={sendCodeRequest}
                      />


                      {sendCodeRequest && (
                        <InputPassword
                          label='Código de confirmação:'
                          value={codeConfirm}
                          onChangeText={setCodeConfirm}
                          autoCorrect={false}
                          keyboardType='numeric'
                        />
                      )}

                    </View>

                    <View style={styles.containerButtons}>
                      <PrimaryButton label='Cancelar'
                        handleClick={() => {
                          setForgotPasswd(false)
                          setSendCodeRequest(false)
                        }} />
                        {!sendCodeRequest && (
                          <PrimaryButton
                            label='Confirmar'
                            handleClick={handleSendCode}
                          />
                        )}
                        {sendCodeRequest && (
                          <PrimaryButton
                            label='Confirmar'
                            handleClick={handleVerifyCode}
                          />
                      )}
                    </View>
                    {sendCodeRequest && (
                      <View>
                        <View>
                            <TouchableOpacity 
                              style={[styles.styleTouchable, {
                                width: '100%'
                              }]} 
                              onPress={handleSendCode}
                            >
                              <Text style={[styles.rememberPasswd, {
                                marginTop: 70,
                              }]}>Enviar código novamente</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <View style={styles.containerInputs}>
                      <InputPassword
                        label='Nova Senha:'
                        placeholder='Informe sua senha'
                        value={newPassword}
                        onChangeText={setNewPassword}
                        autoCorrect={false}
                        secureTextEntry={!isPasswordVisible}
                      />


                      <InputPassword
                        label='Digite a senha novamente:'
                        placeholder='Repita sua nova senha'
                        value={newPasswordConfirm}
                        onChangeText={setNewPasswordConfirm}
                        autoCorrect={false}
                        secureTextEntry={!isPasswordVisible}
                      />

                      {/* Botão para alternar visibilidade da senha */}
                      <View style={{
                        width: '100%',
                        alignItems: 'center',
                        marginTop: 62
                      }}>
                        <TouchableOpacity
                          style={styles.showPasswordButton}
                          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                          <Text style={styles.showPasswordText}>
                            {isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {!isKeyboardVisible && (
                        <View style={[styles.containerButtons, {
                          marginTop: 24,
                          paddingTop: 0,
                          paddingHorizontal: 0
                        }]}>
                          <PrimaryButton 
                            label='Cancelar'
                            style={{ 
                              flex: 1  
                            }}
                            handleClick={() => setForgotPasswd(false)} 
                          />
                          <PrimaryButton
                            label='Confirmar'
                            handleClick={handleUpdatePassword}
                          />
                        </View>
                      )}
                    </View>
                  </>
                )}
              </>
            }
            <Toast />
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}