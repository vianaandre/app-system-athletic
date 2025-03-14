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
  containerInputs: {
    height: "auto",
    width: "100%",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  boxInputs: {
    width: '100%',
  },
  labelInputs: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingBottom: 16,
  },
  placeholderInput: {
    width: '65%',
    alignItems: "center",
    height: 42,
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  containerButtons: {
    width: "100%",
    marginTop: 'auto',
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 35,
    paddingTop: 42
  },
  containerButtonsKeyboardVisible: {
    width: "100%",
    height: "20%",
    marginTop: 35,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  inputs: {
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    paddingEnd: 10,
    color: '#FFFFFF'
  },
});
