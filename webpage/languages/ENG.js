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
    TOS: [
        {
            label: "Furry Index Terms of Service",
            text: "Last updated: 23.08.2025"
        },
        {
            label: "General terms",
            text: [
                "These Terms of Service (hereafter 'TOS') regulate how you (hereafter 'User') may access and use Furry Index (hereafter 'Service').",
                "By using the Service, you agree to comply with these TOS and the rules described herein.",
                "If you do not agree with the TOS, please do not use the Service.",
                "Certain rules are subject to a 'Three Strikes Rule'. Violations may result in one Strike. Upon receiving a third Strike, the User will be permanently banned from the Service."
            ]
        },
        {
            label: "Data and Cookie policy",
            text: [
                "The Service uses cookies only for essential functionality.",
                "The Service collects only data explicitly provided by the User. The only exception is session-related data.",
                "All User data is protected under privacy safeguards, excluding data that is publicly available or explicitly shared with User consent.",
                "User data is part of the Service and will not be shared with third parties."
            ]
        },
        {
            label: "Account",
            text: [
                "Some features of the Service require registering an account.",
                "By registering, the User confirms being at least 18 years of age. Accounts found to be registered with false age information will be suspended until the User turns 18.",
                "Users under 18 may use the Service only if they have disabled NSFW content in their settings.",
                "The User is solely responsible for maintaining the security of their profile and password.",
                "Any actions aimed at disrupting the stable operation of the Service will result in account removal.",
                "Account termination is available at any time, except in cases where the User has uploaded content to the Service. In such cases, termination must be arranged with Service Staff."
            ]
        },
        {
            label: "Content",
            text: [
                "Users may post content, provided it complies with the Posting Guidelines.",
                "Users retain copyright to their content but grant the Service a non-exclusive, worldwide license to display it and to make technical modifications* necessary for proper operation.",
                "Content posted on the Service is prohibited from being used for AI training.",
                "Uploaded content must be freely available or original. Content obtained from paid sources and shared without authorization will be removed.",
                "All content must be properly marked as NSFW or Safe, depending on its nature.",
                "Content that violates copyright, is illegal, spam, malicious, or graphically disturbing will be deleted."
            ]
        },
        {
            label: "Service wide restrictions",
            text: [
                "Use of the Service for illegal purposes is strictly prohibited.",
                "The Administration of the Service is required to enforce these TOS and take action against Users who violate them.",
                "Administrative actions are final and not subject to discussion. In exceptional cases, Users may file an appeal."
            ]
        },
        {
            label: "General release of liability",
            text: [
                "The Service is provided 'as is', without warranties of any kind.",
                "The Administration is not liable for outages, interruptions, or data loss.",
                "The Administration is not responsible for content created or posted by Users; responsibility rests with the User who posted it."
            ]
        },
        {
            label: "TOS updates",
            text: [
                "These TOS may be updated from time to time.",
                "When updated, Users will be notified of the changes.",
                "By continuing to use the Service after such updates, the User agrees to the revised version of the TOS."
            ]
        },
        /*{
            label: "Contacts",
            text: "All contact information can be found at the bottom of the website or on the 'Info' page"
        },*/
        {
            label: "Special mentions",
            text: [
                "* - By 'modifying user content' we mean technical adjustments such as resizing images for display optimization or re-encoding GIFs to MP4 for performance."
            ]
        }
    ],
    PP: [
        {
            "label": "Furry Index Privacy Policy",
            "text": [
                "Last updated: 23.08.2025",
                "Furry Index (\"we\", \"our\", or \"us\") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use the Furry Index Service (hereafter 'Service')."
            ]
        },
        {
            "label": "Information we collect",
            "text": [
                "Account information provided by you during registration and when completing your profile.",
                "Session data such as operating system and browser type.",
                "Content you upload to the Service.",
                "Internal statistics about your actions on the Service."
            ]
        },
        {
            "label": "How we use your information",
            "text": [
                "Providing, maintaining, and improving the Service.",
                "Internal Service analytics (you may opt out of including your data in aggregated analytics).",
                "Ensuring the security and integrity of the Service.",
                "Communicating with you regarding the Service.",
                "Complying with legal obligations."
            ]
        },
        {
            "label": "How we share your information",
            "text": [
                "All information remains the property of the User and the Service and is never sold.",
                "Data may be shared with legal authorities if required by law or legal process.",
                "Sensitive User data will not be disclosed under any circumstances, except when legally obligated."
            ]
        },
        {
            "label": "Cookies and tracking",
            "text": [
                "Cookies are used to manage User sessions and authentication within the Service.",
                "WebSockets may be used to track the User’s current page in order to deliver real-time actions or updates relevant to that session.",
                "If you block cookies, you will not be able to log in to the Service."
            ]
        },
        {
            "label": "Data security",
            "text": [
                "We use reasonable technical and organizational measures to protect your information from unauthorized access, loss, misuse, or disclosure.",
                "However, no method of transmission or storage over the internet can be guaranteed to be 100% secure."
            ]
        },
        {
            "label": "Your rights",
            "text": [
                "Request access to, update, or deletion of your personal information stored by the Service.",
                "Opt out of certain types of data processing where legally applicable.",
                "Request a copy of your personal data collected by the Service."
            ]
        },
        {
            "label": "Content and personal data",
            "text": [
                "User-generated content (such as artwork, posts, and files) uploaded to the Service is not considered personal data under this Privacy Policy.",
                "Such content is governed by the Terms of Service, including rules regarding ownership, copyright, and usage restrictions.",
                "Personal data (such as email addresses, usernames, or other identifying information) remains separate and is protected under this Privacy Policy."
            ]
        },
        {
            "label": "Children's privacy",
            "text": [
                "The Service is not intended for Users under 18 years of age.",
                "While we cannot fully prevent minors from accessing the Service, we request that Users follow the Terms of Service and use the Service responsibly and according to their age."
            ]
        },
        {
            "label": "Privacy Policy updates",
            "text": [
                "This Privacy Policy may be updated from time to time.",
                "When updates occur, Users will be notified through the Service.",
                "By continuing to use the Service after such updates, you agree to the revised version of the Privacy Policy."
            ]
        }
    ],
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
        button: "Log in",
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
                min: "Min",
                max: "Max",
                chars: "characters",
                lowecase: "Only lowecase",
                restrictedSymbol: "Special symbols",
                taken: {
                    default: 'Username should be unique',
                    ok: 'Username unique',
                    nok: 'Username is taken'
                },
                specialSymbolCheck: {
                    default: 'No special symbols',
                    ok: 'No special symbols found',
                    nok: 'Remove special symbols'
                }
            }
        },
        passFirst: {
            label: "Password",
            error: {
                min: "Min",
                max: "Max",
                chars: "characters",
                uppercase: "Need uppercase symbol",
                numbers: "Need numbers"
            }
        },
        passSecond: {
            label: "Repeat password",
            error: {
                notMatch: "Passwords should match"
            }
        },
        TOS: "Terms Of Service",
        PP: "Privacy Policy",
        termsacc: {
            label:'Do you agree with this terms?',
            no: 'No',
            yes: 'Yes'
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
        rating: "Rating",
        favourite: "Favourite"
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
            },
            useAsAvatar: 'Avatar',
            uploadBtn: 'Upload'
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
            },
            score: 'Score',
            favs: 'In favourites'
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
        messages: {
            noMsg: 'No messages... for now',
            message: 'Message...',
            send: 'Send',
            messageElem: {
                editedAt: 'Message edited at',
                editMessage: 'Edit message',
                removeMessage: 'Remove message'
            }
        },
        search: {
            label: "Search"
        },
        dropdown: {
            label: 'Select'
        },
        image:{
            ageRestriction:{
                label:"Are you over 18?",
                no:"No",
                yes:"Yes"
            }
        }
    },
    features: {
        alert: {
            confirm: {
                confirmButton: "Yes",
                cancelButton: "No"
            }
        },
        favs: {
            limit: {
                top: "Warning!",
                content: "You saved 50 favourites in offline mode.\n\nRegister to use unlimited favourites."
            }
        }
    }
}

export default LANG
