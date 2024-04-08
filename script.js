let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

let width = 700;
let height = 500;
let padding = 40;

let svg = d3.select("svg");
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {
  xScale = d3.scaleLinear()
    .domain([d3.min(values, (item) => item['Year']) - 1, d3.max(values, (item) => item['Year']) + 1])
    .range([padding, width - padding]);

  yScale = d3.scaleTime()
    .domain([d3.min(values, (item) => new Date(item['Seconds'] * 1000)), d3.max(values, (item) => new Date(item['Seconds'] * 1000))])
    .range([padding, height - padding]);
};

let drawPoint = () => {
  svg.selectAll('circle')
    .data(values)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', '5')
    .attr('data-xvalue', (item) => item['Year'])
    .attr('data-yvalue', (item) => new Date(item['Seconds'] * 1000))
    .attr('cx', (item) => xScale(item['Year']))
    .attr('cy', (item) => yScale(new Date(item['Seconds'] * 1000)))
    .attr('fill', (item) => item['Doping'] !== '' ? 'orange' : 'lightgreen')
    .on('mouseover', (item) => {
      tooltip.transition().style('visibility', 'visible');
      if (item['Doping'] !== '') {
        tooltip.text(`${item['Year']} - ${item['Name']} - ${item['Time']} - ${item['Doping']}`);
      } else {
        tooltip.text(`${item['Year']} - ${item['Name']} - ${item['Time']} - No Allegations`);
      }
      tooltip.attr('data-year', item['Year']);
    })
    .on('mouseout', () => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

let generateAxis = () => {
  let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'))
    .tickSizeOuter(0); // Remove outer ticks

  let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%M:%S'))
    .tickSizeOuter(0); // Remove outer ticks

  // Append X axis
  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - padding) + ')')
    .selectAll('text') // Apply styles to all axis text
    .style('fill', 'white'); // Change text color to white

  // Append Y axis
  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ',0)')
    .selectAll('text') // Apply styles to all axis text
    .style('fill', 'white'); // Change text color to white
};

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);

  drawCanvas();
  generateScales();
  drawPoint();
  generateAxis();
};
req.send();