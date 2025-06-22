            const guests = document.getElementById("guestNR");
            const testbtn = document.getElementById("testbtn");
            const testArrayDiv = document.getElementById("testArray");

            const testMealbtn = document.getElementById("testMealbtn");
            const testMealArray = document.getElementById("testMealArray");

            const testBusbtn = document.getElementById("testBusbtn");
            const testBusArray = document.getElementById("testBusArray");
             // more info button
            const dialog = document.getElementById('drinkInfo'); // retrieves the drinkInfo element
            const openBtn = document.getElementById('openDialogBtn'); //retrieves the openDialog button
            const closeBtn = document.getElementById('closeDialogBtn'); //retrieves the close Dialog button
            
            let GuestInfoStorage = []; // Empty array to store all of the user answers from the GuestInfo fieldset in
            let MealInfoStorage = [];
            let BusInfoStorage = [];
            let DrinkInfoStorage = [];
            let QuestionInfoStorage = [];

            // Keep backup arrays for restoring
            let oldGuestInfo = [];
            let oldMealInfo = [];
            let oldBusInfo = [];
            let oldDrinkInfo = [];
            let oldQuestion = [];

            let counting = 0; // defines a global counting variable that is redefined when the updateField function is run. Stores this info for the next part of the RSVP.

//Schemas-------------------------------------------------------
            // a schema that defines the rules for the GuestInfoStorage array. Used later for validation checks
            const guestInfoSchema = [
                { field: "GuestName", message: "Please enter the name for Guest {n}" },
                { field: "plus1", message: "Please select if Guest {n} wants a +1" },
                { field: "plusOneName", if: { field: "plus1", value: "yes" }, message: "Please enter the +1 name for Guest {n}" },
                { field: "plusOneRel", if: { field: "plus1", value: "yes" }, message: "Please enter the +1 relationship for Guest {n}" }
            ];
            
            const mealInfoSchema = [
                { field: "menuChoice",  message: "Please select a meal for Guest {n}" },
                { field: "severityChoice", if: { field: "allergenSelected", value: "true" }, message: "Please enter the severity of your allergies" },
            ];  
            
            const busInfoSchema = [
                { field: "hotelName",  if: {field: "busAnswer", value: "Yes"}, message: "Please enter the hotel name for Guest {n}" },
                { field: "busTimes",  if: {field: "busAnswer", value: "Yes"}, message: "Please pick a bus time for Guest {n}" },
                { field: "busTimes", if: { field: "timeSelected", value: "true" }, message: "Please enter a suggested time for Guest {n}" },
            ]; 
// Functions:
//--------------------------------------------------------------

            // this function takes a string and replaces white spaces with _
            function makeSafe(str) {
                return str.replace(/\W/g, '_');
            };

