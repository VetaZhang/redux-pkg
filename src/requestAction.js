import request from 'superagent-bluebird-promise';

let globalConfig = {};

class requestAction {
  constructor({key = '', reqInfo = {}, dispatch, options = {}}) {
    this.key = key;
    this.reqInfo = reqInfo;
    this.options = options;
    this.dispatch = dispatch;
    this.url = transParam(this.reqInfo.url, this.options.param);
  }
  action(subKey, value) {
    this.dispatch({
      type: `${this.key}/diff`,
      subKey,
      value
    });
  }
  getRequest(url) {
    return request[this.reqInfo.method](url);
  }
  getUrl() {
    if (globalConfig.domain) {
      return globalConfig.domain() + this.url;
    } else {
      throw 'Can not find domain';
    }
  }
  run() {
    let req = this.getRequest(this.getUrl());

    this.action('state', this.reqInfo.funcName);
    this.action('error', '');

    if (this.options.query) {
      req = req.query(this.options.query);
    }
    if (this.options.body) {
      req = req.send(this.options.body);
    }

    return req.then((result) => {
      return new Promise((resolve, reject) => {
        if (globalConfig.handleResult) {
          globalConfig.handleResult(result, (data) => {
            // success
            if (this.reqInfo.handleResult) {
              data = this.reqInfo.handleResult(data);
            }
            if (this.reqInfo.autoUpdateValue) {
              this.action('value', data);
            }
            this.action('error', null);
            this.action('state', null);
            resolve(data);
          }, (error) => {
            // failure
            this.action('error', error);
            if (this.reqInfo.autoUpdateValue) {
              this.action('value', null);
            }
            this.action('state', null);
            reject(error);
          });
        } else {
          resolve(result);
        }
      });
    });
  }
}

const transParam = (url, paramObj) => {
  if (typeof paramObj === 'object') {
    for (let key in paramObj) {
      if (paramObj.hasOwnProperty(key)) {
        url = url.replace(`{${key}}`, paramObj[key]);
      }
    }
  }
  return url;
};

const setGlobalConfig = (config) => {
  globalConfig = config;
};

export {
  requestAction,
  setGlobalConfig
};
