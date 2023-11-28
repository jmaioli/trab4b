//https://symbl.cc/en/
//https://getbootstrap.com/docs/5.3/getting-started/introduction/
//

const frm = document.querySelector("form");
const respCalculo = document.querySelector("#outCalculos");
const respBaseIR = document.querySelector('#outBasedeCalculo');

const previdencia = Number(frm.vPrevidencia.value);

// Checagem do INSS (checkbox)

frm.vPrevidencia.disabled = true;

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

const inssCheckbox = document.getElementById("checaInss");

inssCheckbox.addEventListener("change", function() {
    if (inssCheckbox.checked) {
      alert("Dessa forma será calculado INSS automaticamente!");
      frm.vPrevidencia.disabled = true;

    } else {
      alert("Se desmarcado, é necessário inserir a PREVIDÊNCIA MANUALMENTE no campo!");
      frm.vPrevidencia.disabled = false;
    }
})
 
frm.addEventListener("submit", (e) => {
    e.preventDefault();

// tive que converter de volta para ignorar os caracteres no rendaMensal para que o sistema entenda que se trata de um número.

let converte = frm.rendimentos.value;
converte = converte.replace('R$','');
converte = converte.replace('.','');
converte = converte.replace(',','.');

const rendaMensal = parseFloat(converte);

//calculo INSS

inss = rendaMensal;
let prevFinal = 0;
let inss1 = 0;
let inss2 = 0;
let inss3 = 0;
let inss4 = 0;

if (inss > 0 && inss <= 1320) {
  inss1 = (inss * 0.075); 
}
else if (inss > 1320.01 && inss <= 2571.29) {
  inss1 = 1320 * 0.075; 
  inss2 = (inss-1320) * 0.09; 
}
else if (inss > 2571.30 && inss <= 3856.94) {
  inss1 = 1320 * 0.075; // 99,00
  inss2 = (2571.30 - 1320) * 0.09; //112,6161
  inss3 = (inss - 3856.94) * 0.12; // R$ 132,67
}
else if (inss > 3856.95 && inss <= 7507.49) {
  inss1 = 1320 * 0.075; // R$ 99,00
  inss2 = (2571.29 - 1320) * 0.09; //112,6161
  inss3 = (3856.95 - 2571.29) * 0.12; // R$ 154,27
  inss4 = (inss - 3856.95) * 0.14; //440,027
}
else if (inss > 7507.49) {
  inss4 = 825.82; //TETO
}
   

//prevFinal = inss1 + inss2 + inss3 + inss4;

if (inssCheckbox.checked) {
  prevFinal = inss1 + inss2 + inss3 + inss4;
  frm.vPrevidencia.value = prevFinal.toFixed(2)
}
else{
  prevFinal = frm.vPrevidencia.value;
}


//alert(inss1 + " e " + inss2 + " e " + inss3 + " e " + inss4)

//frm.vPrevidencia.value = "";
valorPorDependente = 189.59;

// aqui começa os calculos do IMPOSTO


// Deduções: analisar se a dedução simplificada é maior que previdência, deduzir dependentes
const numDependentes = Number(frm.qDependentes.value);

atual = rendaMensal - ((528 > prevFinal) ? 528 : prevFinal) - (numDependentes * valorPorDependente);
let imposto = 0;
let faixa1 = 0;
let faixa2 = 0;
let faixa3 = 0;
let faixa4 = 0;
let faixa5 = 0;

if (atual <= 2112){
  faixa1 = 0;
}
else if (atual > 2112 && atual <= 2826.65) {
  faixa2 = (atual * 0.075) - 158.40;
}
else if (atual > 2826.66 && atual <= 3751.05) {
  faixa2 = (2826.65 * 0.075) - 158.40;
  faixa3 = ((atual-2826.65) * 0.15) 
}
else if (atual > 3751.06 && atual <= 4664.68) {
  faixa2 = (2826.65 * 0.075) - 158.40;
  faixa3 = ((3751.05 * 0.15) - 370.40) - faixa2
  faixa4 = ((atual-3751.05) * 0.225)
}
else if (atual > 4664.69 && atual < Infinity) {
  faixa2 = (2826.65 * 0.075) - 158.40;
  faixa3 = ((3751.05 * 0.15) - 370.40) - faixa2; 
  faixa4 = ((4664.68 * 0.225 - 651.73) - faixa2) - faixa3;
  faixa5 = ((atual - 4664.68) * 0.275)
}

imposto = faixa1 + faixa2 + faixa3 + faixa4 + faixa5;

respBaseIR.innerText = `Base de Calculo: ${formatarMoeda(atual)} >>> Dependentes IR: ${numDependentes} -(${numDependentes * valorPorDependente})
 Faixa 1 = ${formatarMoeda(faixa1)} - Faixa 2 = ${formatarMoeda(faixa2)} - Faixa 3 = ${formatarMoeda(faixa3)}
  Faixa 4 = ${formatarMoeda(faixa4)} -  Faixa 5 = ${formatarMoeda(faixa5)}`
 respCalculo.innerText = `O Valor de Imposto é: ${formatarMoeda(imposto)} *** INSS: ${formatarMoeda(prevFinal)} ` ;

 


// abaixo encontra-se o Evento de checkBOX

 
})

//use estes 2 script no HTML para chamar a função de mascara do dinheiro no INPUT
//<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
//<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-maskmoney/3.0.2/jquery.maskMoney.min.js"></script>

$(document).ready(function() {
  $('#rendimentos').maskMoney({
    prefix: 'R$ ',      // Prefixo exibido (R$)
    allowNegative: false,  // Impede valores negativos
    thousands: '.',      // Separador de milhares
    decimal: ',',        // Separador decimal
    affixesStay: false,  // Não permite que o prefixo/sufixo se movam
  });
});


document.getElementById("btnemail").addEventListener("click", validarEmail);

function validarEmail() {
  var emailInput = document.getElementById("email");
  var email = emailInput.value;

  // Expressão regular para validar o formato de e-mail
  var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (regexEmail.test(email)) {
    alert("Obrigado por se inscrever!!! \n Em breve receberá informações!");

  } else {
    alert("Formato de email inválido. Por favor, insira um email válido.");
  }
}




