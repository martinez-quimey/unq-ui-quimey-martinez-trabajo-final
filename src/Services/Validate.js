
import api from "./Api";

export const getValidate = async (palabra) => {
  const response = await api.get("/api/validate", {
    params: {
      word: palabra,
    },
  });

  return response.data.exists;
};
