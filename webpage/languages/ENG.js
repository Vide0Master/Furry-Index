const lang = {
    cmd: {
        warn: "Do not copy or edit anything in DevTools uless this action is authorized by the developer",
        eval: "This is evaluation build, this build is intented to test and fix features and fixes before release.",
        dev: "This is dev build, all you do here is unrelated to evaluation or release build.",
        erorrs: {
            NOLINK: "Does not have link assigned"
        }
    },
    header: {
        main: "Main",
        settings: "Settings",
        upload: "Upload",
        fileManager: "File manager",
        postMaster: "PostMaster",
        userCard: {
            login: "Login",
            register: "Register"
        }
    },
    login: {
        mainLabel: "Login",
        fields: {
            username: "Username",
            password: "Password",
            keepmeloggedin: "Keep me logged in"
        },
        errors:{
            wrongUsername:"Wrong username",
            wrondPassword:"Wrong password"
        },
        success:[
            "Logged in as",
            "Success"
        ]
    },
    register: {
        label: "Register",
        username: {
            label: "Username",
            error: {
                usernameRequired: "Username required",
                min: 'Min',
                max: "Max",
                char: "characters",
                lowecase: "Only lowecase",
                restrictedSymbol: "Restricted symbol",
                taken: "Taken"
            }
        },
        passFirst: {
            label: "Password"
        }
    },
    fileManager: {
        noFilesLabel: "You have no files uploaded"
    },
    components: {
        upload: {
            field: "Click or drag your files here"
        }
    }
}

export default lang
