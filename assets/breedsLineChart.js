function breedsLineChart(data = null) {
  prepareSelectors();

    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
      width = 1400 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    var x = d3.scale.linear().domain([2001,2014])
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var color = d3.scale.category20c();

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) {
        return x(d.year);
      })
      .y(function(d) {
        return y(d.count);
      });

    var svg = d3.select("#linechart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (data == null) {
      data = buildBreedsDataset();
    }

    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "year";
    }));

    var breeds = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            year: d.year,
            count: +d[name]
          };
        })
      };
    });

    x.domain(d3.extent(data, function(d) {
      return d.year;
    }));

    y.domain([
      d3.min(breeds, function(c) {
        return d3.min(c.values, function(v) {
          return v.count;
        });
      }),
      d3.max(breeds, function(c) {
        return d3.max(c.values, function(v) {
          return v.count;
        });
      })
    ]);

    var legend = svg.selectAll('g')
      .data(breeds)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width - 84)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.name);
      });

    legend.append('text')
      .attr('x', width - 70)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.name;
      });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 15 - margin.left)
      .style("text-anchor", "middle")
      .text("Dogs count");

    var breed = svg.selectAll(".breed")
      .data(breeds)
      .enter()
      .append("g")
      .attr("class", "breed");

    breed.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      })
      .call(transition)
      ;

    breed.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.year) + "," + y(d.value.count) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      // .text(function(d) {
      //   return d.name;
      // })
      ;

    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(breeds)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        coordx = Math.round(x.invert(d3.mouse(this)[0]));
        coordy = Math.floor(y.invert(d3.mouse(this)[1]));

        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + x(coordx) + "," + height;
            d += " " + x(coordx) + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {

            var bisect = d3.bisector(function(d) { return d.year; }).right;
                idx = bisect(d.values, coordx);

            d3.select(this).select('text')
              .text(d.values[idx-1].count);

            return "translate(" + x(coordx) + "," + y(d.values[idx-1].count) +")";
          });
      });
}

function buildBreedsDataset(breeds = null) {
  if (breeds == null) {
    breeds = sorted_breed_count.map(o => o.breed).slice(0,40);
    breeds = breeds.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  selected = dogs_by_breed_and_year.filter(c => breeds.map(y => y == c.breed).reduce((a,b) => a || b))
  data = []

  // filling the blanks with zero first.
  for (i = 2001 ; i <= 2015 ; i++) {
    data.push({year: i})
    data[i - 2001][breeds[0]] = 0;
    data[i - 2001][breeds[1]] = 0;
    data[i - 2001][breeds[2]] = 0;
  }

  selected.forEach(function(d) {
    yrs = d.years;
    byYear = _.chain(yrs).groupBy("year").map((g, key) => {return {year: key, count: _.sumBy(g, o => o.count)};}).value();

    byYear.forEach(function(y) {
      idx = y.year - 2001;
      if (data[idx]) {
        data[idx][d.breed] = y.count;
      }
      else {
        data[idx] = {year: +y.year};
        data[idx][d.breed] = y.count;
      }
    });

  });

  $('#sel1').selectpicker('val', breeds[0]);
  $('#sel2').selectpicker('val', breeds[1]);
  $('#sel3').selectpicker('val', breeds[2]);

  return data;
}

function transition(path) {
        path.transition()
            .duration(2300)
            .attrTween("stroke-dasharray", tweenDash);
    }
function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

function listenSelector(sel) {

  // option selection behavior
  sel.onchange = function() {
  var index = this.selectedIndex;
  var inputText = this.children[index].innerHTML.trim();
  console.log(inputText);

  breeds = [$("#sel1").val(), $("#sel2").val(), $("#sel3").val()];

  data = buildBreedsDataset(breeds);
  $("#linechart svg").remove();
  breedsLineChart(data);
  }
}

function prepareSelectors() {
  breeds = sorted_breed_count.map(o => o.breed)
  const sel1 = document.getElementById("sel1");
  const sel2 = document.getElementById("sel2");
  const sel3 = document.getElementById("sel3");

  breeds.forEach(function (d) {
    const o1 = document.createElement('option');
    o1.text = o1.value = d;
    const o2 = document.createElement('option');
    o2.text = o2.value = d;
    const o3 = document.createElement('option');
    o3.text = o3.value = d;
    sel1.add(o1, 0);
    sel2.add(o2, 0);
    sel3.add(o3, 0);
  });

  $('.selectpicker').selectpicker('refresh');

  listenSelector(sel1);
  listenSelector(sel2);
  listenSelector(sel3);
}
