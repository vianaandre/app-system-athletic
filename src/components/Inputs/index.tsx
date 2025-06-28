import React from 'react';
import { KeyboardTypeOptions, Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';

interface IInput {
    placeholder?: string;
    label: string;
    keyboardType?: KeyboardTypeOptions;
    value?: string;
    onChangeText?: (e: any) => void;
    secureTextEntry?: boolean;
    autoCorrect?: boolean;
    disabled?: boolean;

}

const InputText = ({ placeholder, label, value, onChangeText, keyboardType, autoCorrect, disabled }: IInput) => {
    return (
        <View style={[styles.boxInputs, {
            opacity: disabled ? 0.5 : 1
        }]}> 
            <Text style={styles.labelInputs}>{label}</Text>
            <TextInput 
                style={styles.placeholderInput}
                keyboardType={keyboardType}
                placeholder={placeholder}
                placeholderTextColor={'#706f6f74'}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={autoCorrect}
                editable={!disabled}
            >
            </TextInput>
        </View>
    );
}

const InputPassword = ({ placeholder, label, value, onChangeText, secureTextEntry, autoCorrect, keyboardType }: IInput) => {
    return (
        <View style={styles.boxInputs}>
            <Text style={styles.labelInputs}>{label}</Text>
            <TextInput style={styles.placeholderInput}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor={'#706f6f74'}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={autoCorrect}
                keyboardType={keyboardType}
            >

            </TextInput>
        </View>
    );
}

export { InputText, InputPassword }