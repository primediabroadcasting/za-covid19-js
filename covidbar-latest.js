/*
  Plugin Name: ZA Covid-19 Bar
  Plugin URL: https://github.com/primediabroadcasting/za-covid19-js
  @description: za-covid19-js is a free solution for implementing a link to the www.sacoronvirus.co.za website
*/

/*
 * Available languages array
 */
var BarLanguages = [
  'en',
  'af'
];




/**
 * Main function
 */
function setupCovidBar() {
  var scriptPath = getScriptPath();
  var CovidBar;

    console.log("inside setupCovidBar");
    initCovidBar();

  /**
   * Initialize CovidBar according to the startup / shutup values.
   * @return null
   */
  function initCovidBar() {
      startCovidBar();
  }

  /**
   * Load external files (css, language files etc.)
   * @return null
   */
  function startCovidBar() {
    var userLang = detectLang();
    // Load CSS file
    var theme = '';
    if (getURLParameter('theme')) {
      theme = '-' + getURLParameter('theme');
    }
    var path = scriptPath.replace(/[^\/]*$/, '');
    var minified = (scriptPath.indexOf('.min') > -1) ? '.min' : '';
    var stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', path + 'themes/covidbar' + theme + minified + '.css');
    document.head.appendChild(stylesheet);

    // Load the correct language messages file and set some variables
    var request = new XMLHttpRequest();
    request.open('GET', path + 'lang/' + userLang + '.html', true);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        var element = document.createElement('div');
        element.innerHTML = request.responseText;
        document.getElementsByTagName('body')[0].appendChild(element);

        CovidBar = document.getElementById('covid-bar');

        if (getURLParameter('scrolling')) {
          scrolling.style.display = 'inline-block';
        }

        if (getURLParameter('top')) {
          CovidBar.style.top = 0;
          setBodyMargin('top');
        } else {
          CovidBar.style.bottom = 0;
          setBodyMargin('bottom');
        }

        setEventListeners();
        fadeIn(CovidBar, 100);
        setBodyMargin();
      }
    };
    request.send();
  }

  /**
   * Get this javascript's path
   * @return {String} this javascript's path
   */
  function getScriptPath() {
    var scripts = document.getElementsByTagName('script');

    for (i = 0; i < scripts.length; i += 1) {
      if (scripts[i].hasAttribute('src')) {
        path = scripts[i].src;
        if (path.indexOf('covidbar') > -1) {
          return path;
        }
      }
    }
  }

  /**
   * Get browser's language or, if available, the specified one
   * @return {String} userLang - short language name
   */
  function detectLang() {
    var userLang = getURLParameter('forceLang');
    if (userLang === false) {
      userLang = navigator.language || navigator.userLanguage;
    }
    userLang = userLang.substr(0, 2);
    if (BarLanguages.indexOf(userLang) < 0) {
      userLang = 'en';
    }
    return userLang;
  }

  /**
   * FadeIn effect
   * @param {HTMLElement} el - Element
   * @param {number} speed - effect duration
   * @return null
   */
  function fadeIn(el, speed) {
    var s = el.style;
    s.opacity = 0;
    s.display = 'block';
    (function fade() {
      (s.opacity -= -0.1) > 0.9 ? null : setTimeout(fade, (speed / 10));
    })();
  }


  /**
   * FadeOut effect
   * @param {HTMLElement} el - Element
   * @param {number} speed - effect duration
   * @return null
   */
  function fadeOut(el, speed) {
    var s = el.style;
    s.opacity = 1;
    (function fade() {
      (s.opacity -= 0.1) < 0.1 ? s.display = 'none' : setTimeout(fade, (speed / 10));
    })();
  }

  /**
   * Add a body tailored bottom (or top) margin so that CovidBar doesn't hide anything
   * @param {String} where
   * @return null
   */
   function setBodyMargin(where) {
      setTimeout(function () {

      var height = document.getElementById('covid-bar').clientHeight;

      var bodyEl = document.getElementsByTagName('body')[0];
      var bodyStyle = bodyEl.currentStyle || window.getComputedStyle(bodyEl);

      switch (where) {
        case 'top':
          bodyEl.style.marginTop = (parseInt(bodyStyle.marginTop) + height) + 'px';
          break;
        case 'bottom':
          bodyEl.style.marginBottom = (parseInt(bodyStyle.marginBottom) + height) + 'px';
          break;
      }
    }, 100);
  }

  /**
   * Get ul parameter to look for
   * @param {string} name - param name
   * @return {String|Boolean} param value (false if parameter is not found)
   */
  function getURLParameter(name) {
    var set = scriptPath.split(name + '=');
    if (set[1]) {
      return set[1].split(/[&?]+/)[0];
    } else {
      return false;
    }
  }

  /**
   * Set button actions (event listeners)
   * @return null
   */
  function setEventListeners() {
  
    if (getURLParameter('scrolling')) {
      var scrollPos = document.body.getBoundingClientRect().top;
      var scrolled = false;
      window.addEventListener('scroll', function() {
        if (scrolled === false) {
          if (document.body.getBoundingClientRect().top - scrollPos > 250 || document.body.getBoundingClientRect().top - scrollPos < -250) {
            // setCookie('CovidBar', 'CookieAllowed');
            clearBodyMargin();
            fadeOut(prompt, 250);
            fadeOut(CovidBar, 250);
            scrolled = true;
            if (getURLParameter('refreshPage')) {
                window.location.reload();
            }
          }
        }
      });
    }
  }
}

if (document.readyState === "uninitialized" || document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', function() {
    setupCovidBar();
  });
}
else
{
  // document.readyState == loaded, interactive or complete (thanks Bruce!)
  setupCovidBar(); 
}