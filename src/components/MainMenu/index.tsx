import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';

import { AddSportsButton } from '../ButtonComponent';

interface IMainMenu {
    labelMenuSports: string;
    labelMenuInfo: string;
    handleClickMenu: () => void;
    handleClickAdd: () => void;
}

const MainMenu = ({ labelMenuSports, labelMenuInfo, handleClickAdd, handleClickMenu }: IMainMenu) => {
    return (
        <View style={styles.containerMenu} >
            <TouchableOpacity style={styles.boxButtonMenu} activeOpacity={0.4}
                onPress={handleClickMenu}>
                <Text style={styles.textMenu}>{labelMenuSports}</Text>
            </TouchableOpacity>

            <View style={styles.containerAddButton}>
                <TouchableOpacity onPress={handleClickAdd}>
                    <MaterialIcons name='add-circle-outline' color={'white'} size={35} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export { MainMenu }