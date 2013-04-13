$(function(){
  var data = {{ timeline_data }};

  function drawTimeline() {
    var timelineDiv = $('#timeline');
    if (!this.width || timelineDiv.width() != this.width) {
      this.width = timelineDiv.width();
      console.log("Width is " + timelineDiv.width());
      var margin = {top: 10, right: 40, bottom: 40, left:20},
          width = timelineDiv.width(),
          height = 50;

      var x = d3.time.scale()
          .domain([d3.time.year(new Date(data[0].date)), new Date(data[data.length - 1].date)])
          .range([0, width - margin.left - margin.right]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .ticks(d3.time.years, 1)
          .tickFormat(d3.time.format('%Y'))
          .tickSize(2)
          .tickPadding(3);

      d3.select('#timeline').select('svg').remove();

      var svg = d3.select('#timeline').append('svg')
          .attr('class', 'points')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
      
      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
          .call(xAxis);

      svg.selectAll('.points')
          .data(data)
        .enter().append('svg:circle')
          .attr('class', 'point')
          .attr('cx', function(d){ return x(new Date(d.date)); })
          .attr('cy', 0)
          .attr('r', function(d){ return 5; })
          .on("click", function(d) {
            console.log("click on " + d.date);
          })
          .on("mouseover", function(){
            var circle = d3.select(this);
            circle.transition().attr('r', function(d){ return 8; });
          })
          .on("mouseout", function(){
            var circle = d3.select(this);
            circle.transition().attr('r', function(d){ return 5; });
          }).
          on("click", function(d){
            window.location = d.date + ".html";
          });
    }
  }
  drawTimeline();
  $(window).resize(drawTimeline);
});