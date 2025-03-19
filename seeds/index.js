if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_KEY;

mongoose.connect('mongodb://localhost:27017/yelp-camp',)
  .then(() => {
    console.log('MongoDBコネクションOK!');
  })
  .catch(err => {
    console.log('コネクションエラー！');
    console.log(err);
  });

/* 配列の要素をランダムに取得 */
const randomIndex = array => array[Math.floor(Math.random() * array.length)];

/* データベースに複数のモデルインスタンスを追加 */
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++){
    const price = Math.floor(Math.random() * 2000) + 1000; 
    const camp = new Campground({
      author: process.env.TESTUSER_ID,
      title: `${randomIndex(descriptors)}・${randomIndex(places)}`,
      images:[
        {
          url:`https://picsum.photos/300?random=${Math.random()}`,
        }
      ],
      location: `${randomIndex(cities).prefecture}${randomIndex(cities).city}`,
      geometry: {
        type:'Point',
        coordinates:[
          randomIndex(cities).longitude,
          randomIndex(cities).latitude,
        ],
      },
      description: 'あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では',
      price,
    });
    await camp.save();
  }
}

/* コネクション切断 */
seedDB().then(() => {
  mongoose.connection.close();
  console.log('mongoDBコネクション切断完了!');
});