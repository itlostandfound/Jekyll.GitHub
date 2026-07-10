(function(){
  var activeCategory = null;
  var buttons = document.querySelectorAll('.tag-btn');
  var posts = document.querySelectorAll('#post-list .post-card');
  var noResults = document.getElementById('no-results');
  var clearBtn = document.getElementById('tag-clear');

  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var cat = this.getAttribute('data-category');

      if (activeCategory === cat) {
        // Deselect
        activeCategory = null;
        showAll();
      } else {
        // Select this category
        activeCategory = cat;
        buttons.forEach(function(b){ b.classList.remove('tag-btn-active'); });
        this.classList.add('tag-btn-active');
        filterPosts(cat);
      }

      clearBtn.style.display = activeCategory ? 'inline-block' : 'none';
    });
  });

  clearBtn.addEventListener('click', function(){
    activeCategory = null;
    buttons.forEach(function(b){ b.classList.remove('tag-btn-active'); });
    showAll();
    clearBtn.style.display = 'none';
  });

  function filterPosts(cat) {
    var visibleCount = 0;
    posts.forEach(function(card){
      var cats = card.getAttribute('data-categories').split(',');
      if (cats.indexOf(cat) !== -1) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  function showAll() {
    posts.forEach(function(card){ card.style.display = ''; });
    noResults.style.display = 'none';
  }
})();