
const { GoogleGenAI } = require('@google/generai');
const apiKey = 'AIzaSyDYq8bmwEN2BuDMGif_aHQbDffMOMM4yJo';
const genAI = new GoogleGenAI(apiKey);

async function testModel(modelName) {
  console.log('Testing ' + modelName + '...');
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Generate a small red circle icon. Return as image.');
    console.log(modelName + ' SUCCESS: ' + JSON.stringify(result.response).substring(0, 100));
  } catch (e) {
    console.log(modelName + ' FAILED: ' + e.message);
  }
}

async function run() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-2.0-flash');
  await testModel('gemini-2.0-flash-exp-image-generation');
  await testModel('imagen-3.0-generate-001');
  await testModel('imagen-4.0-generate-001');
}

run();

