function login(classCode, editorCode){
    //blockBtns();
    $("#loginError").css("display", "none");
    firebase.auth().signInWithEmailAndPassword(classCode+"@li1irk.ru", "li1irk").then(function(user){
        location.href = 'homework.html';
        unblockBtns();
    }).catch(function(error) {
        localStorage.removeItem("classCode");
        localStorage.removeItem("editorCode");
        unblockBtns();
        var errorCode = error.code;
        var errorMessage = error.message;
        $("#loginError").html("Такого пользователя не существует");
        $("#loginError").css("display", "block");
});
}

function register(classCode, editorCode){
   // blockBtns();
    $("#loginError").css("display", "none");
    firebase.auth().createUserWithEmailAndPassword(classCode+"@li1irk.ru", "li1irk").then(function(user){
        localStorage.setItem("reg", "true");
        location.href = 'homework.html';
        unblockBtns();
    }).catch(function(error) {
        localStorage.removeItem("classCode");
        localStorage.removeItem("editorCode");
        unblockBtns();
        var errorCode = error.code;
        var errorMessage = error.message;
        $("#loginError").html("Не корректный код");
        $("#loginError").css("display", "block");
});
}

function blockBtns(){
    $("#signinbtn").css("pointer-events", "none");
    $("#signupbtn").css("pointer-events", "none");
    $("#signinbtn").css("opacity", "0.5");
    $("#signupbtn").css("opacity", "0.5");
}

function unblockBtns(){
    $("#signinbtn").css("pointer-events", "all");
    $("#signupbtn").css("pointer-events", "all");
    $("#signinbtn").css("opacity", "1");
    $("#signupbtn").css("opacity", "1");
}

$("#signinbtn").click(function(){
    localStorage.setItem("classCode", document.getElementById('login-input').value);
    localStorage.setItem("editorCode", document.getElementById('password-input').value);
    login(document.getElementById('login-input').value, document.getElementById('password-input'))});
$("#signupbtn").click(function(){
    localStorage.setItem("classCode", document.getElementById('login-input').value);
    localStorage.setItem("editorCode", document.getElementById('password-input').value);
    register(document.getElementById('login-input').value, document.getElementById('password-input'))});

if(localStorage.getItem("classCode")!=null){
    login(localStorage.getItem("classCode"));
}