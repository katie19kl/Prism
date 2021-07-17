import ReactECharts from 'echarts-for-react';


type VerticalGraphProps = {
	horizontal: string[],
	vertical: []
}



const VerticalGraph	= ({ horizontal, vertical }: VerticalGraphProps) => {
	const options = {
		
		xAxis: {
			type: 'category',
			data: horizontal,
			axisLine: {
				show: true,
				lineStyle: {
					color: "rgba(0,0,0,1)",
					width: 1,
					type: "solid"
				}
			},
			
			
		},
		yAxis: {
			type: 'value',
			axisLine: {
				show: false,
				lineStyle: {
					color: "rgba(0,0,0,1)",
					width: 1,
					type: "solid"
				}
			},
			splitLine: {
                show:true,
                lineStyle: {
                    color: "rgba(0,0,0,1)",
                }
            }
		},
		series: [{
			data: vertical,
			type: 'bar',			
		}],
		
		// mouse hovering => displaying
		tooltip: {
			trigger: 'axis',
		},
	};
	return <ReactECharts option={options} />;
};
export default VerticalGraph;