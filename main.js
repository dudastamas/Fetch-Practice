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
    posts.forEach((post) => {
      const user = users.find(u => u.id === post.userId);
      const relatedComments = comments.filter(comment => comment.postId === post.id);
      
      // Továbbadjuk a user teljes post listáját a showDetails függvénynek
      const cardDiv = `
      <div class="col-sm-3 mb-2 d-flex">
        <div class="card" style="width: 18rem">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">Cím: ${post.title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Szerző: ${user.name}</h6>
            <p class="card-text">ID: ${post.id}</p>
            <button class="btn btn-primary details" onclick='showDetails(${JSON.stringify({ post, user, relatedComments, relatedPosts: postsByUser[user.id] })})'>Részletek</button>
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
  const { post, user, relatedComments, relatedPosts } = data;
  console.log("Post:", post);
  console.log("User:", user.address.street);
  console.log("Comments:", relatedComments);
  console.log("User összes postja:", relatedPosts);
}
