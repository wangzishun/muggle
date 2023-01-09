import { View } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory-native'
import { VictoryNativeStackedColumn } from './index'

export const VictoryNativeStackedColumnDemo1 = () => {
  const data: any = []
  return <VictoryNativeStackedColumn data={data}></VictoryNativeStackedColumn>
}

export const VictoryNativeStackedColumnDemo2 = () => {
  // return <VictoryNativeStackedColumn ></VictoryNativeStackedColumn>
  return (
    <VictoryChart domainPadding={{ x: 40 }}>
      <VictoryBar
        data={[
          { experiment: 'trial 1', expected: 3.75, actual: 3.21 },
          { experiment: 'trial 2', expected: 3.75, actual: 3.38 },
          { experiment: 'trial 3', expected: 3.75, actual: 2.05 },
          { experiment: 'trial 4', expected: 3.75, actual: 3.71 },
        ]}
        x="experiment"
        y={(d) => (d.actual / d.expected) * 100}
      />
      <VictoryAxis
        label="experiment"
        style={{
          axisLabel: { padding: 30 },
        }}
      />
      <VictoryAxis
        dependentAxis
        label="percent yield"
        style={{
          axisLabel: { padding: 40 },
        }}
      />
    </VictoryChart>
  )
}
