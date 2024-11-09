const mainDiv = document.querySelector('.main');

Promise.all([
  fetch('https://jsonplaceholder.typicode.com/posts'),
  fetch('https://jsonplaceholder.typicode.com/comments'),
  fetch('https://jsonplaceholder.typicode.com/users'),
]).then(async (responses) => {
  const [posts, comments, users] = await Promise.all(
    responses.map((response) => response.json())
  );
  function cardRender() {
    posts.forEach((post, index) => {
      if (index < users.length) {
        const user = users[index];
        const cardDiv = `
        <div class="container mt-5 main">
      <div class="card" style="width: 18rem">
        <div class="card-body">
          <h5 class="card-title">Cím: ${post.title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Szerző: ${user.name}</h6>
          <p class="card-text">ID: ${post.id}</p>
        </div>
      </div>
        `;
        mainDiv.innerHTML += cardDiv;
      }
    });
  }
  cardRender();
});
