async function test() {
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful AI." },
        { role: "user", content: "Hello!" }
      ],
      model: "openai"
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } else {
    console.log("Error:", response.status, await response.text());
  }
}

test();
