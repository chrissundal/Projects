function goToProfile() {
    Model.app.currentPage = Model.app.currentPages[3];
    resetSort()
    updateView();
}