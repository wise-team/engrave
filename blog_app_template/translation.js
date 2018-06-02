var fs = require('fs');

let translation = JSON.parse(fs.readFileSync('/locales/pl/translation.json', 'utf8'));

module.exports.initialize = (lang) => {  
    if (lang == 'en') {
        translation = JSON.parse(fs.readFileSync('/locales/en/translation.json', 'utf8'));
    } else if(lang == 'pl') {
        translation = JSON.parse(fs.readFileSync('/locales/pl/translation.json', 'utf8'));
    } else {
        translation = JSON.parse(fs.readFileSync('/locales/pl/translation.json', 'utf8'));
    }
};

module.exports.get_translation = () => {
    return translation;
};