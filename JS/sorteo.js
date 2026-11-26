// Obtiene el campo de texto del apartamento desde el HTML mediante su id "apto"
let campoApto = document.getElementById("apto")
// Obtiene el campo de texto de la placa del vehículo desde el HTML mediante su id "placa"
let campoPlaca = document.getElementById("placa")
// Obtiene el botón que disparará el sorteo desde el HTML mediante su id "btn-sortear"
let botonSortear = document.getElementById("btn-sortear")
// Obtiene el párrafo donde se mostrará el resultado del sorteo mediante su id "resultado"
let resultado = document.getElementById("resultado")

// Crea un arreglo vacío para guardar los apartamentos que ya participaron
let aptosUsados = []
// Crea un arreglo vacío para guardar las placas que ya participaron
let placasUsadas = []

// Escucha cada vez que se escribe o cambia algo en el campo de apartamento
campoApto.addEventListener("input", function() {
    // Convierte el texto a mayúsculas y elimina todos los espacios en blanco
    campoApto.value = campoApto.value.toUpperCase().replaceAll(" ", "")
})

// Escucha cada vez que se escribe o cambia algo en el campo de placa
campoPlaca.addEventListener("input", function() {
    // Convierte el texto a mayúsculas y elimina todos los espacios en blanco
    campoPlaca.value = campoPlaca.value.toUpperCase().replaceAll(" ", "")
})

// Define una función sencilla para verificar si el apartamento o la placa ya están repetidos
function esRepetido(apto, placa) {
    // Revisa si el apartamento ya existe dentro de aptosUsados
    if (aptosUsados.includes(apto)) {
        // Muestra un mensaje indicando que el apartamento ya fue registrado
        resultado.textContent = "Este apartamento ya participó en el sorteo: " + apto
        // Devuelve true para avisar que está repetido
        return true
    }
    // Revisa si la placa ya existe dentro de placasUsadas
    if (placasUsadas.includes(placa)) {
        // Muestra un mensaje indicando que la placa ya fue registrada
        resultado.textContent = "Esta placa ya participó en el sorteo: " + placa
        // Devuelve true para avisar que está repetido
        return true
    }
    // Devuelve false si ni el apartamento ni la placa están repetidos
    return false
}

// Define la función principal que ejecuta el sorteo recibiendo el apartamento y la placa
function sortearParqueadero(apto, placa) {
    // Llama a esRepetido y detiene la función si alguno de los dos ya se usó
    if (esRepetido(apto, placa)) {
        // Sale de la función sin realizar el sorteo
        return
    }
    // Guarda el apartamento en la lista de apartamentos usados
    aptosUsados.push(apto)
    // Guarda la placa en la lista de placas usadas
    placasUsadas.push(placa)
    // Define la cantidad total de parqueaderos disponibles en el conjunto
    const totalParqueaderos = 20
    // Define la cantidad total de carros que participan en el sorteo
    const totalCarros = 100
    // Genera un número aleatorio entre 1 y 100 usando Math.random() y Math.floor()
    const numeroSorteo = Math.floor(Math.random() * totalCarros) + 1
    // Imprime en la consola del navegador el apartamento, la placa y el número sorteado
    console.log(apto, placa, numeroSorteo)
    // Evalúa si el número sorteado está dentro de los 20 cupos disponibles
    if (numeroSorteo <= totalParqueaderos) {
        // Muestra en pantalla que se asignó un parqueadero indicando apartamento y placa
        resultado.textContent = "Parqueadero ASIGNADO para el " + apto + " - Placa: " + placa
    } else {
        // Muestra en pantalla que no se asignó parqueadero en este sorteo indicando apartamento y placa
        resultado.textContent = "Parqueadero NO ASIGNADO para el " + apto + " - Placa: " + placa
    }
}

// Escucha el clic en el botón de sortear y ejecuta una función anónima con los valores ingresados
botonSortear.addEventListener("click", function() {
    // Toma el texto escrito en el campo apartamento y el campo placa y llama a sortearParqueadero
    sortearParqueadero(campoApto.value, campoPlaca.value)
})