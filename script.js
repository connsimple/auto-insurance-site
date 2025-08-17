(function(){
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach(function(a){
    var href = (a.getAttribute('href')||'').toLowerCase();
    if(href === path) a.classList.add('active');
  });
})();
