/* ThinkEat GA4: basic opt-in consent. No Google requests before permission. */
(function () {
  "use strict";

  var settings = window.THINKEAT_ANALYTICS || {};
  var measurementId = String(settings.measurementId || "").trim();
  if (settings.enabled !== true || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return;
  }

  var consentKey = "thinkeat.analytics.consent.v1";
  var analyticsStarted = false;
  var preferencesPanel = null;

  function readChoice() {
    try {
      var value = window.localStorage.getItem(consentKey);
      return value === "allowed" || value === "declined" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function rememberChoice(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      // Allow the current page to work if the browser blocks storage.
    }
  }

  // Queue a denied state before loading any Google script or sending data.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  function startAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  function clearAnalyticsCookies() {
    // Best-effort cleanup after consent withdrawal, including domain cookies.
    var names = document.cookie.split(";").map(function (part) {
      return part.trim().split("=")[0];
    }).filter(function (name) {
      return name === "_ga" || name.indexOf("_ga_") === 0;
    });
    var domains = ["", "; domain=" + window.location.hostname];
    if (window.location.hostname === "www.thinkeat.org" ||
        window.location.hostname === "thinkeat.org") {
      domains.push("; domain=.thinkeat.org");
    }
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          domain + "; SameSite=Lax";
      });
    });
  }

  function hidePanel() {
    if (preferencesPanel) {
      preferencesPanel.remove();
      preferencesPanel = null;
    }
  }

  function setChoice(choice) {
    rememberChoice(choice);
    hidePanel();
    if (choice === "allowed") {
      startAnalytics();
    } else if (analyticsStarted) {
      // A full reload ensures the loaded GA tag stops executing after withdrawal.
      window.gtag("consent", "update", { analytics_storage: "denied" });
      clearAnalyticsCookies();
      window.location.reload();
    }
  }

  function showPanel() {
    hidePanel();
    var panel = document.createElement("section");
    panel.className = "te-consent";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Optional website analytics");
    panel.innerHTML =
      '<div class="te-consent__content">' +
        '<strong>Optional website analytics</strong>' +
        '<p>We use Google Analytics to understand website visits and interest in the ThinkEat app. ' +
        'No analytics data is sent to Google unless you allow it. You can change your choice later. ' +
        '<a href="privacy.html">Privacy policy</a>.</p>' +
      '</div>' +
      '<div class="te-consent__actions">' +
        '<button type="button" class="te-consent__decline">Decline</button>' +
        '<button type="button" class="te-consent__allow">Allow analytics</button>' +
      '</div>';
    panel.querySelector(".te-consent__decline").addEventListener("click", function () {
      setChoice("declined");
    });
    panel.querySelector(".te-consent__allow").addEventListener("click", function () {
      setChoice("allowed");
    });
    document.body.appendChild(panel);
    preferencesPanel = panel;
  }

  function addPreferencesControl() {
    var footer = document.querySelector("footer");
    if (!footer || footer.querySelector(".te-consent-preferences")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "te-consent-preferences";
    button.textContent = "Analytics preferences";
    button.addEventListener("click", showPanel);
    footer.appendChild(button);
  }

  function initialize() {
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "assets/analytics-consent.css";
    document.head.appendChild(style);
    addPreferencesControl();

    var choice = readChoice();
    if (choice === "allowed") {
      startAnalytics();
    } else if (choice !== "declined") {
      showPanel();
    }
  }

  // A link click measures outbound interest, not a confirmed iOS install.
  document.addEventListener("click", function (event) {
    if (!analyticsStarted) return;
    var anchor = event.target && event.target.closest
      ? event.target.closest("a[href]")
      : null;
    if (!anchor) return;

    var destination;
    try {
      destination = new URL(anchor.href, window.location.href);
    } catch (error) {
      return;
    }
    if (destination.hostname !== "apps.apple.com" ||
        destination.pathname !== "/us/app/thinkeat/id6796200052") {
      return;
    }

    window.gtag("event", "ios_app_store_click", {
      link_url: destination.href,
      transport_type: "beacon"
    });
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
}());
