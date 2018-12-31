var RandomColor = function () {
    colors_of_the_rainbow = ["#A4C400", "#60A917", "#008A00", "#00ABA9", "#1BA1E2", "#0050EF",
        "#6A00FF", "#AA00FF", "#D80073", "#A20025", "#E51400", "#FA6800",
        "#F0A30A", "#76608A"];

    var color = colors_of_the_rainbow[Math.floor(Math.random() * colors_of_the_rainbow.length)];

    $(".top-bar, .date-block, #mobile-date-block").css("background-color", color);
    $(".icon, .selected-header").css("color", color);
    $(".selected-header").css("border-bottom-color", color);
}

$(function () {
    RandomColor();
    $(".top-bar, .selected-header a, #top-bar-phone, .date-block, #mobile-date-block").click(RandomColor);
});