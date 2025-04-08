import { Platform, StyleSheet } from "react-native";
import { LOGIN } from "../../utils/styleDefaults";

const valueMargin = Platform.OS === "android" ? 25 : 5;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#5a535a",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 32,
    marginTop: valueMargin,
    paddingTop: 15,
    backgroundColor: "#5a535a",
  },
  containerImage: {
    width: "100%",
    height: 162,
    alignItems: "center",
  },
  containerTitle: {
    alignItems: "center",
    marginBottom: 36,
    marginTop: 62
  },
  titleText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingBottom: 25,
    textTransform: "uppercase",
  },
  subTitleText: {
    textAlign: "center",
    fontSize: 15,
  },
  containerInputs: {
    height: "auto",
    width: "100%",
    paddingHorizontal: LOGIN,
    gap: 16,
    justifyContent: "center",
  },
  boxRememberPaswd: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 59,
    marginLeft: 32,
    marginBottom: 24
  },
  styleTouchable: {
    width: 152,
    marginEnd: 30,
  },
  rememberPasswd: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 14
  },
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingHorizontal: LOGIN,
    gap: 8,
    marginTop: 52,
  },
  smallImage: {
    width: 100,
    height: 100,
  },
  largeImage: {
    width: 300,
  },
  infoIcon: {
    marginStart: 20,
    marginEnd: 20,
  },
  containerInfo: {
    width: "90%",
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEAFA",
  },
  boxTextInfo: {
    width: "80%",
  },
  showPasswordButton: {
    alignItems: "flex-start",
  },
  showPasswordText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
