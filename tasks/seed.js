import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as users from '../data/users.js';
import * as games from '../data/games.js';
import * as reviews from '../data/reviews.js';
import axios from "axios";

const db = await dbConnection();
await db.dropDatabase();
await db.collection('games').deleteMany({});
await db.collection('users').deleteMany({});

const adam = await users.signUpUser('Adam','Ray','adamr','P@ssword1');
const grant = await users.signUpUser('Grant','Reinecke','grantr','P@ssword1');
const alaa = await users.signUpUser('Alaa','Issa','alaai','P@ssword1');
const nicco = await users.signUpUser('Nicco','Carleton','niccoc','P@ssword1');
const sam = await users.signUpUser('Samuel','Preston','samuelp','P@ssword1');

export const getPopularGames = async () => {
    let results = await axios.post(`https://api.igdb.com/v4/games`, `fields id,name, genres.name, summary, rating, cover.url; sort rating desc; limit 50;`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
        'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
      },
    });
    results.data.forEach(game => {
      if (game.rating && typeof game.rating === 'number') {
        game.rating = game.rating.toFixed(2);
      }
    });
  
    return results.data;
  };

const popularGames = await getPopularGames();
console.log('seed');

for(let x = 0; x < popularGames.length; x++){
    let inDB = await games.isInDB(popularGames[x].id);
    if(!inDB){
    await games.createGame(popularGames[x].id,popularGames[x].name,popularGames[x].cover_url,popularGames[x].genres,popularGames[x].summary,popularGames[x].rating);
    if(x % 2 === 0){
        await reviews.addReview('adamr',popularGames[x].id,4,'Amazing Game!');
        await reviews.addLike('adamr','adamr',popularGames[x].id);
        await reviews.addLike('adamr','alaai',popularGames[x].id);
        await reviews.addLike('adamr','niccoc',popularGames[x].id);
        await reviews.addDislike('adamr','grantr',popularGames[x].id);
        await reviews.addDislike('adamr','samuelp',popularGames[x].id);
        await reviews.addReview('alaai',popularGames[x].id,3,'It was ok');
        await reviews.addLike('alaai','adamr',popularGames[x].id);
        await reviews.addLike('alaai','alaai',popularGames[x].id);
        await reviews.addLike('alaai','niccoc',popularGames[x].id);
        await reviews.addLike('alaai','grantr',popularGames[x].id);
        await reviews.addLike('alaai','samuelp',popularGames[x].id);
        await reviews.addReview('grantr',popularGames[x].id,5,'10/10 would play again');
        await reviews.addDislike('grantr','adamr',popularGames[x].id);
        await reviews.addDislike('grantr','alaai',popularGames[x].id);
        await reviews.addDislike('grantr','niccoc',popularGames[x].id);
        await reviews.addLike('grantr','grantr',popularGames[x].id);
        await reviews.addDislike('grantr','samuelp',popularGames[x].id);
        await reviews.addReview('niccoc',popularGames[x].id,1,'Absolute slop');
        await reviews.addDislike('niccoc','adamr',popularGames[x].id);
        await reviews.addDislike('niccoc','alaai',popularGames[x].id);
        await reviews.addDislike('niccoc','niccoc',popularGames[x].id);
        await reviews.addDislike('niccoc','grantr',popularGames[x].id);
        await reviews.addDislike('niccoc','samuelp',popularGames[x].id);
        await reviews.addReview('samuelp',popularGames[x].id,5,'ABSOLUTE SLOP!');
        await reviews.addLike('samuelp','adamr',popularGames[x].id);
        await reviews.addLike('samuelp','alaai',popularGames[x].id);
        await reviews.addDislike('samuelp','niccoc',popularGames[x].id);
        await reviews.addDislike('samuelp','grantr',popularGames[x].id);
        await reviews.addDislike('samuelp','samuelp',popularGames[x].id);

    }
    else{
        await reviews.addReview('adamr',popularGames[x].id,3,'could be better');
        await reviews.addDislike('adamr','adamr',popularGames[x].id);
        await reviews.addDislike('adamr','alaai',popularGames[x].id);
        await reviews.addDislike('adamr','niccoc',popularGames[x].id);
        await reviews.addDislike('adamr','grantr',popularGames[x].id);
        await reviews.addDislike('adamr','samuelp',popularGames[x].id);
        await reviews.addReview('alaai',popularGames[x].id,3,'It was ok');
        await reviews.addLike('alaai','adamr',popularGames[x].id);
        await reviews.addLike('alaai','alaai',popularGames[x].id);
        await reviews.addDislike('alaai','niccoc',popularGames[x].id);
        await reviews.addDislike('alaai','grantr',popularGames[x].id);
        await reviews.addDislike('alaai','samuelp',popularGames[x].id);
        await reviews.addReview('niccoc',popularGames[x].id,5,'10/10 would play again');
        await reviews.addDislike('niccoc','adamr',popularGames[x].id);
        await reviews.addDislike('niccoc','alaai',popularGames[x].id);
        await reviews.addDislike('niccoc','niccoc',popularGames[x].id);
        await reviews.addLike('niccoc','grantr',popularGames[x].id);
        await reviews.addDislike('niccoc','samuelp',popularGames[x].id);
        await reviews.addReview('grantr',popularGames[x].id,1,'Absolute slop');
        await reviews.addLike('grantr','adamr',popularGames[x].id);
        await reviews.addLike('grantr','alaai',popularGames[x].id);
        await reviews.addLike('grantr','niccoc',popularGames[x].id);
        await reviews.addDislike('grantr','grantr',popularGames[x].id);
        await reviews.addDislike('grantr','samuelp',popularGames[x].id);
        await reviews.addReview('samuelp',popularGames[x].id,1,'ABSOLUTE SLOP!');
        await reviews.addLike('samuelp','adamr',popularGames[x].id);
        await reviews.addLike('samuelp','alaai',popularGames[x].id);
        await reviews.addLike('samuelp','niccoc',popularGames[x].id);
        await reviews.addLike('samuelp','grantr',popularGames[x].id);
        await reviews.addLike('samuelp','samuelp',popularGames[x].id);
    }
    }
}



await closeConnection();