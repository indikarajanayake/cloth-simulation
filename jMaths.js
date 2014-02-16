/**
 * java sctript class for the do the calculation for the masses and the spring 
 */


/** vector class to handle the calculations realted to the vectors.
 * use this method to wrap the parameters in one object to reduce the reference complexicty
 *   @param x
 *   @param y
 */
function _2dVector(value) {
    //create the Map style Array to store the cordination of "X"  and "Y"
    this.dimensionMap = new Array();
    this.dimensionMap["X"] = value["X"];
    this.dimensionMap["Y"] = value["Y"];

    //get the cordination of the -2dVector
    this.getValueDimention = function(value) {
        for (key in value) {
            return this.dimensionMap[key];
        }
    }
    //set the value for the dimentions
    this.setValueDimention = function(value) {
        for (key in value) {
            this.dimensionMap[key] = value[key];
        }
    }
    //add the value for the dimentions
    this.addValueDimention = function(value) {
        for (key in value) {
            this.dimensionMap[key] += value[key];
        }
    }
    //substract the values from the dimention
    this.subValueDimention = function(value) {
        for (key in value) {
            this.dimensionMap[key] -= value[key];
        }
    }
    //get the dimension
    this.getCordination = function() {
        return this.dimensionMap;
    }
    //get the dotProduct of the vector
    this.dotProductOfVector = function(value) {
        return this.dimensionMap["X"] * value["X"] + this.dimensionMap["Y"] * value["Y"];
    }
    //get the distance between vector
    this.getDistance = function(value) {
        return Math.sqrt((this.dimensionMap["X"] - value["X"]) * (this.dimensionMap["X"] - value["X"]) + (this.dimensionMap["Y"] - value["Y"]) * (this.dimensionMap["Y"] - value["Y"]));
    }
    //get the length of the vector
    this.getLength = function() {
        return Math.sqrt(this.dimensionMap["X"] * this.dimensionMap["X"] + this.dimensionMap["Y"] * this.dimensionMap["Y"]);
    }
    //scale the vector
    this.scaleVector = function(scale) {
        for (key in this.dimensionMap) {
            this.dimensionMap[key] *= scale;
        }
    }

}
/**
 * handelling the calculations related to the masspoints
 * get the values form the out side files
 * @param weight
 * @param dimension
 */

function _MassPoint(weight, dimension) {
    var dimensionArray = new Array();
    this.currentPosition = new _2dVector(dimension);
    this.previousPosition = new _2dVector(dimension);
    this.weight = weight;
    this.force = new _2dVector(initialDimensionArray);

    //set the values for the cordination for the current position
    this.setCPosition = function(value) {
        this.currentPosition.setValueDimention(value);
    }
    //get the values for the cordination for the current position
    this.getCPosition = function() {
        return this.currentPosition.getCordination();
    }
    //set the value for the cordination for the previous position
    this.setPPosition = function(value) {
        this.previousPosition.setValueDimention(value);
    }
    //get the values for the cordination for the previous position
    this.getPPosition = function() {
        return this.previousPosition.getCordination();
    }

    //add the cordination for the current position
    this.addCPosition = function(value) {
        this.currentPosition.addValueDimention(value);
    }

    //subsctract the cordination from the current position
    this.subCPosition = function(value) {
        this.currentPosition.subValueDimention(value);
    }

    //add the cordination for the previous position
    this.addPPosition = function(value) {
        this.previousPosition.addValueDimention(value);
    }

    //subsctract the cordination from the previous position
    this.subPPosition = function(value) {
        this.previousPosition.subValueDimention(value);
    }

    //set the force
    this.setForce = function(value) {
        this.force.subValueDimention(value);
    }

    //add the value for the force
    this.addValueForce = function(value) {
        this.force.addValueDimention(value);
    }

    //subsctract the values from the force
    this.subValueForce = function(value) {
        this.force.subValueDimention(value);
    }

    //function for the movement calculation
    this.movement = function(time) {
        //Array for the store the value for the X coordination
        var arrayX = new Array();
        arrayX["X"] = 0.0;
        //Array for the store the value for the Y cordination
        var arrayY = new Array();
        arrayY["Y"] = 0.0;

        //Hash map style array to store the X coordination array and Y coordination array
        var map = new Array();
        map["X"] = arrayX;
        map["Y"] = arrayY;

        //variables for the store the calculation of the acceleration,time and new posiion
        var accelaration, squareTime;
        //array for the store current position for the calculation
        var currentPosition = new Array();
        //array for the store the new position for the calculation
        var newPosition = new Array();

        squareTime = time * time;
        /**
         this use the simple verlet integration for the calculation

         xi+1 = xi + (xi - xi-1) + a * dt * dt

         where xi is the current position of the mass and the xi+1 is the new position
         a is the acceleration and dt is the time stamp

         in here use the dimention array for the calculation and with the force dimention calculate the mass point dimentions

         **/
        for (var key in map) {
            accelaration = this.force.getValueDimention(map[key]) / this.weight;
            currentPosition[key] = this.currentPosition.getValueDimention(map[key]);
            newPosition[key] = this.currentPosition.getValueDimention(map[key]) + (this.currentPosition.getValueDimention(map[key]) - this.previousPosition.getValueDimention(map[key])) + accelaration * (time * time);
        }
        //store the new calculated position in the current position and the store the current position as the previous position
        this.previousPosition.setValueDimention(currentPosition);
        this.currentPosition.setValueDimention(newPosition);
    }

    /** function draw the masspoints with using the coordination of the mass points
     * get the context of the canvas and draw on it.
     *
     * @param ctx
     */

    this.draw = function(ctx) {
        //store the current x and y coordination on the array for the drawing
        var arrayX = new Array();
        arrayX["X"] = 0.0;

        var arrayY = new Array();
        arrayY["Y"] = 0.0;
        
        var map = new Array();
        map["X"] = 0.0;
        map["Y"] = 0.0;

        //set the line and position of the masspoint for the draw
        //mass point represent as the sphere in the environment
        ctx.lineWidth = 2;
        ctx.fillStyle = '#B20000';
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.currentPosition.getValueDimention(arrayX),
                this.currentPosition.getValueDimention(arrayY),
                1.0, 0.0, Math.PI * 2.0, true);
        ctx.fill();
    }
}
/**class handel the calculations related to the spring
 * get the values from the outside files
 *
 * @param pointMassA
 * @param pointMassB
 */

