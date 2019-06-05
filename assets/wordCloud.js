function wordCloud() {
  d3.csv("assets/Zurich_dogs.csv", function(error, data) {

      //////////
      var frequency_list = [];
      sorted_breed_count.forEach(function(e) {
        frequency_list.push({"text": e.breed, "size": e.count / 10});
      });

      frequency_list = frequency_list.slice(0,40);

      var color = d3.scale.linear()
              .domain([0,1,2,3,4,5,6,10,15,20,100])
              .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"])
              //.range(["#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222", "#222", "#222"].reverse())
              //.range(["#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#444", "#444", "#333", "#333"])
              ;

      d3.layout.cloud().size([400, 280])
              .words(frequency_list)
              .rotate(0)
              .fontSize(function(d) { return d.size; })
              .on("end", draw)
              .start();

      function draw(words) {
        var fill = d3.scale.category20();

        var svg = d3.select("#wordcloud").append("svg")
                .attr("width", 500)
                .attr("height", 310)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(220,140)")

        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Lucida Grande")
            .style("fill", function(d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        cloud
            .transition()
                .duration(300)
                .delay(function(d, i) { return 40*(i); })
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                .style("fill-opacity", 1);
      }
  });
}
