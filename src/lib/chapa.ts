export const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || "";

export async function initializeChapaTransaction(options: {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization: {
    title: string;
    description: string;
  };
}) {
  const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to initialize Chapa transaction");
  }

  return data;
}
