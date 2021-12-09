const baseEndpointURL = "https://tinygram-webandcloud.uc.r.appspot.com/_ah/api/tinyInsta/v1/";

const EndpointURL = {
  follow: {
    method: "put",
    url: baseEndpointURL + "follow"
  },
  login: {
    method: "post",
    url: baseEndpointURL + "login"
  },
  addPost: {
    method: "post",
    url: baseEndpointURL + "addPost"
  },
  newPosts: {
    method: "get",
    url: baseEndpointURL + "posts"
  },
  likePost: {
    method: "post",
    url: baseEndpointURL + "like"
  },
  getUserInfos: {
    method: "get",
    url: baseEndpointURL + "user/{userEmail}"
  },
  getUserPosts: {
    method: "get",
    url: baseEndpointURL + "user/{userEmail}/posts"
  },
  getPost: {
    method: "get",
    url: baseEndpointURL + "post/{postId}"
  }
}

/**
 * classe regroupant les actions opérables par un utilisateur
 */
const User = {
  login: (googleUser) => {
    var profile = googleUser.getBasicProfile();
    
    const user = {
        email: profile.getEmail(),
        name: profile.getName(),
        url: profile.getImageUrl()
    };
    
    sessionStorage.setItem("user", JSON.stringify(user));
    
    axios[EndpointURL.login.method](EndpointURL.login.url, user)
        .then(e => window.location = "/")
        .catch(e => {
            console.log(e);
            alert("Erreur lors de l'enregistrement de l'utilisateur");
        })
  },

  logout: () => {
    gapi.load('auth2', function() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut()
        .then(() => {
          alert("Déconnexion");
          sessionStorage.clear();
          window.location = "";
        })
        .catch(e => {
          alert("Erreur lors de la déconnexion");
          console.log(e);
        });
    });
  },

  /**
   * Fonction de like d'un post
   * @param {string} postId
   * @param  {string} userEmail
   */
  likePost: (postId) => {
    axios[EndpointURL.likePost.method](EndpointURL.likePost.url, {postId, userEmail: JSON.parse(sessionStorage.getItem("user")).email})
        .then(e => {
            View.updateLikeCount(postId.replace(/\_/g, " "))
        })
        .catch(error => {
            console.log(error);
            alert("Erreur lors du like")
        });
  },

  makePost: () => {
    const url = document.getElementById("imageURL").value;
    const body = document.getElementById("description").value;

    if (!url || !body) {
        alert("Veuillez remplir tous les champs.");
        return null;
    }

    // Récupérer l'owner depuis le sessionStorage
    const owner = JSON.parse(sessionStorage.getItem("user")).email;

    axios[EndpointURL.addPost.method](EndpointURL.addPost.url, {owner, url, body})
        .then(e => {
            alert("Post ajouté avec succès");
            window.location = "/";
        })
        .catch(error => {
            console.log(error);
            alert("Erreur lors de la publication")
        });
  },

  getUserInfos: () => {
    axios[EndpointURL.getUserInfos.method](EndpointURL.getUserInfos.url.replace("{useremail}", email))
        .then(e => {
            console.log(e);
            
        })
        .catch(error => {
            console.log(error);
            alert("Erreur récupération informations utilisateur")
        });
  } 
}

