const axios = require("axios").default;
const {
  getEndpoint
} = require("./config")

async function isUrlAvailable(url) {

  try {
    const response = await axios.get(url);

    if (response.status == 200){
      return true;
    } else {
      return false;
    }
  } catch (ex) {
    if (ex.code == "ENOTFOUND" || ex.code == "ECONNREFUSED"){
      return false;
    } else {
      console.error("Exception trying to connect! \nError code: " + 
      ex.code + "; Message: " + ex.message);
      process.exit(1);
    }
  }
}

async function isAvailable(){
  let endpoint = await getEndpoint();
  return await isUrlAvailable(endpoint);
}

module.exports = {
  isAvailable: isAvailable
}
