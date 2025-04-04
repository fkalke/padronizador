const projectsList = [];
const reportsList = [];
const scriptsList = [];
let projectId = 1;
let reportId = 1;
let scriptId = 1;

var cabecalho = document.getElementById("cabecalho");
var conteudo = document.getElementById("conteudo");
var rodape = document.getElementById("rodape");

const headerFooterHeigth = cabecalho.offsetHeight + rodape.offsetHeight;

(function () {
    showProjects();
    showReports();
    showScripts();
    VMasker(document.getElementById("process")).maskPattern('999999/9999');
    conteudo.style.minHeight = `calc(100vh - ${headerFooterHeigth}px)`;
})();

var projectCheck = document.getElementById("wasCodeChange");
var divProject = document.getElementById("divProject");
var isRework = document.getElementById("isRework");

projectCheck.addEventListener("change", function () {
    if (this.checked) {
        divProject.style.display = "block";
        document.getElementById("projectName").value = "";
        document.getElementById("changedScreen").value = "";
    } else {
        divProject.style.display = "none";
        document.getElementById("projectName").value = "";
        document.getElementById("changedScreen").value = "";
    }
});

var scriptCheck = document.getElementById("hasScript");
var divScript = document.getElementById("divScript");
scriptCheck.addEventListener("change", function () {
    if (this.checked) {
        divScript.style.display = "block";
        document.getElementById("scriptName").value = "";
    } else {
        divScript.style.display = "none";
        document.getElementById("scriptName").value = "";
    }
});

var reportCheck = document.getElementById("hasReport");
var divReport = document.getElementById("divReport");
reportCheck.addEventListener("change", function () {
    if (this.checked) {
        divReport.style.display = "block";
        document.getElementById("reportUpdatedReasonField").style.display = "none";
        document.getElementById("reportName").value = "";
        document.getElementById("updated").value = 'Sim';
    } else {
        divReport.style.display = "none";
        document.getElementById("reportUpdatedReasonField").style.display = "none";
        document.getElementById("reportName").value = "";
        document.getElementById("updated").value = 'Sim';
    }
});

var updated = document.getElementById("updated");
var reportUpdatedReasonField = document.getElementById("reportUpdatedReasonField");
updated.addEventListener("change", function () {
    if (this.value == 'Não') {
        reportUpdatedReasonField.style.display = "block";
        document.getElementById("motivo").value = "";
    }else{
        reportUpdatedReasonField.style.display = "none";
        document.getElementById("motivo").value = "";
    }
});

var tester = document.getElementById("tester");
tester.addEventListener("change", function () {
    if (tester.value === 'Outro') {
        document.getElementById('divOtherTester').style.display = 'block';
    } else {
        document.getElementById('divOtherTester').style.display = 'none';
        document.getElementById('otherTesterName').value = '';
    }
});


function clearFields() {

    document.getElementById("projectName").value = "";
    document.getElementById("type").options[0].selected = true;
    document.getElementById("tester").options[0].selected = true
    document.getElementById("wasCodeChange").checked = false;
    document.getElementById("hasReport").checked = false;
    document.getElementById("hasScript").checked = false;
    document.getElementById("changedScreen").value = "";
    document.getElementById("process").value = "";
    document.getElementById("scriptName").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("divProject").style.display = 'none';
    document.getElementById("divReport").style.display = 'none';
    document.getElementById("divScript").style.display = 'none';

    document.getElementById('otherTesterName').value = "";
    document.getElementById("divOtherTester").style.display = 'none';

    projectsList.length = 0;
    document.getElementById("projectName").value = "";
    document.getElementById("changedScreen").value = "";
    showProjects();

    reportsList.length = 0;
    document.getElementById("reportName").value = "";
    document.getElementById("updated").value = "Sim";
    document.getElementById("reportUpdatedReasonField").style.display = 'none';
    document.getElementById("motivo").value = "Sim";
    showReports();

    scriptsList.length = 0;
    document.getElementById("scriptName").value = "";
    showScripts();

}

