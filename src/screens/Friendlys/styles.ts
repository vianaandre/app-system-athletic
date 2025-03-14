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
    paddingHorizontal: 20
  },
  
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 28,
  },
  fontBold: {
    fontWeight: "bold",
  },
  textNameAthlete: {
    fontSize: 14,
    color: '#FFFFFF',
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerLogo: {
    width: 60,
    height: 60,
  },
  containerList: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#000000",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 17,
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
