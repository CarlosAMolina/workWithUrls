// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw#Throw_an_object

function NotImplementedException() {
  this.message = "Not implemented";
  this.name = "NotImplementedException";
}

export {
  NotImplementedException
};
