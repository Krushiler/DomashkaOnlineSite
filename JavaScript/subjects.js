var subjectsItem = document.getElementById("subs");

setContentLoading(subjectsItem, true);

var editorCode = localStorage.getItem("editorCode");
var sublist = document.getElementById("sublist");
var subs = [];

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    loadData();
  } else {
    firebase.auth().signOut().then(function() {}, function(error) {});
    localStorage.removeItem("classCode");
    localStorage.removeItem("editorCode");
    location.href = "login.html";
  }
});

var isLoad = true;

async function loadSubs(snapshot) {
    if (isLoad){
        subs=[];
        sublist.innerHTML = "";
        
        await snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            subs.push(item);
        });
        
        for (let i = 0; i < subs.length; i++){
            sublist.innerHTML += "<li class='subel'><input class='subinp' value=" + subs[i] + " id='subinp" + i + "'>" + 
            "<div class='button subdel'" + ">Удалить</div>" +"</li>";
        }
        clickedClassHandler("subdel",function(index){
            deleteSub(index);
        });
        return subs;
    }
};

function loadData(){
    setContentLoading(subjectsItem, true)
    var database = firebase.database();
    uid = firebase.auth().currentUser.uid;
    var editorCodeRef = firebase.database().ref(uid+"/EditorCode");
    firebase.database().ref(uid+"/AddictiveSubjects").on('value', function(snapshot) {
    loadSubs(snapshot);});
    editorCodeRef.on('value', function(snapshot){
       if (snapshot.val() != editorCode){
           location.href = "homework.html";
       }
       setContentLoading(subjectsItem, false);
    });
    var subRef = firebase.database().ref(uid+"/AddictiveSubjects");   
}

function addSub(){
    subs.push('');
    sublist.innerHTML += "<li class='subel'><input class='subinp'" + " id='subinp" + subs.length + "'>" + 
    "<div class='button subdel'" + ">Удалить</div>" +"</li>";
    clickedClassHandler("subdel",function(index){
        deleteSub(index);
    });
}

function saveAllSubs(){
    isLoad = false;
    for (let i = 0; i < subs.length; i ++){
        subs[i] = document.getElementsByClassName("subinp")[i].value;
    }
    firebase.database().ref(firebase.auth().currentUser.uid).child('AddictiveSubjects').remove();
    for (let i = 0; i < subs.length; i ++){
        firebase.database().ref(firebase.auth().currentUser.uid).child('AddictiveSubjects').child(i).set(subs[i]);
    }
    isLoad = true;
}


function clickSave(){
    showMessage("Сохранить изменения", "Сохранить", function(){
    saveAllSubs();
    hideMessage();
});
}

function deleteSub(deletingSub){
    subs.splice(deletingSub,1);
    document.getElementsByClassName("subel")[deletingSub].remove();
}

function clickedClassHandler(name,callback) {
    var allElements = document.body.getElementsByTagName("*");
    
    for(var x = 0, len = allElements.length; x < len; x++) {
        if(allElements[x].classList.contains(name)) {
            allElements[x].onclick = handleClick;
        }
    }
    function handleClick() {
        var index = 0;
        for(var x = 0; x < allElements.length; x++) {
            if(allElements[x] == this) {
                break;
            }

            if(allElements[x].classList.contains(name)) {
                index++;
            }
        }
        callback.call(this,index);
    }
}


function showMessage(message, buttonText, buttonEvent){
    $("#messageArea").css("visibility", "visible");
    $("#messageArea").css("opacity", "1");
    $("#saveBtn").html(buttonText);
    $("#message").html(message);
    $("#saveBtn").click(buttonEvent);
}

function hideMessage(){
    $("#messageArea").css("visibility", "hidden");
    $("#messageArea").css("opacity", "0");
}