


// ============================== CONTROLS THE DATA CALCULATIONS FUNCTIONS ======================================

var dataCalculator = (function(){

    function getConstants(hgtUnt,wgtUnt, activity, goal, gender){
        var hgtConst, wgtConst, activityConst, goalConst, genderBMRConst, lbm_height_const, lbm_weight_const, lbm_const;

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
            proteinConst = 0.8;
        } else if (activity === 'little'){
            activityConst = 1.35;
            proteinConst = 0.8;
        } else if (activity === 'moderate'){
            activityConst = 1.5;
            proteinConst = 0.8;
        } else if (activity === 'intense'){
            activityConst = 1.6;
            proteinConst = 0.8;
        } else if (activity === 'hard'){
            activityConst = 1.75;
            proteinConst = 0.8;
        } else if (activity === 'very_hard'){
            activityConst = 1.9;
            proteinConst = 0.8;
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
            lbm_height_const = 0.267;
            lbm_weight_const = 0.407;
            lbm_const = 19.2;
        } else if (gender === 'female'){
            genderBMRConst = -161;
            lbm_height_const = 0.473;
            lbm_weight_const = 0.252;   
            lbm_const = 48.3;
        }

        return {
                hgtConst:hgtConst, 
                wgtConst:wgtConst, 
                activityConst:activityConst, 
                goalConst:goalConst, 
                genderBMRConst:genderBMRConst, 
                lbm_weight_const:lbm_weight_const,
                lbm_height_const:lbm_height_const,
                lbm_const:lbm_const,
                proteinConst:proteinConst
            }
    }

    function calculate(form_val){
        var constants = getConstants(form_val.heightUnit, form_val.weightUnit, form_val.activity, form_val.goal, form_val.gender);
        var weight = (form_val.weight)/constants.wgtConst;
        var height = (form_val.height)/constants.hgtConst;
        var age = (form_val.age);
        var bmi_val = Math.round(10000*weight/Math.pow(height,2));
        var bmi_unit = 'unit';
        var bmr_val = (10 * weight) + (6.25 * height) - (5 * age)  + constants.genderBMRConst;
        var bmr_unit = 'kcal/day';
        var maintenance_cal_val = bmr_val*constants.activityConst;
        var maintenance_cal_unit = 'kcal/day';
        var lean_body_mass_val = (constants.lbm_weight_const*weight) + (constants.lbm_height_const*height) - constants.lbm_const;
        var lean_body_mass_unit = form_val.weightUnit;
        var body_fat_perc_val = ((weight-lean_body_mass_val)/weight)*100;
        var body_fat_perc_unit = '%';
        var protein_val = weight*constants.proteinConst;
        var food_unit = 'gms'
        
        return {
            bmi : [bmi_val, bmi_unit],
            bmr : [bmr_val, bmr_unit],
            maintenance_cal : [maintenance_cal_val, maintenance_cal_unit],
            body_fat_perc : [body_fat_perc_val, body_fat_perc_unit],
            lean_body_weight : [lean_body_mass_val, lean_body_mass_unit],
            daily_calorie : [maintenance_cal_val, maintenance_cal_unit],
            protein : [0, food_unit],
            carb : [0, food_unit],
            fat : [0, food_unit]
        }
    }

    return {
        resultObj : function(formValues){return calculate(formValues)},
    };
})();





// ============================== CONTROLS THE UI FUNCTIONS ======================================

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
        macros : document.querySelector('.macros'),
        allMacros : document.querySelectorAll('.macro'),
        // RESULT
        resultValue : document. querySelector('#calc-result-value'),
        resultUnit : document.querySelector('#calc-result-unit'),
        shownResult : document.getElementById('shown-result-category')
        }
    }

    function improvingValue(val){
        var value = val.toFixed(2);                                                     //Rounding up the value to only 2 decimal points
        var valSplit = value.split('.');
        var int = valSplit[0];
        var dec = valSplit[1];
        if (int.length>3){
            int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);        // 1074 ==> 1,074
            value = int
        } else {
            value = int +'.' + dec;                                                     //20 + . + 42 ==> 20.42
        }
        return value
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
            resultVal = improvingValue(valArr[0]);          // Updating the value with ',' and floating points
            this.dom.resultValue.innerHTML = resultVal;     // Value
            this.dom.resultUnit.innerHTML = valArr[1];      // Unit
        },

        // Changing Display type of elements
        elementsDisplayChange : function(displayItems, displayType){
            function showResult(n) {
                if(!n){n = 0;}
                displayItems[n].style.display = displayType;
                if(n < displayItems.length-1) {
                  setTimeout(function() { showResult(n + 1); }, 500);
                }
            }
            setTimeout(showResult, 500);
        }
    };
})();






