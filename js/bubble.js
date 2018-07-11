
function bubbleChart(data, chart) {
	var width = 600,
		height = 600,
		minRadius = 6,
		maxRadius = 30,
		chartName = chart;

	var colors = d3.scale.ordinal()
		.range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);


	data.map(function(d){
			d.value = +d["values"]; return d;
		});

	console.log(data);

	//shortens text and returns text as null if circle is too small
	function clipText (d, t) {
	    if (d.r < 40) {
	    return "";
	  }

	  var name = t.substring(0, d.r / 5);
	  if (name.length < t.length) {
	    name = name.substring (0, name.length - Math.min(2, name.length)) + "...";
	  }

	  return name;

	}

	var bubble = d3.layout.pack()
		.sort(null)
		.size([width, height])
		.padding(1.5);

	var svg = d3.select(chartName)
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'bubble');

	// use d3-tip if possible

	// var tip = d3.tip()
	// 	.attr('class', 'd3-tip')
	// 	.offset([-10,0])
	// 	.html(function(d) {
	// 		return "<strong># of sites:</strong><span style='color:white'>" + d.value + "</span>";
	// 	});

	// svg.call(tip)


		var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children;});
		
		var bubbles = svg.append("g")
			.attr("transform", "translate(0,0)")
			.selectAll(".bubble")
			.data(nodes)
			.enter();



		var div = d3.select(chartName).append("div")
			.attr("class", "tooltip")
			.style("opacity",0);


		bubbles.append("circle")
			.attr("r", function(d) { return d.r; })
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.style("fill", function(d) { return colors(d.value); })
			.on("mouseover", function(d) {
				// d3.select(this).attr("r", d.r + 10);
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(d.key + "</br><strong># Sites: </strong>" + d.value)
					.style("left", d3.event.pageX +"px")
					.style("top", (d3.event.pageY - 30) + "px");
				})
			.on("mouseout", function(d) {
				// d3.select(this).attr("r", d.r - 10);
				div.transition()
					.duration(500)
					.style("opacity", 0);
			});


		bubbles.append("text")
			.attr("x", function(d) {return d.x; })
			.attr("y", function(d) {return d.y + 5; })
			.attr("text-anchor", "middle")
			// .text(function(d) { return d["key"];})
			.text(function(d) {
				return clipText(d, d.key);
			})
			.style({
				"font-size": "1em"
			});

	return bubbleChart;
}
