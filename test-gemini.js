// Test Gemini API locally
// Run with: node test-gemini.js

const API_KEY = 'AIzaSyDOljX48UExmKQikS9CmevwuI-tzGj1IJM';

async function testGemini() {
  console.log('Testing Gemini API...\n');

  // Test 1: List available models
  console.log('1. Listing available models:');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('Available models:');
      data.models.forEach(model => {
        if (model.name.includes('gemini')) {
          console.log(`  - ${model.name}`);
          console.log(`    Supports: ${model.supportedGenerationMethods?.join(', ')}`);
        }
      });
    } else {
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
  }

  console.log('\n2. Testing generateContent with text:');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say hello!' }]
        }]
      })
    });
    
    const data = await response.json();
    if (data.candidates) {
      console.log('Success! Response:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGemini();
