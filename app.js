var dataCalculator = (function(){

    /*
    1. 
    */

    return true;
})();





var UIcontroller = (function(){

    /*
    1. Get the variables from the form
    2. Set the variable names and return them using an object
    3. Update the Result
    4. Update the Result Shown 
    */

    var domValues = {
        calcBtn : document.querySelector('#calc-btn'),
        clearBtn : document.querySelector("#clear-btn"),
    }

    return {
        dom : domValues,
    };
})();





var controller = (function(dataCalc, UIctrl){
    
    /*
    1. Get the Field Input Data
    2. Add the data to the DataCalculator
    3. Calculate the Result
    4. Display Result to the UI
    */
    var dom = UIctrl.dom;

    var test = function(){console.log('pressed')};
    
    dom.calcBtn.addEventListener('click',test);

})(dataCalculator, UIcontroller);
