function generate() {
    var process = document.getElementById("process").value;
    var type = document.getElementById("type");
    var tester = document.getElementById("tester");
    var wasCodeChange = document.getElementById("wasCodeChange").checked;
    var isRework = document.getElementById("isRework").checked;
    var hasReport = document.getElementById("hasReport").checked;
    var hasScript = document.getElementById("hasScript").checked;
    var title = document.getElementById("title").value.replaceAll('"', '&quot;');;
    var description = document.getElementById("description").value;

    if(process == null || process.length === 0){
        openErrorToast('Você precisa informar o número do processo.');
        document.getElementById("process").focus();
        return;
    }

    var typeValue = type.value;
    if(typeValue === 'Selecione...'){
        openErrorToast('Você precisa informar o tipo.');
        type.focus();
        return;
    }

    var testerValue = tester.value;
    if(testerValue === 'Selecione...'){
        openErrorToast('Você precisa informar o responsável pelo teste.');
        tester.focus();
        return;
    }else if(testerValue === 'Outro'){
        var otherTester = document.getElementById('otherTesterName');
        var otherTesterValue = otherTester.value;
        if(otherTesterValue === ''){
            openErrorToast('Você precisa informar o nome do responsável pelo teste.');
            otherTester.focus();
            return;
        }else{
            testerValue = otherTesterValue;
        }
    }

    if(wasCodeChange && projectsList.length === 0){
        openErrorToast('Você precisa informar os projetos onde foram realizados os commits.');
        return;
    }

    if(hasReport && reportsList.length === 0){
        openErrorToast('Você precisa informar os relatórios que sofreram alterações.');
        return;
    }

    if(hasScript && scriptsList.length === 0){
        openErrorToast('Você precisa informar o nome dos scripts.');
        return;
    }

    if(title == null || title.length === 0){
        openErrorToast('Você precisa informar um título.');
        document.getElementById("title").focus();
        return;
    }

    if(description == null || description.length === 0){
        openErrorToast('Você precisa informar uma descrição das alterações.');
        document.getElementById("description").focus();
        return;
    }

    var changeMessage;

    var commitMessage;

    var scriptsDetails = "Scripts:";

    if (hasScript) {
        if (scriptsList.length > 0) {
            for (let i = 0; i < scriptsList.length; i++) {    
                scriptsDetails += `\n${scriptsList[i].getScript()}`;    
            }
        }
    } else {
        scriptsDetails += "\nNão há Scripts";
    }

    function buildCommitMessage(){
        if ((wasCodeChange || hasScript) && isRework) {
            commitMessage = `${process} - ${testerValue} - RETRABALHO - ${changeMessage} - ${typeValue} - ${title}`;
        } else if ((wasCodeChange || hasScript) && !isRework) {
            commitMessage = `${process} - ${testerValue} - ${changeMessage} - ${typeValue} - ${title}`;
        } else {
            commitMessage = "Não há nada para comitar"
        }
    }

    let processDetail = `Commits:`

    var commitMessagesArea = ``;

    if (projectsList.length > 0) {
        for (let i = 0; i < projectsList.length; i++) {

            if (wasCodeChange) {
                changeMessage = projectsList[i].getScreen();
            }
            
            buildCommitMessage();



            commitMessagesArea += `
            <div class="mb-3">
                <label for="commitMessageAreaItem${i}" class="form-label label-campo-commits-modal">Commit em ${projectsList[i].getProject()}</label>
                <input type="text" value="${commitMessage}" class="form-control campo-commits-modal" id="commitMessageAreaItem${i}" readonly>
                <button id="btnCopiarMsg${i}" type="button" class="botao-copiar" onclick="copyCommitMessageItem(${i})"><img src="./img/icone-copiar.svg" class="me-2">Copiar</button>
            </div>`;

            processDetail += `\n${projectsList[i].getProject()}: ${commitMessage}`;

        }
    } else {
        commitMessagesArea += `<p class="text-secondary">Não houve alterações</p>`;
        processDetail += `\nNão houve alterações`;
    }

    processDetail += `\n\n${scriptsDetails}`;

    var reportDetails = "\n\nRelatórios:"

    if(hasReport) {
        if(reportsList.length > 0){
            for (let i = 0; i < reportsList.length; i++) {    
                reportDetails += `\n${reportsList[i].getReport()}`;    
                if(reportsList[i].getIsUpdated() == "Não"){
                    reportDetails += ` (Não atualizado. Motivo: ${reportsList[i].getReason()})`;
                }else{
                    reportDetails += ` (Atualizado em produção)`;
                }
            }
            processDetail += reportDetails;
        }
    }

    processDetail += `\n\nResumo das alterações: \n${description}`;

    var processDetailArea = document.getElementById("processDetailArea")
    const linhasTextArea = processDetail.split('\n');
    processDetailArea.rows = linhasTextArea.length;

    document.getElementById("commitMessageArea").innerHTML = commitMessagesArea;
    processDetailArea.innerHTML = processDetail;

    if (validateFields()) {
        manipularBotaoCopiar(false, 'copyProcessDetail');
        $("#resultModal").modal("show");
    }
}

