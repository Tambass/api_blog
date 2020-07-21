const search_input = document.getElementById("search");
const results = document.getElementById("results");
let search_term = "";
let recipes;

const fetchRecipes = async () => {
  recipes = await fetch("http://localhost:8080/api").then((res) => res.json());
};

const showRecipes = async () => {
  results.innerHTML = "";
  await fetchRecipes();
  console.log(recipes);
  const ul = document.createElement("ul");

  var recipesArray = Array.from(recipes);

  recipesArray
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(search_term.toLowerCase())
    )
    .forEach((recipe) => {
      //console.log(recipe);
      const li = document.createElement("li");
      let recipe_title = document.createElement("a");
      recipe_title.innerText = recipe.title;
      //recipe_title.href = "/pageSingle/" + recipe.recipeId;
      li.appendChild(recipe_title);
      ul.appendChild(li);
    });
  results.appendChild(ul);
};

//console.log(fetchRecipe());

search_input.addEventListener("input", (e) => {
  search_term = e.target.value;
  if (search_term.length > 0) {
    showRecipes();
  } else {
    results.innerHTML = "";
  }
});
showRecipes();