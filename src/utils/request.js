import NProgress from 'nprogress';
import fetch from 'dva/fetch';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const request = (url, options = {}) => {
  NProgress.start();

  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json;charset=UTF-8';
  options.headers['Accept'] = 'application/json';

  NProgress.inc();

  return fetch(url, options)
    .then((response) => {
      if (response.ok) return response;
      const error = new Error('服务器内部错误，请稍后再试');
      error.response = response;
      return error;
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { message, success } = data;
      if (!success) throw new Error(message);
      return data;
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => {
      NProgress.done();
    });
};

export default request;
