var expect = require('chai').expect;
var htmlToText = require('../lib/html-to-text.js');

describe('html-to-text', function() {
    var htmlBegin = '<html>\n\
    <head>\n\
        <meta charset="utf-8">\n\
    </head>\n\
\n\
    <body>';
    var paragraphs = '<h2>Paragraphs</h2>\n\
                    <p class="normal-space">At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. <a href="www.github.com">Github</a>\n\
                    </p>\n\
                    <p class="normal-space">At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
                    </p>';
    var line = '<hr/>';
    var table1 = '<h2>Pretty printed table</h2>\n\
                    <table id="invoice">\n\
                        <tr>\n\
                            <th>Article</th>\n\
                            <th>Price</th>\n\
                            <th>Taxes</th>\n\
                            <th>Amount</th>\n\
                            <th>Total</th>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>\n\
                                <p>\n\
                                    Product 1<br />\n\
                                    <span style="font-size:0.8em">Contains: 1x Product 1</span>\n\
                                </p>\n\
                            </td>\n\
                            <td align="right" valign="top">6,99&euro;</td>\n\
                            <td align="right" valign="top">7%</td>\n\
                            <td align="right" valign="top">1</td>\n\
                            <td align="right" valign="top">6,99€</td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>Shipment costs</td>\n\
                            <td align="right">3,25€</td>\n\
                            <td align="right">7%</td>\n\
                            <td align="right">1</td>\n\
                            <td align="right">3,25€</td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>&nbsp;</td>\n\
                            <td>&nbsp;</td>\n\
                            <td colspan="3">to pay: 10,24€</td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td></td>\n\
                            <td></td>\n\
                            <td colspan="3">Taxes 7%: 0,72€</td>\n\
                        </tr>\n\
                    </table>';
    var lists = '<h2>Lists</h2>\n\
                    <ul>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                    </ul>\n\
                    <ol>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                    </ol>';
    var columnLayout = '<h2>Column Layout with tables</h2>\n\
                    <table class="address">\n\
                        <tr>\n\
                            <th align="left">Invoice Address</th>\n\
                            <th align="left">Shipment Address</th>\n\
                        </tr>\n\
                        <tr>\n\
                            <td align="left">\n\
                                <p>\n\
                                Mr.<br/>\n\
                                John Doe<br/>\n\
                                Featherstone Street 49<br/>\n\
                                28199 Bremen<br/>\n\
                                </p>\n\
                            </td>\n\
                            <td align="left">\n\
                                <p>\n\
                                Mr.<br/>\n\
                                John Doe<br/>\n\
                                Featherstone Street 49<br/>\n\
                                28199 Bremen<br/>\n\
                                </p>\n\
                            </td>\n\
                        </tr>\n\
                    </table>';
    var mailto = '<h2>Mailto formating</h2>\n\
                    <p class="normal-space small">\n\
                        Some Company<br />\n\
                        Some Street 42<br />\n\
                        Somewhere<br />\n\
                        E-Mail: <a href="mailto:test@example.com">Click here</a>\n\
                    </p>';
    var htmlEnd = '</body>\n\
</html>';
    var fullHtml = '<html>\n\
    <head>\n\
        <meta charset="utf-8">\n\
    </head>\n\
\n\
    <body>\n\
        <table cellpadding="0" cellspacing="0" border="0">\n\
            <tr>\n\
                <td>\n\
                    <h2>Paragraphs</h2>\n\
                    <p class="normal-space">At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. <a href="www.github.com">Github</a>\n\
                    </p>\n\
                    <p class="normal-space">At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
                    </p>\n\
                </td>\n\
                <td></td>\n\
            </tr>\n\
            <tr>\n\
                <td>\n\
                    <hr/>\n\
                    <h2>Pretty printed table</h2>\n\
                    <table id="invoice">\n\
                        <tr>\n\
                            <th>Article</th>\n\
                            <th>Price</th>\n\
                            <th>Taxes</th>\n\
                            <th>Amount</th>\n\
                            <th>Total</th>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>\n\
                                <p>\n\
                                    Product 1<br />\n\
                                    <span style="font-size:0.8em">Contains: 1x Product 1</span>\n\
                                </p>\n\
                            </td>\n\
                            <td align="right" valign="top">6,99&euro;</td>\n\
                            <td align="right" valign="top">7%</td>\n\
                            <td align="right" valign="top">1</td>\n\
                            <td align="right" valign="top">6,99€</td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>Shipment costs</td>\n\
                            <td align="right">3,25€</td>\n\
                            <td align="right">7%</td>\n\
                            <td align="right">1</td>\n\
                            <td align="right">3,25€</td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>&nbsp;</td>\n\
                            <td>&nbsp;</td>\n\
                            <td colspan="3">to pay: 10,24€</td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td></td>\n\
                            <td></td>\n\
                            <td colspan="3">Taxes 7%: 0,72€</td>\n\
                        </tr>\n\
                    </table>\n\
\n\
                </td>\n\
                <td></td>\n\
            </tr>\n\
            <tr>\n\
                <td>\n\
                    <hr/>\n\
                    <h2>Lists</h2>\n\
                    <ul>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                    </ul>\n\
                    <ol>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                        <li>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</li>\n\
                    </ol>\n\
                </td>\n\
            </tr>\n\
            <tr>\n\
                <td>\n\
                    <hr />\n\
                    <h2>Column Layout with tables</h2>\n\
                    <table class="address">\n\
                        <tr>\n\
                            <th align="left">Invoice Address</th>\n\
                            <th align="left">Shipment Address</th>\n\
                        </tr>\n\
                        <tr>\n\
                            <td align="left">\n\
                                <p>\n\
                                Mr.<br/>\n\
                                John Doe<br/>\n\
                                Featherstone Street 49<br/>\n\
                                28199 Bremen<br/>\n\
                                </p>\n\
                            </td>\n\
                            <td align="left">\n\
                                <p>\n\
                                Mr.<br/>\n\
                                John Doe<br/>\n\
                                Featherstone Street 49<br/>\n\
                                28199 Bremen<br/>\n\
                                </p>\n\
                            </td>\n\
                        </tr>\n\
                    </table>\n\
                </td>\n\
                <td></td>\n\
            </tr>\n\
            <tr>\n\
                <td>\n\
                    <hr/>\n\
                    <h2>Mailto formating</h2>\n\
                    <p class="normal-space small">\n\
                        Some Company<br />\n\
                        Some Street 42<br />\n\
                        Somewhere<br />\n\
                        E-Mail: <a href="mailto:test@example.com">Click here</a>\n\
                    </p>\n\
                </td>\n\
            </tr>\n\
        </table>\n\
    </body>\n\
</html>';
    var paragraphsText = 'PARAGRAPHS\n\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum\n\
dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n\
invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos\n\
et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea\n\
takimata sanctus est Lorem ipsum dolor sit amet. Github [www.github.com]\n\
\n\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum\n\
dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n\
invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos\n\
et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea\n\
takimata sanctus est Lorem ipsum dolor sit amet.';
    var table1Text = 'PRETTY PRINTED TABLE\n\
ARTICLE                  PRICE   TAXES             AMOUNT   TOTAL   \n\
Product 1                6,99€   7%                1        6,99€   \n\
Contains: 1x Product 1                                              \n\
Shipment costs           3,25€   7%                1        3,25€   \n\
                                 to pay: 10,24€                     \n\
                                 Taxes 7%: 0,72€                    ';
    var lineText = '--------------------------------------------------------------------------------';
    var listsText = 'LISTS\n\
 * At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
   gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
 * At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
   gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
 * At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
   gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
\n\
 1. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
 2. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
 3. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
    var columnLayoutText = 'COLUMN LAYOUT WITH TABLES\n\
INVOICE ADDRESS          SHIPMENT ADDRESS         \n\
Mr.                      Mr.                      \n\
John Doe                 John Doe                 \n\
Featherstone Street 49   Featherstone Street 49   \n\
28199 Bremen             28199 Bremen             ';
    var mailtoText = 'MAILTO FORMATING\n\
Some Company\n\
Some Street 42\n\
Somewhere\n\
E-Mail: Click here [test@example.com]';
    var result = 'PARAGRAPHS\n\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum\n\
dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n\
invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos\n\
et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea\n\
takimata sanctus est Lorem ipsum dolor sit amet. Github [www.github.com]\n\
\n\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum\n\
dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n\
invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos\n\
et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea\n\
takimata sanctus est Lorem ipsum dolor sit amet.\n\
\n\
--------------------------------------------------------------------------------\n\
\n\
PRETTY PRINTED TABLE\n\
ARTICLE                  PRICE   TAXES             AMOUNT   TOTAL   \n\
Product 1                6,99€   7%                1        6,99€   \n\
Contains: 1x Product 1                                              \n\
Shipment costs           3,25€   7%                1        3,25€   \n\
                                 to pay: 10,24€                     \n\
                                 Taxes 7%: 0,72€                    \n\
\n\
--------------------------------------------------------------------------------\n\
\n\
LISTS\n\
 * At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
   gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
 * At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
   gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
\n\
 1. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
 2. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd\n\
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
\n\
--------------------------------------------------------------------------------\n\
\n\
COLUMN LAYOUT WITH TABLES\n\
INVOICE ADDRESS          SHIPMENT ADDRESS         \n\
Mr.                      Mr.                      \n\
John Doe                 John Doe                 \n\
Featherstone Street 49   Featherstone Street 49   \n\
28199 Bremen             28199 Bremen             \n\
\n\
--------------------------------------------------------------------------------\n\
\n\
MAILTO FORMATING\n\
Some Company\n\
Some Street 42\n\
Somewhere\n\
E-Mail: Click here [test@example.com]';
    describe('#fromString()', function() {
        it('should do correct paragraphs', function() {
            expect(htmlToText.fromString(htmlBegin + paragraphs + htmlEnd)).to.be.equal(paragraphsText);
        });
        it('should do correct tables', function() {
            expect(htmlToText.fromString(htmlBegin + table1 + htmlEnd)).to.be.equal(table1Text);
        });
        it('should do correct line', function() {
            expect(htmlToText.fromString(htmlBegin + line + htmlEnd)).to.be.equal(lineText);
        });
        it('should do correct list', function() {
            expect(htmlToText.fromString(htmlBegin + lists + htmlEnd)).to.be.equal(listsText);
        });
        it('should do correct columnLayout', function() {
            expect(htmlToText.fromString(htmlBegin + columnLayout + htmlEnd)).to.be.equal(columnLayoutText);
        });
        it('should do correct mailto', function() {
            expect(htmlToText.fromString(htmlBegin + mailto + htmlEnd)).to.be.equal(mailtoText);
        });
        it('should do correct inline parsing', function() {
            expect(htmlToText.fromString('<p>Help <i>ME</i>!</p>')).to.be.equal('Help ME!');
            expect(htmlToText.fromString('Paris is a <i>city</i> in <b>France</b>')).to.be.equal('Paris is a city in France');
            expect(htmlToText.fromString('<p>Paris is a <i>city</i> in <b>France</b></p>')).to.be.equal('Paris is a city in France');
        });
        it('should cope with punctuation', function() {
            expect(htmlToText.fromString('<p>Help, ME!</p>')).to.be.equal('Help, ME!');
        });
        it('should do a full example', function() {
            //expect(htmlToText.fromString(fullHtml)).to.be.equal(result);
        });
    });
});