const bar = document.getElementById('top-bar'); 
let Yprev = window.pageYOffset;
window.onscroll = function() {
    let Ycurr = window.pageYOffset;
    if (Ycurr < Yprev) {
        bar.style.top = "0";
    } else {
        if(Ycurr > 60)
        bar.style.top = "-75px";
    }
    Yprev = Ycurr;
}