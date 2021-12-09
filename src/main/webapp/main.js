const baseEndpointURL = "https://tinygram-webandcloud.uc.r.appspot.com/_ah/api/TinyInsta/v1/";

const EndpointURL = {
  follow: {
    method: "",
    url: baseEndpointURL + ""
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
    .then(e => {
        document.getElementById(postId.replace(/ /g, "-") + "-likeCount").innerHTML -= -1
      })
      .catch(error => {
        console.log(error);
        alert("Erreur lors du like")
      });
  }
}

postsFinal = {
  "items": [
      {
          "key": {
              "kind": "Post",
              "appId": "s~tinygram-webandcloud",
              "id": "0",
              "name": "f1:2021-12-07 12:34:55.293",
              "complete": true,
              "namespace": ""
          },
          "appId": "s~tinygram-webandcloud",
          "kind": "Post",
          "namespace": "",
          "properties": {
              "owner": "f1",
              "date": "2021-12-07 12:34:55.293",
              "likeCount": "0",
              "id": "f1:2021-12-07 12:34:55.293",
              "body": "Test posting picture",
              "url": "https://img.bfmtv.com/c/630/420/871/7b9f41477da5f240b24bd67216dd7.jpg"
          }
      },
      {
          "key": {
              "kind": "Post",
              "appId": "s~tinygram-webandcloud",
              "id": "5644004762845184",
              "complete": true,
              "namespace": ""
          },
          "appId": "s~tinygram-webandcloud",
          "kind": "Post",
          "namespace": "",
          "properties": {
              "owner": "f1",
              "id": "f1:2021-12-07 12:34:55.294",
              "date": "2021-12-06T12:43:32.729Z",
              "body": "message",
              "url": "https://cdn.futura-sciences.com/buildsv6/images/wide1920/6/5/2/652a7adb1b_98148_01-intro-773.jpg",
              "likec": "0"
          }
      },
      {
          "key": {
              "kind": "Post",
              "appId": "s~tinygram-webandcloud",
              "id": "5634161670881280",
              "complete": true,
              "namespace": ""
          },
          "appId": "s~tinygram-webandcloud",
          "kind": "Post",
          "namespace": "",
          "properties": {
              "owner": "f1",
              "date": "2021-12-02T06:24:38.454Z",
              "id": "f1:2021-12-07 12:34:55.298",
              "body": "this is the body",
              "url": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg",
              "likec": "0"
          }
      }
  ]
}

const View = {
  listNewPosts : () => {
    document.getElementById("new-posts").innerHTML = postsFinal.items.map(item => View.createPostView(item.properties)).join("");
    // axios[EndpointURL.newPosts.method](EndpointURL.newPosts.url)
    //   .then(e => {
    //     document.getElementById("new-posts").innerHTML = e.items.map(item => View.createPostView(item)).join("");
    //   })
    //   .catch (e => {
    //     console.log(error);
    //     alert("Erreur chargement des derniers Posts")
    //   })
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
if (!gapi.auth2.getAuthInstance().isSignedIn.get() && window.location.pathname !== "/glogin.html") {
  window.location = "/glogin.html"
}