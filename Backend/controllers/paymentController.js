import axios from "axios";

export const verifyKhaltiPayment = async (pidx) => {
  try {
    const headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    };

    const bodyContent = JSON.stringify({ pidx });

    const reqOptions = {
      url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const initializeKhaltiPayment = async ({
  return_url,
  website_url,
  amount,
  purchase_order_id,
  purchase_order_name,
}) => {
  try {
    const headersList = {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      return_url,
      website_url,
      amount,
      purchase_order_id,
      purchase_order_name,
    });

    const reqOptions = {
      url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
