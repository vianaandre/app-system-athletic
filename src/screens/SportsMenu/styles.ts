import { StyleSheet } from "react-native";
import { BG_DEFAULT } from "../../utils/styleDefaults";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DEFAULT,
  },
  container: {
    paddingTop: 59,
    paddingHorizontal: 20,
    flex: 1,
    width: "100%",
    gap: 28
  },
  
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 5,
    paddingBottom: 5,
  },
});
