const userDto = (user) => {
  const {
    _id,
    firstName,
    lastName,
    email,
    image,
    occupation,
    location,
    bio,
    followers,
    following,
    publications,
  } = user;
  return {
    _id,
    firstName,
    lastName,
    email,
    image,
    occupation,
    location,
    bio,
    followers,
    following,
    publications,
  };
};
module.exports = userDto;
