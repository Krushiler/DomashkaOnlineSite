var burgerMenu = document.getElementsByClassName("burger-menu")[0];

document.getElementById("burger-open").onclick = function() {
    burgerMenu.classList.add("active");
};

document.getElementById("burger-close").onclick = function() {
    burgerMenu.classList.remove("active");
};