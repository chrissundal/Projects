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
            "Alle",
            "Salg"
        ],
        dropdown: {
            isOpen: false,
            isAdding: false,
            isAddEmployee: false,
            isEditEmployee: false,
            editMode: ''
        },
        html: {
            productHtml: '',
            storeItems: '',
            categoryText: '',
            quantity: '',
            editUser: 0
        },
        currentPages: [
            "Login",
            "Employee",
            "Store",
            "Profile",
            "Register",
            "Banned"
        ],
        currentPage: "Store"
    },
    input: {
        editUser: '',
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
    cart: [],
    currentUser: {
        firstName: "Chris",
        lastName: "Jacobsen",
        userName: "c",
        passWord: "1",
        address: "Svingen 2",
        city: "Larvik",
        id: 1,
        myCart: [],
        isEmployee: true,
        isAdmin: true,
        isBanned: false,
        isDeleted: false,
    }
}