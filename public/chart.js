function renderChart(data) {
  //const data = filtered_data; //[40, 39, 90, 100, 20];
  d3.select("svg").remove();
  console.log(data);
  data_max = Math.max(...data);

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

  const yScale = d3.scaleLinear().domain([0, data_max]).range([h, 0]);

  const xAxis = d3.axisBottom(xScale).ticks(data.length);

  const yAxis = d3.axisLeft(yScale).ticks(7);

  const tooltip = d3.select("body")
        .append("div")
        .attr("class","d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "10px")
        .style("background", "rgba(0,0,0,0)")
        .style("border-radius", "5px")
        .style("color", "#fff")
        .style("font-family", 'Montserrat')
        .style("font-size", '12px')
        .text("a simple tooltip");

  svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`).style("font-family", 'Montserrat');
  svg.append("g").call(yAxis).style("font-family", 'Montserrat');

  svg
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("x", (v, i) => xScale(i))
    .attr("y", yScale)
    .attr("width", xScale.bandwidth())
    .attr("height", (val) => h - yScale(val))
    .style("fill", "#B2085C")
    .on("mouseover", function(d, i) {
      tooltip.html(`Data: ${d}`).style("visibility", "visible");
    })
      .on("mousemove", function(){
      tooltip
        .style("top", (event.pageY-10)+"px")
        .style("left",(event.pageX+10)+"px");
    })
      .on("mouseout", function() {
      tooltip.html(``).style("visibility", "hidden");
    });

}
