// Export Neue as an AMD module

if ( typeof define === "function" && define.amd ) {
    define( ["jquery"], function ($) { return NEUE; } );
}
