const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs');

const rinks = {rinks: [], last_update: Date.now()};

axios.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml').then((result) => {
    const $ = cheerio.load(result.data, {xmlMode: true});
    $('patinoires patinoire').each((key, patinoire) => {
        rinks.rinks.push({
            name: $(patinoire).children('nom').text(),
            condition: $(patinoire).children('condition').text(),
            is_open: $(patinoire).children('ouvert').text() == '1' ? true : false,
            updated_at: $(patinoire).children('arrondissement').children('date_maj').text()
        });
    });
    fs.writeFile("rinks.json", JSON.stringify(rinks), () => {
        console.log('Rinks file generated');
    });
})