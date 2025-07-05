const LANG = {
    cmd: {
        warn: 'Do not copy or edit anything in DevTools uless this action is authorized by the developer',
        eval: 'This is evaluation build, this build is intented to test and fix features and fixes before release.',
        dev: 'This is dev build, all you do here is unrelated to evaluation or release build.',
        erorrs: {
            NOLINK: 'Does not have link assigned'
        }
    },
    header: {
        main: 'Main',
        settings: 'Settings',
        upload: 'Upload',
        fileManager: 'File manager',
        postMaster: 'PostMaster',
        userCard: {
            login: 'Login',
            register: 'Register'
        }
    },
    login: {
        mainLabel: 'Login',
        fields: {
            username: 'Username',
            password: 'Password',
            keepmeloggedin: 'Keep me logged in'
        },
        errors: {
            wrongUsername: 'Wrong username',
            wrondPassword: 'Wrong password'
        },
        success: [
            'Logged in as',
            'Success'
        ]
    },
    register: {
        label: 'Register',
        username: {
            label: 'Username',
            error: {
                usernameRequired: 'Username required',
                min: 'Min',
                max: 'Max',
                char: 'characters',
                lowecase: 'Only lowecase',
                restrictedSymbol: 'Restricted symbol',
                taken: 'Taken'
            }
        },
        passFirst: {
            label: 'Password',
            error: {
                min: 'Need at least',
                char: 'characters',
                characters: 'Need letters',
                uppercase: 'Need uppercase symbol',
                numbers: 'Need numbers',
                restrictedSymbols: 'Restricted symbols'
            }
        },
        passSecond: {
            label: 'Repeat password',
            error: {
                notMatch: 'Passwords should match'
            }
        },
        rememberMe: {
            label: 'Remember me'
        },
        autologin: {
            label: 'Login after register'
        },
        error: {
            fixForm: 'Fix errors in register form',
            title: 'Register error',
            message: 'Please fix the errors in the form and try again.'
        },
        success: [
            'Profile registered',
            'Success'
        ]
    },
    fileManager: {
        noFilesLabel: 'You have no files uploaded'
    },
    main: {
        welcome: 'Welcome to',
    },
    postView: {
        hiddenLabel: 'This post is not visible',
        tagsLabel: 'Tags:',
        errors: {
            noAccess: 'You do not have access to this post',
            default: 'Error loading post data'
        },
        file: {
            size: 'File size',
            type: 'File type',
            uploadedBy: 'Uploaded by',
            linkedToPost: 'Post',
            resolution: 'Resolution',
            uploadedOn: 'Uploaded on',
            resolution: 'Resolution',
            size: 'Size'
        },
        rating: 'Rating'
    },
    profile: {
        noUsername: 'No username specified in page route',
        noProfile: 'Profile not found',
        regsitered: 'Registered on',
        latestPosts: 'Latest posts'
    },
    upload: {
        groupUpload: 'Upload all',
    },
    postMaster: {
        newPost: 'New post',
    },
    settings: {
        label: 'Settings',
        typeSwitch: {
            webpage: 'Webpage',
            user: 'User',
            placeholder: 'Select type',
        },
        webpage: {
            language: {
                ENG: 'English'
            }
        },
        user: {
            logout: 'Log out from',
            selectAvatar: 'Select avatar',
            selectBtn: 'Select',
            removeAvatar: 'Remove avatar',
            removeAvatarAlert: 'Are you sure you want to remove your avatar?',
            loggedOut: [
                'Logged out from',
                'successfully'
            ]
        }
    },
    components: {
        upload: {
            field: 'Click or drag your files here',
            errors: {
                file: "File",
                unsupportedType: 'has unsupported type',
                tooLarge: 'is too large',
                maxSize: 'Max size',
            }
        }
    },
    elements: {
        fileCard: {
            fnameNotBeSaved: 'Filename will not be saved on server',
            fsize: 'File size',
            ftype: 'File type',
            segment: [
                'Segment',
                'Weight'
            ],
            linked: {
                label: 'Linked to',
                to: {
                    post: 'post',
                    pfavatar: 'avatar'
                }
            },
            delete: {
                buttonLabel: 'Remove file',
                alert: 'Removed file'
            }
        },
        postCard: {
            rating: {
                safe: 'Safe',
                questionable: 'Questionable',
                mature: 'Mature'
            },
            editButtons: {
                visible: 'Visible',
                remove: 'Remove',
                edit: 'Edit',
                successRM: [
                    'Post',
                    'removed'
                ]
            }
        },
        postMaker: {
            postName: 'Post name',
            postDesc: 'Post description',
            postType: 'Post type',
            postRating: 'Post rating',
            filesList: 'Files list',
            noFiles: 'No files selected',
            createPost: 'Create post',
            editPost: 'Edit post',
            successCreate: [
                'Post',
                'created successfully'
            ],
            successEdit: [
                'Post',
                'edited successfully'
            ]
        }
    },
    features: {
        alert: {
            confirm: {
                confirmButton: 'Yes',
                cancelButton: 'No'
            }
        }
    }
}

export default LANG
