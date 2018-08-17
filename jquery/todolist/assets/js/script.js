$("ul").on("click", "li", function() {
    $(this).toggleClass("completed");
});

$("ul").on("click", "span", function(event) {
    $(this).parent().fadeOut(500, function() {
        $(this).remove();
    });
    event.stopPropagation();
});

$("#textbox").change(function() {
    var val = $(this).val();
    $("ul").append("<li><span><i class=\"fas fa-trash\"></i></span> " + val + "</li>");
    $(this).val("");
});

$(".fa-plus").click(function() {
    $("#textbox").fadeToggle();
});
