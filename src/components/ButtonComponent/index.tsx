import React from 'react';
import { Image, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles';

interface IButton extends TouchableOpacityProps {
    label?: string;
    handleClick?: () => void;
}

const PrimaryButton = ({ label, handleClick, ...rest }: IButton) => {
    return (
        <>
            <TouchableOpacity onPress={handleClick} {...rest} style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
        </>
    );
}

const AddButton = ({ label, handleClick }: IButton) => {
    return (
        <View style={styles.containerRoundButton}>
            <TouchableOpacity testID="add-button" style={styles.roundButton} onPress={handleClick}>
                <Image style={styles.iconRoundButton} source={require('../../assets/img/add.png')} />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: '#FFFFFF', textTransform: 'uppercase', marginTop: 22, textAlign: 'center' }} >{label}</Text>
        </View>
    );
}

const ReturnButton = ({ label, handleClick }: IButton) => {
    return (
        <View style={styles.containerRoundButton}>
            <TouchableOpacity testID='return-button' style={styles.roundButton} onPress={handleClick}>
                <Image style={styles.iconRoundButton} source={require('../../assets/img/return.png')} />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: '#FFFFFF', textTransform: 'uppercase', marginTop: 22, textAlign: 'center' }} >{label}</Text>
        </View>
    );
}

const DownloadButton = ({ label, handleClick }: IButton) => {
    return (
        <View style={styles.containerRoundButton}>
            <TouchableOpacity testID='download-button' style={styles.roundButton} onPress={handleClick}>
                <MaterialIcons name='save-alt' color={'white'} size={45} />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: '#FFFFFF', textTransform: 'uppercase', marginTop: 22, textAlign: 'center' }} >{label}</Text>
        </View>
    );
}

const RemoveButton = ({ handleClick }: IButton) => {
    return (
        <TouchableOpacity testID='remove-button' style={styles.styleRemoveButton} onPress={handleClick}>
            <Image style={styles.iconRemoveButton} source={require('../../assets/img/remove.png')} />
        </TouchableOpacity>
    );
}

const EditButton = ({ handleClick }: IButton) => {
    return (
        <TouchableOpacity testID='edit-button' style={styles.styleEditButton} onPress={handleClick}>
            <Image style={styles.iconEditButton} source={require('../../assets/img/edit.png')} />
        </TouchableOpacity>
    );
}

const AddSportsButton = ({ handleClick }: IButton) => {
    return (
        <TouchableOpacity testID='add-sports-button' onPress={handleClick}>
            <MaterialIcons name='add-circle-outline' color={'blue'} size={35} />
        </TouchableOpacity>
    );
}

export { PrimaryButton, AddButton, ReturnButton, RemoveButton, EditButton, AddSportsButton, DownloadButton };