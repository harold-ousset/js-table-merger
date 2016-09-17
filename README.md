# js table merger
## merge two-dimensional arrays
----------


example:

inputs:

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
    var result = tableMerger(source, load, pkeys);
    console.log(result);


> {"result":[["beer
> style","name","site","alc","score"],["Dark","Chocolate
> stout","http://www.rogue.com/rogue_beer/chocolate-stout/",5.8,"\*****"],["Dark","Guinness","https://www.guinness.com/",4.2,"\****"],["IPA","cerdo
> voladores","http://www.barcelonabeercompany.com/en/Cerdos-Voladores",6,"\*****"],["IPA","monteith's","http://www.monteiths.co.nz/Beer-And-Cider/IPA",5.5,"\****"],["IPA","Punk
> IPA","https://www.brewdog.com/beer/headliners/punk-ipa",5.6,"\****"]],"unMatched":[]}

result:  

| beer style | name            | site                                                    | alc | score |
|------------|-----------------|---------------------------------------------------------|-----|-------|
| Dark       | Chocolate stout | http://www.rogue.com/rogue_beer/chocolate-stout/        | 5.8 | \***** |
| Dark       | Guinness        | https://www.guinness.com/                               | 4.2 | \****  |
| IPA        | cerdo voladores | http://www.barcelonabeercompany.com/en/Cerdos-Voladores | 6   | \***** |
| IPA        | monteith's      | http://www.monteiths.co.nz/Beer-And-Cider/IPA           | 5.5 | \****  |
| IPA        | Punk IPA        | https://www.brewdog.com/beer/headliners/punk-ipa        | 5.6 | \****  |

