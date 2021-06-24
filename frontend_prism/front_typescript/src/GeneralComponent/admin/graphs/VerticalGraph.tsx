import React from 'react';
import ReactECharts from 'echarts-for-react';


type VerticalGraphProps = {
	horizontal: string[],
	vertical: []
}



const VerticalGraph	= ({ horizontal, vertical }: VerticalGraphProps) => {
	const options = {
		
		//grid: { top: 8, right: 8, bottom: 24, left: 36 },

		xAxis: {
			type: 'category',
			//data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			data: horizontal
			
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: vertical,
			type: 'bar'
		}],
		
		// mouse hovering => displaying
		tooltip: {
			trigger: 'axis',
		},
	};
	return <ReactECharts option={options} />;
};
export default VerticalGraph;