//For the first guest info section --------------------------------------------------------------
            function updateField() {
                document.getElementById("Menu").style.display = "none"; 
                document.getElementById("Bus").style.display = "none"; //hides the Bus section if it was previously filled out
                document.getElementById("Drinks").style.display = "none"; //hides the drinks section if it was previously filled out
                document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out

                // Step 1: Save a copy of old data
                oldGuestInfo = [...GuestInfoStorage];
                //Step 2: wipe the current Storage list to avoid duplicates
                GuestInfoStorage = [];
                counting = guests.value; // redefines counting to match the number of guests entered by the user. 
                
                //Step 3: wipe all previously generated form elements (gInfo in this case)
                const gInfoDiv = document.getElementById("gInfo");
                gInfoDiv.innerHTML = '<legend><h3>Enter your full names here:</h3></legend><br>'; //deletes the html content of the guestDetailsDiv element.
                
                if (counting > 0 && counting < 11){ // Since I want a max of 10 guests, this makes sure that the code only works when the entered number is above 0 but below 11. 
                
                    gInfoDiv.style.display = "block";
                    testArrayDiv.style.display = "block";

                    //Step 4: create for loop to generate the amount of dynamic fields necessary.
                    for (let i = 0; i<counting; i++){ //runs the following code up to the number specified by user.
                        
                        //Step 5: create empty local storage object  
                        let GuestiInfo = {}; // Empty object to store all of the answers in, Guest Name, +1 answer, +1 name, +1 relationship
                
                        // myInp is a new div element of the class container that will be added to gInfo later
                        const myInp = document.createElement("div"); myInp.className="container";

                        // defines the code contained in myInp
                        myInp.innerHTML = `
                        <div>
                        <label>Guest ${i+1} full name: </label>
                        <input type="text" id="GuestID${i+1}" name="fname" required/> <br><br>
                        </div>
                        <div id="yesno+1${i+1}">
                            <legend>Would you like to request a +1?</legend>
                            <input type="radio" id="yes${i+1}" name="+1${i+1}" value="yes"required/>
                            <label for="yes${i+1}">Yes</label>
                            <input type="radio" id="no${i+1}" name="+1${i+1}" value="no" required/>
                            <label for="no${i+1}">No</label><br><br>
                        </div>
                        `;

                        // appends myInp to ginfo in the document.
                        gInfoDiv.appendChild(myInp);
     
                        const GuestName = myInp.querySelector(`#GuestID${i+1}`); //retrieves the current GuestName to save in GuestInfo later
                        const plusOneYes = myInp.querySelector(`#yes${i+1}`); // retrieves the yes input
                        const plusOneNo = myInp.querySelector(`#no${i+1}`); // retrieves the no input
                        
                        //Event listener for the main guest name                        
                        GuestName.addEventListener("change", function(){
                            GuestiInfo.GuestName = this.value; // saves the entered guest name into GuestInfo for later
                        });

                        // Event listener for the yes radio button. Adds the input fields for plus one to the guest's info
                        plusOneYes.addEventListener("click", function() {
                            
                            let plusOneInfo = document.getElementById(`+1info${i+1}`); // retrieves the plusone info field if it already exists. 

                           //if no plus one for this guest existed before, then one is created
                            if (!plusOneInfo){ 
                                 plusOneInfo = document.createElement("div"); 
                                 plusOneInfo.className = "container"; 
                                 plusOneInfo.id = `+1info${i+1}`;
                                
                                 // writes the info in the newly created div
                                plusOneInfo.innerHTML = `  
                                    <div> <label>Name of plus one for Guest ${i+1}: </label> </div>
                                    <div> <label>Relationship between plus one and Guest ${i+1}: </label></div>
                                    <div><input type="text" id="plusOneName${i+1}" name="fname" /> </div>
                                    <div><input type="text" id="plusOneRel${i+1}" name="longAns"/></div> <br><br>`;
                                    // appends this plus one info to myInp
                                myInp.appendChild(plusOneInfo);

                                // adding eventlisteners to the newly generated plusOne text input fields
                                plusOneInfo.querySelector(`#plusOneName${i+1}`).addEventListener("change", function(){
                                    GuestiInfo.plusOneName = this.value;
                                });
                                plusOneInfo.querySelector(`#plusOneRel${i+1}`).addEventListener("change", function(){
                                    GuestiInfo.plusOneRel = this.value;
                                });

                                // Restores old plus one info if it exists
                                if (oldGuestInfo[i] && oldGuestInfo[i].plusOneName) { //if both oldGuestInfo[i] and oldGuestInfo[i].plusOneName exists, run the following code:
                                    plusOneInfo.querySelector(`#plusOneName${i+1}`).value = oldGuestInfo[i].plusOneName; //retrieves the old plus1 info
                                    GuestiInfo.plusOneName = oldGuestInfo[i].plusOneName // restores the old plus 1 info
                                }
                                if (oldGuestInfo[i] && oldGuestInfo[i].plusOneRel) {//if both oldGuestInfo[i] and oldGuestInfo[i].plusOneName exists, run the following code:
                                    plusOneInfo.querySelector(`#plusOneRel${i+1}`).value = oldGuestInfo[i].plusOneRel;//retrieves the old plus1 info
                                    GuestiInfo.plusOneRel = oldGuestInfo[i].plusOneRel // restores the old plus 1 info
                                }
                            }; // the end of the if statement for restoring old data 

                            // if no plusOneInfo existed yet, then the value of the yes radio button is set to yes here. 
                            GuestiInfo.plus1 = "yes";
                            }); //the end of the plusOneYes event listener

                        // adds an eventlistener to the no radio button that 1) removes the +1 info input fields if the user clicked yes first and 2) adds this answer to GuestInfo
                        plusOneNo.addEventListener("click", function() {
                            const changedFromYes = document.getElementById(`+1info${i+1}`) // retrieves the +1info from the document
                            if (changedFromYes) changedFromYes.remove(); //if this +1info exists in the document, it is removed
                            GuestiInfo.plus1 = "no"; // stores the new answer in GuestiInfo
                            GuestiInfo.plusOneName = "";
                            GuestiInfo.plusOneRel = "";
                        })

                        //Step 10: Restore old guest data if it exists
                        if (oldGuestInfo[i]) { //if there is anything stored in oldGuestInfo[i], proceed with following code
                            const old = oldGuestInfo[i];
                            // Restore guest name
                            GuestName.value = old.GuestName || ""; // sets the current value to the old value or clears it with ""
                            GuestiInfo.GuestName = old.GuestName || ""; 
                            
                            // Restore +1 radio
                            if (old.plus1 === "yes") {
                                plusOneYes.checked = true;
                                
                                // Programmatically trigger the click to create the +1 fields
                                plusOneYes.click();
                            }else if (old.plus1 === "no"){
                                plusOneNo.checked = true;
                            }
                        } // end of checking if oldguest info was saved

                        // Saves the info gathered into GuestInfo into a global list by index. This keeps things ordered for later
                        GuestInfoStorage[i] = GuestiInfo; 
                    };  // end of for loop
                }// end of if statement

                // If the number of guests entered is not between 1 and 10, this alert will pop up.
                else {
                    window.alert("Please enter a number between 1 and 10");
                }
            }

