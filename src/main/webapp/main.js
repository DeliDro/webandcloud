const baseEndpointURL = "https://tinygram-webandcloud.uc.r.appspot.com/_ah/api/tinyInsta/v1/";

const EndpointURL = {
  follow: {
    method: "",
    url: baseEndpointURL + ""
  },
  addPost: {
    method: "post",
    url: baseEndpointURL + "fillposts"
  },
  newPosts: {
    method: "get",
    url: baseEndpointURL + "posts"
  },
  likePost: {
    method: "post",
    url: baseEndpointURL + "like"
  }
}

/**
 * classe regroupant les actions opérables par un utilisateur
 */
const User = {
  login: (googleUser) => {
    var user = googleUser.getBasicProfile();
    sessionStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
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
  },

  /**
   * Fonction de like d'un post
   * @param {string} postId
   * @param  {string} userEmail
   */
  likePost: (postId, userEmail) => {
    axios[EndpointURL.likePost.method](EndpointURL.likePost.url, {postId, userEmail})
        then(e => {
            document.getElementById(postId.replace(/ /g, "-") + "-likeCount").innerHTML -= -1
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
    const owner = JSON.parse(sessionStorage.getElementById("user")).getBasicProfile().getEmail() || "email@example.com";

    axios[EndpointURL.addPost.method](EndpointURL.addPost.url, {owner, url, body})
        .then(e => {
            alert("Post ajouté avec succès");
            window.location = "/";
        })
        .catch(error => {
            console.log(error);
            alert("Erreur lors de la publication")
        });
  }
}

const View = {
  listNewPosts : () => {
      axios[EndpointURL.newPosts.method](EndpointURL.newPosts.url)
        .then(e => {
            document.getElementById("new-posts").innerHTML = postsFinal.items.map(item => View.createPostView(item.properties)).join("");
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
              <img src=${postData.userImgURL} alt="image" class="mr-2 rounded-full" style="height:30px; width:30px">
              <label class="mr-2 font-bold">${postData.owner}</label>
              <label class="text-blue-400 cursor-pointer hover:text-blue-600">• S'abonner</label>
          </div>
          
          <!-- Image de la publication -->
          <img src=${postData.url} alt="image" class="w-full mb-2 shadow">

          <!-- Nombre de likes -->
          <div class="text-gray-600 text-left font-bold m-2 mb-4">
              <label id=${postData.id.replace(/ /g, "-") + "-likeCount"}>${postData.likeCount || postData.likec}</label> J'aime
          </div>
          
          <!-- Texte de la publication -->
          <div class="text-gray-600 text-left m-2 mb-4">
              <label>${postData.body}</label>
          </div>
          
          <!-- J'aime -->
          <div class="text-center">
              <label
                class="rounded shadow text-gray-500 p-2 cursor-pointer font-medium hover:border hover:text-red-500 duration-100 ease-in-out"
                onclick="User.likePost('${postData.id}', '${postData.owner.split(":")[postData.owner.split(':').length-1]}')"
              >
                ♥ J'aime
              </label>
          </div>
      </div>`
    );
  }
}

// Si l'utilisateur n'est pas connecté
// if (!gapi.auth2.getAuthInstance().isSignedIn.get() && window.location.pathname !== "/glogin.html") {
//   window.location = "/glogin.html"
// }