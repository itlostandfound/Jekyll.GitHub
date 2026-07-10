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

  <!-- Post cards -->
  {% if site.posts.size > 0 %}
  <div class="post-cards" id="post-list">
    {% for post in site.posts %}
    <article class="post-card" data-categories="{{ post.categories | join: ',' }}">
      <a href="{{ post.url | relative_url }}" class="post-card-link">
        {% if post.image %}
        <div class="post-card-image">
          <img src="{{ post.image | relative_url }}" alt="{{ post.title }}" loading="lazy">
        </div>
        {% endif %}
        <div class="post-card-body">
          <h2 class="post-card-title">{{ post.title }}</h2>
          {% if post.excerpt %}
          <p class="post-card-excerpt">{{ post.excerpt }}</p>
          {% endif %}
          <div class="post-card-meta">
            <time class="post-card-date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %d, %Y' }}</time>
            <div class="post-card-tags">
              {% for cat in post.categories %}
              <span class="post-card-tag">{{ cat }}</span>
              {% endfor %}
            </div>
          </div>
        </div>
      </a>
    </article>
    {% endfor %}
  </div>
  {% else %}
  <p>No posts yet. Check back soon.</p>
  {% endif %}

  <!-- No results message (hidden by default) -->
  <p class="no-results" id="no-results" style="display:none;">No posts match the selected category.</p>
</div>

<script src="{{ '/assets/js/blog-filter.js' | relative_url }}" defer></script>