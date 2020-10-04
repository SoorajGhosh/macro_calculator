var dataCalculator = (function(){

    function getConstants(hgtUnt,wgtUnt, activity, goal, gender){
        var hgtConst, wgtConst, activityConst, goalConst, genderBMRConst, genderBodyFatPerc;

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

        // Checking the Activity Unit
        if (activity === 'no'){
            activityConst = 1.2;
        } else if (activity === 'little'){
            activityConst = 1.35;
        } else if (activity === 'moderate'){
            activityConst = 1.5;
        } else if (activity === 'intense'){
            activityConst = 1.6;
        } else if (activity === 'hard'){
            activityConst = 1.75;
        }

        // Checking the Goal Unit
        if (goal === 'maintain'){
            goalConst = '=';
        } else if (goal === 'gain'){
            goalConst = '>';
        } else if (goal === 'loss'){
            goalConst = '<';
        }

        // Checking the Gender Unit
        if (gender === 'male'){
            genderBMRConst = 5;
            genderBodyFatPerc = 16.2
        } else if (gender === 'female'){
            genderBMRConst = -161;
            genderBodyFatPerc = 5.4
        }

        return [hgtConst, wgtConst, activityConst, goalConst, genderBMRConst, genderBodyFatPerc]
    }

    function getDoubleDecimal(val){
        return (Math.round(val*100))/100;
    }

    function calculate(form_val){
        [hgtVar, wgtVar, activityConst, goalConst, genderBMRConst, genderBodyFatPerc] = getConstants(form_val.heightUnit,form_val.weightUnit,
                                        form_val.activity, form_val.goal, form_val.gender, 
                                    );
        var weight = (form_val.weight)/wgtVar;
        var height = (form_val.height)/hgtVar;
        var age = (form_val.age);
        var bmi_val = Math.round(10000*weight/Math.pow(height,2));
        var bmi_unit = 'unit';
        var bmr_val = (10 * weight) + (6.25 * height) - (5 * age)  + genderBMRConst;
        var bmr_unit = 'kcal/day';
        var maintenance_cal_val = bmr_val*activityConst;
        var maintenance_cal_unit = 'kcal/day';
        var body_fat_perc_val = (1.20 * bmi_val) + (0.23 * form_val.age) - genderBodyFatPerc;
        var body_fat_perc_unit = '%';
        var lean_body_weight_val = weight-(body_fat_perc_val*weight/100);
        var lean_body_weight_unit = form_val.weightUnit;
        
        return {
            bmi : [getDoubleDecimal(bmi_val), bmi_unit],
            bmr : [getDoubleDecimal(bmr_val), bmr_unit],
            maintenance_cal : [getDoubleDecimal(maintenance_cal_val), maintenance_cal_unit],
            body_fat_perc : [getDoubleDecimal(body_fat_perc_val), body_fat_perc_unit],
            lean_body_weight : [getDoubleDecimal(lean_body_weight_val), lean_body_weight_unit],
            daily_calorie : [goalConst+getDoubleDecimal(maintenance_cal_val), maintenance_cal_unit]
        }
    }

    return {
        resultObj : function(formValues){return calculate(formValues)},
    };
})();





var UIcontroller = (function(){

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
        resultMethods : document.querySelector('.result-methods'),
        allResultMethods : document.querySelectorAll('.result-method'),
        // MACROS
        allMacros : document.querySelectorAll('.macro'),
        // RESULT
        resultValue : document. querySelector('#calc-result-value'),
        resultUnit : document.querySelector('#calc-result-unit'),
        shownResult : document.getElementById('shown-result-category')
        }
    }

    return {
        dom : domValues(),

        // adding red focus on the invalid input class
        add_invalid_el : function(el){
            invalid_el = domValues()[el+'Value'];
            invalid_el.classList.add("form-red-input");
            invalid_el.focus();
        },

        // Updating and Displaying Results
        resultDisplay : function(valArr){
            this.dom.resultValue.innerHTML = valArr[0];
            this.dom.resultUnit.innerHTML = valArr[1];
        },

        // Changing Display type of elements
        elementsDisplayChange : function(displayItems, displayType){
            // results = this.dom.allResultMethods;
            function showResult(n) {
                if(!n){n = 0;}
                var showingVal = displayItems[n].style.display = displayType;
                if(n < displayItems.length-1) {
                  setTimeout(function() { showResult(n + 1); }, 1000);
                }
            }
            setTimeout(showResult, 1000);
        }
    };
})();





var controller = (function(dataCalc, UIctrl){
    var formValues, resultObj;
    /*
    1. Get the Field Input Data
    2. Add the data to the DataCalculator
    3. Calculate the Result
    4. Display Result to the UI
    */
    var dom = UIctrl.dom;
    

    var main = function(){

        // SETTING AND GETTING THE FORM VALUES
        formValues =  {
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
            UIctrl.elementsDisplayChange(dom.allResultMethods, 'inline-block');    // DISPLAY THE RESULT METHODS
            resultObj = dataCalc.resultObj(formValues);     // SENDING THE FORM VALUES TO THE DATA CONTROLLER AND RECIEVING THE RESULT OUTPUT ARRAY
            UIctrl.resultDisplay(resultObj.bmi);            // SETTING THE RESULT IN THE UI
        } else {
            UIctrl.add_invalid_el(formValuesCheck(formValues));
        }

    }
    
    var clearFunc = function(){
        UIctrl.elementsDisplayChange(dom.allResultMethods,'none');    // Hiding the result methods
        dom.heightValue.value ='';              // Deleting values from form
        dom.heightUnit.value = 'cms';
        dom.weightValue.value = '';
        dom.weightUnit.value = 'kgs';
        dom.ageValue.value = '';
        dom.activity.value = 'no';
        dom.goal.value = 'maintain';
        dom.gender.value = 'male';
        dom.resultValue.innerHTML = 0;          // Setting default in results
        dom.resultUnit.innerHTML = 'unit';
        dom.shownResult.innerHTML = 'BMI'
    }
    
    var checkResultType = function(event){
        var target_el = event.target;
        if (target_el.className === dom.allResultMethods[0].className){
            dom.shownResult.innerHTML = target_el.innerHTML;
            dom.shownResult.style.textTransform="uppercase";
            UIctrl.resultDisplay(resultObj[target_el.id]);
            if (target_el.id === 'daily_calorie'){
                UIctrl.elementsDisplayChange(dom.allMacros, 'block');
            }
        }
    }

    dom.calcBtn.addEventListener('click', main);
    dom.clearBtn.addEventListener('click', clearFunc);
    dom.resultMethods.addEventListener('click',checkResultType);
    
    // THE CODE BELOW THE BUTTON CLICK ONLY HApPENS AFTER THE BUTTON IS CLICKED

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
















