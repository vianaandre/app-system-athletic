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
    marginTop: 20
  },
  containerList: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 21,
    justifyContent: "space-between",
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 16,
    borderRadius: 14,
  },
  textNameAthlete: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  textCoursePeriodAthlete: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 20
  },
  containerImageAthlete: {
    width: "auto",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  imageAtleta: {
    width: 60,
    height: 60,
  },
  containerEditRemoveButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 30,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    gap: 10
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    paddingEnd: 0,
    color: '#FFFFFF'
  },
  textEmpty: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: "bold"
  }
});
