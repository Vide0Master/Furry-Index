import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";

export const tag = "profile";
export const tagLimit = 5;

export async function render(params) {
    const container = new Elem('profile-container')

    console.log(User.data)
    console.log(params)

    if (User.data.usename == params.username) {

    }else{
        
    }

    return container.element;
}