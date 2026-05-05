const header = document.querySelector(".site-header");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("load", updateHeader);
window.addEventListener("hashchange", updateHeader);
window.addEventListener("scroll", updateHeader);
