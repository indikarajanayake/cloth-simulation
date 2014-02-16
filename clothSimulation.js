/**
 * This javasctript class for the generate the cloth and behaviour using the jMaths.js class
 * Author :Indika Rajanayake
 *        :2007/mcs/041
 *
 *
 */




/**
 * this is the global variable for store the variables realated to the cloth generation
 *
 */

var _appGlobalVariables = {
    ctx:null,
    width:null,
    height:null,
    weightOfMass:200.0,
    numberofColumns:null,
    numberOfRows:null,
    massPointArray:new Array(),
    springArray:new Array(),
    gravity:null,
    time:0.05

}

/**
 * This generate the array for the calculation because the jMath.js is based on the javasctript array like hash map
 */
function generateArray() {
    this.arrayObject = new Array();       //generate the array
    this.arrayObject["X"] = 0.0;
    this.arrayObject["Y"] = 0.0;

    this.setArrayValue = function(dimension, value) {    //set the values for the array
        this.arrayObject[dimension] = value;
    }
    this.getArrayObject = function() {                  //get the values from the array
        return this.arrayObject;
    }
}


//var savedMouseCoords = null;
//var selectPointmass;
//var tempVector = new _2dVector(0.0, 0.0);
//var s1 = new Array();

/**
 *  This is the main javasctript function for the cloth simulation
 * @param width
 * @param height
 */



function _clothSimulation(width, height) {
    var canvas = document.getElementById('clothSimulation');   //get the canvas tag from the refered HTML5 page
    _appGlobalVariables.ctx = canvas.getContext('2d');
    _appGlobalVariables.width = width;                        //set the width and the height of the render area
    _appGlobalVariables.height = height;
    generateClothStructure();                                 //generate the cloth structure

    behaviourOfCloths();                                                 //call the  behaviour of the cloths
}

/**
 * This is the function to generate the cloth using the masspoints and springs in the jMath.js file
 *
 */


function generateClothStructure() {
    _appGlobalVariables.numberofColumns = 13;  //set the number of columnsof masses for the cloth
    _appGlobalVariables.numberOfRows = 12;     //set the number of rows of masses for the cloth


    //generate the cloth structure by using given mass points columns ans springs

    for (var rows = 0; rows < _appGlobalVariables.numberOfRows; rows++) {
        for (var cols = 0; cols < _appGlobalVariables.numberofColumns; cols++) {
            var x = (10 + cols) * 25;
            var y = (10 - rows) * 25 ;
            var dimenstion = new Array();
            dimenstion["X"] = x;
            dimenstion["Y"] = y;
            var massPoint = new _MassPoint(_appGlobalVariables.weightOfMass, dimenstion); //set the masspoint for the dimension
            if (cols > 0) {
                var prv_masspoint = _appGlobalVariables.massPointArray[_appGlobalVariables.massPointArray.length - 1];//get the previous mass point
                var spring = new _Spring(prv_masspoint, massPoint);  //set the spring between the mass points in horizontal manner
                _appGlobalVariables.springArray.push(spring);  //push the spring to the array
            }
            if (rows > 0) {
                var up_masspoint = _appGlobalVariables.massPointArray[_appGlobalVariables.massPointArray.length - _appGlobalVariables.numberofColumns]; //get the mass point which localte above to the given mass point
                var spring = new _Spring(massPoint, up_masspoint);//set the spring in vertical manner
                _appGlobalVariables.springArray.push(spring); //push the spring to the array
            }
            _appGlobalVariables.massPointArray.push(massPoint);  //push the masspoints for the array

        }
    }

}

/**
 * This the function for the do the behaviour of the cloth
 *
 */



function behaviourOfCloths() {

    var pointArray = new generateArray(); //this is the generate the array for the calculation

    pointArray["X"] = 0.0;
    pointArray["Y"] = -10.0;
    _appGlobalVariables.gravity = pointArray; //add the gravity for the behaviour

    //Apply the force for the masspoints
    for (massPoint in _appGlobalVariables.massPointArray) {
        _appGlobalVariables.massPointArray[massPoint].setForce(_appGlobalVariables.gravity);//apply the gravity force for the mass points
    }
    //get the movement of the mass points with the force apply in the given time period
    for (var i = 0; i < _appGlobalVariables.massPointArray.length; i++) {
        _appGlobalVariables.massPointArray[i].movement(_appGlobalVariables.time);  //get the new position of the mass points with given time period
    }

    //Arrays for the store the coordination of the static mass points
    var ar = new Array();
    ar["X"] = 250.0;
    ar["Y"] = 250.0;

     var ar1 = new Array();
    ar1["X"] = 575.0;
    ar1["Y"] = 250.0;

    //set the top left and top right mass points static for the hang
    _appGlobalVariables.massPointArray[0].setCPosition(ar);
    _appGlobalVariables.massPointArray[12].setCPosition(ar1);

    //chech the constraints of the spring
    for (spring in _appGlobalVariables.springArray) {
        _appGlobalVariables.springArray[spring].constraints();
    }
    //clear the canvas context for the new drawing
    _appGlobalVariables.ctx.clearRect(0, 0, _appGlobalVariables.width, _appGlobalVariables.height);

   //draw the springs in canvas
    for (spring in _appGlobalVariables.springArray) {
        _appGlobalVariables.springArray[spring].draw(_appGlobalVariables.ctx);
    }
    //draw the masspoint in canvas
    for (massPoint in _appGlobalVariables.massPointArray) {
        _appGlobalVariables.massPointArray[massPoint].draw(_appGlobalVariables.ctx);
    }
    //repeat the behaviour
    setTimeout("behaviourOfCloths()", 30);
}