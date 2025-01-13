function updateBannedView() {
    document.getElementById('app').innerHTML = /*HTML*/`
        <div class="topHeader">
            <h1>Du må virkelig ha gjort noen forbanna!</h1>
        </div>
        <img src="IMG/logoutuser.png" class="logoutButton" height=60px onclick="goToLogin()">
        <div class="banned">
            <img src="IMG/stop.png" height=600px width="600px"> 
        </div>
        <footer>
            <p>Author: Chris</p>
            <p><a href="mailto:christoffersj@hotmail.com">Kontakt oss</a></p>
        </footer>
        `;
}