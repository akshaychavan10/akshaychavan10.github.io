---
layout: page
title: About
permalink: /about/
weight: 3
---

# **About Me**

Hi I am **{{ site.author.name }}** :wave:,<br>

I am a Cybersecurity Master’s candidate with professional experience as a SOC Analyst, where I specialized in monitoring SIEM alerts, conducting network-traffic analysis and applied the MITRE ATT&CK framework to classify adversary behavior. My technical background spans Linux hardening, Active Directory, and network traffic analysis. Beyond the SOC, I am an active freelance Security Researcher on HackerOne, having identified and reported over 20 vulnerabilities in web applications.

<div class="row">
{% include about/skills.html title="Technical Skills" source=site.data.technical-skills %}
{% include about/skills.html title="Programming" source=site.data.programming-skills %}
{% include about/skills.html title="Soft Skills" source=site.data.other-skills %}
</div>

<div class="row">
{% include about/timeline.html %}
</div>