import * as d3 from "d3";
import * as legend from "d3-svg-legend";
import chartFactory, {
    fixateColors,
    addRoot,
    colorScale as color,
    tooltip,
    heightOrValueComparator,
    valueComparator,
    descendantsDarker
} from "../common";


const westerosChart = chartFactory({
    margin: {left: 50, right: 50, top: 50, bottom: 50},
    padding: {left:10, right: 10, top: 10, bottom: 10}
});
export default westerosChart;

westerosChart.init = function initChart(chartType, dataUri, ...args) {
    this.loadData(dataUri).then(data => this[chartType].call(this, data, ...args));
    this.innerHeight = this.height - (this.margin.bottom + this.margin.top + this.padding.top + this.padding.bottom);
    this.innerWidth = this.width - (this.margin.right + this.margin.left + this.padding.left + this.padding.right);
};

westerosChart.loadData = async function loadData(uri) {
    if (uri.match(/.csv$/)) {
        this.data = d3.csvParse(await (await fetch(uri)).text());
    } else if (uri.match(/.json$/)) {
        this.data = await (await fetch(uri)).json();
    }
    return this.data;
};

westerosChart.tree = function Tree(_data) {

  const data = getMajorHouses(_data);
  const chart = this.container;
  const stratify = d3.stratify().parentId(d => d.fatherLabel).id(d => d.itemLabel);
  const root = stratify(data);
  const layout = d3.tree().size([this.innerWidth, this.innerHeight]);
  const links = layout(root).descendants().slice(1);

  fixateColors(houseNames(root), 'id');

  const line = d3.line().curve(d3.curveBasis);

  chart.selectAll('.link')
    .data(links)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'lightblue')
      .attr('d', d => line([
        [d.x, d.y],
        [d.x, (d.y + d.parent.y) / 2],
        [d.parent.x, (d.y + d.parent.y) / 2],
        [d.parent.x, d.parent.y]],
      ));

    const nodes = chart.selectAll(".node")
        .data(root.descendants())
        .enter()
            .append("circle")
            .attr("r", 4.5)
            .attr("fill", getHouseColor)
            .attr("class", "node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
}

export const getHouseName = (d) => {
    const ancestors = d.ancestors();
    let house;
    if (ancestors.length > 1) {
        ancestors.pop();
        house = ancestors.pop().id.split(" ").pop();
    } else {
        house = "Westeros";
    }
    return house;
}

const getHouseColor = (d) => color(getHouseName(d));

export const houseNames = root => root.ancestors().shift().children.map(getHouseName);

const getMajorHouses = data =>
    addRoot(data, "itemLabel", "fatherLabel", "Westeros")
    .map((d, i, a) => {
        if (d.fatherLabel == "Westeros") {
            const childrenLen = a.filter(e => e.fatherLabel == d.itemLabel).length;
            return childrenLen > 0? d : undefined;
        } else {
            return d;
        }
    })
    .filter(i => i);
