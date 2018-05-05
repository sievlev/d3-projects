import * as d3 from "d3";

const chart = d3.select("body")
    .append("svg")
    .attr("id", "chart");

const req = new window.XMLHttpRequest();
req.addEventListener("load", mungeData);
req.open("GET", "data/EU-referendum-result-data.csv");
req.send();

function mungeData() {
    const data = d3.csvParse(this.responseText);
    const regions = data.reduce((last, row) => {
        if (!last[row.Region]) last[row.Region] = [];
        last[row.Region].push(row);
        return last;
    }, {});
    const regionsPctTurnout = d3.nest()
        .key(d => d.Region)
        .rollup(d => d3.mean(d, leaf => leaf.Pct_Turnout))
        .entries(data);

    renderChart(regionsPctTurnout);
}

function renderChart(data) {
    chart.attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    const x = d3.scaleBand()
        .domain(data.map(d => d.key))
        .rangeRound([50, window.innerWidth - 50])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([window.innerHeight - 50, 0]);

    const xAxis = d3.axisBottom().scale(x);
    const yAxis = d3.axisLeft().scale(y);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${window.innerHeight - 50})`)
        .call(xAxis);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);


    chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => (window.innerHeight - 50) - y(d.value))
}
