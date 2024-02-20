import fs from 'fs';
import mongoose from 'mongoose';
import { config } from '.';

mongoose.connect(config.mongodb.uri).then(() => console.log('DB connection successful!'));

// const tags = JSON.parse(fs.readFileSync(`${__dirname}/tags.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));


const importData = async () => {
   try {
      console.log('Data successfully loaded!');
   } catch (err) {
      console.log(err);
   }
   process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
   try {
      // TODO
      // clear up some data
      console.log('Data successfully deleted!');
   } catch (err) {
      console.log(err);
   }
   process.exit();
};

if (process.argv[2] === '--import') {
   importData();
} else if (process.argv[2] === '--delete') {
   deleteData();
}

console.log(process.argv);