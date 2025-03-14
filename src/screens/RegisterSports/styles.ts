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
    alignItems: "center",
  },
  containerText: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    marginTop: 24,
  },
  titleText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingBottom: 17,
  },
  titleTypeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  image: {
    width: 315,
    height: 125,
  },
  subTitleText: {
    textAlign: "center",
    fontSize: 15,
  },
  containerInputs: {
    height: "auto",
    width: "90%",
    justifyContent: "center",
    marginTop: 30,
    gap: 16,
  },
  boxInputs: {
    marginBottom: 10,
  },
  labelInputs: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingBottom: 16,
  },
  placeholderInput: {
    width: "100%",
    alignItems: "center",
    height: 42,
    backgroundColor: "#ffff",
    paddingLeft: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  containerButtons: {
    width: "100%",
    height: "25%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 35,
  },
  containerButtonsKeyboardVisible: {
    width: "100%",
    height: "20%",
    marginTop: 35,
    flexDirection: "row",
    alignItems: "flex-end",
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
  smallImage: {
    width: 100,
    height: 100,
  },
  largeImage: {
    width: "100%",
  },
});
