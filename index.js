const express = require('express');
const app = express();
const models = require("./models/Flight");
const routes = require("./routes/flightRoute");
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded());


const flights = require('./flight.json');


//get all flights
app.get('/flights', function(req, res) {
    return res.json(flights)
}); 

// get a single flight
app.get('/flight/:id', function(req, res){
    let id = req.params.id;

    let foundFlight = flights.find( flight => {
        return String(flight.id) === id
    });
    if (foundFlight) {
        return res.status(200).json({flight: foundFlight})
    } else {
        return res.status(404).json({message: 'flight not found'})
    }
});

//delete flight
app.delete('/flight/delete/:id', function(req, res) {
    let id = +req.params.id;
    let index = flights.findIndex((flight) => flight.id === id );
    console.log(index)
    if ( index != -1) {
        let deletedData = flights.splice(index, 1);
        let stringData = JSON.stringify(flights, null, 2)
        fs.writeFile('flight.json', stringData, function(err){
        if (err) {
            return res.status(500).json({message: err});
        } 
    });
        return res.status(200).json({message: 'flight deleted'});
    } else {
        return res.status(404).json({message: 'flight does not exist'})
    }
});

//update flight
app.put('/flight/update/:id', function(req, res){
    let id = +req.params.id;
    let body = req.body;
    let index = flights.findIndex((flight) => flight.id === id );
    if ( index != -1) {
    let updatedflight = {id:id, ...body};
    flights[index] = updatedflight;
    let stringData = JSON.stringify(flights, null, 2);
        fs.writeFile('flight.json', stringData, function(err){
        if (err) {
            return res.status(500).json({message: err});
        } else {
            return res.status(200).json({message: 'update successful'})
        }});
    } else {
        return res.status(404).json({message: 'flight does not exist'});
    };
});
    
//add flight
app.post('/flights', function(req, res){
    flights.push(req.body.newFlight);
    let stringData = JSON.stringify(flights, null, 2);
    fs.writeFile('flight.json', stringData, function(err){
        if (err) {
            return res.status(500).json({message: err});
        }
    });
    return res.status(200).json({message: 'new flight created'});
});



app.listen(8000, function(req, res){
    console.log('server is running on port 8000');
});
