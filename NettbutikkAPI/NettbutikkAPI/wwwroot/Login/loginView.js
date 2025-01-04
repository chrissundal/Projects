function updateLoginView() {
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="loginContainer">
        <div class="login">
        <img class="logo" src="IMG/prisparadis.png" height="100px" alt=""/>
            <input type="text" placeholder="skriv inn brukernavn..." oninput="Model.input.login.username=this.value"/>
            <input type="text" placeholder="skriv inn passord..." oninput="Model.input.login.password=this.value"/>
            ${Model.input.errorMessage}
            <button onclick="checklogin()">Logg inn</button>
            <div>ikke medlem?</div>
            <button onclick="goToRegister()">Registrer</button>
        </div>
    </div>
    `;
}

