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
    const customerPhone = body.phone ? (body.phone.startsWith("+") ? body.phone : "+237" + body.phone) : undefined;
    
    const payload = {
      amount: body.amount,
      currency: body.currency || "XAF",
      customer: {
        email: body.email || "customer@greenzoneslip.com",
        name: body.name || "Customer",
        phone: customerPhone || body.phone || "+237673855887"
      },
      description: body.description || "Greenzoneslip Payment",
      reference: "GZ-" + Date.now(),
      callback: "https://greenzoneslippay.netlify.app"
    };

    const res = await fetch("https://api.notchpay.co/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": NOTCHPAY_KEY
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: true, message: data.message || "NotchPay error", details: data }) };
    }
    
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Network error. Try again", error: err.message }) };
  }
};
