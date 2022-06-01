var ringsItem = document.getElementById("rings");

setContentLoading(ringsItem, true);

var editorCode = localStorage.getItem("editorCode");

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

function generateTasks(count) {
    for (let i = 0; i < count; i++) {
        let scheduleDiv = document.getElementsByClassName("schedule")[0];
        let task = document.createElement("div");
        task.className = "ringItem";
        task.innerHTML = "<div class=\"label\">Урок "+ (i+1) + "</div> <div class=\"ringTime\" id=\"time" + (i * 2) + "\"></div> <div class=\"divider\">-</div> <div class=\"ringTime\" id=\"time"+ (i*2+1) + "\"></div>"
        scheduleDiv.append(task);
    }
    enableResizing();
}

generateTasks(10);


async function loadData(){
    setContentLoading(ringsItem, true);
    var database = firebase.database();
    
    if(localStorage.getItem("reg")!=null){
        firebase.database().ref(firebase.auth().currentUser.uid).child('EditorCode').set(localStorage.getItem("editorCode"));
        localStorage.removeItem("reg");
    }
    
    uid = firebase.auth().currentUser.uid;

    var editorCodeRef = firebase.database().ref(uid+"/EditorCode");

    for (let i = 0; i < 20; i ++) {
        let ringRef = firebase.database().ref(uid+"/time" + i);
        ringRef.on('value', function(snapshot) {
            let val = snapshot.val();
            document.getElementById("time" + i).innerHTML = val;
        });
    }


    editorCodeRef.on('value', function(snapshot){
       if (snapshot.val() == editorCode){
           document.getElementById("subjects_link").style.display = "inline-block";
       }
       setContentLoading(ringsItem, false);
    });
}