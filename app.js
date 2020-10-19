


// ============================== CONTROLS THE DATA CALCULATIONS FUNCTIONS ======================================

var dataCalculator = (function(){

    function getConstants(form_vals){
        var hgtConst, wgtConst, activityConst, goalConst, genderBMRConst, lbm_height_const, lbm_weight_const, lbm_const, macroConst, hgt_unit, wgt_unit;

        // Checking the Height Unit
        if (form_vals.heightUnit === 'cms'){
            hgtConst = 1;
            hgt_unit = 'cms';
        } else if (form_vals.heightUnit === 'inch'){
            hgtConst = 0.39;
            hgt_unit = 'inch';
        }

        // Checking the Wight Unit
        if (form_vals.weightUnit === 'kgs'){
            wgtConst = 1;
            wgt_unit = 'kgs'
            macroConst = 2.2;
            goalCalorieConst = 7700;
        } else if (form_vals.weightUnit === 'lbs'){
            wgtConst = 2.2;
            wgt_unit = 'lbs'
            macroConst = 1;
            goalCalorieConst = 3500;
        }

        // Checking the Activity Unit
        if (form_vals.activity === 'no'){
            activityConst = 1.2;
            proteinConst = 0.5;
            fatConst = 0.4;
        } else if (form_vals.activity === 'little'){
            activityConst = 1.35;
            proteinConst = 0.6;
            fatConst = 0.4;
        } else if (form_vals.activity === 'moderate'){
            activityConst = 1.5;
            proteinConst = 0.7;
            fatConst = 0.4;
        } else if (form_vals.activity === 'intense'){
            activityConst = 1.6;
            proteinConst = 0.8;
            fatConst = 0.4;
        } else if (form_vals.activity === 'hard'){
            activityConst = 1.75;
            proteinConst = 0.9;
            fatConst = 0.4;
        } else if (form_vals.activity === 'very_hard'){
            activityConst = 1.9;
            proteinConst = 1.0;
            fatConst = 0.4;
        }

        // Checking the Goal Unit
        if (form_vals.goal_target === 'maintain'){
            goalTargetConst = '';
            goalCalorieConst = 0;
        } else if (form_vals.goal_target === 'gain'){
            goalTargetConst = '+';
        } else if (form_vals.goal_target === 'loss'){
            goalTargetConst = '-';
        }

        // Checking the Goal Unit
        if (form_vals.goal_time_period === 'week'){
            goalTimePeriodConst = 7;
        } else if (form_vals.goal_time_period === 'month'){
            goalTimePeriodConst = 30;
        } else if (form_vals.goal_time_period === 'year'){
            goalTimePeriodConst = 365;
        }

        // Checking the Gender Unit
        if (form_vals.gender === 'male'){
            genderBMRConst = 5;
            lbm_height_const = 0.267;
            lbm_weight_const = 0.407;
            lbm_const = 19.2;
        } else if (form_vals.gender === 'female'){
            genderBMRConst = -161;
            lbm_height_const = 0.473;
            lbm_weight_const = 0.252;   
            lbm_const = 48.3;
        }

        return {
                hgtConst                : hgtConst,     
                hgt_unit                : hgt_unit,
                wgtConst                : wgtConst,
                wgt_unit                : wgt_unit,
                activityConst           : activityConst, 
                goalCalorieConst        : goalCalorieConst,
                goalTargetConst         : goalTargetConst, 
                goalTimePeriodConst     : goalTimePeriodConst,
                genderBMRConst          : genderBMRConst, 
                lbm_weight_const        : lbm_weight_const,
                lbm_height_const        : lbm_height_const,
                lbm_const               : lbm_const,
                proteinConst            : proteinConst,
                fatConst                : fatConst,
                macroConst              : macroConst
            }
    }

    function calculate(form_val){
        var constants = getConstants(form_val);

        var weight = (form_val.weight)/constants.wgtConst;
        var height = (form_val.height)/constants.hgtConst;
        var age = (form_val.age);
        var goal_weight_dif = form_val.goal_weight_dif;
        var goal_time_span = (form_val.goal_time_span) ? form_val.goal_time_span : 1;   // if no value is provided default is 1

        var bmi_val = Math.round(10000*weight/Math.pow(height,2));
        var bmi_unit = 'unit';
        var bmr_val = (10 * weight) + (6.25 * height) - (5 * age)  + constants.genderBMRConst;
        var bmr_unit = 'kcal/day';
        var maintenance_cal_val = bmr_val*constants.activityConst;
        var maintenance_cal_unit = 'kcal/day';
        var lean_body_mass_val = constants.wgtConst*((constants.lbm_weight_const*weight) + (constants.lbm_height_const*height) - constants.lbm_const);
        var lean_body_mass_unit = form_val.weightUnit;
        var body_fat_perc_val = ((form_val.weight-lean_body_mass_val)/form_val.weight)*100;     // coz we need the weight in same unit as given thus direct form values are taken
        var body_fat_perc_unit = '%';
        var goal_target_calorie = parseInt(constants.goalTargetConst+(constants.goalCalorieConst*goal_weight_dif));
        var goal_time = (goal_time_span*constants.goalTimePeriodConst);
        var daily_calorie_intake_val = maintenance_cal_val+(goal_target_calorie/goal_time);
        
        // Getting body fat percentage baed on US Navy Method
        // Did it without using getConstant bcz there will be a lot of constants to handle then
        if(form_val.bodyValues){
            neckVal = form_val.bodyValues.neck;
            waistVal = form_val.bodyValues.waist;
            hipVal = form_val.bodyValues.hip;
            if (form_val.heightUnit==='cms' && form_val.gender==='male'){
                body_fat_perc_val = (495/(1.0324 - 0.19077*Math.log10(waistVal-neckVal) + 0.15456*Math.log10(height)))-450;
            } else if (form_val.heightUnit==='cms' && form_val.gender==='female'){
                body_fat_perc_val = (495/(1.29579 - 0.35004*Math.log10(waistVal+hipVal-neckVal) + 0.22100*Math.log10(height)))-450;
            } else if (form_val.heightUnit==='inch' && form_val.gender==='male'){
                body_fat_perc_val = 86.01*Math.log10(waistVal-neckVal) - 70.041*Math.log10(height) + 36.76;
            } else if (form_val.heightUnit==='inch' && form_val.gender==='female'){
                body_fat_perc_val = 163.205*Math.log10(waistVal+hipVal-neckVal) - 97.684*Math.log10(height) + 36.76
            }
            lean_body_mass_val = weight-(weight*body_fat_perc_val/100)
        };

        // All these values depend on lean body mass and to get the most accurate one we have put it later the body parts form is also analysed
        var protein_val = lean_body_mass_val*constants.macroConst*constants.proteinConst;  // bcz protein constant is for pounds and we need another const for kilogram lbm
        var fat_val = lean_body_mass_val*constants.macroConst*constants.fatConst;
        // var carb_val = lean_body_mass_val*constants.macroConst*constants.carbConst;
        var carb_val = (daily_calorie_intake_val-(protein_val*4)-(fat_val*9))/4;
        var food_unit = 'gms';

        return {
            bmi                 : [bmi_val, bmi_unit],
            bmr                 : [bmr_val, bmr_unit],
            maintenance_cal     : [maintenance_cal_val, maintenance_cal_unit],
            body_fat_perc       : [body_fat_perc_val, body_fat_perc_unit],
            lean_body_weight    : [lean_body_mass_val, lean_body_mass_unit],
            daily_calorie       : [daily_calorie_intake_val, maintenance_cal_unit],
            protein             : [protein_val, food_unit],
            carbohydrate        : [carb_val, food_unit],
            fat                 : [fat_val, food_unit],
            units               : [getConstants.hgt_unit, getConstants.wgt_unit]
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
            goal_weight_difValue : document.querySelector('#weight-dif-inp'),
            goal_targetValue : document.querySelector('#target-inp'),
            goal_time_spanValue : document.querySelector('#time-span-inp'),
            goal_time_periodValue : document.querySelector('#time-period-inp'),
            gender : document.querySelector('#gender-inp'),
            //ACCURATE RESULT
            accurateBtn : document.querySelector('#get-accurate'),
            bodyForm : document.querySelector('.body-form'),
            neckValue : document.querySelector('#neck-inp'),
            waistValue : document.querySelector('#waist-inp'),
            hipValue : document.querySelector('#hip-inp'),
            // BUTTON
            calcBtn : document.querySelector('#calc-btn'),
            clearBtn : document.querySelector("#clear-btn"),
            // RESULT METHODs
            resultMobileMetods : document.querySelector('#result-mobile-methods'),
            resultMethods : document.querySelector('.result-methods'),
            allResultMethods : document.querySelectorAll('.result-method'),
            // MACROS
            macros : document.querySelector('.macros'),
            allMacros : document.querySelectorAll('.macro'),
            // RESULT
            resultValue : document. querySelector('#calc-result-value'),
            resultUnit : document.querySelector('#calc-result-unit'),
            shownResult : document.getElementById('shown-result-category'),
            // BRANDING
            branding : document. querySelector('.branding'),
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
        } else if (int.length===3){
            value = val.toFixed(1);                                                     // 391.87 ==> 391.9
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
    var formValues, resultObj, invalidField, pressedEvent, firstCalculation, mobileView, previousMobileResult, bodyPartsValues;
    /*
    1. Get the Field Input Data
    2. Add the data to the DataCalculator
    3. Calculate the Result
    4. Display Result to the UI
    */
    var dom = UIctrl.dom;
    
    var setFormValues = function(domVal){
        return {
            height              : domVal.heightValue.value,
            heightUnit          : domVal.heightUnit.value,
            weight              : domVal.weightValue.value,
            weightUnit          : domVal.weightUnit.value,
            age                 : domVal.ageValue.value,
            activity            : domVal.activity.value,
            goal_weight_dif     : domVal.goal_weight_difValue.value,
            goal_target         : domVal.goal_targetValue.value,
            goal_time_span      : domVal.goal_time_spanValue.value,
            goal_time_period    : domVal.goal_time_periodValue.value,
            gender              : domVal.gender.value,
            bodyValues          : bodyPartsValues,
            mobileResults       : dom.resultMobileMetods
        }
    }

    // Check if all values are present
    function formValuesCheck(obj){
        for (var item in obj){
            if (item === 'goal_time_span' || item ==='goal_target'){
                if (!obj['goal_weight_dif']){
                    continue
                } else {
                    if ((item ==='goal_target' && obj[item]!=='maintain')){
                        continue
                    } else if ((item ==='goal_time_span' && obj[item]!=='')){
                        continue
                    }
                    invalidField = item
                    return false
                }
            } else if (item === 'goal_weight_dif'){
                continue
            } else if (item === 'bodyValues'){
                continue
            } else if (!obj[item]){
                invalidField = item
                return false
            }
        }
        return true
    }

    var setPlaceHolder = function(formVal){
        dom.goal_weight_difValue.placeholder = '0 ' + formVal.weightUnit;
    }

    var calculateAndShow = function(){
        
        // SETTING AND GETTING THE FORM VALUES
        formValues =  setFormValues(dom);
        
        if (formValuesCheck(formValues)){
            resultObj = dataCalc.resultObj(formValues);                                 // SENDING THE FORM VALUES TO THE DATA CONTROLLER AND RECIEVING THE RESULT OUTPUT ARRAY
            
            // IF A RESULT METHOD IS ALREADY SELECTED THEN THAT RESULT WILL BE DISPLAYED ON THE UPDATE
            if (pressedEvent){
                checkResultType(pressedEvent);
            } else{
                UIctrl.resultDisplay(resultObj.bmi);                                    // SETTING THE RESULT IN THE UI
            }
            // SETTING THE FIRST CALCULATION VARIABLE TO TRUE SO AS TO DEFINE THAT THE FIRST PRESS ON THR CALCULATE BUTTON IS PRESSED.
            if (!firstCalculation){
                dom.branding.classList.remove('branding-fill');    // Removing the branding screen from the result section
                firstCalculation = true;
                // SETTING THE DISPLAYS CHANGES ACCORDING TO RESPONSIVE PAGES
                if (mobileView){
                    UIctrl.elementsDisplayChange([dom.resultMobileMetods,], 'block');   // BCZ WE NEED LISTS TO CHANGE DISPLAY
                    dom.resultMobileMetods.addEventListener('input', checkResultType)         // we set it here bcz else it was not existing in the dom before as its display is none
                } else {
                    UIctrl.elementsDisplayChange(dom.allResultMethods, 'inline-block'); // DISPLAY THE RESULT METHODS
                } 
            }
            
        } else {
            UIctrl.add_invalid_el(invalidField);
            invalidField=undefined;
        }
    }
    
    var clearFunc = function(){
        dom.branding.classList.add('branding-fill');   // clearing gets back the branding on the results section
        if (mobileView){
            UIctrl.elementsDisplayChange([dom.resultMobileMetods,],'none');
        } else {
            UIctrl.elementsDisplayChange(dom.allResultMethods,'none');   // Hiding the result methods
        }
        
        UIctrl.elementsDisplayChange(dom.allMacros,'none');             // Hiding the macro
        dom.heightValue.value ='';                                      // Deleting values from form
        dom.heightUnit.value = 'cms';
        dom.weightValue.value = '';
        dom.weightUnit.value = 'kgs';
        dom.ageValue.value = '';
        dom.activity.value = 'no';
        dom.goal_weight_difValue.value = '';
        dom.goal_targetValue.value = 'maintain';
        dom.goal_time_spanValue.value = '';
        dom.goal_time_periodValue.value = 'week';
        dom.gender.value = 'male';
        dom.resultMobileMetods.value = 'bmi';
        dom.resultValue.innerHTML = 0;                                  // Setting default in results
        dom.resultUnit.innerHTML = 'unit';
        dom.shownResult.innerHTML = 'BMI';
        dom.neckValue.value = '';                                       // Body Parts form cleaned
        dom.waistValue.value = '';
        dom.hipValue.value = '';
        dom.bodyForm.classList.remove('visible-body-form')              // Removing the form if visible already
        pressedEvent = undefined;                                       // Setting global Variables to undefined again
        formValues = undefined;
        resultObj = undefined;
        invalidField = undefined;
        firstCalculation = undefined;
        bodyPartsValues = undefined
    }
    
    var checkResultType = function(event){
        
        // checking if any result other than daily calorie is selected if yes then remove the macors
        var macroCheck = function(element){ return (element.className === dom.allMacros[0].className || element.parentNode.className === dom.allMacros[0].className)}; // Checking for macros for any element
        
        if (mobileView && event.target.id === 'result-mobile-methods'){         // checking if mobile result methods and in mobile view
            var target_el = event.target.options[event.target.selectedIndex];
        } else {
            var target_el = event.target;
        }
        
        if (pressedEvent && (!macroCheck(target_el) && target_el!==dom.macros)){    // Checking if pressed event exists and if taregt element is a macro or form maacros element
            if (!mobileView && (pressedEvent.target.id === 'daily_calorie' || macroCheck(pressedEvent.target)) && target_el.id !== 'daily_calorie'){   // checking if event is daily calorie or any macro and is it changed from it to something else
                UIctrl.elementsDisplayChange(dom.allMacros,'none');
            } else if (mobileView && previousMobileResult.value==='daily_calorie' && target_el.value!=='daily_calorie'){ // pressedEvent or the event that was before is daily calorie and the element now is something other than daily calorie then
                UIctrl.elementsDisplayChange(dom.allMacros,'none');
            }
        }

        //CHECKING IF TARGET ELEMENT IS FROM MACRO AND IT COMES FIRST BECAUSE ITS MUST BE CHECKED FIRST 
        if (macroCheck(target_el)){
            if (target_el.parentNode.className === dom.allMacros[0].className){
                target_el = target_el.parentNode
            }
            pressedEvent = event;
            dom.shownResult.innerHTML = target_el.id;
            dom.shownResult.style.textTransform="uppercase";
            UIctrl.resultDisplay(resultObj[target_el.id]);
        } else if (mobileView && event.target.id === 'result-mobile-methods'){
            pressedEvent = event;                        // Set it as the target item of a dictionary so as the update function can recognise it as an event
            previousMobileResult = target_el;           // this will store the previous target to check during macro removsl
            dom.shownResult.innerHTML = target_el.text;
            dom.shownResult.style.textTransform="uppercase";
            UIctrl.resultDisplay(resultObj[target_el.value]);
            if (target_el.value === 'daily_calorie'){
                UIctrl.elementsDisplayChange(dom.allMacros, 'block');
            }
        } else if (target_el.className === dom.allResultMethods[0].className){
            pressedEvent = event;
            dom.shownResult.innerHTML = target_el.innerHTML;
            dom.shownResult.style.textTransform="uppercase";
            UIctrl.resultDisplay(resultObj[target_el.id]);
            if (target_el.id === 'daily_calorie'){
                UIctrl.elementsDisplayChange(dom.allMacros, 'block');
            }
        }
    }

    var updateVal = function(){
        // Checking if FromValues are set
        if (firstCalculation){
            formValues =  setFormValues(dom);
            // Setting the placeholder according to the weight unit.
            setPlaceHolder(formValues);
            // Checking if formvalues are set then are all of them valid or some are undefined, if undefined the below function is not executed
            if (formValuesCheck(formValues)){
                calculateAndShow();
            } else {
                UIctrl.add_invalid_el(invalidField);
                invalidField=undefined;
            }
        }
    }

    //CHECKS AND RETURNS VALUES FROM BODY FORM
    var updateBodyVal = function(){
        neck = dom.neckValue.value;
        waist = dom.waistValue.value;
        hip = dom.hipValue.value;
        if (dom.gender.value==='male' && neck ){
            if (!waist){
                UIctrl.add_invalid_el('waist');     // Adding invalid field to the unfilled feilds in body form
            } else{
                bodyPartsValues = {neck : neck, waist : waist};
                calculateAndShow();
            }    
        } else if ( dom.gender.value==='female' && neck){
            if (!waist){
                UIctrl.add_invalid_el('waist');     // Adding invalid field to the unfilled feilds in body form
            } else if (!hip) {
                UIctrl.add_invalid_el('hip');       // Adding invalid field to the unfilled feilds in body form
            } else {
                bodyPartsValues = {neck : neck, waist : waist, hip : hip};
                calculateAndShow();
            } 
        }               
    }

    dom.calcBtn.addEventListener('click', calculateAndShow);
    dom.clearBtn.addEventListener('click', clearFunc);
    dom.resultMethods.addEventListener('click',checkResultType);
    dom.macros.addEventListener('click',checkResultType);

    // ACCURATE BUTTON 
    dom.accurateBtn.addEventListener('click',function(){dom.bodyForm.classList.toggle('visible-body-form')})
    
    // Updating Result if any form value is changed
    dom.heightValue.addEventListener("input", updateVal);        // input : the function is triggered immediately 
    dom.heightUnit.addEventListener("input", updateVal);
    dom.weightValue.addEventListener("input", updateVal);
    dom.weightUnit.addEventListener("input", updateVal);
    dom.ageValue.addEventListener("input", updateVal);
    dom.activity.addEventListener("input", updateVal);
    dom.goal_weight_difValue.addEventListener("change", updateVal);
    dom.goal_targetValue.addEventListener("input", updateVal);
    dom.goal_time_spanValue.addEventListener("input", updateVal);
    dom.goal_time_periodValue.addEventListener("input", updateVal);
    dom.gender.addEventListener("input", updateVal);
    // BODY PARTS FORM
    dom.neckValue.addEventListener("change", updateBodyVal);
    dom.waistValue.addEventListener("change", updateBodyVal);
    dom.hipValue.addEventListener("change", updateBodyVal);
    // SETING BRANDING TO FILL THE RESULT SCREEN BEFORE ANY CALCULATION HAS OCCURED
    dom.branding.classList.add('branding-fill');    

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
        dom.goal_weight_difValue.addEventListener('change', function(){
            dom.goal_weight_difValue.classList.remove('form-red-input');
        })
        dom.goal_targetValue.addEventListener('change', function(){
            dom.goal_targetValue.classList.remove('form-red-input');
        })
        dom.goal_time_spanValue.addEventListener('change', function(){
            dom.goal_time_spanValue.classList.remove('form-red-input');
        })
        invalidField=undefined;
    })();
    

    // MOBILE RESPONSIVENESS AND MEDIA QUERY IS SET HERE
    var media = window.matchMedia("(max-width: 700px)")

    function checkMedia(mediaQuery) {
        if (mediaQuery.matches) {
            mobileView = true;
        } else {
            mobileView = false;
        }
    }

    checkMedia(media)                                               // Call listener function at run time
    media.addListener(checkMedia)                                   // Attach listener function on state changes

})(dataCalculator, UIcontroller);
















//             neck                : (domVal.neck.value)? domVal.neck.value : 1,       // checking if value present if not 1 is given as value and not 0 so as not to get detected in the formValuesCheck
//             waist               : (domVal.waist.value)? domVal.waist.value : 1,
//             hip                 : (domVal.hip.value)? domVal.hip.value : 1,