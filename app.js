var dataCalculator = (function(){
    // var bmi, bmr, maintCal, bodyFatPerc, leanBodyWeight, dailyCalIntake, proteinReq, carbReq, fatReq;
    // var height, weight, age, activity, goal, gender;
    // var invalidField;
    
    
    // Check if all values are present
    function formValuesCheck(obj){
        for (var item in obj){
            if (!obj[item]){
                return item
            }
        }
        return true
    }

    function checkUnits(hgtUnt,wgtUnt){
        var hgtConst, wgtConst;

        // Checking the Height Unit
        if (hgtUnt === 'cms'){
            hgtConst = 1;
        } else if (hgtUnt === 'inch'){
            hgtConst = 0.39;
        }

        // Checking the Wight Unit
        if (wgtUnt === 'kgs'){
            wgtConst = 1;
        } else if (wgtUnt === 'lbs'){
            wgtConst = 2.2;
        }
        return [hgtConst, wgtConst]
    }

    return {
        calcFunction : function(formValues){
            var weight = formValues.weight;
            var height = formValues.height;
            var hgtUnit = formValues.heightUnit;
            var wgtUnit = formValues.weightUnit;
            [hgtVar, wgtVar] = checkUnits(hgtUnit,wgtUnit);
            var bmi = Math.round(10000*(weight/wgtVar)/Math.pow((height/hgtVar),2));
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
        heightUnit : document.querySelector('#height-unit'),
        weightValue : document.querySelector('#weight-inp'),
        weightUnit : document.querySelector('#weight-unit'),
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
    
    // adding red focus on the invalid input class
    var add_invalid_el = function(el){
        invalid_el = domValues()[el+'Value'];
        invalid_el.classList.add("form-red-input");
        invalid_el.focus();
    }

    var showResultMethods = function(){
        allResultMethods.style.display = 'block';
    }

    return {
        dom : domValues(),

        resultDisplay : function(valArr){
            this.dom.resultValue.innerHTML = valArr[0];
            this.dom.resultUnit.innerHTML = valArr[1];
            if (valArr[2]){
                add_invalid_el(valArr[2]);
            }
        },

        resultMethodsDisplay : function(displayType){
            results = this.dom.allResultMethods;
            function showResult(n) {
                if(!n){n = 0;}
                  
                var showingVal = results[n].style.display = displayType;    
              
                if(n < results.length) {
                  setTimeout(function() { showResult(n + 1); }, 500);
                }
            }
            setTimeout(showResult, 500);
        }
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
            heightUnit : dom.heightUnit.value,
            weight : dom.weightValue.value,
            weightUnit: dom.weightUnit.value,
            age : dom.ageValue.value,
            activity : dom.activity.value,
            goal : dom.goal.value,
            gender : dom.gender.value
        };

        
        // Check if all values are present
        function formValuesCheck(obj){
            for (var item in obj){
                if (!obj[item]){
                    return item
                }
            }
            return true
        }

        if (formValuesCheck(formValues)===true){
            // DISPLAY THE RESULT METHODS
            UIctrl.resultMethodsDisplay('inline-block');
            // SENDING THE FORM VALUES TO THE DATA CONTROLLER AND RECIEVING THE RESULT OUTPUT ARRAY
            var resultArr = dataCalc.calcFunction(formValues);
        } else {
            var resultArr = [0,'unit', formValuesCheck(formValues)]
        }

        // SETTING THE RESULT IN THE UI
        UIctrl.resultDisplay(resultArr);
    }
    
    var clearFunc = function(){
        UIctrl.resultMethodsDisplay('none');    // hiding the result methods
        dom.heightValue.value ='';
        dom.heightUnit.value = 'cms';
        dom.weightValue.value = '';
        dom.weightUnit.value = 'kgs';
        dom.ageValue.value = '';
        dom.activity.value = 'no';
        dom.goal.value = 'maintain';
        dom.gender.value = 'male';
        dom.resultValue.innerHTML = 0;
        dom.resultUnit.innerHTML = 'unit';
    }
    
    dom.calcBtn.addEventListener('click', main);
    dom.clearBtn.addEventListener('click', clearFunc);
    
    // THE CODE BELOW THE BUTTON CLICK ONLY HAAPENS AFTER THE BUTTON IS CLICKED

    // Removing any form-red-input class
    (function removeInvalid(){
        dom.heightValue.addEventListener('change', function(){
            dom.heightValue.classList.remove('form-red-input');
        });
        dom.weightValue.addEventListener('change', function(){
            dom.weightValue.classList.remove('form-red-input');
        });
        dom.ageValue.addEventListener('change', function(){
            dom.ageValue.classList.remove('form-red-input');
        })
    })();
    
})(dataCalculator, UIcontroller);
















