SabaLetters = {};

SabaLetters.drawTimeline = function(data, currentLetter) {
  var timelineDiv = $('#timeline');
  if (!this.width || timelineDiv.width() != this.width) {
    this.width = timelineDiv.width();
    console.log("Width is " + timelineDiv.width());
    var margin = {top: 10, right: 40, bottom: 10, left:40},
        width = timelineDiv.width(),
        height = 120;

    var firstYear = new Date(data[0].date).getUTCFullYear(),
        lastYear = new Date(data[data.length - 1].date).getUTCFullYear();

    console.log("years: " + firstYear + " : " + lastYear);

    var y = d3.scale.linear()
      .domain([firstYear, lastYear])
      .range([0, height - margin.top - margin.bottom]);

    var x = d3.scale.linear()
        .domain([0, 365])
        .range([0, width - 3 - margin.right]);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(lastYear - firstYear)
      .tickFormat(d3.format("d"))
      .tickSize(3, 0, 0)
      .tickPadding(2);


    function dayOfYear(d){
      var date = new Date(d.date);
      var timestmp = new Date().setUTCFullYear(date.getUTCFullYear(), 0, 1);
      var yearFirstDay = Math.floor(timestmp / 86400000);
      var today = Math.ceil(date.getTime() / 86400000);
      return today - yearFirstDay;
    }

    function make_y_axis() {        
      return d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(lastYear - firstYear)
    }

    d3.select('#timeline').select('svg').remove();

    var svg = d3.select('#timeline').append('svg')
        .attr('class', 'points')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.append('g')
        .attr('class', 'yaxis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

    svg.append("g")
      .attr("class", "grid")
      .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat("")
      )

    function isCurrentDate(d) {
      return d.date === currentLetter;
    }

    svg.selectAll('.points')
        .data(data)
      .enter().append('svg:circle')
        .attr('class', function(d){ 
          if (isCurrentDate(d)) {
          return "currentPoint"
          }
          else return "point"; 
        })
        .attr('cx', function(d){ return x(dayOfYear(d)) ; })
        .attr('cy', function(d){ return y(new Date(d.date).getUTCFullYear()); })
        .attr('r', 6)
        .on("mouseover", function(d){
          if (!isCurrentDate(d)){
            d3.select(this).transition().attr('r', function(d){ return 8; });
          }
        })
        .on("mouseout", function(d){
          if (!isCurrentDate(d)){
            d3.select(this).transition().attr('r', function(d){ return 6; });
          }
        }).
        on("click", function(d){
          if (!isCurrentDate(d)){
            window.location = d.date + ".html";
          }
        });
  }
}
