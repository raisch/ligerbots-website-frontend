# ligerbots-website-frontend

This is the repo for the new Ligerbots website, a work in progress.

Contact Coach Rob on slack if you're interested in helping.

## Architecture

This site is built using [`sveltekit`](kit.svelte.dev) which is a leading-edge, standards-compliant framework
for building web sites. (Under the covers, it uses the standard [ExpressJS](https://expressjs.com/) running
on top of [NodeJS](https://nodejs.org/en).)

`sveltekit` is powered by
- [`vite`](https://vitejs.dev/) which provides all the tooling required to build and serve your site or app, and
- [`svelte`](https://svelte.dev/) which is a compiled, component-based framework (a little like React but
  much faster and lighter) that allows you to combine business logic (in Javascript), content layout/organization
  (in HTML), and presentation styling (in CSS) into discrete 'components' you can use to build your web pages.

For example, the base for all the pages on this site looks like:

```
<head />
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">
    <App>
      <slot/>
    </App>
  </div>
</body>
```
where the `<App>` tag is defined as:
```
<div id="header-ghost"></div>

<div class="container-fluid no-side-padding" id="page-container">
  <div class="col-xs-12 no-side-padding">
    <Masthead />
    <Navbar />
    <MainPane>
      <slot /> <!-- where anything between <App> and </App> will be inserted. -->
    </MainPane>
    <Footer />
  </div>
</div>
```

As you can see, by breaking pages into a hierarchy of components, you gain concision of expression and a high level
of reuse.



## Notes on Web Security

This code embraces all web-related standards, especially the "Content Security Policy" which
greatly reduces the possibility of Cross Site Scripting (XSS) attacks.

CSP provides an HTTP header which controls what sources can be used for a variety of elements, such as
`<image>`, `<style>`, `<script>`, `<iframe>`, and `<embed>`. (See note below on use of the `<embed>` tag.)

The only drawback to locking down what resources your page is allowed to access is that, for example, should you
wish to include images from a source that is not listed in the CSP `image-src` portion of the header, the user's
browser will refuse to allow that image on your page.

Other than resources retrieved from both this (the front-end service) and our backend service, the current
CSP header for this site allows the page to retrieve from the following sources:

- font-src:
  - fonts.googleapis.com
  - fonts.gstatic.com
  - cdnjs.cloudflare.com

- frame-src:
  - 'calendar.google.com
  - docs.google.com
  - www.youtube.com
  - *.twitter.com
  - giphy.com

- img-src:
  - *.staticflickr.com

- script-src:
  - cdnjs.cloudflare.com
  - platform.twitter.com

- style-src:
  - fonts.googleapis.com
  - cdnjs.cloudflare.com

See [References/HTTP/Content Security Policy (CSP) on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
for further information.

## Note On The Use Of `<embed>` Tags
The `<embed>` tag defines a container for an external resource, such as a web page, a picture, a media player, or a plug-in application; these tags are no longer supported broadly as they were originally intended as containers for `Java` Applets, `ActiveX` Controls, and Shockwave Flash, which are no longer used in the modern web.

We use the `<embed>` tag to embed active `SVG` elements in a page; active in this sense means they encapsulate
images, links, and styles in the same object.

Our use of the tag is to support images which have "clickable regions" within them.

<div style="color:red">But our use of this tag for this purpose poses both significant security issues for
browsers and violates the contract browsers have with page content.</div><br/>

A far better way to accomplish the same functionality, and one that does not pose as much risk as SVGs, is to
use individual `<img>` tags wrapped in `<a>` anchor tags which then rely on the standard page formatting
tools to manage their position on the page.

