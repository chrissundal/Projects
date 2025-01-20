function goToLogin() {
    Model.app.currentPage = Model.app.currentPages[0];
    Model.currentUser = null;
    updateView();
}

async function checklogin() {
    try {
        let login = {
            UserName: Model.input.login.username, 
            PassWord: Model.input.login.password
        }
        let response = await axios.post('/login', login);
            Model.currentUser = response.data;
            if (Model.currentUser.isBanned) {
                goToBanned();
                Model.currentUser = null;
            } else if (Model.currentUser.isDeleted){
                displayErrorMessage("Bruker er slettet")
                Model.currentUser = null;
            } else {
                displayWelcomeMessage(`Velkommen ${Model.currentUser.firstName}`);
                clearLoginInputs()
                await goToStore();
            }
    } catch (error) {
        clearLoginInputs()
        displayErrorMessage("Ugyldig passord eller brukernavn")
    }
}
function clearLoginInputs() {
    Model.input.login.username = '';
    Model.input.login.password = '';
}