exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const NOTCHPAY_KEY = process.env.NOTCHPAY_KEY;
    if (!NOTCHPAY_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ message: "Server missing NOTCHPAY_KEY" }) };
    }
    const res = await fetch("https://api.notchpay.co/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": NOTCHPAY_KEY
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: body.currency || "XAF",
        email: body.email || "customer@greenzoneslip.com",
        description: body.description || "Greenzoneslip Payment"
      })
    });
    const data = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Network error. Try again", error: err.message }) };
  }
};
