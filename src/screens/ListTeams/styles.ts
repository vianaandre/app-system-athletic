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
    paddingBottom: 24,
    paddingHorizontal: 20
  },
  containerList: {
    height: 80,
    width: "100%",
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 30,
    borderRadius: 14,
  },
  containerTouchable: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14
  },
  textLogo: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: "bold"
  },
  containerName: {
    width: "auto",
    height: "100%",
    justifyContent: "center",
    gap: 4,
  },
  textCountAthlete: {
    fontSize: 12,
    color: "#FFFFFF",
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
    paddingTop: 10,
    paddingBottom: 5,
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
