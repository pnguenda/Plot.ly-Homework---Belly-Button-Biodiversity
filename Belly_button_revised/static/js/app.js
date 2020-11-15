// Received help from Erin along with 7 other students both from MW and TTH class 
//"The Plan"
// 1.  Inspect data - samples.json, will need to use d3.json().then..
// 2.  Fill in 'sample #' element with data - dropdown input will feed into chart generation
// 2b. Will probably need to start with an initial chart
// 3.  Will also need a function for updating
// 3b.  Use sample# to select demographic info and chart data

// Revisions:
// Make two functions init() and optionChanged()
// init() includes data filling the dropdown and making initial charts with '940' data
// optionChanged() overwrites text and updates charts


function init(){

    //bring in data and inspect data
    d3.json("samples.json").then((data) => { 
        var names = data.names;
        var metadata = data.metadata[0];
        var samples = data.samples[0].otu_ids;
        var values = data.samples[0].sample_values;


        console.log(`Names: ${names}`);
        console.log(`MetaData: ${metadata}`);
        console.log(metadata);
        console.log(`Samples: ${samples}`);
        console.log(`Values: ${values}`);

        // D3 Method with standard for loop
        var selector = d3.select("#selDataset");
        selector.html("");
        for (i=0; i<data.names.length; i++){
            var dropdown = selector.append("option");
            dropdown.text(`OTU ${data.names[i]}`);
            dropdown.property("value", data.names[i]);
        };

        // // D3 Method with standard for loop 
        // // note: names = data.names
        // names.forEach((sample) =>{
        //     selector.append("option")
        //     .text(sample)
        //     .property("value", sample);
        // });

        
        // Addin the metadata area
        var meataArea = d3.select('#sample-metadata');
        meataArea.html("");
        var metadata =data.metadata;
        var filterMetaData = metadata.filter(i => i.id == "940")
        console.log(`Filtered: ${filterMetaData[0].id}`)
        console.log(filterMetaData)
        

        Object.entries(filterMetaData[0]).forEach(([key, value]) => {
            meataArea.append("p").text(`${key.toUpperCase()}: ${value}`);
        });
        // Generate a horizontal bar plot of one ID
        var trace ={
            type: "bar",
            orientation: "h",
            x: data.samples[0].sample_values.slice(0,10).reverse(),
            y: data.samples[0].otu_ids.slice(0,10).reverse().map(x => `OTU ${x.toString()}`),
            text: data.samples[0].otu_labels.slice(0,10).reverse(),
        };

        console.log(data.samples[0].otu_ids.slice(0,10).reverse().map(x => `OTU ${x.toString()}`));
        console.log(data.samples[0].sample_values.slice(0,10));


        var chartData = [trace];

        var layout = {
            title: `Sample ID: ${data.metadata[0].id}`,
            xaxis: {
                title: 'Sample Value',    
            },
            yaxis: {
                title: 'Sample ID'
            },
        };
        Plotly.newPlot("bar", chartData, layout);

    // Generate a bubble chart of one ID
    var trace1 = {
        x: data.samples[0].otu_ids,
        y: data.samples[0].sample_values,  
        mode: 'markers',
        marker:{
            color: data.samples[0].otu_ids,
            size: data.samples[0].sample_values
        }
    }
    var bubbleData = [trace1];

    var layout = {
        title: 'Sample Value versu Sample ID',
    };

    Plotly.newPlot('bubble', bubbleData, layout);


    });
 





}

init()


function optionChanged(){

    // restyle meta
    // restyle bubble chart
    // restyle horizontal bar chart

    // select input box
    var inputValue = d3.select("#selDataset").node().value
    console.log(inputValue)

    // bring in data
    d3.json("samples.json").then ((data) => { 

        // Filter the data for the object with the desired sample number
         // select metadata
        var metadata = data.metadata;
         // Data filter
        var resultsArray = metadata.filter(i => i.id == inputValue)
        console.log(resultsArray)
        var result = resultsArray[0]; // json only - key value pairs
        
       
        var metaArea = d3.select("#sample-metadata");
        metaArea.html("");

        Object.entries(result).forEach(([key, value]) => {
            metaArea.append("p").text(`${key.toUpperCase()}: ${value}`);
        });
  
         // Data filter
         var samples = data.samples;
         var resultsArray2 = samples.filter(i => i.id == inputValue)
         var result2 = resultsArray2[0];


         var otu_ids = result2.otu_ids;
         var otu_labels = result2.otu_labels;
         var sample_values = result2.sample_values;

         // buble chart update
         //Restyle Bubble Chart
         Plotly.restyle("bubble", "x", [otu_ids]);
         Plotly.restyle("bubble", "y", [sample_values]);
         Plotly.restyle("bubble", "marker", {color: otu_ids, size: sample_values});
    
      
        //horizontal bar chart
        // Restyle/Relayout Horizontal Bar Graph
        Plotly.restyle("bar", "x", [sample_values.slice(0,10).reverse()]);
        Plotly.restyle("bar", "y", [otu_ids.slice(0,10).reverse().map(x => `OTU ${x.toString()}`)]);
        Plotly.relayout("bar", {title: `Sample ID: ${result2.id}`});
   

    });

}   






