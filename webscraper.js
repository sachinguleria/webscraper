/*
* Title: Web Scraper
* Author: Sachin Guleria (sachinguleria@live.com)
*/

var casper = require("casper").create({
    pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

var url = 'http://listings.findthecompany.com';
var companies = [];

var terminate = function() {
    this.echo("Execution complete!").exit();
};

function getCompanies() {
    var rows = document.querySelectorAll('table.srp-list-results tr[id^="listing_row_"]');
    var companies = [];

    for (var i = 0, row; row = rows[i]; i++) {
        var cname = row.cells[1].querySelector('a.srp-listing-title');
        var caddress = row.cells[2].querySelector('div.c-content');
        var cemp = row.cells[1].querySelector('div.val');
        var ceal = row.cells[1].querySelector('div.val');
        var csales = row.cells[1].querySelector('div.val');
        var company = {};

        company['Company name'] = cname.innerText;
        company['Address'] = caddress.innerText;
        company['Total employees'] = cemp.innerText;
        company['Employees at this location'] = ceal.innerText;
        company['Sales'] = csales.innerText;
        companies.push(company);
    }
    return companies;       
}

var processPage = function() {
    companies = this.evaluate(getCompanies);
    require('utils').dump(companies);
    if (!this.exists("table.srp-list-results")) {
        return terminate.call(casper);
    }
    this.thenClick("div#pager div.next").then(function() {
        this.waitFor(function() {
            return this.evaluate(getCompanies);
        }, processPage, terminate);
    });
};

casper.start(url);
casper.waitForSelector('table.srp-list-results', processPage, terminate);
casper.run();