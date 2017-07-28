/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var request = require('request');
var Promise = require('bluebird');

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {

  return getUsername(readFilePath)
  .then((username) => {
    if (!username) {
      throw new Error('There is no username');
    } else {
      return fetchGithubProfile(username);
    }
  })
  .then((simpleProfile) => {
    if (!simpleProfile) {
      throw new Error('There is a problem getting the GitHub profile');
    } else {
      return writeProfileToFile(writeFilePath, simpleProfile);
    }
  })
};

var getUsername = (readFilePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(readFilePath, 'utf8', (err, content) => {
      if(err) {
        reject (err);
      } else {
        resolve (content.split('\r\n')[0]);
      }
    });
  })
}

var fetchGithubProfile = (username) => {
  return new Promise((resolve, reject) => {
    var options = {
      url: 'https://api.github.com/users/' + username,
      headers: { 'User-Agent': 'request' },
      json: true  // will JSON.parse(body) for us
    };

    request.get(options, function(err, data, body) {
      if (err) { return reject(err); }

      var simpleProfile = {
        id: body.id,
        handle: body.login,
        name: body.name,
        company: body.company,
        location: body.location
      };
      resolve(simpleProfile);
    });
  });
}

var writeProfileToFile = (filepath, profileObj) => {
  return new Promise ((resolve, request) => {
    fs.writeFile(filepath, JSON.stringify(profileObj), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('Write Successful!');
      }
    })
  })
}

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
