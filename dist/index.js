/**
 * Based on: https://gist.github.com/lhr0909/e6ac2d6dd6752871eb57c4b083799947
 */

var FilterInputStream = Java.type('java.io.FilterInputStream');
var LinkedList = Java.type('java.util.LinkedList');
var NullPointerException = Java.type('java.lang.NullPointerException');
var IndexOutOfBoundsException = Java.type('java.lang.IndexOutOfBoundsException');

function isMatchFound(inQueue, search) {
  var iterator = inQueue.iterator();

  for (var i in search) {
    if (!iterator.hasNext() || search[i] != iterator.next()) {
      return false;
    }
  }

  return true;
}

function readAhead(is, inQueue, search) {
  // Work up some look-ahead.
  while (inQueue.size() < search.length) {
    var next = is.read();

    inQueue.offer(next);

    if (next == -1) {
      break;
    }
  }
}

/**
 * Referente ao read sem argumentos do Java
 * @param {InputStream} is inputStream
 * @param {LinkedList} inQueue fila de caracteres de input
 * @param {LinkedList} outQueue file de caracteres de output
 * @param {byte[]} search bytes a serem pesquisados
 * @param {byte[]} replacement bytes a serem substituidos
 */
function read0(is, inQueue, outQueue, search, replacement) {
  // Next byte already determined.
  // console.log('read0');

  while (outQueue.isEmpty()) {
    readAhead(is, inQueue, search);

    if (isMatchFound(inQueue, search)) {
      for (var i in search) {
        inQueue.remove();
      }

      for (var i in replacement) {
        outQueue.offer(replacement[i]);
      }
    } else {
      outQueue.add(inQueue.remove());
    }
  }

  return outQueue.remove();
}

/**
 * Referente ao read com 3 argumentos do Java
 * @param {InputStream} is inputStream
 * @param {byte[]} b bytes lidos
 * @param {int} off offset dos bytes
 * @param {int} len tamanho do buffer lido
 * @param {LinkedList} inQueue fila de caracteres de input
 * @param {LinkedList} outQueue file de caracteres de output
 * @param {byte[]} search bytes a serem pesquisados
 * @param {byte[]} replacement bytes a serem substituidos
 */
function read3(is, b, off, len, inQueue, outQueue, search, replacement) {
  // console.log("read3:" +  off + ":" + len);

  if (!b) {
    throw new NullPointerException();
  } else if (off < 0 || len < 0 || len > b.length - off) {
    throw new IndexOutOfBoundsException();
  } else if (len == 0) {
    return 0;
  }

  var c = read0(is, inQueue, outQueue, search, replacement);

  if (c == -1) {
    return -1;
  }

  b[off] = c;

  var i = 1;

  try {
    for (; i < len; i++) {
      c = read();

      if (c == -1) {
        break;
      }

      b[off + i] = c;
    }
  } catch (ee) {
  }

  return i;
}

function buildReplaceableInputStream(is, search, replace) {
  var inQueue = new LinkedList();
  var outQueue = new LinkedList();

  search = search.getBytes('UTF-8');
  replace = replace.getBytes('UTF-8');

  var ReplaceableInputStreamClass = Java.extend(FilterInputStream, {
    read: function (b, off, len) {
      if (arguments.length == 0) {
        return read0(is, inQueue, outQueue, search, replace);
      } else if (arguments.length == 1) {
        return read3(is, b, 0, b.length, inQueue, outQueue, search, replace);
      } else {
        return read3(is, b, off, len, inQueue, outQueue, search, replace);
      }
    }
  });

  return new ReplaceableInputStreamClass(is);
};

exports = function (is, replacements) {
  return Object.keys(replacements).reduce(function (is, search) {
    return buildReplaceableInputStream(is, search, replacements[search])
  }, is);
}