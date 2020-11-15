function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("static/data/samples.json").then((data) => {
      var sampleNames = data.names;
      console.log(sampleNames);
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      var sample = "940";
      getPlots(sample);
      getInfo(sample);
      
  })

} 
  
  init();


// funtion that create the plots id using the assigned data
function optionChanged(sample) {
    console.log(sample)
    getPlots(sample);
    getInfo(sample);
}
function getPlots(id) { 
    //use D3 library to read the samples JSON file 
    d3.json("static/data/samples.json").then((data) => {
        console.log(data.samples);
        // filter sample data by id
        var sampleData = data.samples.filter(s => s.id == id)[0];
        console.log(sampleData);
        // get only the first 10 objects for plotting and reverse the array
        var sample_values = sampleData.sample_values.slice(0,10).reverse();
        console.log(sample_values)
        // Use `otu_ids` as the labels for the bar chart
        var otu_ids = sampleData.otu_ids.slice(0,10).map(i => {
            return 'OTU IDS: ' + i;
        }).reverse();
        console.log(`${otu_ids}`)
        // Use `otu_labels` as the hovertext for the chart
        var otu_labels = sampleData.otu_labels.slice(0,10).reverse;

        // create a trace for the bar plot
        var barTrace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            name: 'First 10',
            marker: {
                color: 'turquoise'},
            type: 'bar',
            orientation: 'h'
        };
        // Create the data variable
        var data = [barTrace];
        // Create layout variable for the plots
        var barLayout = {
            title: 'Top 10 OTU',
            font: {size: 5},
            yaxis:{
                tickmode: 'linear'
            },
            margin: {
                l: 50,
                r: 50,
                t: 100,
                b: 30,
            }
        };
        // Generate a new bar plot
        Plotly.newPlot('bar', data, barLayout);
        // Build bubble chart trace
        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };
        
        // Create the data variable for the bubble plot
        var data1 = [bubbleTrace];
        // Create layout variable for the bubble plot
        var bubbleLayout = {
            xaxis: {title: 'OTU ID'},
            showlegend: false,
            margin: {t: 20, l: 100}, 
  
        };
        // Create the bubble plot
        Plotly.newPlot('bubble', data1, bubbleLayout);
    });
}
// Create the function to get the necessary data
function getInfo(id) {
    // Read the JSON file to get data
    d3.json("static/data/samples.json").then((samplesData) => {
        // Get the data info for the demographic 
        var metadata = samplesData.metadata;
        console.log(metadata)
        // filter meta data info by id
       var result = metadata.filter(meta => meta.id.toString() === id)[0];
       console.log(result);
       // select demographic panel to insert data
        var demoInfo = d3.select("#sample-metadata");
         
      // Clear out the demographic for every new id input 
        demoInfo.html("");
 
      // Grab the necessary demographic data for the id and append the info
         Object.entries(result).forEach((key) => {   
             demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
         });
    });
}