function copyCommitMessageItem(itemId) {
    var commitMessage = document.getElementById("commitMessageAreaItem" + itemId);
    navigator.clipboard.writeText(commitMessage.value);
    manipularBotaoCopiar(true, 'btnCopiarMsg' + itemId);
}

function validateFields() {
    return true;
}

var btnCopyProcessDetail = document.getElementById("copyProcessDetail");
btnCopyProcessDetail.addEventListener('click', (e) => {
    e.preventDefault();

    manipularBotaoCopiar(true, 'copyProcessDetail');

    var processDetail = document.getElementById("processDetailArea");
    navigator.clipboard.writeText(processDetail.value);

});

function manipularBotaoCopiar(isCopiado, idBotao){
    var icone = isCopiado ? './img/icone-copiado.svg' : './img/icone-copiar.svg';
    var texto = isCopiado ? 'Copiado' : 'Copiar';
    var botaoCopiar = document.getElementById(idBotao);
    botaoCopiar.innerHTML = `<img src="${icone}" class="me-2"> ${texto}`;
    botaoCopiar.className = isCopiado ? 'botao-copiado' : 'botao-copiar';
}

function openSuccessToast(message) {
    var messageElement = document.getElementById('successToastMessage');
    messageElement.innerHTML = message;
    $("#successToast").toast("show");
}

function openErrorToast(message) {
    var messageElement = document.getElementById('errorToastMessage');
    messageElement.innerHTML = message;
    $("#errorToast").toast("show");
}

function addProject() {
    var projectName = document.getElementById("projectName").value;
    var changedScreen = document.getElementById("changedScreen").value;

    if (projectName == null || projectName == undefined || projectName.length == 0) {
        var messageElement = document.getElementById('errorToastMessage');
        messageElement.innerHTML = 'O campo [Projeto] não pode ser nulo.';
        $("#errorToast").toast("show");
        return;
    }

    if (changedScreen == null || changedScreen == undefined || changedScreen.length == 0) {
        var messageElement = document.getElementById('errorToastMessage');
        messageElement.innerHTML = 'O campo [Tela Alterada] não pode ser nulo.';
        $("#errorToast").toast("show");
        return;
    }

    let project = new Project(projectId, projectName, changedScreen);
    projectId = projectId + 1;

    projectsList.push(project);

    document.getElementById("projectName").value = '';
    document.getElementById("changedScreen").value = '';

    showProjects();
}


function showProjects() {
    var projectsArea = document.getElementById('projectsArea');
    let projectAreaHtml = ``;
    if (projectsList.length > 0) {
        for (let i = 0; i < projectsList.length; i++) {
            projectAreaHtml += `
            <div class="area-projetos-adicionados-item">
                <div class="area-projetos-adicionados">
                    <p class="text-center m-0 p-0">${projectsList[i].getProject()}</p>
                    <span>&nbsp;|&nbsp;</span>
                    <p class="text-center m-0 p-0">${projectsList[i].getScreen()}</p>
                </div>
                <button class="exclude-project btn-excluir" onclick="deleteProjectFromList(${projectsList[i].getId()})"><img src="./img/btn-excluir.svg" class="me-2"/>Excluir</button>
            </div>
            `;
        }
    } else {
        projectAreaHtml += `
        <div class="area-sem-projetos">
            <p class="text-center m-0 p-0">Nenhum projeto adicionado</p>
        </div>`;
    }
    projectsArea.innerHTML = projectAreaHtml;
}

