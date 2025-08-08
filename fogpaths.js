// ----------- First Chart: Animated Lines with Glow ------------

const width1 = 1400;
const height1 = 1000;
const margin1 = { top: 20, right: 10, bottom: 20, left: 10 };

const svg1 = d3.select("#chart")
  .append("div")
  .attr("id", "chart1")
  .append("svg")
  .attr("width", width1)
  .attr("height", height1);

// Glow filter
const defs = svg1.append("defs");
const glowFilter = defs.append("filter").attr("id", "glow-filter");
glowFilter.append("feGaussianBlur").attr("stdDeviation", 6).attr("result", "blur");
const feMerge = glowFilter.append("feMerge");
feMerge.append("feMergeNode").attr("in", "blur");
feMerge.append("feMergeNode").attr("in", "SourceGraphic");

const x1 = d3.scaleLinear().domain([0, 100]).range([margin1.left, width1 - margin1.right]);
const y1 = d3.scaleLinear().domain([0, height1]).range([margin1.top, height1 - margin1.bottom]);

const lineCount = 100;
const lines = Array.from({ length: lineCount }, (_, i) => {
  const xPos = i;
  const coordinates = [
    [xPos, 0],
    [xPos + (Math.random() * 2 - 1), 100],
    [xPos + (Math.random() * 2 - 1), 200],
    [xPos + (Math.random() * 2 - 1), 300],
    [xPos + (Math.random() * 2 - 1), 400],
    [xPos + (Math.random() * 2 - 1), 500],
    [xPos + (Math.random() * 2 - 1), 600],
  ];
  return {
    name: `Line${i}`,
    coordinates,
    delay: i * 20
  };
});

const lineGenerator = d3.line()
  .x(d => x1(d[0]))
  .y(d => y1(d[1]));

lines.forEach(lineData => {
  const path = svg1.append("path")
    .datum(lineData.coordinates)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", 1)
    .attr("class", `path-${lineData.name}`);

  const pathNode = path.node();
  const totalLength = pathNode.getTotalLength();

  // Glow
  const glow = svg1.append("circle")
    .attr("r", 10)
    .attr("fill", "grey")
    .attr("class", "glow")
    .style("opacity", 0.3);

  // Main point
  const point = svg1.append("circle")
    .attr("r", 3)
    .attr("fill", "grey");

  // Trail path
  const trail = svg1.append("path")
    .attr("class", "trail");

  // Animate
  function animate() {
    const duration = 8000;

    point.transition()
      .delay(lineData.delay)
      .duration(duration)
      .ease(d3.easeLinear)
      .attrTween("transform", function () {
        return function (t) {
          const pt = pathNode.getPointAtLength(t * totalLength);
          return `translate(${pt.x},${pt.y})`;
        };
      });

    glow.transition()
      .delay(lineData.delay)
      .duration(duration)
      .ease(d3.easeLinear)
      .attrTween("transform", function () {
        return function (t) {
          const pt = pathNode.getPointAtLength(t * totalLength);
          return `translate(${pt.x},${pt.y})`;
        };
      });

    trail.transition()
      .delay(lineData.delay)
      .duration(duration)
      .ease(d3.easeLinear)
      .attrTween("d", function () {
        return function (t) {
          const subLength = t * totalLength;
          const trailPath = pathNode.getPointAtLength
            ? Array.from({ length: 80 }, (_, j) => {
                const l = subLength - j * 10;
                if (l < 0) return null;
                const pt = pathNode.getPointAtLength(l);
                return [pt.x, pt.y];
              }).filter(Boolean)
            : [];

          const trailLine = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);

          return trailLine(trailPath);
        };
      })
      .on("end", animate);
  }

  animate();
});


// ----------- Second Chart: Moving Circle with Axes ------------

const width2 = 700;
const height2 = 300;
const margin2 = { top: 20, right: 20, bottom: 30, left: 40 };

const pathCoordinates = [
  [0, 220],
  [195, 220],
  [215, 110],
  [325, 110],
  [340, 220],
  [640, 220]
];

const x2 = d3.scaleLinear().domain([0, 700]).range([margin2.left, width2 - margin2.right]);
const y2 = d3.scaleLinear().domain([0, 300]).range([height2 - margin2.bottom, margin2.top]);

const svg2 = d3.select("#chart")
  .append("div")
  .attr("id", "chart2")
  .append("svg")
  .attr("width", width2)
  .attr("height", height2);

svg2.append("g")
  .attr("transform", `translate(0,${height2 - margin2.bottom})`)
  .call(d3.axisBottom(x2));

svg2.append("g")
  .attr("transform", `translate(${margin2.left},0)`)
  .call(d3.axisLeft(y2));

const line2 = d3.line()
  .x(d => x2(d[0]))
  .y(d => y2(d[1]));

const path2 = svg2.append("path")
  .attr("d", line2(pathCoordinates))
  .attr("fill", "none")
  .attr("stroke", "black");

const circle2 = svg2.append("circle")
  .attr("r", 5)
  .attr("fill", "black")
  .attr("stroke", "black");

const totalLength2 = path2.node().getTotalLength();

function animate2() {
  circle2.transition()
    .duration(4000)
    .ease(d3.easeLinear)
    .attrTween("transform", function () {
      return function (t) {
        const point = path2.node().getPointAtLength(t * totalLength2);
        return `translate(${point.x},${point.y})`;
      };
    })
    .on("end", animate2); // loop
}
animate2();