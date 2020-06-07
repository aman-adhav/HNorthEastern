// const API_URL = 'http://localhost:8080';
const API_URL = 'https://us-central1-hacknortheastern-qrcodes.cloudfunctions.net/api';

var firebaseConfig = {
  apiKey: 'AIzaSyAQB7AeHJTfm3esqGDqC-ZD5Q3a4MGRAco',
  authDomain: 'hacknortheastern-qrcodes.firebaseapp.com',
  databaseURL: 'https://hacknortheastern-qrcodes.firebaseio.com',
  projectId: 'hacknortheastern-qrcodes',
  storageBucket: 'hacknortheastern-qrcodes.appspot.com',
  messagingSenderId: '208488575117',
  appId: '1:208488575117:web:73c22b2e9b5c48d87172c4',
  measurementId: 'G-ENRMNB8L6G',
};

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      console.log('auth result');
      console.log(authResult);
      console.log('user');

      // const user = firebase.auth().currentUser;
      // if (!authResult.additionalUserInfo.isNewUser) {
      //   document
      //     .querySelector('#navigator')
      //     .replacePage('create.html', { animation: 'fade', data: user });
      // }

      // document.querySelector('#navigator').replacePage('loading.html', { animation: 'fade' });
      return false;
    },
  },

  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    { provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, requireDisplayName: false },
  ],
  credentialHelper: 'none',
};

let user;

var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function () {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    cordova.plugin.http.setDataSerializer('json');

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
        console.log('onAuthStateChanged');
        user.getIdToken().then((token) => {
          console.log(user.uid);
          console.log(token);
          cordova.plugin.http.sendRequest(
            `${API_URL}/profiles/${user.uid}`,
            {
              method: 'get',
            },
            function (response) {
              const data = JSON.parse(response.data);
              user = data;
              // document
              //   .querySelector('#navigator')
              //   .replacePage('create.html', { animation: 'fade', data: user });

              document
                .querySelector('#navigator')
                .replacePage('user.html', { animation: 'fade', data: { user, token } });
            },
            function (response) {
              if (response.status === 404) {
                document
                  .querySelector('#navigator')
                  .replacePage('create.html', { animation: 'fade', data: { user, token } });
                // firebase.auth().signOut();
              }
              console.error(response);
            },
          );
          // document.querySelector('#navigator').replacePage('user.html', { animation: 'fade' });
        });
        // console.log();
      } else {
        console.log('onAuthStateChanged no user');
        document.querySelector('#navigator').replacePage('welcome.html', { animation: 'fade' });
      }
    });

    document.querySelector('#navigator').addEventListener('postpush', postPush);
  },
};

app.initialize();

// document.addEventListener('init', function (event) {
// firebase.auth().onIdTokenChanged(function (user) {
//   if (user) {
//     console.log('onIdTokenChanged');
//     console.log(user);
//   } else {
//     console.log('onIdTokenChanged no user');
//   }
// });

//   var page = event.target;

//   if (page.id === 'welcome') {
//     initWelcome(page);
//   } else if (page.id === 'qrcode') {
//     initQrcode(page);
//   }
// });

/**
 * @param {HTMLElement} page
 */
function initWelcome(page) {
  page.querySelector('#scancode').onclick = function () {
    document.querySelector('#navigator').pushPage('scan.html');
  };
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start(page.querySelector('#firebaseui-auth-container'), uiConfig);
}

/**
 * @param {HTMLElement} page
 */
function initScan(page) {
  page.querySelector('#scan-close').onclick = function () {
    document.querySelector('#navigator').popPage();
  };
}

/**
 * @param {HTMLElement} page
 */
function initQrcode(page) {
  page.querySelector('#qr-close').onclick = function () {
    document.querySelector('#navigator').popPage();
  };
  page.querySelector('#qrcode-image').style = `background-image: url('${page.data.qr.url}')`;
}

/**
 * @param {HTMLElement} page
 */
function initCreate(page) {
  page.querySelector('#create-button').onclick = function () {
    const name = page.querySelector('#create-name-input').value;
    const email = page.querySelector('#create-email-input').value;
    const phone = page.querySelector('#create-phone-input').value;
    const description = page.querySelector('#create-description-input').value;
    if (!name || !name.length) return;
    if (!email || !email.length) return;
    if (!phone || !phone.length) return;
    if (!description || !description.length) return;
    let token;

    firebase
      .auth()
      .currentUser.getIdToken()
      .then(async (idToken) => {
        token = idToken;
        cordova.plugin.http.sendRequest(
          `${API_URL}/profiles`,
          {
            method: 'post',
            data: { name, email, description, phone, socials: [] },
            headers: { Authorization: `Bearer ${idToken}` },
          },
          function (response) {
            const data = JSON.parse(response.data);
            user = data;
            // document
            //   .querySelector('#navigator')
            //   .replacePage('create.html', { animation: 'fade', data: user });

            document
              .querySelector('#navigator')
              .replacePage('user.html', { animation: 'fade', data: { user, token } });
          },
          function (response) {
            console.error(response);
          },
        );
      });
  };
}

