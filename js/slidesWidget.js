export const init = (view, slidesDivId) => {
  let scene = view.map
  let slides = scene.presentation.slides;
  slides.forEach(slide => {
    
    let slideElement = document.createElement("div");
    slideElement.id = slide.id;
    slideElement.classList.add("slide");

    let title = document.createElement("div");
    title.innerText = slide.title.text;
    slideElement.appendChild(title);

    let img = new Image();
    img.src = slide.thumbnail.url;
    img.title = slide.title.text;
    slideElement.appendChild(img);

    let slidesDiv = document.getElementById(slidesDivId)
    slidesDiv.appendChild(slideElement);
    
    slideElement.addEventListener("click", () => {
      var slides = document.querySelectorAll(".slide");
      Array.from(slides).forEach(node => {
        node.classList.remove("active");
      });

      slideElement.classList.add("active");
      slide.applyTo(view);
    })
  })
}