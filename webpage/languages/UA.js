const LANG = {
    cmd: {
        warn: "Не копіюйте або редагуйте нічого в DevTools, якщо ця дія не одобрена розробником.",
        eval: "Це версія для попередньої оцінки, ця версія призначена для тестування та виправлення функцій та помилок перед випуском.",
        dev: "Це версія для розробки, все, що ви роботите тут не пов'язано з версією попередньої оцінки або випуском.",
        erorrs: {
            NOLINK: "Не має присвоєнного посилання"
        }
    },
    BUILD: {
        dev: "ВЕРСІЯ ДЛЯ РОЗРОБКИ",
        eval: "ВЕРСІЯ ДЛЯ ПОПЕРЕДНЬОЇ ОЦІНКИ",
        sdb: "ВИДІЛЕНА НЕЗАЛЕЖНА БАЗА ДАНИХ"
    },
    header: {
        main: "Головна",
        search: "Пошук",
        settings: "Налаштунки",
        upload: "Завантажити",
        fileManager: "Менеджер файлів",
        postMaster: "PostMaster",
        userCard: {
            login: "Увійти",
            register: "Реєстрація"
        }
    },
    login: {
        mainLabel: "Увійти",
        fields: {
            username: "Ім'я користувача",
            password: "Пароль",
            keepmeloggedin: "Запам'ятати мене"
        },
        errors: {
            wrongUsername: "Невірне ім'я користувача",
            wrondPassword: "Невірний пароль"
        },
        success: [
            "Ви увійшли як",
            "Успіх"
        ]
    },
    register: {
        label: "Реєстрація",
        username: {
            label: "Ім'я користувача",
            error: {
                usernameRequired: "Потрібне ім'я користувача",
                min: "Мінімум",
                max: "Максимум",
                char: "символів",
                lowecase: "Тільки малі літери",
                restrictedSymbol: "Заборонений символ",
                taken: "Занятий"
            }
        },
        passFirst: {
            label: "Пароль",
            error: {
                min: "Потрібно мінімум",
                char: "символів",
                characters: "Потрібні букви",
                uppercase: "Потрібен великий символ",
                numbers: "Потрібна цифра",
                restrictedSymbols: "Заборонений символ"
            }
        },
        passSecond: {
            label: "Повторіть пароль",
            error: {
                notMatch: "Паролі повинні співпадати"
            }
        },
        rememberMe: {
            label: "Запам'ятати мене"
        },
        autologin: {
            label: "Автоматичний вхід"
        },
        error: {
            fixForm: "Виправте помилки у формі реєстрації",
            title: "Помилка реєстрації",
            message: "Виправте помилки у формі реєстрації і спробуйте знову."
        },
        success: [
            "Профіль зарєстровано",
            "Успіх"
        ]
    },
    fileManager: {
        noFilesLabel: "Ви не завантажили жодних файлів"
    },
    main: {
        welcome: "Вітаємо у",
        featured: "Популярні пости"
    },
    postView: {
        hiddenLabel: "Цей пост не відображається",
        errors: {
            noAccess: "у вас немає доступу до цього посту",
            default: "Помилка завантаження данних посту"
        },
        file: {
            size: "Розмір",
            type: "Тип файлу",
            uploadedBy: "Завантажений",
            linkedToPost: "Пост",
            resolution: "Розширення",
            uploadedOn: "Завантажено"
        },
        rating: "Рейтинг"
    },
    profile: {
        noUsername: "Ім'я користувача не вказане в адресі сторінки",
        noProfile: "Профіль не знайдено",
        regsitered: "Зареєстрований",
        latestPosts: "Останні пости"
    },
    upload: {
        groupUpload: "Завантажити усе"
    },
    postMaster: {
        newPost: "Створити"
    },
    settings: {
        label: "Налаштунки",
        typeSwitch: {
            webpage: "Сторінка",
            user: "Користувач",
            placeholder: "Оберіть тип"
        },
        webpage: {
            language: {
                ENG: "Англійська",
                UA: "Українська",
                RU: "російська"
            }
        },
        user: {
            logout: "Вийти з",
            selectAvatar: "Обрати аватар",
            selectBtn: "Обрати",
            removeAvatar: "Прибрати аватар",
            removeAvatarAlert: "Ви впевнені, що хочете видалити аватар?",
            noAvatarFiles: "Файлів для аватару не знайдено",
            uploadFile: "Завантажити новий файл",
            loggedOut: [
                "Ви вийшли з",
                "успішно"
            ],
            visibleName: {
                label: "Відображуване ім'я",
                setBtn: "Задати",
                rmBtn: "Прибрати",
                result: {
                    setsucc: "Успішно задано відображуване ім'я",
                    rmsucc: "Відображуване ім'я прибрано"
                }
            }
        }
    },
    components: {
        upload: {
            field: "Натисніть або перетягніть файли",
            errors: {
                file: "Файл",
                unsupportedType: "має непідтримуваний тип",
                tooLarge: "завеликий",
                maxSize: "Максимальний розмір"
            }
        }
    },
    elements: {
        fileCard: {
            fnameNotBeSaved: "Ім'я файлу не буде збережене на сервері",
            fsize: "Розмір",
            ftype: "Тип",
            segment: [
                "Сегмент",
                "Вага"
            ],
            linked: {
                label: "Пов'язано з",
                to: {
                    post: "пост",
                    pfavatar: "аватар"
                }
            },
            delete: {
                buttonLabel: "Видалити",
                alert: "Видалено файл"
            }
        },
        postCard: {
            rating: {
                safe: "Безпечно",
                questionable: "Під питанням",
                mature: "Для дорослих"
            },
            editButtons: {
                visible: "Видимість",
                remove: "Видалити",
                edit: "Редагувати",
                successRM: [
                    "Пост",
                    "прибрано"
                ]
            }
        },
        postMaker: {
            postName: "Назва",
            postDesc: "Опис",
            postType: "Тип",
            postRating: "Рейтинг",
            filesList: "Список файлів",
            noFiles: "Файли не обрано",
            tags: "Теги",
            createPost: "Створити",
            editPost: "Редагувати",
            successCreate: [
                "Пост",
                "успішно створено"
            ],
            successEdit: [
                "Пост",
                "успішно відредаговано"
            ]
        },
        search: {
            label: "Пошук"
        }
    },
    features: {
        alert: {
            confirm: {
                confirmButton: "Так",
                cancelButton: "Ні"
            }
        }
    }
};

export default LANG
