import * as d3 from "d3";
import chartFactory from "../common/index";

export async function renderSVGStuff(){
    const chart = chartFactory();

    const weierstrass = (x) => {
        const a = 0.5;
        const b = (1 + 3 * Math.PI/ 2) / a;
        return d3.sum(d3.range(100).map(
            n => Math.pow(a, n) * Math.cos(Math.pow(b, n) * Math.PI * x)));
    }

    const drawLine = (line) => chart.container.append("path")
        .datum(data)
        .attr("d", line)
        .style("stroke-wifth", 2)
        .style("fill", "none");

    const data = d3.range(-100, 100).map(d => d / 200);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const extent = d3.extent(data.map(weierstrass));

    const x = d3.scaleLinear()
        .domain(d3.extent(data))
        .range([0, chart.width]);

    const linear = d3.scaleLinear()
        .domain(extent)
        .range([chart.height / 4, 0])

    const line1 = d3.line()
        .x(x)
        .y(d => linear(weierstrass(d)));

    drawLine(line1)
        .attr("transform", `translate(0, ${chart.height / 16})`)
        .style("stroke", colors(0));
 
    const power = d3.scalePow()
        .exponent(0.2)
        .domain(d3.extent(data))
        .range([0, chart.width])

    const line3 = line1.x(d => power(d));

    drawLine(line3)
        .attr("transform", `translate(0, ${chart.height / 8})`)
        .style("stroke", colors(2));
}
