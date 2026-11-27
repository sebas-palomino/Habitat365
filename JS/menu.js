const boton = document.querySelector(".menu-boton")
const lista = document.querySelector(".nav_lista")

boton.addEventListener("click", () => {
    lista.classList.toggle("abierto")
})

lista.querySelectorAll("a").forEach(enlace => {
    enlace.addEventListener("click", () => lista.classList.remove("abierto"))
})

document.addEventListener("DOMContentLoaded", () => {
    const formContacto = document.getElementById("form-contacto");
    const mensajeExito = document.getElementById("mensaje-exito");

    if (formContacto) {
        formContacto.addEventListener("submit", (evento) => {
            // 1. Evita que la página se recargue al enviar
            evento.preventDefault();

            // 2. Muestra el mensaje de confirmación
            mensajeExito.style.display = "block";

            // 3. Limpia los campos del formulario
            formContacto.reset();

            // 4. Oculta el mensaje después de 5 segundos
            setTimeout(() => {
                mensajeExito.style.display = "none";
            }, 5000);
        });
    }
});