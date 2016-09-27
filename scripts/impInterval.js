/**
* 
* impInterval.js
* Helper script to use instead of Javascript's setInterval
* Eliminates the issue with setInterval not working when a tab is inactive in Chrome
* Eliminates the issue with multiple executions happening at the same time (native setInterval doesn't care whether the callback is still running or not)
* 
* 
* 
* Example of usage to set interval:
    var timer = impInterval(function () {
        // Code block goes here
    }, 1000, 10);
* 
* 
* 
* Example of usage to clear interval:
    timer.cancel();
* 
*/
function impInterval(func, wait, times) {
    var interv = function () {
        if (typeof times === "undefined" || times-- > 0) {
            setTimeout(interv, wait);
            try {
                func.call(null);
            }
            catch (e) {
                times = 0;
                throw e.toString();
            }
        }
    };

    setTimeout(interv, wait);

    return { cancel: function () { times = 0 } };
};
