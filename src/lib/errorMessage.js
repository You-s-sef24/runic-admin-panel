export default function errorMessage(error) {
  const data = error.response?.data;
  return data?.message || data?.errors?.[0]?.msg || error.message;
}