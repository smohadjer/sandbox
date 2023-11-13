async function fetchTemplate(path) {
    const response = await fetch(path);
    const responseText = await response.text();
    return responseText;
}

async function fetchData(path) {
    const response = await fetch(path);
    const json = await response.json();
    return json;
}

async function init() {
    const template = await fetchTemplate('templates/form.hbs');
    const compiledTemplate = Handlebars.compile(template);
    const data = await fetchData('json/form.json');
    const html = compiledTemplate(data);
    document.querySelector('#app').innerHTML = html;
}

init();
