$(document)
  .ready(function () {
    let dataSource = '/gdp/GDP-data.json'
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    let formatCurrency = d3.format("$,.2f")

    $.getJSON(dataSource, res => {
      if (res) {
        let data = res.data
          console.log(res)
          d3
            .select('.notes')
            .append('text')
            .text(res.description)

          let margin = {
              top: 5,
              right: 10,
              bottom: 30,
              left: 75
            },
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

          let barWidth = Math.ceil(width / data.length);

          let minDate = new Date(data[0][0]);
          let maxDate = new Date(data[data.length - 1][0]);

          let x = d3
            .scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);

          let y = d3
            .scaleLinear()
            .range([height, 0])
            .domain([
              0,
              d3.max(data, function (d) {
                return d[1];
              })
            ]);

          var xAxis = d3.axisBottom(x)
          // .ticks(d3.time.years, 5);

          var yAxis = d3
            .axisLeft(y)
            .ticks(10, "");

          // var infobox = d3.select(".infobox");

          var div = d3
            .select(".card")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          var chart = d3
            .select(".chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          chart
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          chart
            .append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.8em")
            .style("text-anchor", "end")
            .text("Gross Domestic Product, USA");

          chart
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
              return x(new Date(d[0]));
            })
            .attr("y", function (d) {
              return y(d[1]);
            })
            .attr("height", function (d) {
              return height - y(d[1]);
            })
            .attr("width", barWidth)
            .on("mouseover", function (d) {
              var rect = d3.select(this);
              rect.attr("class", "mouseover");
              var currentDateTime = new Date(d[0]);
              var year = currentDateTime.getFullYear();
              var month = currentDateTime.getMonth();
              var dollars = d[1];
              div
                .transition()
                .duration(200)
                .style("opacity", 0.9);
              div.html("<span class='amount'>" + formatCurrency(dollars) + "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' + months[month] + "</span>").style("left", (d3.event.pageX + 5) + "px").style("top", (d3.event.pageY - 50) + "px");
            })
            .on("mouseout", function () {
              var rect = d3.select(this);
              rect.attr("class", "mouseoff");
              div
                .transition()
                .duration(500)
                .style("opacity", 0);
            });

        }
      })
    })