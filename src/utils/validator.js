export function checkPassword(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]|[_]){6,18}$/;
  if (value && !reg.test(value)) {
    callback('密码只能由6~18位字符，只能包含英文字母、数字、下划线');
  } else {
    callback();
  }
}

export function checkNewPassword(rule, value, callback, ollPassword) {
  const reg = /^([a-zA-Z0-9]|[_]){6,18}$/;
  if (value && value === ollPassword) {
    callback('新密码和原密码不能相同，请重新输入新密码');
  } else if (value && !reg.test(value)) {
    callback('密码只能由6~18位字符，只能包含英文字母、数字、下划线');
  } else {
    callback();
  }
}

export function checkConfirmPassword(rule, value, callback, newPassword) {
  if (value && value !== newPassword) {
    callback('新密码和确认密码不一致，请重新输入确认密码');
  } else {
    callback();
  }
}

export function checkOrderNum(rule, value, callback) {
  const reg = /^([0-9]){1,2}$/;
  if (value && !reg.test(value)) {
    callback('排序号只能输入数字（0～99）');
  } else {
    callback();
  }
}

export function checkIP(rule, value, callback) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (value && !reg.test(value)) {
    callback('IP格式不正确');
  } else {
    callback();
  }
}

export function checkIPs(rule, value, callback) {
  const pattern = /[^\d^.,]+/g;
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (!value) {
    callback();
    return;
  }
  if (pattern.test(value)) {
    callback('IP格式不正确');
  } else {
    const valueArr = value.split(',');
    valueArr.forEach(val => {
      if (!reg.test(val)) {
        callback('IP格式不正确');
      }
    });
    callback();
  }
}

export function checkIPForEnd(rule, value, callback, getFieldValue) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (value && !reg.test(value)) {
    callback('IP格式不正确');
  } else {
    const endField = rule.field;
    const startField = endField.replace('ends', 'starts');
    const startValue = getFieldValue(startField);

    if (startValue && value) {
      const startValueArr = startValue.split('.');
      const endValueArr = value.split('.');
      if (
        startValueArr[0] !== endValueArr[0] ||
        startValueArr[1] !== endValueArr[1] ||
        startValueArr[2] !== endValueArr[2]
      ) {
        callback('必须和开始ip的前三位相同');
      } else if (Number(startValueArr[3]) >= Number(endValueArr[3])) {
        callback('开始ip必须小于结束ip');
      }
    }
    callback();
  }
}

export function checkPort(rule, value, callback) {
  const pattern = /^[0-9]*$/;
  if (!value) {
    callback();
    return;
  }
  if (!pattern.test(value)) {
    callback('端口号格式不正确');
  } else if (Number(value) > 65535) {
    callback('端口号不能大于65535');
  } else {
    callback();
  }
}

export function checkName(rule, value, callback) {
  if (value && value.length > 15) {
    callback('最长只能输入15个字符');
  } else {
    callback();
  }
}

export function checkID(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  // 加权因子
  const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  const code = `${value}`;
  const last = value[17]; // 最后一位

  const seventeen = code.substring(0, 17);

  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  const arr = seventeen.split('');
  const len = arr.length;
  let num = 0;
  for (let i = 0; i < len; i += 1) {
    num += arr[i] * weightFactor[i];
  }

  // 获取余数
  const resisue = num % 11;
  const lastNo = checkCode[resisue];

  // 格式的正则
  // 正则思路
  /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
  const idcardPatter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

  // 判断格式是否正确
  const format = idcardPatter.test(value);

  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  // return  ? true : false;
  if (last === lastNo && format) {
    callback();
  } else {
    callback('请输入正确的身份证号码');
  }
}

export function checkPhone(rule, value, callback) {
  const reg = /^1[3456789]\d{9}$/;
  if (value && !reg.test(value)) {
    callback('请输入正确的手机号码');
  } else {
    callback();
  }
}

export function checkCarNum(rule, value, callback) {
  // var reg = /^1[3456789]\d{9}$/;
  const reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/;
  if (value && !reg.test(value)) {
    callback('请输入正确的车牌号');
  } else {
    callback();
  }
}
