
import axios from "axios";

export const searchGamesByTitle = async (title) => {
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
  
   let results = await axios.post(`https://api.igdb.com/v4/games`,`fields name,genres.name,cover.url; search "${title}";`,{ method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
       'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
     },
 })
   return results.data;
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
 let result = await axios.post(`https://api.igdb.com/v4/games`,`fields id,name, genres, summary, rating, cover.url; where id = ${id};`,{ method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
    'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
  },
})
 return result.data;
};
