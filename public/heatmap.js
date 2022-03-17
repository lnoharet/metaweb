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
    d3.select("#heatmap-svg").remove(); // Not good, tar bort charten på sidan också
    console.log("rendering heatmap");
    // set the dimensions and margins of the graph

    var margin =  {top: 0, right: 0, bottom: 0, left: 0},
    width = 600*96/64;
    height = 600;


    // append the svg object to the body of the page
    const svg = d3.select("#heatmap")
    .append("svg")
    .attr("id", "heatmap-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

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
    // TODO: show color scale depending on max_val
    // TODO: Gör en color scale från genomskinlig till färg

    const myGroups = Array.from(new Set(data.map(d => d.coords[0])))
    const myVars = Array.from(new Set(data.map(d => d.coords[1])))
    const myValue = Array.from(new Set(data.map(d => d.value)))
    const myNames = Array.from(new Set(data.map(d => d.names)))
    
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
        //.range(["rgba(1,0,0,0)","rgba(1,0,0,1)"])

    const myNoColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,max_val])

    // create a tooltip
    const tooltip = d3.select("#heatmap")
        .append("div")
        .style("opacity", 1)
        .style("width", width)
        .style("height", "0px")
        .style("background-color", "#292929")
        .style("color", "white")
        .style("padding-left", "10px")
        .style("font-family", 'Montserrat')
        .style("font-size", '14px');   

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
        .html("Location <br>"+"x: " +d.coords[0]*16+" y: "+d.coords[1]*16+ "<br>Players: "+ d.names.join(', '))
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 + "px")
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
        .attr("x", function(d) { return x(d.coords[0]) })
        .attr("y", function(d) { return y(d.coords[1]) })
        //.attr("rx", 4)
        //.attr("ry", 4)
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return (myColor(summa(d.value)) === "#000004" ? "none" : myColor(summa(d.value)))} )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", square_opacity)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    })
   
}
