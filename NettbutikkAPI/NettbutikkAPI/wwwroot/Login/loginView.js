function updateLoginView() {
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="loginContainer">
        <div class="login">
        <h1>Nettbutikk</h1>
            Username:
            <input type="text" placeholder="skriv inn brukernavn..." oninput="Model.input.login.username=this.value"/>
            Password:
            <input type="text" placeholder="skriv inn passord..." oninput="Model.input.login.password=this.value"/>
            ${Model.input.errorMessage}
            <button onclick="checklogin()">Login</button>
            <div>ikke medlem?</div>
            <button onclick="goToRegister()">Sign up</button>
        </div>
    </div>
    `;
}

