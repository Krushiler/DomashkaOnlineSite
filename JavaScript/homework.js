var homeworkItem = document.getElementById("homework");

setContentLoading(homeworkItem, true);

var homeworks = new Array(60);
var subjects = new Array(60);
var dayInt = 1;
var editorCode = localStorage.getItem("editorCode");
var newHomeworks = new Array(60);
var newSubjects = new Array(60);
var uid;

var defSubjectOptions = {
  " ":0,
  "Русский язык":1,
  "Литература":2,
  "Алгебра":3,
  "Геометрия":4,
  "Физика":5,
  "Биология":6,
  "География":7,
  "История":8,
  "Обществознание":9,
  "Химия":10,
  "Музыка":11,
  "Физ-ра":12,
  "ОБЖ":13,
  "Английский язык":14,
  "Информатика":15,
  "Технология":16,
  "Черчение":17,
  "Астрономия":18,
  "История России":19,
  "Всеобщая история":20,
  "Спецкурс":21,
  "Классный час":22
};

var addictiveSubjectOptions;

function generateTasks(count) {
    for (let i = 0; i < count; i++) {
        let scheduleDiv = document.getElementsByClassName("schedule")[0];
        let task = document.createElement("div");
        task.className = "task";
        task.innerHTML = "<select id=\"sub" + i + "\" class=\"sub_field\"></select> <textarea id=\"homework" + i + "\" class=\"homework_field\"></textarea>"
        scheduleDiv.append(task);
    }
    enableResizing();
}

generateTasks(10);

$('.homework_field').prop('disabled', true);

for(let i = 0; i < 60; i++){
    homeworks[i] = "";
}

function autosize(el){
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:0';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
}

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

var today = new Date();
var dayOfWeek = today.getDay();

var days = ["ПН","ВТ","СР","ЧТ","ПТ","СБ"];

if (dayOfWeek==0 || dayOfWeek==1){dayOfWeek=1;}
    dayInt = dayOfWeek;
    dayOfWeek--;
    var counter = 1;
    let i = dayOfWeek;
    while (i < 6){
        $("#btnd" + counter).html(days[i]);
        $("#btnd" + counter).addClass("btnd" + parseInt(i+1));
        counter++;
        i++;
    }
    i = 0;
    while(i < dayOfWeek){
        $("#btnd" + counter).html(days[i]);
        $("#btnd" + counter).addClass("nextWeek");
        $("#btnd" + counter).addClass("btnd" + parseInt(i+1));
        counter++;
        i++;
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

$("#closeBtn").click(hideMessage); 

$("#saveSpan").click(function(){showMessage("Сохранить изменения", "Сохранить", function(){
    saveAll();
    hideMessage();
})});

exit_link.onclick = function(){
    firebase.auth().signOut().then(function() {}, function(error) {});
    localStorage.removeItem("classCode");
    localStorage.removeItem("editorCode");
    location.href = "login.html";
}

async function makeSpinners(snapshot) {
    var returnArr = [];
    
    await snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });
    
    addictiveSubjectOptions = defSubjectOptions;
    for (let i = 0; i < returnArr.length; i ++){
        addictiveSubjectOptions[returnArr[i]] = i+23;
    }
    for(let i = 0; i < 10; i++){
    var $el = $("#sub" + i);
        $el.empty();
        $.each(addictiveSubjectOptions, function(key,value) {
            $el.append($("<option></option>")
                .attr("value", value).text(key));});
    }
    
    return returnArr;
};

async function loadData(){
    setContentLoading(homeworkItem, true);
    var database = firebase.database();
    if(localStorage.getItem("reg")!=null){
        firebase.database().ref(firebase.auth().currentUser.uid).child('EditorCode').set(localStorage.getItem("editorCode"));
        localStorage.removeItem("reg");
    }
    uid = firebase.auth().currentUser.uid;
    var homeworkRefs = new Array(60);
    var subjectRefs = new Array(60);
    var editorCodeRef = firebase.database().ref(uid+"/EditorCode");
    firebase.database().ref(uid+"/AddictiveSubjects").on('value', function(snapshot) {
    makeSpinners(snapshot);});
    for (let i = 0; i < 60; i++){
        homeworkRefs[i] = firebase.database().ref(uid+"/Homework" + i);
        subjectRefs[i] = firebase.database().ref(uid+"/Subjects" + i);
        homeworkRefs[i].on('value', function(snapshot) {
            homeworks[i] = snapshot.val();
            newHomeworks[i] = homeworks[i];
            let k = 0;
            for (let j = (dayInt-1) * 10; j < dayInt * 10; j ++){
                let ta = document.getElementById("homework" + k);
                ta.value = homeworks[j];
                k++;
            }
            autosizeAll();
        });
        subjectRefs[i].on('value', function(snapshot) {
            subjects[i] = snapshot.val();
            newSubjects[i] = subjects[i];
            let k = 0;
            for (let j = (dayInt-1) * 10; j < dayInt * 10; j ++){
                document.getElementById("sub" + k).value = subjects[j];
                k++;
            }
            setContentLoading(homeworkItem, false);
        });
    }

    editorCodeRef.on('value', function(snapshot){
       if (snapshot.val() == editorCode){
           $('.homework_field').prop('disabled', false);
           $('.sub_field').css('pointer-events','all');
           document.getElementById("saveSpan").style.display = "flex";
           document.getElementById("subjects_link").style.display = "inline-block";
       }
    });
}

$(".buttonDays").click(function(){
    if(!$(this).hasClass("active")){
        $(".buttonDays").removeClass("active");
        $(this).addClass("active");
        if ($(this).hasClass("btnd1")){dayInt = 1;}
        if ($(this).hasClass("btnd2")){dayInt = 2;}
        if ($(this).hasClass("btnd3")){dayInt = 3;}
        if ($(this).hasClass("btnd4")){dayInt = 4;}
        if ($(this).hasClass("btnd5")){dayInt = 5;}
        if ($(this).hasClass("btnd6")){dayInt = 6;}
        let k = 0;
        for (let i = (dayInt-1) * 10; i < dayInt * 10; i ++){
            let ta = document.getElementById("homework" + k);
            ta.value = newHomeworks[i];
            document.getElementById("sub" + k).value = newSubjects[i];
            k++;
        }   
        autosizeAll();
    }
});

var textarea = document.querySelectorAll('textarea');
textarea.forEach(function(el){
  el.addEventListener('change', changeNewHomeworks);
});
function changeNewHomeworks(){
    let el = this;  
    let num = 0;
    let strNum;
    strNum = el.id;
    strNum = strNum.replace('homework', '');
    num = parseInt(strNum);
    num = num + (dayInt-1)*10;
    newHomeworks[num] = el.value;
}

var select = document.querySelectorAll('select');
select.forEach(function(el){
  el.addEventListener('change', changeNewSubjects);
});

function changeNewSubjects(){
    let el = this;
    let num = 0;
    let strNum;
    strNum = el.id;
    strNum = strNum.replace('sub', '');
    num = parseInt(strNum);
    num = num + (dayInt-1)*10;
    newSubjects[num] = el.value;
}

function saveAll(){
    for (let i = 0; i < 60; i ++){
        firebase.database().ref(firebase.auth().currentUser.uid).child('Homework' + i).set(newHomeworks[i]);
        firebase.database().ref(firebase.auth().currentUser.uid).child('Subjects' + i).set(newSubjects[i]);
    }
}