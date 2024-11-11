const mainDiv = document.querySelector('.main');
const postData = document.querySelector('.post-details');
const modalContent = document.querySelector('.modal-content');

const getStoreData = () => {
  const data = {
    posts: localStorage.getItem('posts'),
    comments: localStorage.getItem('comments'),
    users: localStorage.getItem('users'),
  };
  return Object.entries(data).every(([key, value]) => value !== null)
    ? data
    : null;
};

const getData = async () => {
  const storeData = getStoreData();
  if (storeData) {
    return {
      posts: JSON.parse(storeData.posts),
      comments: JSON.parse(storeData.comments),
      users: JSON.parse(storeData.users),
    };
  }
  try {
    const response = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts'),
      fetch('https://jsonplaceholder.typicode.com/comments'),
      fetch('https://jsonplaceholder.typicode.com/users'),
    ]);

    response.forEach((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    });
    const [posts, comments, users] = await Promise.all(
      response.map((res) => res.json())
    );

    //Mentés localStorage-ba
    if (posts.length && comments.length && users.length) {
      localStorage.setItem('posts', JSON.stringify(posts));
      localStorage.setItem('comments', JSON.stringify(comments));
      localStorage.setItem('users', JSON.stringify(users));
    }
    return {
      posts,
      comments,
      users,
    };
  } catch (error) {
    localStorage.clear();
    throw error;
  }
};

getData()
  .then(({ posts, comments, users }) => {
    try {
      // A postsByUser objektumban a user id-k szerint rendezzük a postokat
      const postsByUser = users.reduce((acc, user) => {
        acc[user.id] = posts.filter((post) => post.userId === user.id);
        return acc;
      }, {});

      cardRender = function () {
        mainDiv.innerHTML = '';
        const cardDiv = users
          .map((user) => {
            // Csak az utolsó postot jelenítjük meg az adott felhasználótól
            const userPosts = postsByUser[user.id];
            const lastPost = userPosts[userPosts.length - 1]; // Az utolsó post

            // Az adott posthoz kapcsolódó kommentek
            const relatedComments = comments.filter(
              (comment) => comment.postId === lastPost.id
            );

            // Kattintásra az összes postot jelenítjük meg az adott felhasználótól
            return `
      <div class="col-sm-3 g-4 d-flex">
        <div class="card" style="width: 18rem">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">Cím: ${lastPost.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Szerző: ${
              user.name
            }</h6>
            <p class="card-text">ID: ${lastPost.id}</p>
            <button class="btn btn-primary details" onclick='showDetails(${JSON.stringify(
              { user, posts: userPosts, relatedComments }
            )})'>Részletek</button>
          </div>
        </div>
      </div>
      `;
          })
          .join('');
        mainDiv.innerHTML = cardDiv;
      };

      cardRender();
    } catch (error) {
      mainDiv.innerHTML = `<div class="alert alert-danger">Hiba történt: ${error.message}</div>`;
      console.error('Hiba:', error);
    }
  })
  .catch((error) => {
    mainDiv.innerHTML = `<div class="alert alert-danger">Hiba történt: ${error.message}</div>`;
    console.error('Hiba:', error);
  });

// showDetails függvény, ami az összes adatot megkapja
function showDetails(data) {
  const { user, posts, relatedComments } = data;

  userDetails = `
  <div class="col mb-5">
    <h2>${user.name}</h2>
    <div class="posts d-flex flex-wrap gap-2">
      ${posts
        .map(
          (post) => `
        <div class="post">
          <button class="btn btn-info text-white" onclick='showPostBody(${JSON.stringify(
            post.body
          )}, ${JSON.stringify(post.title)})'>${post.title}</button>        
        </div>
      `
        )
        .join('')}
    </div>
    <button onclick="cardRender()">Vissza</button>
  </div>
`;

  mainDiv.innerHTML = userDetails;
}

function createModal() {
  const modalHTML = `<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;

  modalContent.insertAdjacentHTML('beforeend', modalHTML);
}
createModal();

const userModalDetails = new bootstrap.Modal(
  document.querySelector('#exampleModal')
);
function showPostBody(body, title) {
  document.getElementById('exampleModalLabel').textContent = title;
  document.querySelector('#exampleModal .modal-body').textContent = body;
  userModalDetails.show();
}
