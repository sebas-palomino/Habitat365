const boton = document.querySelector(".menu-boton")
const lista = document.querySelector(".nav_lista")

boton.addEventListener("click", () => {
    lista.classList.toggle("abierto")
})

lista.querySelectorAll("a").forEach(enlace => {
    enlace.addEventListener("click", () => lista.classList.remove("abierto"))
})