//Author: Steven Dodd
//Date: 24/03/2024
//description: js for Rock, Paper, Scissors game

function Start(){

	const UserImage = document.getElementById('UserImage');
	const CompImage = document.getElementById('CompImage');
	
	//Declare variables
	var randomNum = getRandom();
	var guess = document.getElementById("mySelect").selectedIndex;//uses the form index for the guess selection
	
	//getCompOption(randomNum);
   	document.getElementById("UserInput").innerHTML= "User Guess: "+guess;
    document.getElementById("CompGuess").innerHTML= "Comp Guess: "+randomNum;
	
	//Guess index: Rock == 1, Paper == 2, Scissors == 3
    if (randomNum == 1 && guess == 1) {//Rock and Rock
		document.getElementById("msg").innerHTML= "Tie! You selected Rock. The computer has Rock: Rock and Rock ";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Rock";
		document.getElementById('UserImage').src="images/RockPlayer.png"
		document.getElementById('CompImage').src="images/RockComp.png"
	}
	else if(randomNum == 1 && guess == 2){//Rock and Paper
		document.getElementById("msg").innerHTML= "Well done you win! You selected Paper. The computer has Rock: Paper wins against Rock";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Rock";
		alert("Win!")
		document.getElementById('UserImage').src="images/PaperPlayer.png"
		document.getElementById('CompImage').src="images/RockComp.png"
	}
	else if(randomNum == 1 && guess == 3){//Rock and scissors
		document.getElementById("msg").innerHTML= "You Lose! You selected Scissors. The computer has Rock: Rock wins against Scissors";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Rock";
		document.getElementById('UserImage').src="images/ScissorsPlayer.png"
		document.getElementById('CompImage').src="images/RockComp.png"
	}
   	else if(randomNum == 2 && guess == 1){//Paper and Rock
	    document.getElementById("msg").innerHTML= "You lose! You selected Rock. The computer has Paper: Paper wins against Rock ";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Paper";
		document.getElementById('UserImage').src="images/RockPlayer.png"
		document.getElementById('CompImage').src="images/PaperComp.png"
	}
	else if(randomNum == 2 && guess == 2){//paper and Paper
		document.getElementById("msg").innerHTML= "Tie! You selected Paper. Computer has Paper: Paper and Paper";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Paper";
		document.getElementById('UserImage').src="images/PaperPlayer.png"
		document.getElementById('CompImage').src="images/PaperComp.png"
	}
	else if(randomNum == 2 && guess == 3){//Paper and scissors
		document.getElementById("msg").innerHTML= "Well done you win! You selected Scissors. The computer had Paper: Scissors wins against Paper";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Paper";
		alert("Win!")
		document.getElementById('UserImage').src="images/ScissorsPlayer.png"
		document.getElementById('CompImage').src="images/PaperComp.png"
	}
	else if(randomNum == 3 && guess == 1){//Paper = Scissors
		document.getElementById("msg").innerHTML= "Well done you win! You selected Rock. The computer has Scissors: Rock wins against Scissors ";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Scissor";
		alert("Win!")
		document.getElementById('UserImage').src="images/RockPlayer.png"
		document.getElementById('CompImage').src="images/ScissorsComp.png"	
	}
	else if(randomNum == 3 && guess == 2){//Scissors and Paper
		document.getElementById("msg").innerHTML= "Lose! \n You selected Paper. The computer has Scissors: Scissors wins against Paper";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Scissors";
		document.getElementById('UserImage').src="images/PaperPlayer.png"
		document.getElementById('CompImage').src="images/ScissorsComp.png"
	}
	else if(randomNum == 3 && guess == 3){//Scissors and scissors
		document.getElementById("msg").innerHTML= "Tie! You selected Scissors. The computer selected Scissors: Scissors and Scissors";
		document.getElementById("CompCardmsg").innerHTML= "Computer guessed Scissors";
		document.getElementById('UserImage').src="images/ScissorsPlayer.png"
		document.getElementById('CompImage').src="images/ScissorsComp.png"
	}
	else{
		alert("Invalid input, try again")
	}

}

function hideForm() {//when the 'Click to play' button is pressed the form is hidden along with the Click to play button
	document.getElementById("mySelect").style.display="none";
	document.getElementById("btn1").style.display="none";
	document.getElementById("AlertBtn").className ="d-block"
  }

function ActivatePlayAgain() {//when the 'Click to play' button is pressed the 'Play again' Button is set to active 
	document.getElementById("Again").class="btn btn-primary active";
}

function getRandom(){ //Create a random number 1,2,3.
	return Math.floor(Math.random() * 3)+1;
}

function playAgain(){
	window.location.reload(); //reloads HTML page when the 'play again' button is pressed
	document.getElementById("Again").style.display="none"; //hides the 'play again' button after it is pressed
}