/**
 * @param {HTMLElement} page
 */
function initUser(page) {
  // console.log(cordova);
  // console.log(firebase.auth().currentUser);
  const { user, token } = page.data;
  console.log(user);

  // const $socials = page.querySelector('#socials');

  page.querySelector('#user-socials-add').onclick = function () {
    if (page.querySelector('#user-socials-add').disabled) return;

    const dialog = document.querySelector('#user-socials-create');
    if (dialog) {
      dialog.querySelector('#user-dialog-url-input').value = '';
      dialog.querySelector('#user-dialog-type-input').value = 'devpost';
      dialog.show();
      return;
    }

    ons.createElement('user-socials-create.html', { append: true }).then(function (dialog) {
      dialog.show();

      dialog.querySelector('#user-dialog-button-cancel').onclick = function () {
        dialog.hide();
      };

      dialog.querySelector('#user-dialog-button-add').onclick = function () {
        const type = dialog.querySelector('#user-dialog-type-input').value;
        const url = dialog.querySelector('#user-dialog-url-input').value;

        if (!url || !url.length) return;

        user.socials.push({ type, url });

        updateSocials(user.socials, page);

        if (user.socials.length >= 5) {
          page.querySelector('#user-socials-add').disabled = true;
        }

        console.log(user.socials);
        dialog.hide();
      };
    });
  };

  page.querySelector('#user-socials-save').onclick = function () {
    const profile = { ...user };
    delete profile.id;

    saveSocial(profile, token)
      .then(() => {
        ons.notification.toast('Saved', {
          timeout: 2000,
        });
      })
      .catch((err) => {
        ons.notification.toast('Failed to save', {
          timeout: 2000,
        });
      });
  };

  page.querySelector('#user-logout').onclick = function () {
    firebase.auth().signOut();
  };

  page.querySelector('#user-qr-show').onclick = function () {
    document.querySelector('#navigator').pushPage('qrcode.html', { data: { qr: user.qr } });
  };

  page.querySelector('#user-qr-scan').onclick = function () {
    document.querySelector('#navigator').pushPage('scan.html', { data: { user } });
  };

  page.querySelector('#text-name').textContent = user.name;

  updateSocials(user.socials, page);

  page.classList.remove('hidden');
}

function saveSocial(profile, accessToken) {
  delete profile.id;
  delete profile.created;
  delete profile.updated;
  delete profile.qr;
  if (profile.socials.length) {
    profile.socials.forEach((social) => {
      delete social.image;
    });
  }

  console.log(profile);

  return new Promise((resolve, reject) => {
    cordova.plugin.http.sendRequest(
      `${API_URL}/profiles`,
      {
        method: 'put',
        data: profile,
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      function () {
        resolve();
      },
      function (response) {
        console.error(response);
        reject(JSON.parse(response.error));
      },
    );
  });
}

function updateSocials(socials, page) {
  const $socials = page.querySelector('#socials');

  if (!socials.length) {
    $socials.textContent = "You don't have any socials, add one now.";
    return;
  }
  $socials.textContent = '';

  const $card = document.querySelector('#socials-card-template').content.cloneNode(true);

  if (!socials[0].image) socials[0].image = { url: '' };

  const card1 = $card.cloneNode(true);
  card1.querySelector('.socials-image').src = `images/${socials[0].type}.png`;
  card1.querySelector('.socials-input').textContent = socials[0].url;
  card1.querySelector('.socials-button-delete').onclick = function () {
    socials.splice(0, 1);
    updateSocials(socials, page);
  };
  $socials.append(card1);

  for (let i = 1; i < socials.length; i++) {
    if (!socials[i].image) socials[i].image = { url: '' };

    const card = $card.cloneNode(true);
    card.querySelector('.socials-image').src = `images/${socials[i].type}.png`;
    card.querySelector('.socials-input').textContent = socials[i].url;
    card.querySelector('.socials-button-delete').onclick = function () {
      socials.splice(i, 1);
      updateSocials(socials, page);
    };
    $socials.append(card);
  }
}

function postPush(event) {
  switch (event.enterPage.id) {
    case 'welcome':
      initWelcome(event.enterPage);
      break;
    case 'qrcode':
      initQrcode(event.enterPage);
      break;
    case 'user':
      initUser(event.enterPage);
      break;
    case 'scan':
      initScan(event.enterPage);
      break;
    case 'create':
      initCreate(event.enterPage);
      break;
    default:
      break;
  }
}
