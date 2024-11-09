const mainDiv = document.querySelector('.main');
const postData = document.querySelector('.post-data');

Promise.all([
  fetch('https://jsonplaceholder.typicode.com/posts'),
  fetch('https://jsonplaceholder.typicode.com/comments'),
  fetch('https://jsonplaceholder.typicode.com/users'),
]).then(async (responses) => {
  const [posts, comments, users] = await Promise.all(
    responses.map((response) => response.json())
  );

  // A postsByUser objektumban a user id-k szerint rendezzük a postokat
  const postsByUser = users.reduce((acc, user) => {
    acc[user.id] = posts.filter(post => post.userId === user.id);
    return acc;
  }, {});

  function cardRender() {
    users.forEach((user) => {
      // Csak az utolsó postot jelenítjük meg az adott felhasználótól
      const userPosts = postsByUser[user.id];
      const lastPost = userPosts[userPosts.length - 1]; // Az utolsó post

      // Az adott posthoz kapcsolódó kommentek
      const relatedComments = comments.filter(comment => comment.postId === lastPost.id);

      // Kattintásra az összes postot jelenítjük meg az adott felhasználótól
      const cardDiv = `
      <div class="col-sm-3 mb-2 d-flex">
        <div class="card" style="width: 18rem">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">Cím: ${lastPost.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Szerző: ${user.name}</h6>
            <p class="card-text">ID: ${lastPost.id}</p>
            <button class="btn btn-primary details" onclick='showDetails(${JSON.stringify({ user, posts: userPosts, relatedComments })})'>Részletek</button>
          </div>
        </div>
      </div>
      `;
      mainDiv.innerHTML += cardDiv;
    });
  }

  cardRender();
});

// showDetails függvény, ami az összes adatot megkapja
function showDetails(data) {
  const { user, posts, relatedComments } = data;
  console.log("User:", user);
  console.log("Postok:", posts);  // Az összes post az adott userhez
  console.log("Kommentek:", relatedComments);
}
