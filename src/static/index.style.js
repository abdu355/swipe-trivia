import { StyleSheet } from 'react-native';

export const colors = {
  black: '#637b97',
  gray: '#637b97',
  background1: '#637b97',
  background2: '#21D4FD',
  background3: '#373d4d'
};

export default StyleSheet.create({
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: colors.background3
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  scrollview: {
    flex: 1,
    paddingTop: 10
  },
  scrollviewContentContainer: {
    paddingBottom: 50
  },
  exampleContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  slider: {
    marginTop: 25
  },
  sliderContentContainer: {},
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  }
});
