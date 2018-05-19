import * as d3 from "d3";
import chartFactory from "../common/index";

export async function renderSVGStuff(){
    const chart = chartFactory();

    chart.svg.append("circle")
        .attr("cx", "350")
        .attr("cy", "250")
        .attr("r", "100");
}
