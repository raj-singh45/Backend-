import { getApiKey, getSettingsFile, saveApiKey } from "./utils/file.utils.js";
import rl from "./utils/readline.js";

async function main() {
  const settings = await getSettingsFile();
  console.log(settings);
  if (!settings.apiKey) {
    const apiKey = await rl.question("Please enter your OpenAI API key: ");
    await saveApiKey(apiKey);
  }
  
  const response = await getApiKey();
  if (response.error) {
    console.error("Invalid OR Expired API key");
    const apiKey = await rl.question("Please enter your OpenAI API key: ");
    await saveApiKey(apiKey);
    return main();
  }
  rl.close();
}
export default main;