//For the second, Meal info section --------------------------------------------------------------
        
            // this function updates the meal fields to include all of the guests entered in the first question.
            function updateMeal() {
                document.getElementById("Bus").style.display = "none"; //hides the Bus section if it was previously filled out 
                document.getElementById("Drinks").style.display = "none"; //hides the drinks section if it was previously filled out
                document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                document.getElementById("Menu").style.display = "block"; // makes the div element called Menu visible
                testMealArray.style.display = "block";

                // Step 1: Save a copy of old data
                oldMealInfo = [...MealInfoStorage];
            
                //Step 2: wipe the current Storage list to avoid duplicates
                MealInfoStorage = []; 
               
                //Step 3: wipe all previously generated form elements
                 const guestMealsDiv = document.getElementById("guestMeals"); //retrieves the guestMeals div from the Menu div
                 guestMealsDiv.innerHTML = "";

                 //Step 4: create for loop to generate the amount of dynamic fields necessary. 
                for (let i = 0; i<counting; i++){ // for i in range (0, counting, 1):

                    //retrieves the guest name and plus 1 name if it exists from GuestInfoStorage
                    let guestName = GuestInfoStorage[i].GuestName;
                    let plus1Name = GuestInfoStorage[i].plusOneName || ""; // If undefined, use ""

                    //Steps 5-6 and 8-9 happens inside of createMealSection: 
                    let [dynamicSection, temporaryMealStorage, UserAnswers] = createMealSection(guestName);
                   
                    //Step 7: append the newly generated dynamic form-object to the document (in this case it's created in the createMealSection function)
                    guestMealsDiv.appendChild(dynamicSection);

                     //Step 10: Restore old user answer-data if it exists to the temporary storage-item: 
                    if (oldMealInfo[i]){
                        restoreMealSection(temporaryMealStorage, UserAnswers, oldMealInfo[i]);
                    };

                    //step 12: update the global storage array with the data from the temporary storage in createdMealSection
                    MealInfoStorage[i] = temporaryMealStorage

                    // if plus1Name (with spaces removed so no error is thrown) isn't empty
                    if (plus1Name.trim() !== "") {
                    
                        //Steps 5-6 and 8-9 happens inside of createMealSection: 
                        let [dynamicSectionPlus1, temporaryPlus1MealStorage, plus1UserAnswers] = createMealSection(plus1Name);

                        //Step 7: append the newly generated dynamic form-object to the document (in this case it's plus1Name content created by createMealSection)
                        guestMealsDiv.appendChild(dynamicSectionPlus1);

                        //STEP 10: Restore old PLUS-1 answer-data if it exists to the temporary storage-item: 
                        if (oldMealInfo[i]?.plusOneMeal){
                            restoreMealSection(temporaryPlus1MealStorage, plus1UserAnswers, oldMealInfo[i].plusOneMeal);
                        };

                        MealInfoStorage[i].plusOneMeal = temporaryPlus1MealStorage;
                        
                    }
                };
            }; //end of function

            // Helper for restoring meal section data
            function restoreMealSection(mealInfo, inputs, oldData) {
                // inputs = [menuChoice, allergenChoice, severityChoice, otherAllergensChoice]
                if (!oldData) return;

                // Restore menu choice
                if (inputs[0]) {
                    inputs[0].value = oldData.menuChoice || "";
                    mealInfo.menuChoice = oldData.menuChoice || "";
                }

                // Restore allergens (checkboxes)
                if (inputs[1] && oldData.allergenChoice) {
                    inputs[1].forEach(cb => {
                        cb.checked = (oldData.allergenChoice || []).includes(cb.value);
                    });
                    mealInfo.allergenChoice = oldData.allergenChoice || [];
                    mealInfo.allergenSelected = oldData.allergenSelected || "";
                }

                // Restore severity selections
                if (inputs[2] && oldData.severityChoice) {
                    inputs[2].forEach((sel, idx) => {
                        sel.value = oldData.severityChoice[idx] || "--severity--";
                    });
                    mealInfo.severityChoice = oldData.severityChoice || [];
                }

                // Restore other allergens
                if (inputs[3]) {
                    inputs[3].value = oldData.otherAllergens || "";
                    mealInfo.otherAllergens = oldData.otherAllergens || "";
                }
            }; // end of function
