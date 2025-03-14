import { StyleSheet } from 'react-native';
import { BG_DEFAULT } from '../../utils/styleDefaults';

export const styles = StyleSheet.create({
    containerHeader: {
        width: '100%',
        paddingTop: 15,
        paddingBottom: 16,
        gap: 24,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: BG_DEFAULT,
        borderBottomColor: "#FFFFFF",
        borderBottomWidth: 2,
    },
    titleText: {
        textAlign: "left",
        fontSize: 26,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    subTitleText: {
        textAlign: "left",
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    boxImageIcon: {
        height: '100%',
        width: '25%',
        alignItems: 'center',
        top: 5,
        right: 15,
    },
    imageIcon: {
        borderRadius: 999999
    },
    containerTitle: {
        flex: 1,
        alignItems: 'flex-start',
        marginStart: 25,
        gap: 4
    },
    textDisconect: {
        color: '#000000',
        marginTop: 4,
        fontWeight: 'bold'
    }
});