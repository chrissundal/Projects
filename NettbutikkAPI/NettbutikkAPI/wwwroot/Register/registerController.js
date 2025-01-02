function goToRegister() {
    Model.app.currentPage = Model.app.currentPages[4];
    Model.currentUser = null;
    updateView();
}

async function checkPassword() {
    if (Model.input.register.repeatpassword === Model.input.register.password) {
        displayWelcomeMessage(`Velkommen ${Model.input.register.firstname}`);
        await addUser();
        blankSignup();
        await fromSignupToStore();
    } else {
        Model.input.errorMessage = "Passordene stemmer ikke overens";
        updateView();
    }
}

function blankSignup() {
    Model.input.register.firstname = '';
    Model.input.register.lastname = '';
    Model.input.register.username = '';
    Model.input.register.password = '';
    Model.input.register.repeatpassword = '';
    Model.input.register.address = '';
    Model.input.register.city = '';
}

async function checkUserNameExist() {
    let username = Model.input.register.username;
    Model.currentUser = null;
    try {
        let response = await axios.get(`/check-username/${username}`);
        let userExists = response.data;

        if (userExists) {
            Model.input.errorMessage = "Brukernavn er tatt";
            updateView();
        } else {
            checkPassword();
        }
    } catch (error) {
        console.error("Error checking username:", error);
        Model.input.errorMessage = 'Failed to check username';
        updateView();
    }
}

async function addUser() {
    let idCount = await axios.get('/userslength');
    let idNumber = idCount.data
    let newUser = {
        firstName: Model.input.register.firstname,
        lastName: Model.input.register.lastname,
        userName: Model.input.register.username,
        passWord: Model.input.register.password,
        address: Model.input.register.address,
        city: Model.input.register.city,
        id: idNumber,
        myCart: [],
        isEmployee: false,
        isAdmin: false
    };
    Model.currentUser = idNumber;
    await axios.post('/users', newUser);
}

function cancelSignup() {
    Model.input.register.firstname = '';
    Model.input.register.lastname = '';
    Model.input.register.username = '';
    Model.input.register.password = '';
    Model.input.register.repeatpassword = '';
    Model.input.register.address = '';
    Model.input.register.city = '';
    goToLogin()
}

function displayWelcomeMessage(message) {
    Model.input.errorMessage = message;
    setTimeout(() => {
        Model.input.errorMessage = '';
        updateView();
    }, 10000);
}