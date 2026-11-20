/* Minimal GA4 integration; loads nothing while analytics is disabled. */
(function () {
  "use strict";

  var settings = window.THINKEAT_ANALYTICS || {};
  var measurementId = String(settings.measurementId || "").trim();

  if (settings.enabled !== true || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: true });

  var tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(tag);

  // This is an outbound-link intent event, not an app installation.
  document.addEventListener("click", function (event) {
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
}());
