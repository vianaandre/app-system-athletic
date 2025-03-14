import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../hook/useAuth';
import { TypeUserEnum } from '../../Models/Users';

interface IHeader {
    title: string;
    subtitle: string;
    isAdm?: boolean;
    userImage?: ImageSourcePropType;
    handleClickDisconnect: () => void;
    handleClickEditUser?: () => void;
    isDisconect?: boolean
}


const Header = ({ isAdm, title, subtitle, userImage, handleClickDisconnect, handleClickEditUser, isDisconect = true }: IHeader) => {
    const { user } = useAuth()

    return (
        <View style={styles.containerHeader}>
            <View style={styles.containerTitle}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.subTitleText} >{subtitle}</Text>
            </View>
            <View style={styles.boxImageIcon}>
                <TouchableOpacity testID="edit-user" onPress={handleClickEditUser} >
                    <Image source={{
                        uri: user?.logo,
                        width: 68,
                        height: 68,
                    }} style={styles.imageIcon} />
                </TouchableOpacity>
                <TouchableOpacity testID="disconnect" onPress={handleClickDisconnect}>
                    <Text style={styles.textDisconect}>Desconectar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export { Header }