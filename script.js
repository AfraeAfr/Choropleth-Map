let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countyData;
let educationData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

let drawMap = () => {
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = educationData.find((item) => item['fips'] === id);
            let percentage = county['bachelorsOrHigher'];
            if (percentage <= 15) {
                return '#fee5d9';
            } else if (percentage <= 30) {
                return '#fcae91';
            } else if (percentage <= 45) {
                return '#fb6a4a';
            } else {
                return '#de2d26';
            }
        })
        .attr('data-fips', (countyDataItem) => countyDataItem['id'])
        .attr('data-education', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = educationData.find((item) => item['fips'] === id);
            return county['bachelorsOrHigher'];
        })
        .on('mouseover', (countyDataItem) => {
            tooltip.transition().style('visibility', 'visible');

            let id = countyDataItem['id'];
            let county = educationData.find((item) => item['fips'] === id);

            tooltip.text(`${county['fips']} - ${county['area_name']}, ${county['state']}: ${county['bachelorsOrHigher']}%`)
                .attr('data-education', county['bachelorsOrHigher'])
                .style('left', (d3.event.pageX + 10) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition().style('visibility', 'hidden');
        });
};

d3.json(countyURL).then(
    (data) => {
        countyData = topojson.feature(data, data.objects.counties).features;

        d3.json(educationURL).then(
            (data) => {
                educationData = data;
                drawMap();
            }
        );
    }
);
