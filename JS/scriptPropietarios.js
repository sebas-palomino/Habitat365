const productos = [
    {
        propietario: "Jorge soto", bloque: "A", casa: 201 ,fechaPago: "15/07/2023" , estado: "Pagado"
    },
    {
        propietario: "Felipe Ariza", bloque: "A", casa: 202 ,fechaPago: "20/07/2023" , estado: "Pagado"
    },
    {
        propietario: "Carlos Martinez", bloque: "A", casa: 203 ,fechaPago: "25/07/2023" , estado: "Pagado"
    },
    {
        propietario: "jose rodriguez", bloque: "A", casa: 204 ,fechaPago: "30/07/2023" , estado: "Pendiente"
    },
    {
        propietario: "juan perez", bloque: "A", casa: 205 ,fechaPago: "05/08/2023", estado: "Pendiente"
    },
    {
        propietario: "luz angela", bloque: "A", casa: 206 ,fechaPago: "05/08/2023", estado: "Pagado"
    },
    {
        propietario: "Sandra Lopez", bloque: "A", casa: 207 ,fechaPago: "05/08/2023", estado: "Mora"
    },
    { propietario: "Maria Gomez", bloque: "A", casa: 208 ,fechaPago: "05/08/2023", estado: "Pendiente"}
];

const cuerpoTabla = document.getElementById("tabla-body");
for (let i = 0; i < productos.length; i++) {

    const producto = productos[i];

    const fila = document.createElement("tr");

    // Nombre 
    const tdPropietario = document.createElement("td");
    tdPropietario.textContent = producto.propietario;

    const tdBloque= document.createElement("td");
    tdBloque.textContent = producto.bloque;

    const tdCasa= document.createElement("td");
    tdCasa.textContent = producto.casa;
    const tdFechaPago= document.createElement("td");
    tdFechaPago.textContent = producto.fechaPago;

    const tdEstado = document.createElement("td");

    if (producto.estado === "Mora") {
        fila.classList.add("Mora");
        tdEstado.textContent = "En mora";
        tdEstado.style.color = "#9c0a0f";
        tdEstado.style.fontWeight = "bold";

    } else if (producto.estado === "Pendiente") {
        fila.classList.add("Pendiente");
        tdEstado.textContent = "Pendiente";
        tdEstado.style.color = "#ffc107";
        tdEstado.style.fontWeight = "bold";
    } else {
        fila.classList.add("pagado");
        tdEstado.textContent = "Al día";
        tdEstado.style.color = "#155724";
        tdEstado.style.fontWeight = "bold";
    }
  
    // Armar la fila en el mismo orden de los encabezados 
    fila.appendChild(tdPropietario);
    fila.appendChild(tdBloque);
    fila.appendChild(tdCasa);
    fila.appendChild(tdFechaPago);
    fila.appendChild(tdEstado);

    cuerpoTabla.appendChild(fila);


}
