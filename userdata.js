let username;

function setUsername(user) {
  username = user;
}

function getUsername() {
  return username;
}

module.exports = {
  setUsername,
  getUsername,
};
