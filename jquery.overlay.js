/*
    Overlay Plugin v0.1
    Author: RRH
    Created: 2015-01-02
*/
(function ($, window) {
    "use strict";
    if (!$) { return; }

    var pluginName = "overlay",
        defaults = {
            message: "Please wait...",
            container: "body"
        },
        activeOverlay;

    $[pluginName] = function (message, container) {
        // VARIABLES
        var wrapperId = pluginName + (new Date()).getTime(),
            container_prevCssPos,
            wrapper,
            box,
            obj;

        // VERIFY that there are no active overlays
        if (activeOverlay) {
            activeOverlay.close();
        }

        // FUNCTIONS
        // center the box horizontally and vertically
        function centerbox() {
            var wrapperelem = $("#" + wrapperId),
                boxelem = wrapperelem.find("." + pluginName + "_box");
            // top positioning should be half the wrapper's height minus half the box's height
            boxelem.css("top", (wrapperelem.outerHeight() / 2) - (boxelem.outerHeight() / 2));
            // left positioning should be half the wrapper's width minus half the box's width
            boxelem.css("left", (wrapperelem.outerWidth() / 2) - (boxelem.outerWidth() / 2));
        }
        // destroy the provided overlay
        function destroy(wrapperelem) {
            // turn off the resize event handler
            $(window).off("resize", centerbox);
            // set the position css back to its original
            container.css("position", container_prevCssPos);
            // finally remove the overlay wrapper and box from the dom
            wrapperelem.remove();
            // clear the active overlay variable
            activeOverlay = undefined;
        }

        // SETUP the provided variables
        // if no message is provided, then the default message is provided
        if (!message || !message.length) {
            message = defaults.message;
        }
        // make sure that we have a container to put this message in
        container = $(container);
        if (!container || !container.length) {
            container = $(defaults.container);
        }

        // BUILD the elements
        // find the position css value of the container
        container_prevCssPos = container.css("position");
        // make the wrapper elem (the overlay)
        wrapper = $("<div/>", {
            id: wrapperId,
            "class": pluginName + "_wrapper",
            css: {
                backgroundColor: "rgba(255,255,255,0.6)",
                padding: "10px",
                textAlign: "center",
                position: container.is("body") ? "fixed" : "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        });
        // make the box elem, to hold the message inside in the overlay
        box = $("<div/>", {
            html: message,
            "class": pluginName + "_box",
            css: {
                backgroundColor: "white",
                border: "1px solid gray",
                display: "inline-block",
                color: "black",
                position: "absolute",
                padding: "20px 40px"
            }
        });
        box.appendTo(wrapper);

        // INSERT the elements into the dom and add the interactions
        if (!container.is("body") && container_prevCssPos === "static") {
            // if the container does not allow positioning, we'll need to override it
            container.css("position", "relative");
        }
        // put the wrapper inside the container element
        container.append(wrapper);
        // run the centerbox message to...to center the box in the container
        centerbox();
        // attach the window resize event handler, so the box is always in the center
        $(window).on("resize", centerbox);

        // create an object with the functions needed after opening the overlay
        obj = {
            // close function [obviously] closes the overlay when you're done with it
            close: function () {
                destroy($("#" + wrapperId));
            }
        };
        // save the object to the active variable // this makes sure that only one is open a time
        activeOverlay = obj;
        // return the object to the caller, so they can call the functions programmatically as well
        return obj;
    };

}(this.jQuery, this));