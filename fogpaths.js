const width = 700;
const height = 300;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

const pathCoordinates = [
  [0, 220],
  [195, 220],
  [215, 110],
  [325, 110],
  [340, 220],
  [640, 220]
];

const x = d3.scaleLinear().domain([0, 700]).range([margin.left, width - margin.right]);
const y = d3.scaleLinear().domain([0, 300]).range([height - margin.bottom, margin.top]);

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));

const path = svg.append("path")
    .attr("d", line(pathCoordinates))
    .attr("fill", "none")
    .attr("stroke", "black");

const circle = svg.append("circle")
    .attr("r", 5)
    .attr("fill", "black")
    .attr("stroke", "black");

const totalLength = path.node().getTotalLength();

function animate() {
    circle.transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attrTween("transform", function() {
            return function(t) {
                const point = path.node().getPointAtLength(t * totalLength);
                return `translate(${point.x},${point.y})`;
            };
        })
        .on("end", animate); // loop
}

animate();