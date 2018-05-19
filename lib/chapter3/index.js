import * as d3 from "d3";
import chartFactory from "../common/index";

export async function renderSVGStuff(){
    const chart = chartFactory();
    const data = d3.zip(d3.range(0,12), d3.shuffle(d3.range(0, 12)));
    const colors = ["linen", "lightsteelblue", "lightcyan", "lavender", "honeydew", "gainsboro"];

    const ribbon = d3.ribbon()
        .source(d => d[0])
        .target(d => d[1])
        .radius(d3.min([chart.width/3,chart.height/3]))
        .startAngle(d => -2 * Math.PI * (1/data.length) * d)
        .endAngle(d => -2 * Math.PI * (1/data.length) * ((d - 1) % data.length));

    chart.container.append("g")
        .attr("transform", `translate(${chart.width/2}, ${chart.height/2})`)
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", ribbon)
        .attr("fill", (d, i) => colors[i % colors.length])
        .attr("stroke", (d, i) => colors[(i+1) % colors.length]);
}
