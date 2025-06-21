
const guests = document.getElementById("guestNR");
let GuestInfoStorage = []; // Empty array to store all of the user answers from the GuestInfo fieldset in
// Keep backup arrays for restoring
           let oldGuestInfo = [];
let counting = 0; // defines a global counting variable that is redefined when the updateField function is run. Stores this info for the next part of the RSVP.


const guestInfoSchema = [
               { field: "GuestName", message: "Please enter the name for Guest {n}" },
               { field: "plus1", message: "Please select if Guest {n} wants a +1" },
               { field: "plusOneName", if: { field: "plus1", value: "yes" }, message: "Please enter the +1 name for Guest {n}" },
               { field: "plusOneRel", if: { field: "plus1", value: "yes" }, message: "Please enter the +1 relationship for Guest {n}" }
           ];


//For the first guest info section --------------------------------------------------------------
           function updateField() {


               document.getElementById("gInfo").innerHTML = '<legend><h3>Enter your full names here:</h3></legend><br>'; //deletes the html content of the guestDetailsDiv element.
               // Step 1: Save a copy of old data
               oldGuestInfo = [...GuestInfoStorage];
               GuestInfoStorage = []; //wipe the current Storage list to avoid duplicates
               counting = guests.value; // redefines counting to match the number of guests entered by the user.
              
               if (counting > 0 && counting < 11){ // Since I want a max of 10 guests, this makes sure that the code only works when the entered number is above 0 but below 11.
              
                   document.getElementById("gInfo").style.display = "block";
                   testArrayDiv.style.display = "block";


                   for (let i = 0; i<counting; i++){ //runs the following code up to the number specified by user.
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
                       document.getElementById("gInfo").appendChild(myInp);


                       // Restore data if it exists
                       if (oldGuestInfo[i]) { //if there is anything stored in oldGuestInfo[i], proceed with following code
                           const old = oldGuestInfo[i];
                           // Restore guest name
                           myInp.querySelector(`[id="GuestID${i+1}"]`).value = old.GuestName || ""; // sets the current value to the old value or clears it with ""
                           // Restore +1 radio
                           if (old.plus1 === "yes") {
                               myInp.querySelector(`[id="yes${i+1}"]`).checked = true;
                               // Programmatically trigger the click to create the +1 fields
                               plusOneYes.click();
                               // Now restore the +1 values if they exist
                               const plusOneInfo = document.getElementById(`+1info${i+1}`);
                               if (plusOneInfo) {
                                   if (old.plusOneName) {
                                       plusOneInfo.querySelector(`#plusOneName${i+1}`).value = old.plusOneName;
                                   }
                                   if (old.plusOneRel) {
                                       plusOneInfo.querySelector(`#plusOneRel${i+1}`).value = old.plusOneRel;
                                   }
                               }
                           } else if (old.plus1 === "no") {
                               myInp.querySelector(`[id="no${i+1}"]`).checked = true;
                           }
                       }


                       //saves the current GuestName in GuestInfo for later
                       const GuestName = document.getElementById(`GuestID${i+1}`);
                       GuestName.addEventListener("change", function(){
                           GuestiInfo.GuestName = this.value;
                       });


                       // Saves the yes and no inputs as constants
                       const plusOneYes = document.getElementById(`yes${i+1}`);
                       const plusOneNo = document.getElementById(`no${i+1}`);


                       // adds an eventlistener to the yes radio button. This eventlistener adds the input fields for plus one.
                       plusOneYes.addEventListener("click", function() {
                          
                           //creates the div element that contains the plus one input fields and sets the class to container grid for styling
                          let plusOneInfo = document.getElementById(`+1info${i+1}`);


                          //if no plus one for this guest existed before, then one is created
                           if (!plusOneInfo){
                                plusOneInfo = document.createElement("div"); plusOneInfo.className = "container"; plusOneInfo.id = `+1info${i+1}`;
                               // writes the info in the newly created div
                               plusOneInfo.innerHTML = `
                                   <div> <label>Name of plus one for Guest ${i+1}: </label> </div>
                                   <div> <label>Relationship between plus one and Guest ${i+1}: </label></div>
                                   <div><input type="text" id="plusOneName${i+1}" name="fname" /> </div>
                                   <div><input type="text" id="plusOneRel${i+1}" name="longAns"/></div> <br><br>`;
                                   // appends this plus one info to myInp
                               myInp.appendChild(plusOneInfo);


                               // Restore plus one info if it exists
                               if (oldGuestInfo[i] && oldGuestInfo[i].plusOneName) { //if both oldGuestInfo[i] and oldGuestInfo[i].plusOneName exists, run the following code:
                               plusOneInfo.querySelector(`#plusOneName${i+1}`).value = oldGuestInfo[i].plusOneName; //restore the plus1 info
                               }
                               if (oldGuestInfo[i] && oldGuestInfo[i].plusOneRel) {//if both oldGuestInfo[i] and oldGuestInfo[i].plusOneName exists, run the following code:
                               plusOneInfo.querySelector(`#plusOneRel${i+1}`).value = oldGuestInfo[i].plusOneRel;//restore the plus1 info
                               }


                               // adding eventlisteners to the newly generated plusOne text input fields
                               plusOneInfo.querySelector(`#plusOneName${i+1}`).addEventListener("change", function(){
                                   GuestiInfo.plusOneName = this.value;
                               });
                               plusOneInfo.querySelector(`#plusOneRel${i+1}`).addEventListener("change", function(){
                                   GuestiInfo.plusOneRel = this.value;
                               });
                           }
                           GuestiInfo.plus1 = "yes";
                           }); //the end of the plusOneYes event listener


                       // adds an eventlistener to the no radio button that 1) removes the +1 info input fields if the user clicked yes first and 2) adds this answer to GuestInfo
                       plusOneNo.addEventListener("click", function() {
                         
                           const changedFromYes = document.getElementById(`+1info${i+1}`) // retrieves the +1info from the document
                           if (changedFromYes) changedFromYes.remove(); //if this +1info exists in the document, it is removed
                           GuestiInfo.plus1 = "no"; // stores the new answer in GuestiInfo
                       })


                       //restore the section info if needed:
                       if (oldGuestInfo[i] && oldGuestInfo[i].plus1 === "yes") {
                           plusOneYes.click();
                       }


                       // Instead of GuestInfoStorage.push(GuestiInfo);
                       GuestInfoStorage[i] = GuestiInfo; // adds all of the information gathered into the item GuestInfo into a global list by index. This keeps things ordered for later
                   }; 
               }
               // If the number of guests entered is not between 1 and 10, this alert will pop up.
               else {
                   window.alert("Please enter a number between 1 and 10");
               }
           }

