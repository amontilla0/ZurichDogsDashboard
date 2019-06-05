function topBreedsChart() {
  var margin = {top: 30, right: 20, bottom: 180, left: 60},
      width = 450 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Dogs count:</strong> <span style='color:white'>" + d.count + "</span>";
    })

  var svg = d3.select("#topics_barchart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 310)
    .append("g")
      .attr("transform", "translate(" + 50 + "," + 8 + ")");

  svg.call(tip);

  top15 = sorted_breed_count.slice(0,15);

  x.domain(top15.map(function(d) { return d.breed; }));
  y.domain([0, d3.max(top15, function(d) { return d.count; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-55)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 20 - margin.left)
      .style("text-anchor", "middle")
      .text("Dogs count");

  svg.selectAll(".bar")
      .data(top15)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.breed); })
      .attr("width", x.rangeBand())
      .attr("height", 0)
      .attr("y", function (d, i) {
  				return height;
  			})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .transition().duration(400).delay(function(d, i) { return 115*i; })
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); })


  function type(d) {
    d.count = +d.count;
    return d;
  }
}
