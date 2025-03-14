import { StyleSheet } from "react-native";
import { BG_DEFAULT } from "../../utils/styleDefaults";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DEFAULT,
  },
  container: {
    width: "100%",
    paddingHorizontal: 20
  },
  containerList: {
    width: "100%",
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 17,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 23
  },
  textLogo: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  containerLogoName: {
    width: "auto",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  containerLogo: {
    width: 60,
    height: 60,
    borderRadius: 6
  },
  containerEditRemoveButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginTop: 38,
    marginBottom: 23,
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
