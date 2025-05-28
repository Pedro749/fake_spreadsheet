let contador = 1;
const pessoas = [];

function changeType() {
    const typeInput = document.getElementById("plan_type");
    const typeHeader = document.getElementById("type_table");
    const plan_type = typeInput.value;

    typeHeader.innerHTML = plan_type == "month" ? "Mês" : "Semana | Dia";
    clean();
}

function clean() {
    const tbody = document.getElementById("table_participant").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    pessoas = [];
    contador = 1;

    atualizarTabela();
}

function changeTitle(element) {
    const tableTitle = document.getElementById("table_title");
    tableTitle.innerHTML = element.value.trim();
}

function currencyToFloat(valor) {
    return parseFloat(valor.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
}

function floatToCurrency(valor) {
    return (
        "R$ " +
        valor
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    );
}

function monthInPortugues(dataInput, monthAdd) {
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    const data = new Date(dataInput);

    data.setMonth(data.getMonth() + monthAdd);

    return meses[data.getMonth()];
}

function sumDaysFormated(dataStr, daysAdd = 0) {
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    const data = new Date(dataStr);
    data.setDate(data.getDate() + daysAdd);

    const dia = data.getDate();
    const mesNome = meses[data.getMonth()];

    return `${dia} de ${mesNome}`;
}

function changeObs(element) {
    const tableTitle = document.getElementById("table_obs");
    tableTitle.innerHTML = element.value.trim();
}

function maskReal(elemento) {
    let valor = elemento.value.replace(/\D/g, "");
    if (!valor) {
        elemento.value = "R$ 0,00";
        return;
    }

    valor = (parseInt(valor, 10) / 100).toFixed(2);
    valor = valor.toString().replace(".", ",");
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    elemento.value = "R$ " + valor;
}

function validate() {
    const typeInput = document.getElementById("plan_type");
    const type = typeInput.value.trim();

    if (type === "") {
        alert("Por favor, Selecione um tipo.");
        return;
    }

    const valueInput = document.getElementById("plan_value");
    const value = valueInput.value.trim();

    if (value === "") {
        alert("Por favor, digite um valor.");
        return;
    }

    const acrescInput = document.getElementById("plan_acresc");
    const acresc = acrescInput.value.trim();

    if (acresc === "") {
        alert("Por favor, digite um acréscimo.");
        return;
    }

    const dateInput = document.getElementById("plan_init");
    const date = dateInput.value.trim();

    if (date === "") {
        alert("Por favor, selecione uma data.");
        return;
    }

    const nameInput = document.getElementById("plan_participant");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Por favor, digite um nome.");
        return;
    }

    return {
        name,
        type,
        value,
        acresc,
        date,
    };
}

function atualizarTabela() {
    const tbody = document.getElementById("table_participant").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    const totalPessoas = pessoas.length;

    pessoas.forEach((pessoa, index) => {
        const linha = tbody.insertRow();

        const cellNome = linha.insertCell(0);
        const cellMes = linha.insertCell(1);
        const cellValor = linha.insertCell(2);
        const cellTotal = linha.insertCell(3);

        const valor = calcularValor(pessoa, totalPessoas);
        const total = calcularTotal(pessoa, totalPessoas);
        const period = calcularPeriodo(pessoa);

        cellNome.textContent = pessoa.name;
        cellMes.textContent = period;
        cellValor.textContent = valor;
        cellTotal.textContent = total;
    });
}

function calcularValor(data) {
    const valor = currencyToFloat(data.valor) + currencyToFloat(data.acresc) * data.position;

    return floatToCurrency(valor);
}

function calcularTotal(data, qtdPessoas) {
    const valor = currencyToFloat(data.valor) + currencyToFloat(data.acresc) * data.position;

    const total = valor * qtdPessoas;

    return floatToCurrency(total - valor);
}

function calcularPeriodo(data) {
    const postion = data.position - 1;

    if (data.type == "month") {
        return monthInPortugues(data.date, postion);
    } else {
        return postion + 1 + "  |  " + sumDaysFormated(data.date, postion * 7 + 1);
    }
}

function addParticipant() {
    const data = validate();

    if (!data) return;

    pessoas.push({
        name: data.name,
        position: contador,
        valor: data.value,
        acresc: data.acresc,
        type: data.type,
        date: data.date,
    });

    const nameInput = document.getElementById("plan_participant");
    nameInput.value = "";
    nameInput.focus();

    atualizarTabela();
    aplicarEstiloStripedManualmente();

    contador++;
}

function makeImage() {
    const section = document.getElementById('print_plan');
    const preview = document.getElementById('previewContainer');

    preview.innerHTML = section.innerHTML;

    preview.style.fontFamily = window.getComputedStyle(section).fontFamily;
    preview.style.backgroundColor = window.getComputedStyle(section).backgroundColor;
    preview.style.padding = window.getComputedStyle(section).padding;

    html2canvas(preview, { scale: 2 }).then(canvas => {
    const link = document.createElement('a');
        link.download = "consorcio.jpg";
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    });
}

function aplicarEstiloStripedManualmente() {
  const linhas = document.querySelectorAll('table tbody tr');

  linhas.forEach((linha, index) => {
    linha.style.backgroundColor = index % 2 === 0 ? '#eee' : '#a4c2f4'; // ou a cor do Bootstrap
  });
}