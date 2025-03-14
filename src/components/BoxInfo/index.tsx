import { View, Text, Image } from 'react-native'
import React from 'react'
import { styles } from './styles'

interface IBoxInfo {
    text: string;
}

const BoxInfo = ({ text }: IBoxInfo) => {
    return (
        <View style={styles.containerInfo} testID="container-info" >
            <View style={styles.info}>
                <Image testID='info-icon' style={styles.infoIcon} source={require("../../assets/img/Info-icon.png")} />

                <View style={styles.boxTextInfo}>
                    <Text >{text}</Text>
                </View>
            </View>
        </View>
    )
}

export { BoxInfo }