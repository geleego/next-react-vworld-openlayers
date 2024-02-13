import axios from 'axios';

const urls = {
  'default': process.env.API_URL
};

const CancelToken = axios.CancelToken;
export let cancel;


/**
 * API 요청 (GET)
 * @param {string} resource 
 * @param {string} type
 */
export async function getAPIData(resource, api='default') {
  if (!(api in urls)) {
    console.warn(`'${api}' type not exist`);
    return;
  }
  const url = urls[api] + resource;

  try {
    const res = await axios.get(url, {
      cancelToken: new CancelToken(function excutor(c) {
        cancel = c;
      })
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * API 요청 (POST)
 * @param {string} resource
 * @param {object} data
 * @param {string} type
 */
export async function postAPIData(resource, data=null, type='default') {
  if (!(type in urls)) {
    console.warn(`'${type}' type not exist`);
    return;
  }
  const url = urls[type] + resource;

  try {
    const res = await axios.post(url, data);

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * API 요청 (PUT)
 * @param {string} resource
 * @param {object} data
 * @param {string} type
 */
export async function putAPIData(resource, data=null, type='default') {
  if (!(type in urls)) {
    console.warn(`'${type}' type not exist`);
    return;
  }
  const url = urls[type] + resource;

  try {
    const res = await axios.put(url, data);

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * API 요청 (DELETE)
 * @param {string} resource
 * @param {string} type
 */
export async function deleteAPIData(resource, type='default') {
  if (!(type in urls)) {
    console.warn(`'${type}' type not exist`);
    return;
  }
  const url = urls[type] + resource;

  try {
    const res = await axios.delete(url);

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
