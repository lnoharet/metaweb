function renderChart(data) {
  //const data = filtered_data; //[40, 39, 90, 100, 20];
  console.log(data);
  const w = 300;
  const h = 300;
  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("overflow", "visible")
    .style("padding-top", "40px")
    .style("margin-left", "60px");

  const xScale = d3
    .scaleBand()
    .domain(data.map((val, i) => i))
    .range([0, w])
    .padding(0.1);

  const yScale = d3.scaleLinear().domain([0, h]).range([h, 0]);

  const xAxis = d3.axisBottom(xScale).ticks(data.length);

  const yAxis = d3.axisLeft(yScale).ticks(7);

  svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);
  svg.append("g").call(yAxis);

  svg
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("x", (v, i) => xScale(i))
    .attr("y", yScale)
    .attr("width", xScale.bandwidth())
    .attr("height", (val) => h - yScale(val))
    .style("fill", "#B2085C");
}
