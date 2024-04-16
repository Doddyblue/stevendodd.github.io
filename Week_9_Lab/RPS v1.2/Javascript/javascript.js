const options = document.querySelectorAll('.card');
const CompOptions = ['Rock', 'Paper', 'Scissors'];
let round = 0;
let playerscore = 0;
let compscore = 0;

function playRound(PlayerInput, CompInput) {
    // Display user and computer selections
    document.getElementById('result').innerHTML = `
        <p>Your choice: ${PlayerInput}</p>
        <p>Computer's choice: ${CompInput}</p>
    `;

    // Determine the winner
    if (PlayerInput === CompInput) {
        document.getElementById('result').innerHTML += "<p>It's a tie!</p>";
    } else if (
        (PlayerInput === 'Rock' && CompInput === 'Scissors') ||
        (PlayerInput === 'Paper' && CompInput === 'Rock') ||
        (PlayerInput === 'Scissors' && CompInput === 'Paper')
    ) {
        document.getElementById('result').innerHTML += "<p>You win!</p>";
        playerscore += 1;//add to score
    } else {
        document.getElementById('result').innerHTML += "<p>Computer wins!</p>";
        compscore += 1;//add to score
    }

    document.getElementById('Playerscore').innerHTML = "Player score: " + playerscore;
    document.getElementById('Compscore').innerHTML = "Computer score: " + compscore;
    document.getElementById('round').innerHTML = "Round: " + round;
}

// Set up event listeners outside the loop
options.forEach((option) => {
    option.addEventListener('click', function () {
        const PlayerInput = this.id; // Use the card ID as the user's choice
        const CompInput = CompOptions[Math.floor(Math.random() * 3)];
        playRound(PlayerInput, CompInput);
		
		//update selction cards
		document.getElementById('playerMsg').innerHTML = PlayerInput;
		document.getElementById('compMsg').innerHTML = CompInput;
        if (round === 3) {
            const playAgain = confirm("Do you want to play again?");//window.confirm()
            if (playAgain) {
                window.location.reload();
            } else {
                window.close(); // Close the page if the user doesn't want to play again
            }
        } else {
            round++;
            document.getElementById('round').innerHTML = "Round: " + round;//update round
        }
    });
});
