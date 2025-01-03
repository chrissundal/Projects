function goToLogin() {
    Model.app.currentPage = Model.app.currentPages[0];
    Model.currentUser = null;
    updateView();
}

async function checklogin() {
    let username = Model.input.login.username;
    let password = Model.input.login.password;
    try {
        let response = await axios.post('/login', {UserName: username, PassWord: password});
        if (response.status === 200) {
            Model.currentUser = response.data;
            if(Model.currentUser.isBanned) {
                goToBanned();
            }
            else {
                displayWelcomeMessage(`Velkommen ${Model.currentUser.firstName}`);
                Model.input.login.username = '';
                Model.input.login.password = '';
                await goToStore();
            }
        } else {
            Model.input.errorMessage = 'Ugyldig passord eller brukernavn';
            updateView();
        }
    } catch (error) {
        console.error("Error during login:", error);
        Model.input.errorMessage = 'Failed to login';
        updateView();
    }
}