function _Spring(pointMassA, pointMassB) {
    //set the mass point A
    this.pointMassA = pointMassA;
    //set the mass point B
    this.pointMassB = pointMassB;
    //set the initial vector for the calculation
    this.vector = new _2dVector(initialDimensionArray);
    //get the masspoint A current position
    this.pointMassAPos = pointMassA.getCPosition();
    //get the masspoint B current position
    this.pointMassBPos = pointMassB.getCPosition();

    //set the distance for the vector for the calculation
    this.vector.setValueDimention(this.pointMassBPos);
    this.vector.subValueDimention(this.pointMassAPos);

    //set the short and long  constant for the spring
    this.shortConst = this.vector.getLength() * _appGlobals.minLength;
    this.longConst = this.vector.getLength() * _appGlobals.maxLength;

    //check the mass point positions vialate the spring property
    //for this we first define the length which masspoints can come closer and goaway
    //if the result distance between masses are not in the range what we declare we get the difference between result length
    //and we add that to the result length

    this.constraints = function() {
        //get the array for the store the difference
        var differenceMap = new Array();
        differenceMap["X"] = 0.0;
        differenceMap["Y"] = 0.0;

        //set the new vector which have the same distance like orginal spring have
        this.vector.setValueDimention(this.pointMassBPos);
        this.vector.subValueDimention(this.pointMassAPos);

        //if the new calculates distance less than the distance which mass points can come closer
        // push the mass points away from each other in small distance
        //like spring actually do
        if (this.vector.getLength() < this.shortConst) {

            //define the scale factor
            var scaleFactor;
            //get the scale factor
            //first we get the difference between length and devided by 2 to get the distance for one mass point and we increase it by small quantity
            scaleFactor = ((this.shortConst - this.vector.getLength()) / 2) * 0.01;
            //then scale the distance by that scale factor
            this.vector.scaleVector(scaleFactor);
            //add and subsctract the distance from the current position of the mass points
            this.pointMassA.subCPosition(this.vector.dimensionMap);
            this.pointMassB.addCPosition(this.vector.dimensionMap);
        }
        //if the new calculates distance greater than the distance which mass points can go away each other
        // push the mass points away from each other in small distance
        //like spring actually do same like we done for above  condition 

        if (this.vector.getLength() > this.longConst) {

            var scaleFactor;
            var ss = this.longConst;
            var sss = this.vector.getLength();
            scaleFactor = ((this.longConst - this.vector.getLength()) / 2) * 0.01;
            this.vector.scaleVector(scaleFactor);
            this.pointMassA.subCPosition(this.vector.dimensionMap);
            this.pointMassB.addCPosition(this.vector.dimensionMap);
        }
    }

    //this function draw the spring in the given context .context should pass as the parameter
    this.draw = function(ctx) {
        //get the arrays for the store the x ans y cordinations
        var arrayX = new Array();
        arrayX["X"] = 0.0;

        var arrayY = new Array();
        arrayY["Y"] = 0.0;
        
        var map = new Array();
        map["X"] = 0.0;
        map["Y"] = 0.0;

        ctx.lineWidth = 2;                //define the line width
        ctx.strokeStyle = '#B20000';      //define the stock color
        ctx.fillStyle = '#B20000';
        ctx.beginPath();
        try {
            var ca = this.pointMassA.getCPosition();    //get the masspoint "A" current position
            var cb = this.pointMassB.getCPosition();    //get the masspoint "B" current position
            ctx.moveTo(ca["X"], ca["Y"]);               //move to the masspoint "A" positon
            ctx.lineTo(cb["X"], cb["Y"]);               //draw the line from Mass point A to B
        } catch(e) {
            alert(e)
        }
        ctx.stroke();
    }
}


function generateMap() {
    this.array = new Array();
    this.array["X"] = 0.0;
    this.array["Y"] = 0.0;


}

//global variable to generate the inital array for the calculaion
var initialDimensionArray = new Array();
initialDimensionArray["X"] = 0.0;
initialDimensionArray["Y"] = 0.0;


//global javasctript object to store the min length and maxlength of the spring
var _appGlobals = {
    minLength:0.99,
    maxLength:1.01
}

  
