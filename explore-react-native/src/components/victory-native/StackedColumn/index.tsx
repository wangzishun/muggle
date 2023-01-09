import React from 'react'
import { View } from 'react-native'

import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryBrushContainer,
  VictoryZoomContainer,
  VictoryScatter,
  VictoryBar,
} from 'victory-native'

import { styles } from './styles'

type VictoryNativeStackedColumnData = {}

type VictoryNativeStackedColumnProps = {
  data: VictoryNativeStackedColumnData[]
  x?: string
  y?: string
}

export const VictoryNativeStackedColumn = ({}: VictoryNativeStackedColumnProps) => {
  const data = [
    { x: new Date(2017, 1, 1), num: 125, percent: '12%' },
    { x: new Date(1987, 1, 1), num: 257, percent: '25%' },
    { x: new Date(1993, 1, 1), num: 345, percent: '34%' },
    { x: new Date(1997, 1, 1), num: 515, percent: '51%' },
    { x: new Date(2001, 1, 1), num: 132, percent: '13%' },
    { x: new Date(2005, 1, 1), num: 305, percent: '30%' },
    { x: new Date(2011, 1, 1), num: 270, percent: '27%' },
    { x: new Date(2015, 1, 1), num: 470, percent: '47%' },
    { x: new Date(2018, 1, 1), num: 470, percent: '47%' },
  ]

  return (
    <VictoryChart
      scale={{ x: 'time' }}
      // domainPadding={{ x: 100 }}
      containerComponent={
        <VictoryZoomContainer
          // zoomDomain={{ x: [0, 6.1] }}
          responsive={false}
          // allowZoom={false}
          allowPan={true}
          zoomDimension="x"
          // zoomDomain={this.state.zoomDomain}
          // onZoomDomainChange={this.handleZoom.bind(this)}
        />
      }
    >
      <VictoryBar
        data={data}
        x={'x'}
        y={'num'}
        // y={(d) => (d.actual / d.expected) * 100}
      />
      <VictoryAxis />
      <VictoryAxis dependentAxis style={{}} />
      <VictoryAxis dependentAxis orientation="right" />
    </VictoryChart>
  )
}
