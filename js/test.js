function display(name){
	document.getElementById("display").innerHTML = "Hello, "+name;
}	

function changeColor(color){
	var css = document.body.style;
	css.backgroundColor = color;
}