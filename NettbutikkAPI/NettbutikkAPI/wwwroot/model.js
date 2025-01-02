let Model = {
    app: {
        category: [
            "Mat",
            "Drikke",
            "Klær",
            "Kontor",
            "Leker",
            "Sport",
            "Diverse",
            "Alle"
        ],
        dropdown: {
            isOpen: false,
            isAdding: false,
            isAddEmployee: false,
            editMode: ''
        },
        html: {
            productHtml: '',
            storeItems: '',
            categoryText: '',
            quantity: ''
        },
        currentPages: [
            "Login",
            "Employee",
            "Store",
            "Profile",
            "Register"
        ],
        currentPage: "Profile"
    },
    input: {
        errorMessage: '',
        inputQty: 0,
        inputName: '',
        inputPrice: 0,
        inputCategory: '',
        inputStock: 0,
        inputImage: '',
        ShoppingCartCounter: 0,
        totalPrice: 0,
        register: {
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            address: '',
            city: '',
            repeatpassword: '',
        },
        login: {
            username: '',
            password: '',
        },
        productItems: []
    },
    orders: [],
    currentUser: {
        firstName: "Chris",
        lastName: "Jacobsen",
        userName: "c",
        passWord: "1",
        address: "Svingen 2",
        city: "Larvik",
        id: 0,
        myCart: [],
        isEmployee: true,
        isAdmin: true
    }
}