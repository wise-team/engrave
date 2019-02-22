var email = document.getElementById("email")
  , email_repeat = document.getElementById("email_repeat");

function validateEmail(){
  if(email.value != email_repeat.value) {
    email_repeat.setCustomValidity("Email addresses does not match");
  } else {
    email_repeat.setCustomValidity('');
  }
}

email.onchange = validateEmail;
email_repeat.onkeyup = validateEmail;