import {getApiKey, getSettingsFile, saveApiKey} from './utils/file.utils.js';
import rl from './utils/readline.js';


async function main(){
    const settings = await getSettingsFile();
    console.log(settings);
    if(!settings.apiKey){
        console.error("API key is not set");
        const apiKey = await rl.question("Please enter your OpenAI API key: ");
        await saveApiKey(apiKey);
    }

    const apiKey = await getApiKey();
    console.log(`Your OpenAI API key is: ${apiKey}`);
  rl.close()
}
export default main;

