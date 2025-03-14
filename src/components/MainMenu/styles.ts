import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerMenu: {
    width: "100%",
    height: 62,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000000',
  },
  textMenu: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  textInfoMenu: {
    fontSize: 17,
    color: "#666666",
  },
  boxButtonMenu: {
    width: "85%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 5,
  },
  containerAddButton: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
