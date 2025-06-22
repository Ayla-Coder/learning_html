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
                    let [dynamicSection, temporaryMealStorage, UserAnswers] = createMealSection(GuestName);
                   
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
                    let checkedSeverities = Array.from(severityChoice).map(sel => sel.value);
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
