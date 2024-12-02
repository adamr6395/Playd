

import axios from "axios";

export const searchGamesByTitle = async (title) => {
 let results = [];
 if(!title){
  throw new Error ("Must provide a title");
 }
 if(typeof title !== 'string'){
  throw new Error ("title must be a non empty string");
 }
 title = title.trim();
 if(title.length === 0){
  throw new Error ("title must be a non empty string");
 }
 for(let pg = 1; pg <= 5; pg++){
  let result = await axios.get(``)
  if(result.data.Response == 'False'){
    if(pg === 1){
      throw new Error('No Games Found');
    }
    break;
  } 
  results = results.concat(result.data.Search);
}
return results 
};

export const getGameById = async (id) => {
 if(!id){
  throw new Error ("Must provide a id");
 }
 if(typeof id !== 'string'){
  throw new Error ("id must be a non empty string");
 }
 id = id.trim();
 if(id.length === 0){
  throw new Error ("id must be a non empty string");
 }
 let result = await axios.get (``);
 if(result.data.Response == 'False'){
  throw new Error('No Game Found');
 }
 return result.data;
};