function deleteProjectFromList(projectId) {
    for (let i = 0; i < projectsList.length; i++) {
        if (projectsList[i].id === projectId) {
            projectsList.splice(i, 1);
        }
    }
    showProjects();
}

function addReport() {

    var messageElement = document.getElementById('errorToastMessage');
    var reportName = document.getElementById("reportName").value;
    var updated = document.getElementById("updated").value;
    var reason = document.getElementById("motivo").value;

    if (reportName == null || reportName == undefined || reportName.length == 0) {
        messageElement.innerHTML = 'O campo [Nome Relatório] não pode ser nulo.';
        $("#errorToast").toast("show");
        return;
    }

    if(updated == "Não" && (reason == null || reason == undefined || reason.length == 0)){
        messageElement.innerHTML = 'O campo [Motivo] não pode ser nulo.';
        $("#errorToast").toast("show");
        return;
    }

    let report = new Report(reportId, reportName, updated, reason);
    reportId = reportId + 1;

    reportsList.push(report);

    document.getElementById("reportName").value = '';
    document.getElementById("updated").value = 'Sim';
    document.getElementById("motivo").value = '';
    document.getElementById("reportUpdatedReasonField").style.display = "none";

    showReports();
}

function showReports() {
    var reportsArea = document.getElementById('reportsArea');
    let reportsAreaHtml = ``;
    if (reportsList.length > 0) {
        for (let i = 0; i < reportsList.length; i++) {
            reportsAreaHtml += `
            <div class="area-projetos-adicionados-item">
                <div class="area-projetos-adicionados">
                    <p class="text-center m-0 p-0">${reportsList[i].getReport()}</p>
                </div>
                <button class="exclude-project btn-excluir" onclick="deleteReportFromList(${reportsList[i].getId()})"><img src="./img/btn-excluir.svg" class="me-2"/>Excluir</button>
            </div>
            `;
        }
    } else {
        reportsAreaHtml += `
        <div class="area-sem-projetos">
            <p class="text-center m-0 p-0">Nenhum relatório adicionado</p>
        </div>`;
    }
    reportsArea.innerHTML = reportsAreaHtml;
}

function deleteReportFromList(reportId) {
    for (let i = 0; i < reportsList.length; i++) {
        if (reportsList[i].id === reportId) {
            reportsList.splice(i, 1);
        }
    }
    showReports();
}

function addScript() {

    var scriptName = document.getElementById("scriptName").value;

    if (scriptName == null || scriptName == undefined || scriptName.length == 0) {
        var messageElement = document.getElementById('errorToastMessage');
        messageElement.innerHTML = 'O campo [Nome] não pode ser nulo.';
        $("#errorToast").toast("show");
        return;
    }

    let script = new Script(scriptId, scriptName);
    scriptId = scriptId + 1;

    scriptsList.push(script);

    document.getElementById("scriptName").value = '';

    showScripts();
}

function showScripts() {
    var scriptsArea = document.getElementById('scriptsArea');
    let scriptsAreaHtml = ``;
    if (scriptsList.length > 0) {
        for (let i = 0; i < scriptsList.length; i++) {
            scriptsAreaHtml += `
            <div class="area-projetos-adicionados-item">
                <div class="area-projetos-adicionados">
                    <p class="text-center m-0 p-0">${scriptsList[i].getScript()}</p>
                </div>
                <button class="exclude-project btn-excluir" onclick="deleteScriptFromList(${scriptsList[i].getId()})"><img src="./img/btn-excluir.svg" class="me-2"/>Excluir</button>
            </div>
            `;
        }
    } else {
        scriptsAreaHtml += `
        <div class="area-sem-projetos">
            <p class="text-center m-0 p-0">Nenhum script adicionado</p>
        </div>`;
    }
    scriptsArea.innerHTML = scriptsAreaHtml;
}

function deleteScriptFromList(scriptId) {
    for (let i = 0; i < scriptsList.length; i++) {
        if (scriptsList[i].id === scriptId) {
            scriptsList.splice(i, 1);
        }
    }
    showScripts();
}