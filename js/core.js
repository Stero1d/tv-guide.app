(function () {
    const ANIMATION_TIME_MS = 0
    const templates = {}
    const utils = {}

    utils.applyTemplate = function (selector, templatePath, model, onComplete) {
        const template = templates[templatePath]
        const container = document.querySelector(selector)
        if (template) {
            applyTemplate(container, template, model, onComplete)
            return
        }
        utils.load(templatePath, (response) => {
            const template = Handlebars.compile(response)
            templates[templatePath] = template
            applyTemplate(container, template, model, onComplete)
        })
    }

    function applyTemplate(container, template, model, onComplete) {
        container.className += ' animate'
        container.style.opacity = 0
        setTimeout(() => {
            container.innerHTML = template(model)
            container.style.opacity = 1
            setTimeout(() => {
                container.style.opacity = 1
                onComplete ? onComplete() : 0
            }, ANIMATION_TIME_MS)
        }, ANIMATION_TIME_MS)
    }

    utils.load = function (url, onSuccess, onError) {
        fetch(url)
            .then(response => response.text())
            .then(responseText => {
                onSuccess ? onSuccess(responseText) : 0
            })
            .catch(error => {
                console.error(error.message)
                console.error(error.stack)
                onError ? onError(error.message) : 0
            })
    }

    window.core = {
        utils: utils 
    }
})()