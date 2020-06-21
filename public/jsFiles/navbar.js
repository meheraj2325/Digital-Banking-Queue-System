

$(".nav-link").on("click", function () {
  alert("hi")
  $(".nav-link").find(".active").removeClass("active");
  $(this).addClass("active");
});
