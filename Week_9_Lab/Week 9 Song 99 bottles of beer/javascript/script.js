function count(){
    for(i=99;i>=3;i--){
        document.getElementById("Song").innerHTML+="<br />"+i + " bottles of beer on the wall, "+i+" bottles of beer.";
        document.getElementById("Song").innerHTML+="<br />"+"Take one down and pass it around, "+(i-1) +" bottles of beer on the wall.";
        document.getElementById("Song").innerHTML+="<br />"+" ";
    }
    document.getElementById("Song").innerHTML+="<br />"+  "2 bottles of beer on the wall, 2 bottles of beer.";
    document.getElementById("Song").innerHTML+="<br />"+"Take one down and pass it around, 1 bottle of beer on the wall.";
    document.getElementById("Song").innerHTML+="<br />"+" ";
    document.getElementById("Song").innerHTML+="<br />"+"1 bottle of beer on the wall, 1 bottle of beer.";
    document.getElementById("Song").innerHTML+="<br />"+"Take it down and pass it around, no more bottles of beer on the wall.";
    document.getElementById("Song").innerHTML+="<br />"+" ";
    document.getElementById("Song").innerHTML+="<br />"+"No more bottles of beer on the wall, no more bottles of beer.";
    document.getElementById("Song").innerHTML+="<br />"+"Go to the store and buy some more, 99 bottles of beer on the wall.";
}

function HideBtn1(){
    document.getElementById("button").style.display="none";
}