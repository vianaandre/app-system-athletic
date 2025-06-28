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
    marginTop: 17,
    paddingHorizontal: 20,
    backgroundColor: BG_DEFAULT
  },
  containerInputs: {
    flex: 1,
    gap: 6
  },
  inputs: {
    flexDirection: "row",
    flex: 1,
    marginTop: 10
  },
  boxInputs: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  labelInputs: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingBottom: 16
  },
  placeholderInput: {
    width: '100%',
    alignItems: "center",
    height: 42,
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  textLogo: {
    fontSize: 17,
  },
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 32,
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 5,
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
