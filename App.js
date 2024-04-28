import { StyleSheet, StatusBar } from 'react-native';
import AppNavigation from './src/navigations/appNavigation';

export default function App() {
  return (
    <>
      <StatusBar barStyle="default" />
      <AppNavigation />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
