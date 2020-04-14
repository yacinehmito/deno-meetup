function spinLogos() {
  document.querySelectorAll(".logos > img").forEach((logo) => {
    logo.classList.add("spin");
  });
}

document.querySelectorAll(".logos > img").forEach((logo) => {
  logo.addEventListener("animationend", (event) => {
    if (event.animationName === "spin") {
      logo.classList.remove("spin");
    }
  });
});

document.getElementById("spin-button")?.addEventListener("click", spinLogos);