// Helper function for updateMeal that creates the content for each guest and/or plus one entered in the first question
            function createMealSection(personName) {
                //Step 5: create empty local storage object
                let mealInfo = {};

                mealInfo.GuestName = personName //stores the relevant name in this local object
                const safeName = makeSafe(personName); //replaces whitespaces from the person name with _ for element ids

                //Step 6: create the dynamic form-object (Here, a new div element classed as container2 for styling)
                let section = document.createElement("div");section.className = "container2";
                section.innerHTML = `
                <div>
                    <legend><b>Enter your meal preferences here:</b></legend><br>
                    <label>${personName}: </label>
                    <select id="menu${safeName}" class="menuItem${safeName}"> 
                        <option value="">--Please choose an option--</option>
                        <option value="Standard meal">Standard meal</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Vegetarian">Vegetarian</option>
                        </select>
                </div>
                <div>
                    <legend><b>Do you have any of the following allergies/intolerances?</b></legend>
                    <div class="smallcontainer">
                        <div>
                            <input type="checkbox" id="Gluten${safeName}" name="allergen${safeName}" value="Gluten" class="menuItem${safeName}"/>
                            <label for="Gluten${safeName}">Gluten</label>
                        </div>
                        <div>
                            <select id="Gsev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>  
                        <div>
                            <input type="checkbox" id="Dairy${safeName}" name="allergen${safeName}" value="Dairy" class="menuItem${safeName}"/>
                            <label for="Dairy${safeName}">Dairy</label>
                        </div>
                        <div>
                            <select id="Dsev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div> 
                        <div>
                        <input type="checkbox" id="Peanuts${safeName}" name="allergen${safeName}" value="Peanuts" class="menuItem${safeName}"/>
                            <label for="Peanuts${safeName}">Peanuts</label>
                        </div>
                        <div>
                            <select id="Psev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div> 
                        <div>
                            <input type="checkbox" id="treeNuts${safeName}" name="allergen${safeName}" value="treeNuts" class="menuItem${safeName}"/>
                            <label for="treeNuts${safeName}">Tree nuts</label>
                        </div>
                        <div>
                            <select id="TNsev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>

                        <div>
                            <input type="checkbox" id="Egg${safeName}" name="allergen${safeName}" value="Egg" class="menuItem${safeName}"/>
                            <label for="Egg${safeName}">Egg</label>
                        </div>
                        <div>
                            <select id="Esev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>

                        <div>
                            <input type="checkbox" id="Soy${safeName}" name="allergen${safeName}" value="Soy" class="menuItem${safeName}"/>
                            <label for="Soy${safeName}">Soy</label>
                        </div>
                        <div>
                            <select id="Ssev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>

                        <div>
                            <input type="checkbox" id="Wheat${safeName}" name="allergen${safeName}" value="Wheat" class="menuItem${safeName}"/>
                            <label for="Wheat${safeName}">Wheat</label>
                        </div>
                        <div>
                            <select id="Wsev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>

                        <div>
                            <input type="checkbox" id="Fish${safeName}" name="allergen${safeName}" value="Fish" class="menuItem${safeName}"/>
                            <label for="Fish${safeName}">Fish</label>
                        </div> 
                        <div>
                            <select id="Fsev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>
                        
                        <div>
                            <input type="checkbox" id="Shellfish${safeName}" name="allergen${safeName}" value="Shellfish" class="menuItem${safeName}"/>
                            <label for="Shellfish${safeName}">Shellfish</label>
                        </div>
                        <div>
                            <select id="SFsev${safeName}" name="severity${safeName}" class="menuItem${safeName}">
                                <option>--severity--</option>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>
                     </div>
                </div>
                <div>
                    <legend><b>Any other intolerances/allergies we should know about?:</b></legend><br>
                    <input type="text" id="allergies${safeName}" name="longAns" class="menuItem${safeName}"/>
                </div>
                `;
                
                //Step 8: retrieve any input elements from the newly generated section
                const menuChoice = section.querySelector(`#menu${safeName}`);
                const allergenChoice = section.querySelectorAll(`[name="allergen${safeName}"]`);
                const severityChoice = section.querySelectorAll(`[name="severity${safeName}"]`);
                const otherAllergensChoice = section.querySelector(`#allergies${safeName}`);

                //Steo 9: add eventlisteners to these input elements which adds the user's current answers to the temporary storage object (mealInfo)

                 // When creating/selecting the menu dropdown
                 menuChoice.addEventListener("change", function() {
                    if (this.value === "--Please choose an option--") {
                        mealInfo.menuChoice = "";
                    } else {
                        mealInfo.menuChoice = this.value;
                    }
                });
                
                // scans the answers to see if an allergy has been checked off, and appends this as well as any selected variable to mealInfo
                function updateAllergenChoice() {
                    let checkedAllergens = Array.from(allergenChoice)
                        .filter(cb => cb.checked)
                        .map(cb => cb.value);

                    // For the schema to work, we need to check that checkedAllergens is true. if it is and the severity hasn't been filled, an alert will pop up.
                    mealInfo.allergenSelected = checkedAllergens.length > 0 ? "true" : "";
                    mealInfo.allergenChoice = checkedAllergens;
                    
                    // Checks that the severity has been selected when the allergy check box next to it is selected.
                    let checkedSeverities = Array.from(severityChoice)
                        .filter(sel => sel.value === "--severity--" ? "" : this.value)
                        .map(sel => sel.value);
                
                    mealInfo.severityChoice = checkedSeverities;
                };
                allergenChoice.forEach(function(cb) {
                    cb.addEventListener("change", updateAllergenChoice);
                });
                severityChoice.forEach(function(sel) {
                    sel.addEventListener("change", updateAllergenChoice);
                });

                otherAllergensChoice.addEventListener("change", function(){
                        mealInfo.otherAllergens = this.value;
                });

                const menuChange = section.querySelectorAll(`.menuItem${safeName}`); // retrieves all radio buttons by the class attribute (indicated with a . instead of #)
                 // adds eventlistener to the menu radio buttons, which hides the time-suggestion field when selected
                if (menuChange){ // if (times) check is a safety net to make sure times exists before trying to use it.
                    //forEach loops through each element/item in the times object
                    menuChange.forEach(function(element) {
                        element.addEventListener("change", function() {
                            document.getElementById("Bus").style.display = "none"; //hides the Bus section if it was previously filled out
                            document.getElementById("Drinks").style.display = "none"; //hides the drinks section if it was previously filled out
                            document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                        });
                    });
                }
                
                const UserAnswers = [menuChoice, allergenChoice, severityChoice, otherAllergensChoice]
                //MealInfoStorage.push(mealInfo);
            //returns the new div element section 
            return [section, mealInfo, UserAnswers];
            };
