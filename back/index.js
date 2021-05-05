$(function() {
    /* If browser back button was used, flush cache */
    const host = window.location.hostname;
    const referrerUrl = document.referrer;

    console.log(referrerUrl, host, window.history.length, window.history);

    if (window.history.length === 1 || referrerUrl.length === 0 || referrerUrl.indexOf(host) === -1) {
        return;
    }

    $('.back').removeAttr('hidden').on('click', function() {
        window.history.back();
    });
});
