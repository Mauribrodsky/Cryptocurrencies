const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}

//Crear Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
     criptomonedas.forEach(cripto => {
         const {FullName, Name} = cripto.CoinInfo;

         const option = document.createElement('option');
         option.value = Name;
         option.textContent = FullName;
         criptomonedasSelect.appendChild(option);
     })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();

    //Validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //Consultar la API con los resultados
    consultarAPI()

}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error');
    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        //Mensaje de error
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
         const respuesta = await fetch(url);
         const resultado = await respuesta.json();
         mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
    } catch (error) {
        console.log(error)
    }
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();

    const {PRICE, OPENDAY, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio actual es: <span>${PRICE}</span>`;

    const precioApertura = document.createElement('p');
    precioApertura.innerHTML = `<p>Precio de apertura: <span>${OPENDAY}</span>`;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto registrado en el día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo registrado en el día: <span>${LOWDAY}</span>`;

    const ultimas24hs = document.createElement('p');
    ultimas24hs.innerHTML = `<p>Variación en las últimas 24hs: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaAct = document.createElement('p');
    ultimaAct.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span>`;
    
    
    resultado.appendChild(precio);
    resultado.appendChild(precioApertura);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimas24hs);
    resultado.appendChild(ultimaAct);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}