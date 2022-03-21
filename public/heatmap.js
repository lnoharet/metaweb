function summa(arr){
    var sum = 0
    for(let i = 0; i<arr.length; i++){
        sum += arr[i];
    }
    return sum;
}
var square_opacity = 0.5;
var max_val = -1;
function render_heatmap(){
    d3.select("#heatmap-svg").remove();
    console.log("rendering heatmap");
    // set the dimensions and margins of the graph

    //var margin =  {top: 0, right: 0, bottom: 0, left: 0},
    width = 900;
    height = 600;

    let transform;

    const zoom = d3.zoom().on("zoom", e => {
          svg.attr("transform", (transform = e.transform));
        });
    


    // append the svg object to the body of the page
    const svg = d3.select("#heatmap")
    .append("svg")
    .attr("id", "heatmap-svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .append("g")
    //.attr("transform", `translate(${margin.left}, ${margin.top})`)

    //Read the data
    //d3.csv("https://raw.githubusercontent.com/glas444/data/main/heatmap_data3.csv").then(function(data) {
    //d3.json("https://raw.githubusercontent.com/glas444/data/main/countries.csv").then(function(data) {  
    d3.json("https://raw.githubusercontent.com/glas444/data/main/data.json").then(function(data) {  
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        if (window.current_player_name != null){
            var new_data_json = []
            var w = 96;
            var h = 64;

            for(let i = 0; i<w; i++){
                for (let j = 0; j < h; j++){
                    new_data_json.push({coords : [i,j], value : [], names : []});
                }
            }
            // iterate through data to see if filter through vales and create new json object to same values.
            for (let i = 0; i<data.length; i++){
                for(let j = 0; j< data[i].names.length; j++){
                    
                    if (data[i].names[j] == window.current_player_name){
                        //get value and set to coordinate in new json object
                        new_data_json[i].value.push(data[i].value[j]);
                        new_data_json[i].names.push(window.current_player_name);
                        if (data[i].value[j] > max_val){
                            max_val = data[i].value[j];
                        }
                    }
                }
            }
            data = new_data_json;
        }
        else{
            max_val = 100;
        }

        const myGroups = Array.from(new Set(data.map(d => d.coords[0])))
        const myVars = Array.from(new Set(data.map(d => d.coords[1])))
        //const myValue = Array.from(new Set(data.map(d => d.value)))
        //const myNames = Array.from(new Set(data.map(d => d.names)))
        
        // Build X scales and axis:
        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(myGroups)
            //.padding(0.05);


        // Build Y scales and axis:
        const y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(myVars)
            //.padding(0.05);

        // Build color scale
        const myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1,max_val])

        const myNoColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([1,max_val])

        // create a tooltip
        const tooltip = d3.select("#heatmap")
            .append("div")
            .style("opacity", 1)
            .style("width", "800px")
            .style("height", "0px")
            .style("background-color", "#292929")
            .style("color", "white")
            .style("padding-left", "10px")
            .style("font-family", 'Montserrat')
            .style("font-size", '1rem');   

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event,d) {
            tooltip
            .style("opacity", 1)
            d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
        }
        const mousemove = function(event,d) {
            tooltip
            .html("Location <br>"+"x: " +d.coords[0]*16+" y: "+d.coords[1]*16+ "<br>These players have visited lately: "+ d.names.join(', '))

            .style("position", "fixed")
        }
        const mouseleave = function(event,d) {
            tooltip
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", square_opacity)
        }

        

        // add the squares
        svg.selectAll()
            .data(data, function(d) {return d.coords[0]+':'+d.coords[1];})
            .join("rect")
            .attr("class", "heatmap-square")
            .attr("x", function(d) { return x(d.coords[0]) })
            .attr("y", function(d) { return y(d.coords[1]) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return (myColor(summa(d.value)) === "#000004" ? "rgba(0,0,0,0)" : myColor(summa(d.value)))} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", square_opacity)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            
        
            
            //scale on the side
        function drawScale(id, interpolator) {
            
                var data = Array.from(Array(100).keys());
            
                var cScale = d3.scaleSequential()
                    .interpolator(d3.interpolateInferno)
                    .domain([max_val,0]);
            
                var yScale = d3.scaleLinear()
                    .domain([100,0])
                    .range([-5,height-9]);
                
                var yAxScale = d3.scaleLinear()
                    .domain([100,0])
                    .range([0,height-15]);
            
                var u = d3.select("#" + id)
                    .selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("y", (d) => Math.floor(yScale(d)))
                    .attr("x", 0)
                    .attr("width", 20)
                    .attr("height", (d) => {
        
                        return Math.floor(yScale(d)) - Math.floor(yScale(d+1)-3);
                        })
                    .attr("fill", (d) => cScale(100-d))
                    
            
                var yAxis = d3.axisRight(yAxScale);
            
                var svg = d3.select("#"+id);
            
                svg.append("g")
                .attr("class", "y axis")
                .attr("color", "white")
                .style("font-family", 'Montserrat')
                .attr("transform", "translate(22,12)")
                .call(yAxis)
                
                svg.append("text")
                .attr("class", "legendTitle")
                .attr("x", 250)
                .attr("y", -55)
                .style("text-anchor", "left")
                .attr("transform", "rotate(90)")
                .text("Player Activity ")
                .style("font-family", 'Montserrat')
                .style('fill', 'white');

                svg.append("text")
                .attr("id", "upperbound-txt")
                .attr("x", 1)
                .attr("y", 15)
                .text("")
                .style("font-family", 'Montserrat')
                .style('font-size', '15px')
                .style('fill', 'white')
                .style('textAlign', "center")
                ;
    
                svg.append("text")
                .attr("id", "lowerbound-txt")
                .attr("x", 1)
                .attr("y", 15)
                .text("")
                .style("font-family", 'Montserrat')
                .style('font-size', '15px')
                .style('fill', 'white')
                .style('textAlign', "center")
                ;
            
                svg.call(
                    d3.brushY()                   
                    .extent( [ [0,0], [20,height] ] )       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                    .on("brush", updateChartBrush) 
                )
        }
        drawScale("seq1", d3.interpolate(d3.interpolateInferno));

        function updateChartBrush(){

            const sel = d3.brushSelection(this);

            var upper_bound = 100 - sel[0] / 6;
            var lower_bound = 100 - sel[1] / 6;
            
            // displays values on brush
            var upper = d3.select("#upperbound-txt")
            upper.text(Math.round(upper_bound))
            
            var lower = d3.select("#lowerbound-txt")
            lower.text(Math.round(lower_bound))

            // font formatting
            if(Math.round(lower_bound) == 100){
                lower.style("font-size", '11px')
            }
            else{
                lower.style("font-size", '15px')
            }

            //edge case formatting
            if(Math.round(upper_bound) == 100){
                upper.style("font-size", '11px')
                upper.attr('y', sel[0] + 10)
            }
            else{
                upper.style("font-size", '15px')
            }
            if(Math.round(lower_bound) == 0){
                lower.attr('y', sel[1] - 1.5)
            }
            if(Math.round(lower_bound) < 10){
                lower.attr('x', 5)
            }            
            else{
                lower.attr('x', 1.5)
            }
            if(Math.round(upper_bound) < 10){
                upper.attr('x', 5)
            }            
            else{
                upper.attr('x', 1.5)
            }
            
            // position formatting
            if(Math.round(upper_bound) - Math.round(lower_bound) < 5){
                // have numbers on the outside of brush
                if(Math.round(upper_bound) != 100){
                    upper.attr("y", sel[0] - 1.5);
                }
                if(Math.round(lower_bound) != 0){
                    lower.attr("y", sel[1] + 12.5);
                }
            }
            else{
                // have numbers on the inside of brush
                if(Math.round(upper_bound) != 100){
                    upper.attr("y", sel[0] + 12.5);
                }
                lower.attr("y", sel[1] - 1.5);
            }
            if(Math.round(upper_bound) - Math.round(lower_bound) == 0){
                lower.text("")
            }

            d3.selectAll(".heatmap-square")
            .style("fill", function(d) { return ( summa(d.value) <= upper_bound && summa(d.value) > lower_bound ? myColor(summa(d.value)) : "rgba(0,0,0,0)" )} );
        }

    })

}