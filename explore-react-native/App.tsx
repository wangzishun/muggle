import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { AntvisF2StackedColumn } from './src/components/antvis-f2/StackedColumn'
import { VictoryNativeStackedColumnDemo1, VictoryNativeStackedColumnDemo2 } from './src/components/victory-native/StackedColumn/demo'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      {/* <VictoryNativeStackedColumnDemo1 />
      <VictoryNativeStackedColumnDemo2 /> */}
      {/* <AntvisF2StackedColumn /> */}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
