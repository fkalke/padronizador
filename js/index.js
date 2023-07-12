(function() {
    VMasker(document.getElementById("process")).maskPattern('999999/9999');
})();

var projectCheck = document.getElementById("wasCodeChange");
var divProject = document.getElementById("divProject");

projectCheck.addEventListener("change", function() {
  if (this.checked) {
    divProject.style.display = "flex";
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

scriptCheck.addEventListener("change", function() {
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


function clearFields(){
    document.getElementById("projectName").value = "";
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

function generate(){
    var process = document.getElementById("process").value;
    var wasCodeChange = document.getElementById("wasCodeChange").checked;
    var projectName = document.getElementById("projectName").value;
    var changedScreen = document.getElementById("changedScreen").value;
    var hasScript = document.getElementById("hasScript").checked;
    var scriptType = document.getElementById("scriptType").value;    
    var scriptName = document.getElementById("scriptName").value;
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;

    var codeComittedMessage;

    if(wasCodeChange){
        codeComittedMessage = "Sim";
    }else{
        codeComittedMessage = "Sem alterações";
        projectName = "Sem alterações";
    }

    var changeMessage;
    if(wasCodeChange){
        changeMessage = changedScreen;
    }else if(hasScript) {
        changeMessage = scriptName;
    }else{
        changeMessage = "Sem Alt. Tela/Script";
    }

    var commitMessage;
    if(wasCodeChange || hasScript){
        commitMessage = `${process} - ${changeMessage} - ${title}`;
    }else{
        commitMessage = "Não há nada para comitar"
    }

    var scriptCommitedLabel;
    var scriptNameLabel;
    if(scriptType == 1){
        scriptCommitedLabel = "SCRIPT Commitado";
        scriptNameLabel = "Nome do SCRIPT";
    }else if(scriptType == 2){
        scriptCommitedLabel = "FUNÇÃO Commitada";
        scriptNameLabel = "Nome da FUNÇÃO";
    }else{
        scriptCommitedLabel = "";
        scriptNameLabel = "";
    }

    var scriptCommitedMessage;

    if(hasScript){
        scriptCommitedMessage = "Sim";
    }else{
        scriptCommitedLabel = "SCRIPT Commitado";
        scriptNameLabel = "Nome do SCRIPT";
        scriptCommitedMessage = "Não há Script";
        scriptName = "Não há Script";
    }

    const processDetail = `Projeto do GIT = ${projectName} \nCódigo Commitado = ${codeComittedMessage} \n${scriptCommitedLabel} = ${scriptCommitedMessage} \n${scriptNameLabel} = ${scriptName} \nResumo das alterações= ${description}`;

    document.getElementById("commitMessageArea").value = commitMessage;
    document.getElementById("processDetailArea").innerHTML = processDetail;

    if(validateFields()){
        $("#resultModal").modal("show");
    }
}


function validateFields(){
    return true;
}

var btnCopyCommitMessage = document.getElementById("copyCommitMessage");
btnCopyCommitMessage.addEventListener('click', (e) => {
    e.preventDefault();
    var commitMessage = document.getElementById("commitMessageArea");
    navigator.clipboard.writeText(commitMessage.value);    
    openSuccessToast('Mensagem de commit copiada com sucesso!');
});

var btnCopyProcessDetail = document.getElementById("copyProcessDetail");
btnCopyProcessDetail.addEventListener('click', (e) => {
    e.preventDefault();
    var processDetail = document.getElementById("processDetailArea");
    navigator.clipboard.writeText(processDetail.value);    
    openSuccessToast('Detalhamento copiado com sucesso!');
    
});

function openSuccessToast(message){
    var messageElement = document.getElementById('successToastMessage');
    messageElement.innerHTML = message;
    $("#successToast").toast("show");
}