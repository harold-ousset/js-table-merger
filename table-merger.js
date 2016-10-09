/*
Copyright 2016 Harold Ousset

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/  
  
  /**
  * Table merger is used to merge two-dimensional arrays and come as a prototype of Array Object
  * @param {Array} Load, Table with data to be added (2D Array)
  * @param {Array} primaryKeys, header columns used to match 2D arrays
  * @param {Object} options { header: "none" | "source" | "load", clear: true | false, skipHeader: true | false, appendUnmached: true | false}
  * @return {Array} the merged Array
  * option header: allow fusion of table without header if they are from same size and order
  * option clear: if second array has empty cell, merge will erase content from first array
  * option skipHeader: remove header of the resulting array
  * option appendUnmached: add at the end of the resulting array row from second array that do not have correspondance in the first one
  **/
  
(
  function () {
    function merge2d(secondMember, pkeys, options) {
      var source = this.slice();//copy original array
      var load = secondMember.slice();//copy the second array
      options = options || {};

      // Header control and creation
      var sourceHeader = [];
      var loadHeader = [];
      if (options.header === 'none') {// return index has header
        sourceHeader = source[0].map(
          function (cur, idx) {
            return idx;
          }
        );
        loadHeader = sourceHeader.slice();//copy source header to load header
      } else if (options.header === 'source') {
        sourceHeader = source.shift();
        loadHeader = sourceHeader.slice();
      } else if (options.header === 'load') {
        loadHeader = load.shift();
        sourceHeader = loadHeader.slice();
      } else {
        sourceHeader = source.shift();
        loadHeader = load.shift();
      }

      // check data consistency
      if (source.length < 1 || load.length < 1) {
        throw 'Empty array can\'t be handled';
      }

      function buildHeaderIndex(header, idx) {
        this[header] = idx;
      }

      // normalize load to fit data
      if (source.length != load.length) {
        if (['none', 'source', 'load'].indexOf(options.header) > -1) {
          // normalization can't happen without correct header
          throw "can't normalize without header";
        }

        // build load index
        var loadIndex = {};// indexed second member array
        loadHeader.forEach(
          buildHeaderIndex,
          loadIndex
        );

        function realignRow(head) {
          return this[loadIndex[head]] || '';
        }

        function parseLoad(row) {
          return sourceHeader.map(
            realignRow,
            row
          );
        }

        // normalisation process
        load = load.map(
          parseLoad
        );
      }

      // check for primary key consistency
      // TODO check for doublon in pkeys
      if (options.header != 'none') {
        pkeys.forEach(
          function (key, idx) {
            if (sourceHeader.indexOf(key) === -1) {
              throw 'invalid primary key: ' + key;
            }
          }
        );
      }

      // build source Index
      var sourceIndex = {};
      sourceHeader.forEach(
        buildHeaderIndex,
        sourceIndex
      );

      /**
      * function to build sourceObj
      **/
      function repObj(obj, arr, line, idx) {
        if (arr.length > 0) {
          var key = arr.shift();
          var localKey = line[sourceIndex[key]];
          obj[localKey] = obj[localKey] || {};
          obj[localKey] = repObj(obj[localKey], arr, line, idx);
        } else {
          if (options.unique === true && obj.index !== undefined) {
            throw 'Duplicate primary key identified (duplicates entries at: ' +
            idx + ' ) : ' + line;
          }

          obj.index = obj.index || [];
          obj.index.push(idx);
        }

        return obj;
      }

      // build sourceObj
      var sourceObj = {};
      source.reduce(
        function (pre, cur, idx) {
          return repObj(pre, pkeys.slice(), cur, idx);
        },

        sourceObj
      );

      // merge
      var unMatched = load.filter(
        function (row) {
          var index = [];
          pkeys.reduce(// parse each primary key
            function (pre, key, idx, arr) {
              if (pre[row[sourceIndex[key]]] === undefined) {
                return {}; // stop when unmatch
              }

              if (idx === arr.length - 1) { // index reached
                index = pre[row[sourceIndex[key]]].index;
              }

              return pre[row[sourceIndex[key]]]; // else return sub object
            },

            sourceObj
          );
          if (index.length === 0) { // no match
            return true;
          } else {
            for (var ix = 0; ix < index.length; ix++) {
              if (options.clear === true) { // clear content when load is empty
                source[index[ix]] = row.slice();
              } else {
                source[index[ix]] = row.map(// only aggregator
                  function (val, id) {
                    return val !== '' ? val : source[index[ix]][id];
                  }
                );
              }
            }
          }

          return false;
        }
      );

      // reconnect header
      if (['none', 'load'].indexOf(options.header) === -1 && options.skipHeader !== true) {
        source.unshift(sourceHeader);
      }

      if (options.appendUnmached === true) {
        source = source.concat(unMatched);
      }

      return source;
    }

    this.merge2d = merge2d;
  }
).call(Array.prototype);