// ============================== CONTROLS THE BASIC FUNCTIONS ======================================

var controller = (function(dataCalc, UIctrl){
    var formValues, resultObj, invalidField, pressedEvent;
    /*
    1. Get the Field Input Data
    2. Add the data to the DataCalculator
    3. Calculate the Result
    4. Display Result to the UI
    */
    var dom = UIctrl.dom;
    
    // Check if all values are present
    function formValuesCheck(obj){
        for (var item in obj){
            if (!obj[item]){
                invalidField = item
                return false
            }
        }
        return true
    }

    var calculateAndShow = function(){

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

        if (formValuesCheck(formValues)){
            UIctrl.elementsDisplayChange(dom.allResultMethods, 'inline-block');    // DISPLAY THE RESULT METHODS
            resultObj = dataCalc.resultObj(formValues);                            // SENDING THE FORM VALUES TO THE DATA CONTROLLER AND RECIEVING THE RESULT OUTPUT ARRAY
            if (pressedEvent){
                checkResultType(pressedEvent);
            } else{
                UIctrl.resultDisplay(resultObj.bmi);                               // SETTING THE RESULT IN THE UI
            }
        } else {
            UIctrl.add_invalid_el(invalidField);
            invalidField=undefined;
        }
    }
    
    var clearFunc = function(){
        UIctrl.elementsDisplayChange(dom.allResultMethods,'none');      // Hiding the result methods
        UIctrl.elementsDisplayChange(dom.allMacros,'none');             // Hiding the macro
        dom.heightValue.value ='';                                      // Deleting values from form
        dom.heightUnit.value = 'cms';
        dom.weightValue.value = '';
        dom.weightUnit.value = 'kgs';
        dom.ageValue.value = '';
        dom.activity.value = 'no';
        dom.goal.value = 'maintain';
        dom.gender.value = 'male';
        dom.resultValue.innerHTML = 0;                                  // Setting default in results
        dom.resultUnit.innerHTML = 'unit';
        dom.shownResult.innerHTML = 'BMI';
        pressedEvent = undefined;                                       // Setting global Variables to undefined again
        formValues = undefined;
        resultObj = undefined;
        invalidField = undefined;
    }
    
    var checkResultType = function(event){
        var target_el = event.target;
        pressedEvent = event;
        if (target_el.className === dom.allResultMethods[0].className){
            dom.shownResult.innerHTML = target_el.innerHTML;
            dom.shownResult.style.textTransform="uppercase";
            UIctrl.resultDisplay(resultObj[target_el.id]);
            if (target_el.id === 'daily_calorie'){
                UIctrl.elementsDisplayChange(dom.allMacros, 'block');
            }
        } else if (target_el.className === dom.allMacros[0].className || target_el.parentNode.className === dom.allMacros[0].className){
            if (target_el.parentNode.className === dom.allMacros[0].className){
                target_el = target_el.parentNode
            }
            dom.shownResult.innerHTML = target_el.id;
            dom.shownResult.style.textTransform="uppercase";
            UIctrl.resultDisplay(resultObj[target_el.id]);
        }
    }

    var updateVal = function(){
        // Checking if FromValues are set
        if (formValues){
            // Checking if formvalues are set then are all of them valid or some are undefined, if undefined the below function is not executed
            if (formValuesCheck(formValues)){
                calculateAndShow();
            }
        }
    }

    dom.calcBtn.addEventListener('click', calculateAndShow);
    dom.clearBtn.addEventListener('click', clearFunc);
    dom.resultMethods.addEventListener('click',checkResultType);
    dom.macros.addEventListener('click',checkResultType);
    
    // Updating Result if any form value is changed
    dom.heightValue.addEventListener("input", updateVal);        // input : the function is triggered immediately 
    dom.heightUnit.addEventListener("input", updateVal);
    dom.weightValue.addEventListener("input", updateVal);
    dom.weightUnit.addEventListener("input", updateVal);
    dom.ageValue.addEventListener("input", updateVal);
    dom.activity.addEventListener("input", updateVal);
    dom.goal.addEventListener("input", updateVal);
    dom.gender.addEventListener("input", updateVal);
    

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
















