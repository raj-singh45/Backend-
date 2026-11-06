import fs from 'fs/promises';
import{CONFIG_DIR,HOME_DIR} from "./constant.js"
import path from 'path';
// return the content of setting file if it exists,if does not exist create the file and return the content of setting file
export async function getSettingsFile(){
    try {
        //CONFIG_DIR is the directory where the settings file will be stored, it is defined in constant.js, path is C:\Users\rajsi\.beta
     await fs.access(CONFIG_DIR);//it will check if the directory exists or not
    } catch (error) {
      await fs.mkdir(CONFIG_DIR, { recursive: true }); //create the directory if it does not exist
    }
    const settingsFilePath = path.join(CONFIG_DIR, 'settings.json');
    try {
      await fs.access(settingsFilePath); //check if the file exists or not
      const content = await fs.readFile(settingsFilePath, 'utf8');
      return JSON.parse(content);
    }
    catch(err){
        await fs.writeFile(settingsFilePath, JSON.stringify({})); //create the setting file if it does not exist
        return {};
    }
    //sbse pehle ye check karega ki CONFIG_DIR exist karta hai ya nahi, agar nahi karta to ye directory create karega. Phir ye check karega ki settings.json file exist karti hai ya nahi, agar nahi karti to ye file create karega aur empty object return karega. Agar file exist karti hai to uska content read karke return karega.
}


export async function saveApiKey(apiKey){
    const settingsFilePath = path.join(CONFIG_DIR, 'settings.json');
    const settings = await getSettingsFile();
    settings.apiKey = apiKey;
    await fs.writeFile(settingsFilePath, JSON.stringify(settings));
}   
// get api key from settings.json file
export async function getApiKey(){
    const settings = await getSettingsFile();
    return settings.apiKey || null;
}   