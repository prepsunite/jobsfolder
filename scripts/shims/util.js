export default {
  inspect: function (obj) {
    return typeof obj === 'string' ? obj : JSON.stringify(obj);
  }
};
export const inspect = function (obj) {
  return typeof obj === 'string' ? obj : JSON.stringify(obj);
};
