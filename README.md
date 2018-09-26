replaceable-inputstream
===============

replaceable-inputstream é um *bitcode* de processamento e transformação de stream da dados para [Thrust](https://github.com/Thrustjs/thrust).
Com ele é possível ler um stream de dados de forma bufferizada realizando replaces no stream.

# Instalação

Posicionado em um app [ThrustJS](https://github.com/thrustjs/thrust), no seu terminal:

```bash
thrust install replaceable-inputstream
```

## Tutorial

```javascript
var ReplaceableInputStream = require('replaceable-inputstream')
var is = ReplaceableInputStream(new java.io.FileInputStream("inputFile.txt"), {
    '&amp;': '&',
    'strings': 'strings_2',
    'possamos': 'POSSAMOS',
    '&apos;': '\''
});

//Agora, ao ler o stream 'is', os replaces passados como argumento irão ocorrer

```