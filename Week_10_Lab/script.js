const fruits = [];

function displayList() {//loop
    let text = "<ul>";
    for (let i = 0; i < fruits.length; i++) {
        text += `<li>${fruits[i]} <button onclick="removeRecord(${i})">Remove</button></li>`;
    }
    text += "</ul>";
    document.getElementById("demo").innerHTML = text;
}

function addToList() {
    const add = document.getElementById("add").value;
    fruits[fruits.length] = (add);//can use length too to add to an
    //fruits.push(add);//push method adds new items to the end of an array.
    displayList();
}

function removeRecord(index) {
    fruits.splice(index, 1);//The splice() method adds and/or removes array elements. Syntax = array.splice(index, howmany, item1, ....., itemX)
    displayList();
}
