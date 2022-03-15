function renderChart(data, label, date) {
  tickLabels = date;
  
  //const data = filtered_data; //[40, 39, 90, 100, 20];
  d3.select("#chart").remove();
  const isAllZero = data.every(item => item === 0);
  isAllZero ? data_max = 10 : data_max = Math.max(...data);

  function circle_pattern(x_value, y_value, r_value) {
    isAllZero ?  svg.append('circle')
    .attr('cx', x_value)
  .attr('cy', y_value)
  .attr('r', r_value)
  .attr('stroke', 'none')
  .attr('fill', "#292929") 
  : " ";

    return svg;
  }
  
  const w = 300;
  const h = 250;
  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("overflow", "visible")
    .style("padding-top", "40px")
    .style("margin-left", "60px")
    .attr("id", "chart");

 
  circle_pattern(70, 150, 50)
  circle_pattern(180, 120, 100)


  isAllZero ?  svg.append("text")    
  .style("z-index", "10")         
  .attr("transform",
        "translate(150, 150)")
  .style("text-anchor", "middle")
  .text("No activity for this time period")
  .style("padding", "10px")
  .style("fill", "#fff")
  .style("font-family", 'Montserrat')
  .style("font-size", '14px') 
  : " ";

  const xScale = d3
    .scaleBand()
    .domain(data.map((val, i) => i))
    .range([0, w])
    .padding(0.1);

  tickLabels2 = []
  const yScale = d3.scaleLinear().domain([0, data_max]).range([h, 0]);
  tickLabels.forEach(function(item, i) { i % 2 == 0 ? tickLabels2.push(tickLabels[i]) :tickLabels2.push(" ") } );
  console.log(tickLabels2)

  const xAxis = d3.axisBottom(xScale).ticks(tickLabels.length).tickFormat(function(d,i){ return (tickLabels.length < 15 ? tickLabels[i] : tickLabels2[i])})


  const yAxis = d3.axisLeft(yScale).ticks(7);

  const tooltip = d3.select("#d3-container")
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

  svg.append("text")             
  .attr("transform",
        "translate(" + (w) + " ," + 
                       (h + 40) + ")")
  .style("text-anchor", "middle")
  .text("Date")
  .style("padding", "10px")
  .style("fill", "#fff")
  .style("font-family", 'Montserrat')
  .style("font-size", '14px');

  svg.append("g").call(yAxis).style("font-family", 'Montserrat');

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x",0 - (h / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(label)
      .style("fill", "#fff")
      .style("font-family", 'Montserrat')
      .style("font-size", '14px');     

  svg
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("x", (v, i) => xScale(i))
    .attr("y", yScale)
    .attr("width", xScale.bandwidth())
    .attr("height", (val) => h - yScale(val))
    .style("fill", "#B2085C")
    .on("mouseover", function(event, d, i) {
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