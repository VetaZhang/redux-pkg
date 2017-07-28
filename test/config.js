export default {
  domain() {
    return 'http://domain.com';
  },
  // 全局的 result 处理函数，用于处理所有请求的结果
  handleResult(result, success, failure) {
    const body = result.body;
    if (body && body.ok) {
      success(body.result);
    } else {
      failure(body.msg);
    }
  }
};
