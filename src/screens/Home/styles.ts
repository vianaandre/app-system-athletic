import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#1785F2",
    flex: 1
  },
  container: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
  },
  sideLeft: {
    width: '20%',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  sidebarText: {
    color: '#fff',
    fontSize: 40,
    lineHeight: 45,
  },
  sideRight:{
    width:'80%',
    alignItems: 'flex-start',
    paddingTop: 40,
    paddingStart: 10,
  },
  image: {
    position: 'absolute',
    top: 35,
    left:5,
    borderRadius: 10,
    marginBottom: 20,
  },
  containerText: {
    flex: 1,
    justifyContent: 'center'
  },
  centerText: {
    color: '#fff',
    fontSize: 30,
  },
});