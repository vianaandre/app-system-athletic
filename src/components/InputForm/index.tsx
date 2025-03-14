import { KeyboardTypeOptions, Text, TextInput, View } from "react-native"
import { styles } from "./styles";
import { TextInputMask } from "react-native-masked-text";

interface IInputFormText {
    placeholder?: string;
    label?: string;
    keyboardType?: KeyboardTypeOptions;
    value?: string;
    onChangeText?: (e: any) => void;
    secureTextEntry?: boolean;
    autoCorrect?: boolean;
    onBlur?: () => void;
    typeMask?: string;
}

const InputFormText = ({ placeholder, label, value, onChangeText, keyboardType, autoCorrect, secureTextEntry }: IInputFormText) => {
    return (
            <View style={styles.boxInputs}>
                <Text style={styles.labelInputs}>{label}</Text>
                <TextInput testID="input" style={styles.placeholderInput}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    placeholderTextColor={'#706f6f74'}
                    value={value}
                    onChangeText={onChangeText}
                    autoCorrect={autoCorrect}
                    secureTextEntry={secureTextEntry}
                >
                </TextInput>
            </View>
    )
}

const InputFormTextMask = ({ label, value, onChangeText, onBlur }: IInputFormText) => {
    return (
        <View style={styles.boxInputs}>
            <Text style={styles.labelInputs} >{label}</Text>
            <TextInputMask testID="input-mask" style={styles.placeholderInput}
                onBlur={onBlur}
                value={value}
                onChangeText={onChangeText}
                type={'cel-phone'}	
                options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                }}                        
            />

        </View>
    )
}

const InputFormTextMaskDatetime = ({ label, value, onChangeText, onBlur, placeholder }: IInputFormText) => {
    return (
        <View style={styles.boxInputs}>
            <Text style={styles.labelInputs} >{label}</Text>
            <TextInputMask testID="input-mask-datetime" style={styles.placeholderInput}
                onBlur={onBlur}
                value={value}
                onChangeText={onChangeText}
                type={'datetime'}	
                options={{
                    format: 'DD/MM/YYYY',
                }}
                placeholder={placeholder}                  
            />

        </View>
    )
}

export { InputFormText, InputFormTextMask, InputFormTextMaskDatetime }