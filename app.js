var dataCalculator = (function(){
    var bmi, bmr, maintCal, bodyFatPerc, leanBodyWeight, dailyCalIntake, proteinReq, carbReq, fatReq;
    var height, weight, age, activity, goal, gender;
    
    
    /*
    1. 
    */
    
    return {
        calcFunction : function(formValues){
            console.log(formValues.weight, formValues.height)
            var bmi = Math.round(10000*formValues.weight/Math.pow(formValues.height,2));
            console.log(bmi);
            return [bmi,'unit']
        },
    };
})();





var UIcontroller = (function(){

    /*
    1. Get the variables from the form
    2. Set the variable names and return them using an object
    3. Update the Result
    4. Update the Result Shown 
    */

    var domValues = function(){
        return {
        // FORM INPUT
        heightValue : document.querySelector('#height-inp'),
        heightUnit : document.querySelector('#height-opt'),
        weightValue : document.querySelector('#weight-inp'),
        heightUnit : document.querySelector('#weight-opt'),
        ageValue : document.querySelector('#age-inp'),
        activity : document.querySelector('#activity-inp'),
        goal : document.querySelector('#goal-inp'),
        gender : document.querySelector('#gender-inp'),
        // BUTTON
        calcBtn : document.querySelector('#calc-btn'),
        clearBtn : document.querySelector("#clear-btn"),
        // RESULT METHODs
        allResultMethods : document.querySelectorAll('.result-method'),
        activeElement : document.activeElement,
        bmi : document.querySelector('#bmi'),
        // RESULT
        resultValue : document. querySelector('#calc-result-value'),
        resultUnit : document.querySelector('#calc-result-unit')
        }
    }

    return {
        dom : domValues(),

        resultDisplay : function(valArr){
            this.dom.resultValue.innerHTML = valArr[0];
            this.dom.resultUnit.innerHTML = valArr[1];
        },
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
    

    var main = function(){

        // GETTING THE FORM VALUES
        var formValues =  {
            height : dom.heightValue.value,
            weight : dom.weightValue.value,
            age : dom.ageValue.value,
            activity : dom.activity.value,
            goal : dom.goal.value,
            gender : dom.gender.value
        };

        // SENDING THE FORM VALUES TO THE DATA CONTROLLER AND RECIEVING THE RESULT OUTPUT ARRAY
        var resultArr = dataCalc.calcFunction(formValues);

        // SETTING THE RESULT IN THE UI
        UIctrl.resultDisplay(resultArr);
    }
    
    var clearFunc = function(){
        dom.resultValue.innerHTML = 0;
        dom.resultUnit.innerHTML = 'unit';
    }

    dom.calcBtn.addEventListener('click', main);
    dom.clearBtn.addEventListener('click', clearFunc);

})(dataCalculator, UIcontroller);
















