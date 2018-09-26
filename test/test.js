var majesty = require('majesty')
var ReplaceableInputStream = require('../dist/index.js');

function exec(describe, it, beforeEach, afterEach, expect, should, assert) {

    describe("Testes do ReplaceableInputStream", function () {

        it("Realizando leitura de um arquivo com replace", function () {
            var is = new java.io.FileInputStream("inputFile.txt");

            is = ReplaceableInputStream(is, {
                '&amp;': '&',
                'strings': 'strings_2',
                'possamos': 'POSSAMOS',
                '&apos;': '\''
            });

            var actual = readInputStream(is);
            var expected = readFile('expected.txt');

            expect(actual).to.equals(expected);
        });
    });
}

function readInputStream(is) {
    var result = new java.io.ByteArrayOutputStream();
    var buffer = new (Java.type('byte[]'))(1024);
    var length;

    while ((length = is.read(buffer)) != -1) {
        result.write(buffer, 0, length);
    }

    return result.toString("UTF-8");
}

function readFile(filePathName) {
    return new java.lang.String(java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePathName)), 'UTF-8')
}

var res = majesty.run(exec)
exit(res.failure.length);