// creates the bus input fields for each guest based on the first question
            function updateBus (){
                document.getElementById("Drinks").style.display = "none"; //hides the drinks section if it was previously filled out
                document.getElementById("DrinkNext").innerHTML = ""; //resets the drinks section if it was previously filled out
                document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                
                document.getElementById("Bus").style.display = "block"; // unhides the Bus div element
                testBusArray.style.display = "block";

                // retrieves the BussInf element which the new inputs will be added to:
                const guestBusDiv = document.getElementById("BussInf");
                
                // for i in range(0, counting, 1):
                for (let i = 0; i<counting; i++){
                    //retrives the namees of the guest an +1 if it exists
                    let guestName = GuestInfoStorage[i].GuestName;
                    let plus1Name = GuestInfoStorage[i].plusOneName || ""; // If undefined, use ""

                    //appends the input fields for the guest created by the createBusSection function
                    guestBusDiv.appendChild(createBusSection(guestName));

                    //if there is a plus one name (with spaces removed by trim()) that isn't empty, append the input fields for them created by createBusSection function
                    if (plus1Name.trim() !== "") {
                        guestBusDiv.appendChild(createBusSection(plus1Name));
                    }
                    BusInfoStorage[i] = busInfo;
                };
        
            }

// Helper function for updatebus
            function createBusSection(personName) {
                let busInfo = {};

                busInfo.GuestName = personName

                const safeName = makeSafe(personName); // removes whitespaces from the name, replacing them with _

                //creates a new div element called section, making it class=container3 for styling
                let section = document.createElement("div");section.className = "container3";
                section.innerHTML = `
                 <div>
                    <label>${personName}: </label><br>
                    <input type="radio" id="yesBus${safeName}" name="Bus${safeName}" value="yes"/>
                    <label for="yesBus${safeName}">Yes</label>

                    <input type="radio" id="noBus${safeName}" name="Bus${safeName}" value="no"/>
                    <label for="noBus${safeName}">No</label>
                 </div>

                 <div id="ifYesBus${safeName}" style="display:none">
                    <legend><b>Which hotel will you be staying at?</b></legend><br>
                    <label>(Where should the bus pick you up/ drop you off?)</label>
                    <input type="text" id="hName${safeName}" name="longAns"/>
                 </div>
                 <div>
                    </div>

                 <div id="timesBus${safeName}" style="display:none">
                    <legend><b>What times would you want to take the bus?</b></legend>
                    <p>Info: we are early-birds, but if enough people would like to stay later than 01:00 am, we will consider pushing 
                        the second drop-off time back</p>

                    <div class="smallcontainer2"> 
                        <div class="small">
                            <div>
                            <input type="checkbox" id="times1${safeName}"/>
                            </div>
                            <div>
                            <label for="times1${safeName}">Pick-up at 01:30 pm (13:30)</label>
                            </div>
                        </div>
                        <div>
                            <legend>Drop-off times</legend>
                            <input type="radio" id="times2${safeName}" value="10:30 pm" name="dropOff${safeName}" class="noSuggest${safeName}"/>
                            <label for="times2${safeName}">10:30 pm (22:30)</label> <br>
                            
                            <input type="radio" id="times3${safeName}" value="01:00 am" name="dropOff${safeName}" class="noSuggest${safeName}"/>
                            <label for="times3${safeName}">01:00 am (01:00)</label><br>
                       
                            <input type="radio" id="times4${safeName}" name="dropOff${safeName}"/>
                            <label for="times4${safeName}">Request a later time</label><br>
                        </div>
                         <div id="laterDropOff${safeName}" style="display:none"> 

                            <label>Please suggest a time before 03:00 am here:</label><br>
                            <input type="time" id="Suggested${safeName}"/>
                        </div>
                    </div>
                    
                </div>`;

                // querySelector, not getElementById, is used because of the way the code was before (unsanitized by safeName). can only be after innerHTML is set
                const yesRadio = section.querySelector(`#yesBus${safeName}`); // retrieves the yes radio button
                const noRadio = section.querySelector(`#noBus${safeName}`); // retrieves the no radio button
                const ifYesDiv = section.querySelector(`#ifYesBus${safeName}`); // retrieves the hotel name input 
                const hotelInp = section.querySelector(`#hName${safeName}`);
                const busTimes = section.querySelector(`#timesBus${safeName}`); // retrieves the bus times div element
                const suggestTime = section.querySelector(`#Suggested${safeName}`); // retrieves the later drop-off radio button
                const times = section.querySelectorAll(`.noSuggest${safeName}`); // retrieves all other drop-off radio buttons by the class attribute (indicated with a . instead of #)
                const times4Radio = section.querySelector(`#times4${safeName}`); // retrieves the later drop-off time suggestion 
                const pickUp = section.querySelector(`#times1${safeName}`);

                //if the yes radio button is selected, the hotel name input and the bus times input are made visible
                if (yesRadio) {
                    yesRadio.addEventListener("change", function() {
                        document.getElementById("Drinks").style.display = "none"; //hides the drinks section if it was previously filled out
                        document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                        busInfo.busAnswer = "Yes";
                        ifYesDiv.style.display = "block";
                        busTimes.style.display = "block";
                    
                     });

                     hotelInp.addEventListener("change", function(){
                        busInfo.hotelName = this.value
                    });
                };

               

                // if the no radio button is selected, the hotel name input and the bus times input are made invisible again if they were already visible
                if (noRadio){
                    noRadio.addEventListener("change", function(){
                        document.getElementById("Drinks").style.display = "none"; //hides the drinks section if it was previously filled out
                        document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                        busInfo.busTimes.remove();
                        busInfo.suggestedTime.remove();

                        ifYesDiv.style.display = "none";
                        busTimes.style.display = "none";
                    });
                };
           
                if (pickUp){
                    pickUp.addEventListener("change", function(){
                        document.getElementById("DrinkNext").innerHTML = ""; //resets the drinks section if it was previously filled out
                        document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                        if (this.checked){
                            busInfo.pickUpYes = "Yes"
                        }else{delete busInfo.pickUpYes};
                        
                    });
                };

                // adds eventlistener to the times4 radio button, which makes the time-suggestion field visible
                if (times4Radio){
                    times4Radio.addEventListener("change", function () {
                        document.getElementById("DrinkNext").innerHTML = ""; //resets the drinks section if it was previously filled out
                        document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                        //busInfo.suggestedTime.remove
                        busInfo.timeSelected = "true"
                        document.getElementById(`laterDropOff${safeName}`).style.display = "block";
                        });
                        suggestTime.addEventListener("change", function(){
                            busInfo.busTimes = this.value
                        });
                }
                 // adds eventlistener to the other bus-times radio buttons, which hides the time-suggestion field when selected
                if (times){ // if (times) check is a safety net to make sure times exists before trying to use it.
                    //forEach loops through each element/item in the times object
                    times.forEach(function(element) {
                        document.getElementById("DrinkNext").innerHTML = ""; //resets the drinks section if it was previously filled out
                        document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out

                        element.addEventListener("change", function() {
                            busInfo.timeSelected = "true"
                            document.getElementById(`laterDropOff${safeName}`).style.display = "none";
                            busInfo.busTimes = this.value
                        });
                    });
                    BusInfoStorage.push(busInfo)
                }
                return section;
            }  
            //drinks function
            function updateDrinks (){
                document.getElementById("DrinkNext").innerHTML = ''; //deletes the html content of the DrinkNext element.
                document.getElementById("End").style.display = "none"; //hides the End question section if it was previously filled out
                document.getElementById("Drinks").style.display = "block"; // makes the Drinks element visible
               
                const guestDrink = document.getElementById("DrinkNext"); //retrieves the DrinkNext element from the document
               
                for (let i = 0; i<counting; i++){

                    let guestName = GuestInfoStorage[i].GuestName; // retrieves the guest name from GuestInfoStorage

                    // retrieves the +1 name from GuestInfoStorage if it exists, and sets plus1Name to "" if it doesnt exits (is undefined)
                    let plus1Name = GuestInfoStorage[i].plusOneName || ""; 

                    // appends the drink inputs for each guest to the DrinkNext element in the document using the createDrinkSection function
                    guestDrink.appendChild(createDrinksSection(guestName)); 

                    if (plus1Name.trim() !== "") { // if the plus 1 name exists and isn't just "" when all the whitespace is removed, the following happens: 
                        guestDrink.appendChild(createDrinksSection(plus1Name)); // the +1 name is appended to the DrinkNext element in the document
                    }
                };
            }

