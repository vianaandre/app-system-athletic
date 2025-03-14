import { StyleSheet } from "react-native";
import { BG_DEFAULT } from "../../utils/styleDefaults";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_DEFAULT,
    },
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20
    },
    containerList: {
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 17,
        flexDirection: "row",
        backgroundColor: "#000000",
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginTop: 30,
        borderRadius: 14,
    },
    textNameChampionship: {
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    textCoursePeriodChampionship: {
        fontSize: 14,
        color: "#FFFFFF",
    },
    containerImageAthlete: {
        width: "auto",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    containerLogo: {
        width: 60,
        height: 60,
    },
    containerEditRemoveButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    containerButtons: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingTop: 20,
        paddingBottom: 28,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        gap: 10
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: "bold",
        paddingEnd: 0,
        color: '#FFFFFF'
    },
});
