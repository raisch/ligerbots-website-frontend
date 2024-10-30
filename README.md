# ligerbots-website-frontend

This is the repo for the new Ligerbots website, a work in progress.

Contact Coach Rob on slack if you're interested in helping.

## Development Strategy
The ultimate goal of this project is to replace the current LigerBots web site with one
built on better, more modern, and more secure tools and technologies than those in the
current site.

To this end, it was determined that we should follow this path:

1. Select new tools/platforms to build the new site [__*COMPLETE*__]
2. Create as complete and loyal a copy of the existing site as possible [75% COMPLETE]
3. Create a new carpool app using the new tools.
4. Change the site to adhere to the design and style changes defined by the marketing & graphics teams.

The following features are still need to complete #2:
- Announcements: front page block, list, & detail pages
- Blog Posts: front page block, list, & detail pages
- Photo Gallery: as defined by existing web site

### Carpool App
The coaches are very keen on us providing a way to manage carpools to and from events.

To this end, we've created a data model (in Directus) to support this function and will need to
create the required pages.

We hope to deliver this app, as a plugin to the existing web site, by the end of 2024.

## Directory Structure
- /bin - useful scripts (probably out-of-date)
- /src - site components (svelte)
  - lib
    - /components - svelte componentry
      - /icons - useful icons as svelte components
        - Note: Sourced from svelte-icon-pack, might wish to use a better pack, like
          lucide-svelte
      - *.svelte - site components
        - Note: Most of these are just html ripped from existing site and should be refactored
          into actual components. To do so, we'll need to decide on a site wide css layout
          library. The existing site uses an old version of bootstrap which is sub-optimal.
    - /server - server-side javascript
  - routes - sveltekit routes
    - [slug] - general pages reachable via http://HOST/[slug]
    - announcement - announcements (TBD), http://HOST/announcement & http://HOST/announcement/[slug]
    - api - service api for calls from client-side componentry, http://HOST/api/...
    - blog - blog posts (TBD), http://HOST/blog & http://HOST/blog/[slug]
    - carpool - scaffolding (TBD), http://HOST/carpool
    - directory - user directory, http://HOST/directory
    - facebook - user photo gallery, http://HOST/facebook
    - login - user login (relies on /api/login), http://HOST/login
    - logout - user logout, http://HOST/logout
    - photos - photo gallery (TBD), http://HOST/photos
    - post - DEPRECATED, see /announcement & /blog
    - signup - new user signup (TBD), http://HOST/signup
- /static - static site resources (served via url: http://HOST/...)
- /system - boilerplate and instructions for installation on a ubuntu linux service machine

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

## Note On The Use Of `<embed>` Tags
The `<embed>` tag defines a container for an external resource, such as a web page, a picture, a media player, or a plug-in application.

We use the `<embed>` tag to embed active `SVG` elements in a page; active in this sense means they encapsulate
images, links, and styles in the same object.

Our use of the tag is to support images which have "clickable regions" within them.

<div style="color:red">But our use of this tag for this purpose poses both significant security issues for
browsers and violates the contract browsers have with page content.</div><br/>

A far better way to accomplish the same functionality, and one that does not pose as much risk as SVGs, is to
use individual `<img>` tags wrapped in `<a>` anchor tags which then rely on the standard page formatting
tools to manage their position on the page.

