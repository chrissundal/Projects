function goToBanned() {
    Model.app.currentPage = Model.app.currentPages[5];
    updateView();
}