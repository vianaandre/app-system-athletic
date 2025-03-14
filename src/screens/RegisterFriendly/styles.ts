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
    //height: "10%",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  containerText: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    marginTop: 40,
  },
  image: {
    width: 315,
    height: 125,
  },
  containerInputs: {
    height: "auto",
    width: "100%",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    marginTop: 'auto',
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 28,
  },
  containerButtonsKeyboardVisible: {
    width: "100%",
    height: "15%",
    marginTop: 35,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    paddingEnd: 10,
    color: '#FFFFFF'
  },
  inputs: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    borderColor: "#000",
    borderBottomWidth: 2,
    //borderTopWidth: 2,
    paddingStart: 20,
  },
});
