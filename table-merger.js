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
  * Data table merger is used to merge two-dimensional arrays
  *
  * @param {Array} Source, Table to modify (2D Array)
  * @param {Array} Load, Table with fresh data (2D Array)
  * @param {Array} primaryKeys
  * @param {Object} options { header : "none" | "source" | "load", normalize : true | false, clear : true | false, skipHeader : true | false}
  * @return {Object} { result : mergedArray, unmatched : excedentRows }
  **/
  
function tableMerger(source, load, pkeys, options) {
  options = options || {};
  
  // Header creation
  var sourceHeader = [];
  var loadHeader = [];
  if (options.header == "none") {
    sourceHeader = source[0].map(function(cur,idx) {return idx;});
    loadHeader = sourceHeader.slice();
  }
  else if (options.header == "source") {
    sourceHeader = source.shift();
    loadHeader = sourceHeader.slice();
  }
  else if (options.header == "load") {
    loadHeader = load.shift();
    sourceHeader = loadHeader.slice();
  }
  else {
    sourceHeader = source.shift();
    loadHeader = load.shift();
  }
    
  // normalize load to fit data
  if (options.normalize == true) {
    if (["none","source","load"].indexOf(options.header) > -1) {
      throw "can't normalize without header";
    }
    var loadIndex = {};
    for (var h = 0; h<loadHeader.length; h++) {
      loadIndex[loadHeader[h]] = h;
    }
    var load =load.map( function (row) { return sourceHeader.map(function (head) { return row[loadIndex[head]] || "" } ); });  
  }
  else { // check the consistence of the data
    if (source[0].length !== load[0].length) {
      throw "unconsistant data: source and load size differ";
    }
  }
  
  // check data consistency
  if ( source.length < 1 || load.length < 1) {
    throw " Empty array can't be handled";
  }
  
  // check for primary key consistence
  if ("none" != options.header) {
    pkeys.forEach(
      function (key) {
        if (sourceHeader.indexOf(key) == -1) {
          throw "invalid primary key: "+key;
        }
      }
    );
  }
   
  // build source Index
  var sourceIndex = {};
  for (var h = 0; h<sourceHeader.length; h++) {
    sourceIndex[sourceHeader[h]] = h;
  }

  /**
  * function to build sourceObj
  **/
  function repObj (obj, arr, line, idx) {
    if (arr.length>0) {
      var key = arr.shift();
      var localKey = line[sourceIndex[key]];
      obj[localKey] = obj[localKey] || {};
      obj[localKey] = repObj(obj[localKey], arr, line, idx);
    }
    else {
      if (options.unique == true && obj.index != undefined) {
        throw "Duplicate primary key identified";
      }
      obj.index = obj.index || [];
      obj.index.push(idx);
    }
    return obj;
  }

  // build sourceObj
  var sourceObj = {};
  source.reduce(
    function(pre,cur,idx) {
      return repObj (pre, pkeys.slice(), cur, idx)
    },
    sourceObj
  );
    
  // merge
  var unMatched = load.filter(
    function (row) {
      var index = [];
      pkeys.reduce( // parse each primary key
        function (pre,key,idx,arr) {
          if(pre[row[sourceIndex[key]]] == undefined) {
            return {}; // stop when unmatch
          }
          if(idx == arr.length-1) { // index reached
            index = pre[row[sourceIndex[key]]].index;
          }
          return pre[row[sourceIndex[key]]]; // else return sub object
        },
        sourceObj
      );
      if (index.length == 0) { // no match
        return true;
      }
      else {
        for (var ix = 0; ix < index.length; ix++) {
          if (options.clear == true) { // clear content when load is empty
            source[index[ix]] = row.slice();
          }
          else {
            source[index[ix]] = row.map( // only aggregator
              function(val,id) {
                return val != "" ? val : source[index[ix]][id];
              }
            );
          }
        }
      }
      return false;
    }
  );

  // reconnect header
  if (["none","load"].indexOf(options.header) == -1 && options.skipHeader != true) {
    source.unshift(sourceHeader);
  }
  
  return {result : source, unMatched:unMatched};
}
