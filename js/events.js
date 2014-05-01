/**
 * @module neue/events
 * Pub/Sub events: Allows modules to communicate via publishing
 * and subscribing to events.
 *
 * Based on Addy Osmani's Pubsubz, licensed under the GPL.
 * https://github.com/addyosmani/pubsubz
 * http://jsfiddle.net/LxPrq/
 */

define(function() {
  "use strict";

  var topics = {};
  var subUid = -1;

  var publish = function(topic, args) {
    if (!topics[topic]) {
      return false;
    }

    setTimeout(function() {
      var subscribers = topics[topic],
      len = subscribers ? subscribers.length : 0;

      while(len--) {
        subscribers[len].func(topic, args);
      }
    }, 0);

    return true;
  };

  var subscribe = function(topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });

    return token;
  };

  var unsubscribe = function(token) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }

    return false;
  };

  // Export public API
  return {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };
});
