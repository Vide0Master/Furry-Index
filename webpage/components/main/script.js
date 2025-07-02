export default class Main {
    static render() {
        const body = document.querySelector('body')
        this.element = document.createElement('main')
        body.appendChild(this.element)
    }
}