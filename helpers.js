import xss from 'xss';

const exportedMethods = {

  checkString(strVal, varName) {
    if (!strVal) throw new Error(`Error: You must supply a ${varName}!`);
    if (typeof strVal !== 'string') throw new Error(`Error: ${varName} must be a string!`);
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw new Error (`Error: ${varName} cannot be an empty string or string with just spaces`);
    if (!isNaN(strVal))
      throw new Error (`Error: ${strVal} is not a valid value for ${varName} as it only contains digits`);
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  }
};

export const validateFirstName = (firstName) => {
  if (typeof firstName !== 'string' || firstName.length < 2 || firstName.length > 25 || !firstName) 
      throw "Error: firstName must be a non-empty string between 2 and 25 characters";
  return xss(firstName);
}

export const validateLastName = (lastName) => {
  if (typeof lastName !== 'string' || lastName.length < 2 || lastName.length > 25 || !lastName) 
      throw "Error: lastName must be a non-empty string between 2 and 25 characters";
  return xss(lastName);
}

export const validateUserId = (userId) => {
  if (typeof userId !==  'string' || userId.length < 5 || userId.length > 10 || !userId) 
      throw "Error: userId must be a non-empty string between 5 and 10 characters";
  return xss(userId);
}

export const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 8 || !password) 
      throw "Error: password must be a non-empty string over 8 characters";
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
      throw "Error: password must include at least one uppercase letter, one number and one special character.";  
  return xss(password);
}

export default exportedMethods;
