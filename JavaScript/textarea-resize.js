function enableResizing() {
  var textarea = document.querySelectorAll('textarea');
  textarea.forEach(function(el){
    el.addEventListener('keydown', autosize);
  });
  function autosize(){
    var el = this;
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = 'height:' + (5 + el.scrollHeight) + 'px';
    },0);
  }
}

function autosizeAll() {
  var textarea = document.querySelectorAll('textarea');
  textarea.forEach(function(el){
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = 'height:' + (5 + el.scrollHeight) + 'px';
    },0);
  });
}