// Helper function for updateDrinks
            function createDrinksSection(personName) {
                const safeName = makeSafe(personName) // replaces all whitespaces in the name with _

                // creates a new div element using class="container3" for styling
                let section = document.createElement("div");section.className = "container3";
                section.innerHTML = `
                 <div>
                    <legend>Are you interested in getting some vouchers?</legend>

                    <label>${personName}: </label><br>
                    <input type="radio" id="yesDrinks${safeName}" name="drinkName${safeName}" value="yes"/>
                    <label for="yesBus${safeName}">Yes</label>

                    <input type="radio" id="noDrinks${safeName}" name="drinkName${safeName}" value="no"/>
                    <label for="noBus${safeName}">No</label>
                 </div>`;

                const yesDrinks = section.querySelector(`#yesDrinks${safeName}`); //retrieves the yes radio button
                const noDrinks = section.querySelector(`#noDrinks${safeName}`); //retrieves the no radio button

                // adds eventlistener to the yes and no radio buttons, which displays the next button when selected
                if (yesDrinks) { // if (yesDrinks) check is a safety net to make sure times exists before trying to use it.
                        yesDrinks.addEventListener("change", function() {
                            document.getElementById("Next5").style.display = "block";
                        });
                    };
                     // adds eventlistener to the no radio button, which displays the next button when selected
                    if (noDrinks) {
                        noDrinks.addEventListener("change", function() {
                            document.getElementById("Next5").style.display = "block";
                        });
                    };
                return section;
            }

            //universal validation function
            function validateInfo(infoList, schema) {
                // for i in range(0, len(infoList), 1):
                for (let i = 0; i < infoList.length; i++) {
                    // answer = all answers from guest i
                    const answer = infoList[i];
                    // for rule in schema
                    for (const rule of schema) {

                        // If there's an if condition (like if yes is selected), check it
                        if (rule.if) {
                            // if the answer's if condition entered by the user is the same as the value in the schema, then add the next if check
                            if (answer[rule.if.field] === rule.if.value) {
                                // if the user's input is unanswered or just whitespace send an alert, and stop the event (by returning false) that is being validated 
                                if (!answer[rule.field] || answer[rule.field].toString().trim() === "") {
                                    alert(rule.message ? rule.message.replace('{n}', i+1) : `Please fill in ${rule.field} for item ${i+1}`);
                                    return false;
                                }
                            }
                        // if there isn't an if condition tied to another input field, run this code instead:
                        } else {
                            // if the answer field is empty, return an alert and stop the associated even from firing using return false
                            if (!answer[rule.field] || answer[rule.field].toString().trim() === "") {
                                alert(rule.message ? rule.message.replace('{n}', i+1) : `Please fill in ${rule.field} for item ${i+1}`);
                                return false;
                            }
                        }
                    }
                }
                // if all the above checks aren't true, then allow the connected event to fire by returning true
                return true;
            }

