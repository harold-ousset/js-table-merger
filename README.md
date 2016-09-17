# js table merger
## merge two-dimensional arrays
----------
###Note  
this is a full JS script it do not use ECMAScript 2015 specifications because it's dedicated to be used in Google Apps Script

###Syntax  
> var result = tableMerger(source, load, pkeys[, options]);
####Parameters  
**source** 
 a two dimension array [][] representing the first table to merge
 **load**  
 a two dimension array [][] represneting the second table to merge
 **pkeys**  
 an array with the N° of the column(s) to use as primary key OR the name(s) of the header to use as primary key
 **options**  
Optional object that allow you to modify the function behavior

 - **header : "none" | "source" | "load"** by defect the table have a first row has header, you can specify you want it removed.
 - **normalize : true | false** if the second table don't have the same amount of columns than the first one normalizing will match the existing columns
 - **clear : true | false** by defect the values of the load table will extend the source table, with the option *clear = true* empty strings of load table will replace the content of the source table
 - **skipHeader : true | false** skip the header in the returned table

####Return value  
return an object containing the result table and the the row that haven't been matched in the source table.
 *{ result : mergedArray, unmatched : excedentRows }*
 

###example

*inputs:*

    var source =[["beer style","name","site","alc","score"],["Dark","Chocolate stout","http://www.rogue.com/rogue_beer/chocolate-stout/",5.8,"*****"],["Dark","Guinness","https://www.guinness.com/",4.2,"****"],["IPA","cerdo voladores","http://www.barcelonabeercompany.com/en/Cerdos-Voladores",6,"***"],["IPA","monteith's","http://www.monteiths.co.nz/Beer-And-Cider/IPA",5.5,""],["IPA","Punk IPA","https://www.brewdog.com/beer/headliners/punk-ipa",5.6,"****"]]
| beer style | name            | site                                                    | alc | score |
|------------|-----------------|---------------------------------------------------------|-----|-------|
| Dark       | Chocolate stout | http://www.rogue.com/rogue_beer/chocolate-stout/        | 5.8 | \***** |
| Dark       | Guinness        | https://www.guinness.com/                               | 4.2 | \****  |
| IPA        | cerdo voladores | http://www.barcelonabeercompany.com/en/Cerdos-Voladores | 6   | \***   |
| IPA        | monteith's      | http://www.monteiths.co.nz/Beer-And-Cider/IPA           | 5.5 |       |
| IPA        | Punk IPA        | https://www.brewdog.com/beer/headliners/punk-ipa        | 5.6 | \****  |


    var load =  [[name, score], [monteith's, ****], [cerdo voladores, *****]];

| name            | score |
|-----------------|-------|
| monteith's      | \****  |
| cerdo voladores | \***** |


    var pkeys = ["name"];
    var options = {normalize:true};
    var result = tableMerger(source, load, pkeys, options);
    console.log(result);

*console.log output:*
> {"result":[["beer
> style","name","site","alc","score"],["Dark","Chocolate
> stout","http://www.rogue.com/rogue_beer/chocolate-stout/",5.8,"\*****"],["Dark","Guinness","https://www.guinness.com/",4.2,"\****"],["IPA","cerdo
> voladores","http://www.barcelonabeercompany.com/en/Cerdos-Voladores",6,"\*****"],["IPA","monteith's","http://www.monteiths.co.nz/Beer-And-Cider/IPA",5.5,"\****"],["IPA","Punk
> IPA","https://www.brewdog.com/beer/headliners/punk-ipa",5.6,"\****"]],"unMatched":[]}

*result:*  

| beer style | name            | site                                                    | alc | score |
|------------|-----------------|---------------------------------------------------------|-----|-------|
| Dark       | Chocolate stout | http://www.rogue.com/rogue_beer/chocolate-stout/        | 5.8 | \***** |
| Dark       | Guinness        | https://www.guinness.com/                               | 4.2 | \****  |
| IPA        | cerdo voladores | http://www.barcelonabeercompany.com/en/Cerdos-Voladores | 6   | \***** |
| IPA        | monteith's      | http://www.monteiths.co.nz/Beer-And-Cider/IPA           | 5.5 | \****  |
| IPA        | Punk IPA        | https://www.brewdog.com/beer/headliners/punk-ipa        | 5.6 | \****  |

