const NameValidation = (name) => {
  const regex = /(?=.*[a-z]).{6,15}$/;
  if (name.match(regex)) return true;
  return false;
};

const EmailValidation = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regex)) return true;
  return false;
};

const PasswordValidation = (password) => {
  const regex = /(?=.*[a-z])(?=.*\d).{6,20}$/;
  if (password.match(regex)) return true;
  return false;
};

export { NameValidation, EmailValidation, PasswordValidation };
