# Swat's over the top krunker document object model generator (W.I.P.)
An NPM tool that allows you to convert HTML/CSS into a flat krunker dom, which can then be parsed by krunkscript. This tool is still under heavy development, and can't do much yet.

# Env & contributing
1. Pull this project.
2. Create a new branch based on `master`
3. Update project:
```
yarn
```
4. Test changes with: (will need modification on linux/osx)
```
yarn load (only needed once)
yarn try
```
- When done, it will copy a krunker object to your clipboard. You can make your own interpeter in krunkscript or use the one in `./krunkscript/client.krnk`. Load this into a krunker map and you should get a website.
5. Merge `master` into branch again, then make a pull request. You can unload the module with `yarn unload`.


# Example conversion:
[![](https://imgur.com/5gNUPzk.png)](https://youtu.be/6KOySQY11L8) 

# Support
✅: yes 
❌: no
❔: maybe

## HTML tags
| Feature                          | Available                     | Planned |
|-                                 |-                              |-        |
| \<!--comments-->                 |✅                             |✅      |
| \<head>                          |✅                             |✅      |
| \<body>                          |✅                             |✅      |
| \<div>                           |✅                             |✅      |
| \<style>                         |✅                             |✅      |
| \<title>                         |✅                             |✅      |
| \<a>                             |✅                             |✅      |
| \<script>                        |❌                             |✅      |
| \<br>                            |❌                             |✅      |
| \<iframe> (styling only)         |❌                             |✅      |
| \<img>                           |❌                             |✅      |
| \<input>                         |❌                             |✅      |
| \<template>                      |❌                             |✅      |
| <br>
| \<abbr>                          |✅                             |✅      |
| \<address>                       |✅                             |✅      |
| \<article>                       |✅                             |✅      |
| \<aside>                         |✅                             |✅      |
| \<b>                             |✅                             |✅      |
| \<blockquote>                    |✅                             |✅      |
| \<caption>                       |✅                             |✅      |
| \<cite>                          |✅                             |✅      |
| \<code>                          |✅                             |✅      |
| \<col>                           |✅                             |✅      |
| \<colgroup>                      |✅                             |✅      |
| \<dd>                            |✅                             |✅      |
| \<del>                           |✅                             |✅      |
| \<dfn>                           |✅                             |✅      |
| \<dialog>                        |✅                             |✅      |
| \<dl>                            |✅                             |✅      |
| \<dt>                            |✅                             |✅      |
| \<em>                            |✅                             |✅      |
| \<fieldset>                      |✅                             |✅      |
| \<figcaption>                    |✅                             |✅      |
| \<figure>                        |✅                             |✅      |
| \<footer>                        |✅                             |✅      |
| \<form> (styling only)           |✅                             |✅      |
| \<h1>                            |✅                             |✅      |
| \<h2>                            |✅                             |✅      |
| \<h3>                            |✅                             |✅      |
| \<h4>                            |✅                             |✅      |
| \<h5>                            |✅                             |✅      |
| \<h6>                            |✅                             |✅      |
| \<header>                        |✅                             |✅      |
| \<hr>                            |✅                             |✅      |
| \<html>                          |✅                             |✅      |
| \<i>                             |✅                             |✅      |
| \<ins>                           |✅                             |✅      |
| \<kbd>                           |✅                             |✅      |
| \<label>                         |✅                             |✅      |
| \<legend>                        |✅                             |✅      |
| \<li>                            |✅                             |✅      |
| \<link>                          |✅                             |✅      |
| \<main>                          |✅                             |✅      |
| \<mark>                          |✅                             |✅      |
| \<nav>                           |✅                             |✅      |
| \<ol>                            |✅                             |✅      |
| \<p>                             |✅                             |✅      |
| \<pre>                           |✅                             |✅      |
| \<q>                             |✅                             |✅      |
| \<s>                             |✅                             |✅      |
| \<samp>                          |✅                             |✅      |
| \<section>                       |✅                             |✅      |
| \<small>                         |✅                             |✅      |
| \<span>                          |✅                             |✅      |
| \<strike>                        |✅                             |✅      |
| \<strong>                        |✅                             |✅      |
| \<sub>                           |✅                             |✅      |
| \<table>                         |✅                             |✅      |
| \<tbody>                         |✅                             |✅      |
| \<td>                            |✅                             |✅      |
| \<tfoot>                         |✅                             |✅      |
| \<th>                            |✅                             |✅      |
| \<thead>                         |✅                             |✅      |
| \<tr>                            |✅                             |✅      |
| \<u>                             |✅                             |✅      |
| \<ul>                            |✅                             |✅      |
| \<var>                           |✅                             |✅      |
| \<video>                         |❌                             |✅      |
| \<summary>                       |❌                             |✅      |
| \<sup>                           |❌                             |✅      |
| \<meter>                         |❌                             |✅      |
| \<details>                       |❌                             |✅      |
| \<audio>                         |❌                             |✅      |
| \<map>                           |❌                             |❔       |
| \<button>                        |❌                             |❔       |
| \<area>                          |❌                             |❔       |
| \<base>                          |❌                             |❔       |
| \<bdi>                           |❌                             |❔       |
| \<bdo>                           |❌                             |❔       |
| \<base>                          |❌                             |❔       |
| \<datalist>                      |❌                             |❔       |
| \<optgroup>                      |❌                             |❔       |
| \<option>                        |❌                             |❔       |
| \<output>                        |❌                             |❔       |
| \<picture>                       |❌                             |❔       |
| \<progress>                      |❌                             |❔       |
| \<select>                        |❌                             |❔       |
| \<source>                        |❌                             |❔       |
| \<svg>                           |❌                             |❔       |
| \<textarea>                      |❌                             |❔       |
| \<wbr>                           |❌                             |❔       |
| \<canvas>                        |❌                             |❌      |
| \<center>                        |❌                             |❌      |
| \<data>                          |❌                             |❌      |
| \<dir>                           |❌                             |❌      |
| \<embed>                         |❌                             |❌      |
| \<font>                          |❌                             |❌      |
| \<frame>                         |❌                             |❌      |
| \<frameset>                      |❌                             |❌      |
| \<meta>                          |❌                             |❌      |
| \<noframes>                      |❌                             |❌      |
| \<noscript>                      |❌                             |❌      |
| \<object>                        |❌                             |❌      |
| \<param>                         |❌                             |❌      |
| \<rp>                            |❌                             |❌      |
| \<rt>                            |❌                             |❌      |
| \<ruby>                          |❌                             |❌      |
| \<time>                          |❌                             |❌      |
| \<track>                         |❌                             |❌      |
| \<tt>                            |❌                             |❌      |

## CSS
| Feature                          | Available                     | Planned |
|-                                 |-                              |-        |
| CSS file import                  |✅                             |✅      |
| style tags                       |✅                             |✅      |
| inline style                     |✅                             |✅      |
| classes, tags & ids              |✅                             |✅      |
| all CSS keywords                 |✅                             |✅      |
| <br>
| fonts                            |❌                             |✅      |
| background-images                |❌                             |✅      |
| selectors                        |❌                             |✅      |
| pseudo classes                   |❌                             |✅      |
