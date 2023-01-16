import { Configuration, OpenAIApi } from 'openai';

if(process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY==""){
  console.log("🛑 OPENAI API key not found.");
}
if(process.env.RECOMMENDATION_LIST || process.env.RECOMMENDATION_LIST==""){
  console.log("🛑 RECOMMENDATION_LIST property not found.");
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Recommend ${process.env.RECOMMENDATION_LIST} song that match with vibe of the book `;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}"${req.body.userInput}"`);

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}"${req.body.userInput}"`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;