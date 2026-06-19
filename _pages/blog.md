---
layout: default
title: Blog
permalink: /blog/
---

<div class="page-content">
  <h1>Blog</h1>

  <!-- Tag cloud -->
  <div class="tag-filter" id="tag-filter">
    <span class="tag-filter-label">Filter by category:</span>
    <div class="tag-cloud" id="tag-cloud">
      {% assign all_categories = "" | split: "" %}
      {% for post in site.posts %}
        {% for cat in post.categories %}
          {% unless all_categories contains cat %}
            {% assign all_categories = all_categories | push: cat %}
          {% endunless %}
        {% endfor %}
      {% endfor %}
      {% for cat in all_categories %}
        {% assign count = 0 %}
        {% for post in site.posts %}
          {% if post.categories contains cat %}
            {% assign count = count | plus: 1 %}
          {% endif %}
        {% endfor %}
        <button class="tag-btn" data-category="{{ cat }}">{{ cat }} <span class="tag-count">{{ count }}</span></button>
      {% endfor %}
    </div>
    <button class="tag-clear-btn" id="tag-clear" style="display:none;">Clear filter</button>
  </div>

  <!-- Post list -->
  {% if site.posts.size > 0 %}
  <ul class="writing-list" id="post-list">
    {% for post in site.posts %}
    <li data-categories="{{ post.categories | join: ',' }}">
      <a href="{{ post.url | relative_url }}">
        <span class="post-title">{{ post.title }}</span>
        <span class="post-date">{{ post.date | date: '%B %d, %Y' }}</span>
      </a>
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <p>No posts yet. Check back soon.</p>
  {% endif %}

  <!-- No results message (hidden by default) -->
  <p class="no-results" id="no-results" style="display:none;">No posts match the selected category.</p>
</div>

<script>
(function(){
  var activeCategory = null;
  var buttons = document.querySelectorAll('.tag-btn');
  var posts = document.querySelectorAll('#post-list li');
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
    posts.forEach(function(li){
      var cats = li.getAttribute('data-categories').split(',');
      if (cats.indexOf(cat) !== -1) {
        li.style.display = '';
        visibleCount++;
      } else {
        li.style.display = 'none';
      }
    });
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  function showAll() {
    posts.forEach(function(li){ li.style.display = ''; });
    noResults.style.display = 'none';
  }
})();
</script>