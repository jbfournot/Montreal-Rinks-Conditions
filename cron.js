const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs');

setRinks = () => {
    axios.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml').then((result) => {
        const rinks = {rinks: [], last_update: Date.now()};
        const $ = cheerio.load(result.data, {xmlMode: true});
        $('patinoires patinoire').each((key, patinoire) => {
            rinks.rinks.push({
                name: $(patinoire).children('nom').text().replace(/\([A-Z]*\)/gm, ''),
                condition: $(patinoire).children('condition').text().toLocaleLowerCase(),
                is_open: $(patinoire).children('ouvert').text() == '1' ? true : false,
                updated_at: $(patinoire).children('arrondissement').children('date_maj').text()
            });
        });
        fs.writeFile('data/rinks.json', JSON.stringify(rinks), () => {
            console.log('Rinks file generated');
        });
    });
}

getRinks = (caption) => {
    const caption_words = caption.toLowerCase().split(/-| /);
    const rinks = JSON.parse(fs.readFileSync('data/rinks.json'));
    return rinks.rinks.map((rink) => {
        rink.occurence_found = 0;
        rink.name.toLowerCase().split(/-| /).map((word) => {
            if(caption_words.includes(word)){
                rink.occurence_found++;
            }
        });
        return rink;
    }).filter(rink => rink.occurence_found > 0).sort((a, b) => b.occurence_found - a.occurence_found);
}

module.exports = {
    setRinks: setRinks,
    getRinks: getRinks
}