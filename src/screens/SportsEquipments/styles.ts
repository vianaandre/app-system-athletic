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
  },
  
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingBottom: 29,
  },
  textNameAthlete: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  textCoursePeriodAthlete: {
    fontSize: 14,
    color: "#666666",
  },
  containerEditRemoveButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerImageAthlete: {
    width: "auto",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  containerLogo: {
    width: 60,
    height: 60,
  },
  containerList: {
    width: "100%",
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 21,
    marginTop: 30,
    borderRadius: 14,
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
