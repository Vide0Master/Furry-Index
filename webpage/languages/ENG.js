const LANG = {
    cmd: {
        warn: "Do not copy or edit anything in DevTools uless this action is authorized by the developer.",
        eval: "This is evaluation build, this build is intented to test and fix features and fixes before release.",
        dev: "This is dev build, all you do here is unrelated to evaluation or release build.",
        erorrs: {
            NOLINK: "Does not have link assigned"
        }
    },
    BUILD: {
        dev: "DEVELOPMENT BUILD",
        eval: "EVALUATION BUILD",
        sdb: "SEPARATE DATABASE PROVIDED"
    },
    header: {
        main: "Main",
        search: "Search",
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
        errors: {
            wrongUsername: "Wrong username",
            wrondPassword: "Wrong password"
        },
        success: [
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
                min: "Min",
                max: "Max",
                char: "characters",
                lowecase: "Only lowecase",
                restrictedSymbol: "Restricted symbol",
                taken: "Taken"
            }
        },
        passFirst: {
            label: "Password",
            error: {
                min: "Need at least",
                char: "characters",
                characters: "Need letters",
                uppercase: "Need uppercase symbol",
                numbers: "Need numbers",
                restrictedSymbols: "Restricted symbols"
            }
        },
        passSecond: {
            label: "Repeat password",
            error: {
                notMatch: "Passwords should match"
            }
        },
        rememberMe: {
            label: "Remember me"
        },
        autologin: {
            label: "Login after register"
        },
        error: {
            fixForm: "Fix errors in register form",
            title: "Register error",
            message: "Please fix the errors in the form and try again."
        },
        success: [
            "Profile registered",
            "Success"
        ]
    },
    fileManager: {
        noFilesLabel: "You have no files uploaded"
    },
    main: {
        welcome: "Welcome to",
        featured: "Featured posts",
    },
    postView: {
        hiddenLabel: "This post is not visible",
        errors: {
            noAccess: "You do not have access to this post",
            default: "Error loading post data"
        },
        file: {
            size: "Size",
            type: "Type",
            uploadedBy: "Uploaded by",
            linkedToPost: "Post",
            resolution: "Resolution",
            uploadedOn: "Uploaded on",
        },
        rating: "Rating"
    },
    profile: {
        noUsername: "No username specified in page route",
        noProfile: "Profile not found",
        regsitered: "Registered on",
        latestPosts: "Latest posts"
    },
    upload: {
        groupUpload: "Upload all",
    },
    postMaster: {
        newPost: "Create",
    },
    settings: {
        label: "Settings",
        typeSwitch: {
            webpage: "Webpage",
            user: "User",
            placeholder: "Select type",
        },
        webpage: {
            language: {
                label: "Language",
                ENG: "English",
                UA: "Ukrainian",
                RU: "russian"
            }
        },
        user: {
            logout: "Log out from",
            selectAvatar: "Select avatar",
            selectBtn: "Select",
            removeAvatar: "Remove avatar",
            removeAvatarAlert: "Are you sure you want to remove your avatar?",
            noAvatarFiles: "No files for avatar found",
            uploadFile: "Upload new file",
            loggedOut: [
                "Logged out from",
                "successfully"
            ],
            visibleName: {
                label: "Visible name",
                setBtn: "Set",
                rmBtn: "Remove",
                result: {
                    setsucc: "Successfully set visible name",
                    rmsucc: "Successfully removed visible name",
                }
            }
        }
    },
    components: {
        upload: {
            field: "Click or drag your files here",
            errors: {
                file: "File",
                unsupportedType: "has unsupported type",
                tooLarge: "is too large",
                maxSize: "Max size",
            }
        }
    },
    elements: {
        fileCard: {
            fnameNotBeSaved: "Filename will not be saved on server",
            fsize: "File size",
            ftype: "File type",
            segment: [
                "Segment",
                "Weight"
            ],
            linked: {
                label: "Linked to",
                to: {
                    post: "post",
                    pfavatar: "avatar"
                }
            },
            delete: {
                buttonLabel: "Remove file",
                confirm: "Confirm",
                confirmText: [
                    "You want to delete file",
                    '?'
                ],
                alert: "Removed file"
            }
        },
        postCard: {
            rating: {
                safe: "Safe",
                questionable: "Questionable",
                mature: "Mature"
            },
            type: {
                image: 'Image',
                imageGroup: 'Image group',
                comic: 'Comic',
                video: 'Video'
            },
            editButtons: {
                visible: "Visible",
                remove: "Remove",
                edit: "Edit",
                successRM: [
                    "Post",
                    "removed"
                ]
            }
        },
        postMaker: {
            postName: "Name",
            postDesc: "Description",
            postType: "Type",
            postRating: "Rating",
            filesList: "Files list",
            noFiles: "No files selected",
            tags: "Tags",
            createPost: "Create",
            editPost: "Edit",
            successCreate: [
                "Post",
                "created successfully"
            ],
            successEdit: [
                "Post",
                "edited successfully"
            ]
        },
        search: {
            label: "Search"
        }
    },
    features: {
        alert: {
            confirm: {
                confirmButton: "Yes",
                cancelButton: "No"
            }
        }
    }
}

export default LANG
