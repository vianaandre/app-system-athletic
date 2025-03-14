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
  containerInputs: {
    flex: 1,
    width: "100%",
    gap: 16,
    marginTop: 16,
  },
  inputs: {
    justifyContent: "center",
  },
  boxInputs: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
  },
  labelInputs: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingBottom: 16,
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
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 28,
    paddingTop: 71
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
