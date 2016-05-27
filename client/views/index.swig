<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}{% endblock %}</title>

  {% block head %}
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/css/styles.css">
  {% endblock %}
</head>
<body>
{% block branding %}{% endblock %}
{% block menu %}{% endblock %}
{% block content %}{% endblock %}
{% block footer %}{% endblock %}
</body>
</html>
