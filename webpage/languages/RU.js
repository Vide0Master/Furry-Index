const LANG = {
    cmd: {
        warn: "Не копируйте или редактируйте ничего в DevTools, если это действие не одобрено разработчиком.",
        eval: "Это сборка для предварительной оценки, эта сборка предназначена для тестирования и исправления функций и ошибок перед выпуском.",
        dev: "Это сборка для разработки, все что вы делаете здесь не связано с версией для предварительной оценки или выпуском.",
        erorrs: {
            NOLINK: "Не имеет привязанной ссылки"
        }
    },
    BUILD: {
        dev: "ВЕРСИЯ ДЛЯ РАЗРАБОТКИ",
        eval: "ВЕРСИЯ ДЛЯ ПРЕДВАРИТЕЛЬНОЙ ОЦЕНКИ",
        sdb: "ПРЕДОСТАВЛЕНА ОТДЕЛЬНАЯ БАЗА ДАННЫХ"
    },
    header: {
        main: "Главная",
        search: "Поиск",
        settings: "Настройки",
        upload: "Загрузить",
        fileManager: "Файловый менеджер",
        postMaster: "PostMaster",
        userCard: {
            login: "Войти",
            register: "Регистрация"
        }
    },
    login: {
        mainLabel: "Вход",
        button: "Войти",
        fields: {
            username: "Имя пользователя",
            password: "Пароль",
            keepmeloggedin: "Запомнить меня"
        },
        errors: {
            wrongUsername: "Неверное имя пользователя",
            wrondPassword: "Неверный пароль"
        },
        success: [
            "Вы вошли как",
            "Успех"
        ]
    },
    register: {
        label: "Регистрация",
        username: {
            label: "Имя пользователя",
            error: {
                min: "Минимум",
                max: "Максимум",
                chars: "символов",
                lowecase: "Только строчные",
                restrictedSymbol: "Запрещённый символ",
                taken: {
                    default: "Имя должно быть уникальным",
                    ok: "Имя уникальном",
                    nok: "Имя занято"
                },
                specialSymbolCheck: {
                    default: "Спец. символы запрещены",
                    ok: "Спец. символы не найдены",
                    nok: "Уберите спец символы"
                }
            }
        },
        passFirst: {
            label: "Пароль",
            error: {
                min: "Минимум",
                max: "Максимум",
                chars: "символов",
                uppercase: "Нужна заглавная буква",
                numbers: "Нужна цифра"
            }
        },
        passSecond: {
            label: "Повторите пароль",
            error: {
                notMatch: "Пароли не совпадают"
            }
        },
        rememberMe: {
            label: "Запомнить меня"
        },
        autologin: {
            label: "Автоматический вход"
        },
        error: {
            fixForm: "Исправьте ошибки в форме регистрации",
            title: "Ошибка регистрации",
            message: "Исправьте ошибки в форме регистрации и повторите снова."
        },
        success: [
            "Профиль зарегестрирован",
            "Успех"
        ]
    },
    fileManager: {
        noFilesLabel: "У вас нет загруженных файлов"
    },
    main: {
        welcome: "Добро пожаловать в",
        featured: "Популярные посты"
    },
    postView: {
        hiddenLabel: "Этот пост не отображается",
        errors: {
            noAccess: "У вас нет доступа к этому посту",
            default: "Ошибка загрузки данных поста"
        },
        file: {
            size: "Размер",
            type: "Тип файла",
            uploadedBy: "Загружен",
            linkedToPost: "Пост",
            resolution: "Разрешение",
            uploadedOn: "Загружено"
        },
        rating: "Рейтинг",
        favourite: "Избранное"
    },
    profile: {
        noUsername: "Имя пользователя не указано в адресе страницы",
        noProfile: "Профиль не найден",
        regsitered: "Зарегистрирован",
        latestPosts: "Последние посты"
    },
    upload: {
        groupUpload: "Загрузить всё"
    },
    postMaster: {
        newPost: "Создать"
    },
    settings: {
        label: "Настройки",
        typeSwitch: {
            webpage: "Страница",
            user: "Пользователь",
            placeholder: "Выберите тип"
        },
        webpage: {
            language: {
                label: "Язык",
                ENG: "Английский",
                UA: "Украинский",
                RU: "русский"
            }
        },
        user: {
            logout: "Выйти из",
            selectAvatar: "Выбрать аватар",
            selectBtn: "Выбрать",
            removeAvatar: "Убрать аватар",
            removeAvatarAlert: "Вы уверены что хотите убрать аватар?",
            noAvatarFiles: "Файлов для аватара не найдено",
            uploadFile: "Загрузить новый файл",
            loggedOut: [
                "Вы вышли из",
                "успешно"
            ],
            visibleName: {
                label: "Отображаемое имя",
                setBtn: "Задать",
                rmBtn: "Убрать",
                result: {
                    setsucc: "Успешно задано отображаемое имя",
                    rmsucc: "Отображаемое имя убрано"
                }
            }
        }
    },
    components: {
        upload: {
            field: "Нажмите или перетяните файлы",
            errors: {
                file: "Файл",
                unsupportedType: "имеет неподдерживаемый тип",
                tooLarge: "слишком большой",
                maxSize: "Максимальный размер"
            }
        }
    },
    elements: {
        fileCard: {
            fnameNotBeSaved: "Имя файла не будет сохранено на сервере",
            fsize: "Размер",
            ftype: "Тип",
            segment: [
                "Сегмент",
                "Вес"
            ],
            linked: {
                label: "Связан с",
                to: {
                    post: "постом",
                    pfavatar: "аватаром"
                }
            },
            delete: {
                buttonLabel: "Удалить",
                confirm: "Подтверждение",
                confirmText: [
                    "Вы хотите удалить файл",
                    "?"
                ],
                alert: "Удалён файл"
            },
            useAsAvatar: "Аватар"
        },
        postCard: {
            rating: {
                safe: "Безопасно",
                questionable: "Сомнительно",
                mature: "Для взрослых"
            },
            type: {
                image: "Картинка",
                imageGroup: "Группа картинок",
                comic: "Комикс",
                video: "Видео"
            },
            editButtons: {
                visible: "Видимость",
                remove: "Удалить",
                edit: "Редактировать",
                successRM: [
                    "Пост",
                    "Удалён"
                ]
            },
            score: "Рейтинг",
            favs: "В избранном"
        },
        postMaker: {
            postName: "Название",
            postDesc: "Описание",
            postType: "Тип",
            postRating: "Рейтинг",
            filesList: "Список файлов",
            noFiles: "Файлы не выбраны",
            tags: "Теги",
            createPost: "Создать",
            editPost: "Редактировать",
            successCreate: [
                "Пост",
                "успешно создан"
            ],
            successEdit: [
                "Пост",
                "успешно отредактирован"
            ]
        },
        search: {
            label: "Поиск"
        }
    },
    features: {
        alert: {
            confirm: {
                confirmButton: "Да",
                cancelButton: "Нет"
            }
        },
        favs: {
            limit: {
                top: "Внимание!",
                content: "Вы сохранили 50 избранных в оффлайн режиме.\n\nЗарегистрируйтесь что-бы добавлять в избранные без ограничения."
            }
        }
    }
};

export default LANG
