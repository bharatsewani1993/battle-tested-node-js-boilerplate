window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("navbar").style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    } else {
        document.getElementById("navbar").style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    }
}
