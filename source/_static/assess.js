
var checkMe = function(divid, expected, feedback) {
	var given;
	var buttonObjs = document.forms[divid+"_form"].elements.group1;
	for (var i = buttonObjs.length - 1; i >= 0; i--) {
		if (buttonObjs[i].checked) {
			given = buttonObjs[i].value;
		}
	}
	// update number of trials??
	// log this to the db
	feedBack('#'+divid+'_feedback',given == expected, feedback);
	var answerInfo = 'answer:' +  (given==expected ? 'correct' : given);
	logBookEvent({'event':'assses', 'act':answerInfo, 'div_id':divid});
};


var feedBack = function(divid,correct,feedbackText) {
	if (correct) {
      $(divid).html('You are Correct!');
      $(divid).css('background-color','#C8F4AD');
   	} else {
	    $(divid).html("Inorrect.  " + feedbackText );
      $(divid).css('background-color','#FFFFFF');		
	}
};


/* 
Multiple Choice with Feedback for each answer
*/

var checkMCMF = function(divid, expected, feedbackArray) {
	var given;
    var feedback = null;
	var buttonObjs = document.forms[divid+"_form"].elements.group1;
	for (var i = buttonObjs.length - 1; i >= 0; i--) {
		if (buttonObjs[i].checked) {
			given = buttonObjs[i].value;
            feedback = feedbackArray[i];
		}
	}
	// log the answer
    logBookEvent({'event':'mChoice','act': 'answer_' + given, 'div_id':divid}); 
    
    // give the user feedback
	feedBackMCMF('#'+divid+'_feedback',given == expected, feedback);
};


var feedBackMCMF = function(divid,correct,feedbackText) {
	if (correct) {
		$(divid).html('Correct!  ' + feedbackText);
        $(divid).css('background-color','#C8F4AD');
	} else {
		$(divid).html("Inorrect.  " + feedbackText );
        $(divid).css('background-color','#FFFFFF');
	}
};

var checkMCMA = function(divid, expected, feedbackArray) {
	var given;
    var feedback = "";
    var correctArray = expected.split(",");
    correctArray.sort();
    var givenArray = [];
    //var allThere = true;
    var correctCount = 0;
    var correctIndex = 0;
    var givenIndex = 0;
	var buttonObjs = document.forms[divid+"_form"].elements.group1;
    
    // loop through the checkboxes
	for (var i = 0;  i < buttonObjs.length; i++) {
		if (buttonObjs[i].checked) { // if checked box
			given = buttonObjs[i].value; // get value of this button
            givenArray.push(given)    // add it to the givenArray
            feedback+=given + ": " + feedbackArray[i] + "<br />"; // add the feedback
		}
	}
    // sort the given array
    givenArray.sort();
    
    //if (givenArray.length != choiceArray.length) {
    //        allThere = false;
    //}
  
    while (correctIndex < correctArray.length && 
           givenIndex < givenArray.length) {
      if (givenArray[givenIndex] < correctArray[correctIndex]) {
          givenIndex++;
      }
      else if (givenArray[givenIndex] == correctArray[correctIndex]) {
        correctCount++;
        givenIndex++;
        correctIndex++;
      }
      else {
        correctIndex++;
      }

     // for (var i=0; i < choiceArray.length; i++) {
     //   if (choiceArray[i] != givenArray[i]) {
     //       allThere = false;
     //   }

    } // end while
    
	// log the answer
    logBookEvent({'event':'mChoice','act': 'answer_' + given, 'div_id':divid}); 
    
	// give the user feedback
	feedBackMCMA('#'+divid+'_feedback', correctCount,
                 correctArray.length, givenArray.length, feedback);
};


/*
 Multiple Choice with Multiple Answers
*/
var feedBackMCMA = function(divid,numCorrect,numNeeded,numGiven,feedbackText) {   
    var answerStr = "answers";
    if (numGiven == 1) answerStr = "answer";
    
	if (numCorrect == numNeeded && numNeeded == numGiven) {
		$(divid).html('Correct!  <br />' + feedbackText);
        $(divid).css('background-color','#C8F4AD');
	} else {
		$(divid).html("Incorrect.  " +  "You gave " + numGiven + 
        " " + answerStr + " and got " + numCorrect + " correct of " +
         numNeeded + " needed.<br /> " + feedbackText );
        $(divid).css('background-color','#FFFFFF');
	}
};


// for each form in the div
//    get the id of the form
//    call checkMe on the form...  -- need metadata what kind of question what parms etc
//    hidden fields for meta data??? each form defines a checkme function with no parameters
//    that calls the actual function that checks the answer properly??
// summarize