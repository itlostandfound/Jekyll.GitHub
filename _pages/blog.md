---
layout: default
title: Blog
permalink: /blog/
---

<div class="page-content">
  <h1>Blog</h1>

  {% if site.posts.size > 0 %}
  <ul class="writing-list">
    {% for post in site.posts %}
    <li>
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
</div>