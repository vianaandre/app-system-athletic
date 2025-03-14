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
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  containerInputs: {
    flex: 1,
    width: "100%",
    gap: 16
  },
  inputs: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    borderColor: "#000",
    borderBottomWidth: 2,
    paddingStart: 20,
  },
  textLogo: {
    fontSize: 17,
  },
  containerButtons: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 52,
    marginBottom: 24
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
});