// Event listeners
//--------------------------------------------------
            guests.addEventListener("change", updateField);

            testbtn.addEventListener("click", function() {
                console.log(GuestInfoStorage);
                alert(JSON.stringify(GuestInfoStorage, null, 2));
             });

             testMealbtn.addEventListener("click", function() {
                console.log(MealInfoStorage);
                alert(JSON.stringify(MealInfoStorage, null, 2));
             });

             testBusbtn.addEventListener("click", function() {
                console.log(BusInfoStorage);
                alert(JSON.stringify(BusInfoStorage, null, 2));
             });
            document.getElementById("Next2").addEventListener("click", function() {
                if (validateInfo(GuestInfoStorage, guestInfoSchema)) {
                    console.log("Validation passed!");
                    updateMeal();
                } else {
                    console.log("Validation failed!");
                }
            });
            document.getElementById("Next3").addEventListener("click", function() {
                if (validateInfo(MealInfoStorage, mealInfoSchema)) {
                    updateBus();
                }
            })

            document.getElementById("Next4").addEventListener("click", function() {
                if (validateInfo(BusInfoStorage, busInfoSchema)) {
                    updateDrinks();
                }
            };
// adds an eventlistener to the open dialog button that shows the drinkInfo element usig showModal
            openBtn.addEventListener('click', function() {
                dialog.showModal(); // showModal shows a text box that overlays the rest of the webpage, making that webpage inactive until the modal is closed again.
            });

            // adds an eventlistener to the close dialog button that shows the drinkInfo element usig showModal
            closeBtn.addEventListener('click', function() {
                dialog.close(); // .close closes a modal (text box that overlays the rest of the webpage, making that webpage inactive) 
            });

            // Optional: Allow closing the dialog by clicking outside of it via an event listener
            dialog.addEventListener('click', function(event) {
                const rect = dialog.getBoundingClientRect();
                if (
                    event.clientX < rect.left ||
                    event.clientX > rect.right ||
                    event.clientY < rect.top ||
                    event.clientY > rect.bottom
                ) {
                    dialog.close();
                }
            });

            //adds an eventlistener to the last next button
            Next5.addEventListener("click", function(){
                document.getElementById("End").style.display = "block"
            });
