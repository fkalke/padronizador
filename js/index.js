const projectsList = [];
let projectId = 1;

(function () {
    showProjects();
    VMasker(document.getElementById("process")).maskPattern('999999/9999');
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
        divScript.style.display = "flex";
        document.getElementById("scriptName").value = "";
        document.getElementById("scriptType").value = 0;
    } else {
        divScript.style.display = "none";
        document.getElementById("scriptName").value = "";
        document.getElementById("scriptType").value = 0;
    }
});


function clearFields() {
    document.getElementById("projectName").value = "";
    document.getElementById("tester").options[0].selected = true
    document.getElementById("wasCodeChange").checked = false;
    document.getElementById("hasScript").checked = false;
    document.getElementById("scriptType").value = 0;
    document.getElementById("changedScreen").value = "";
    document.getElementById("process").value = "";
    document.getElementById("scriptName").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("divProject").style.display = 'none';
    document.getElementById("divScript").style.display = 'none';
}

function generate() {
    var process = document.getElementById("process").value;
    var tester = document.getElementById("tester");
    var wasCodeChange = document.getElementById("wasCodeChange").checked;
    var isRework = document.getElementById("isRework").checked;
    var hasScript = document.getElementById("hasScript").checked;
    var scriptType = document.getElementById("scriptType").value;
    var scriptName = document.getElementById("scriptName").value;
    var title = document.getElementById("title").value.replaceAll('"', '&quot;');;
    var description = document.getElementById("description").value;

    var testerValue = tester.value;
    if(testerValue === 'Selecione...'){
        openErrorToast('Você precisa informar o responsável pelo teste.');
        tester.focus();
        return;
    }

    var changeMessage;

    var commitMessage;


    var scriptNameLabel;
    if (scriptType == 1) {
        scriptNameLabel = "Nome do SCRIPT";
    } else if (scriptType == 2) {
        scriptNameLabel = "Nome da FUNÇÃO";
    } else {
        scriptNameLabel = "";
    }

    var scriptCommitedMessage;

    if (hasScript) {
        scriptCommitedMessage = "Sim";
    } else {
        scriptNameLabel = "Nome do SCRIPT";
        scriptCommitedMessage = "Não há Script";
        scriptName = "Não há Script";
    }

    function buildCommitMessage(){
        if ((wasCodeChange || hasScript) && isRework) {
            commitMessage = `${process} - ${testerValue} - RETRABALHO - ${changeMessage} - ${title}`;
        } else if ((wasCodeChange || hasScript) && !isRework) {
            commitMessage = `${process} - ${testerValue} - ${changeMessage} - ${title}`;
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
                <label for="commitMessageAreaItem${i}" class="form-label text-secondary">Commit em ${projectsList[i].getProject()}</label>
                <input type="text" value="${commitMessage}" class="form-control" id="commitMessageAreaItem${i}" readonly>
                <button type="button" class="btn btn-sm btn-primary mt-2" onclick="copyCommitMessageItem(${i})"><i class="bi bi-clipboard"> </i>Copiar</button>
            </div>`;

            processDetail += `\n${projectsList[i].getProject()}: ${commitMessage}`;

        }
    } else if (!wasCodeChange && hasScript) {
        buildCommitMessage();
        commitMessagesArea += `
            <div class="mb-3">
                <label for="commitMessageAreaItem99" class="form-label text-secondary">Commit em cpe-jdk-scripts</label>
                <input type="text" value="${commitMessage}" class="form-control" id="commitMessageAreaItem99" readonly>
                <button type="button" class="btn btn-sm btn-primary mt-2" onclick="copyCommitMessageItem(99)"><i class="bi bi-clipboard"> </i>Copiar</button>
            </div>`;
            processDetail += `\n${commitMessage}`;
    } else {
        commitMessagesArea += `<p class="text-secondary">Não houve alterações</p>`;
        processDetail += `\nNão houve alterações`;
    }

    processDetail += `\n\n${scriptNameLabel}: \n${scriptName} \n\nResumo das alterações: \n${description}`;

    document.getElementById("commitMessageArea").innerHTML = commitMessagesArea;
    document.getElementById("processDetailArea").innerHTML = processDetail;

    if (validateFields()) {
        $("#resultModal").modal("show");
    }
}


function copyCommitMessageItem(itemId) {
    var commitMessage = document.getElementById("commitMessageAreaItem" + itemId);
    navigator.clipboard.writeText(commitMessage.value);
    openSuccessToast('Mensagem de commit copiada com sucesso!');
}

function validateFields() {
    return true;
}

var btnCopyProcessDetail = document.getElementById("copyProcessDetail");
btnCopyProcessDetail.addEventListener('click', (e) => {
    e.preventDefault();
    var processDetail = document.getElementById("processDetailArea");
    navigator.clipboard.writeText(processDetail.value);
    openSuccessToast('Detalhamento copiado com sucesso!');

});

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
            <div class="border rounded mb-2 p-2 d-flex justify-content-between">
                <div class="m-0 p-0 d-flex">
                    <p class="text-center m-0 p-0">${projectsList[i].getProject()}</p>
                    <span>&nbsp;|&nbsp;</span>
                    <p class="text-center m-0 p-0">${projectsList[i].getScreen()}</p>
                </div>
                <div class="m-0 p-0 text-danger">
                    <div class="m-0 p-0 exclude-project" onclick="deleteProjectFromList(${projectsList[i].getId()})"><i class="bi bi-trash3"></i></div>
                </div>
            </div>
            `;
        }
    } else {
        projectAreaHtml += `
        <div class="border rounded mb-2 p-2">
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