const View = {
  listNewPosts : () => {
      axios[EndpointURL.newPosts.method](EndpointURL.newPosts.url)
        .then(e => {
            document.getElementById("new-posts").innerHTML = e.data.items.map(item => View.createPostView(item.properties)).join("");
            async () => {
                for (const item of e.data.items) {
                    axios[EndpointURL.getUserInfos.method]([Endpoint.getUserInfos.url].replace("{userEmail}", item.properties.owner))
                        .then(e => document.getElementById(postData.id.replace(/ /g, "-") + "-userImage").src = e.data.items[0].properties.url)
                }
            }
        })
        .catch (e => {
            console.log(error);
            alert("Erreur chargement des derniers Posts")
        })
  },

  createPostView : (postData) => {
    return (
      `<div class="w-full mb-2 border pb-4">
          <!-- Informations utilisateur -->
          <div class="flex text-left items-center m-2">
              <img id=${postData.id.replace(/ /g, "-") + "-userImage"} src=${postData.userImgURL} alt="image" class="mr-2 rounded-full" style="height:30px; width:30px">
              <label class="mr-2 font-bold">${postData.owner}</label>
              <label class="text-blue-400 cursor-pointer hover:text-blue-600">• S'abonner</label>
          </div>
          
          <!-- Image de la publication -->
          <img src=${postData.url} alt="image" class="w-full mb-2 shadow">

          <!-- Nombre de likes -->
          <div class="text-gray-600 text-left font-bold m-2 mb-4 flex items-center">
              <label class="flex-grow">
                <label id=${postData.id.replace(/ /g, "_") + "-likeCount"}>
                    ${postData.likeCount}
                </label>
                J'aime
              </label>
              
              <label>${formatDate(postData.date)}</label>
          </div>
          
          <!-- Texte de la publication -->
          <div class="text-gray-600 text-left m-2 mb-4">
              <label>${postData.body}</label>
          </div>
          
          <!-- J'aime -->
          <div class="text-center">
              <label
                class="rounded shadow text-gray-500 p-2 cursor-pointer font-medium hover:border hover:text-red-500 duration-100 ease-in-out"
                onclick="User.likePost('${postData.id}')"
              >
                ♥ J'aime
              </label>
          </div>
      </div>`
    );
  },

  listUserNewPosts : () => {
    axios[EndpointURL.getUserPosts.method](EndpointURL.getUserPosts.url.replace("{userEmail}", JSON.parse(sessionStorage.getItem("user")).email))
      .then(e => {
          document.getElementById("new-posts").innerHTML = e.data.items.map(item => View.createUserPostView(item.properties)).join("");
      })
      .catch (e => {
          console.log(error);
          alert("Erreur chargement des derniers Posts")
      });
  },

  createUserPostView : (postData) => {
    return (
      `<div class="w-full mb-2 border pb-4">          
          <!-- Image de la publication -->
          <img src=${postData.url} alt="image" class="w-full mb-2 shadow">

          <!-- Nombre de likes -->
          <div class="text-gray-600 text-left font-bold m-2 mb-4 flex items-center">
              <label class="flex-grow">
                <label id=${postData.id.replace(/ /g, "_") + "-likeCount"}>
                    ${postData.likeCount}
                </label>
                J'aime
              </label>
              
              <label>${formatDate(postData.date)}</label>
          </div>
          
          <!-- Texte de la publication -->
          <div class="text-gray-600 text-left m-2 mb-4">
              <label>${postData.body}</label>
          </div>
          
          <!-- J'aime -->
          <div class="text-center">
              <label
                class="rounded shadow text-gray-500 p-2 cursor-pointer font-medium hover:border hover:text-red-500 duration-100 ease-in-out"
                onclick="User.likePost('${postData.id}')"
              >
                ♥ J'aime
              </label>
          </div>
      </div>`
    );
  },
  
  updateLikeCount: (postId) => {
    axios[EndpointURL.getUserPosts.method](EndpointURL.getUserPosts.url.replace("{postId}", postId))
        .then(e => {
            document.getElementById(postId.replace(/ /g, "_") + "-likeCount").innerHTML = e.data.properties.likeCount
        });
  }
}

function isUserConnected() {
    return Boolean(sessionStorage.getItem("user"));
}

function formatDate(date) {
    date = date.split(" ")[0].split("-");
    return [date[2], date[1], date[0]].join("/");
}

// // Si l'utilisateur n'est pas connecté
if (!isUserConnected() && window.location.pathname !== "/login.html") {
    window.location = "/login.html";
}

// // Chargement automatique des derniers posts sur la page d'accueil
if ("/home.html".includes(window.location.pathname) && isUserConnected()) {
    View.listNewPosts();
}