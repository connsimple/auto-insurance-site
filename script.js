// Highlight the current nav item automatically
(function(){
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });
})();
