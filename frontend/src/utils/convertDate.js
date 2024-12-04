export const convertDate = (dat) => {
  var a = new Date(dat);

  var res = [
    addLeadZero(a.getDate()),
    addLeadZero(a.getMonth() + 1),
    a.getFullYear(),
  ].join(".");

  function addLeadZero(val) {
    if (+val < 10) return "0" + val;
    return val;
  }

  return res;
};
