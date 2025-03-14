import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: 120,
    paddingTop: 5,
    backgroundColor: "#fff",
  },
  containerImage: {
    width: "100%",
    height: "auto",
    alignItems: "center",
  },
  containerTitle: {
    width: "70%",
    alignItems: "center",
  },
  titleText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#48C445",
    paddingBottom: 25,
  },
  subTitleText: {
    textAlign: "center",
    fontSize: 15,
  },
  containerInputs: {
    height: "auto",
    width: "90%",
    justifyContent: "center",
    marginTop: 15,
  },
  containerButtons: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  imageSmall: {
    width: 220,
    height: 220,
  },
  imageLarge: {
    width: "100%",
  },
  showPasswordButton: {
    marginTop: 10,
    alignItems: "center",
  },
  showPasswordText: {
    color: "#007BFF",
    fontSize: 14,
  },
});
