import "bootstrap/dist/js/bootstrap.bundle";
import "core-js/stable";
import "regenerator-runtime/runtime";

// Importing Images
import cuisineImg from "../icons/cuisine.png";
import caloriesImg from "../icons/calories.png";
import servingsImg from "../icons/servings.png";
import ingredientsImg from "../icons/ingredients.png";
import healthFactsImg from "../icons/health-facts.png";
import errorImg from "../icons/error.png";

// DOM Selections
const searchForm = document.querySelector("form");
const searchResultList = document.querySelector(".search-result-list");
const listGroup = document.querySelector(".list-group");
const recipeResultDisplay = document.querySelector(".recipe-result-display");
const APP_ID = process.env.APP_ID;
const APP_Key = process.env.APP_Key;

// Declaring Global Variables
let searchQuery = "";

// Function to get the Recipes
const getRecipes = async () => {
  try {
    const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_Key}`;
    const response = await fetch(baseUrl);
    console.log(response);

    if (!response.ok)
      throw new Error(`Something Went Wrong ${response.status}`);

    const data = await response.json();
    console.log(data);

    if (data.hits.length === 0)
      throw new Error(`No Results Found For Your Query`);

    generateListHtml(data.hits);
  } catch (err) {
    console.error(err.message);
    console.log(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    renderErrorMessage(
      `${err.message}, Try searching with some other keywords`
    );
  }
};

// Function to render Search Recipe Result
const generateListHtml = (results) => {
  let generatedCardHtml = "";
  results.map((result) => {
    generatedCardHtml += `
      <a
      href="#"
      class="list-group-item list-group-item-action"
      aria-current="true"
      recipe-id=${result._links.self.href}
    >
      <div class="d-flex w-100 align-items-center">
      <img src="${result.recipe.image}" alt="${result.recipe.label}" class="img-fluid search-list-image"/>
        <p class="mb-1 px-1">${result.recipe.label}</p>
      </div>
    </a>
    `;
  });

  searchResultList.innerHTML = generatedCardHtml;
  listGroup.style.overflow = "scroll";
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to render Error Message for Search Recipe Result
const renderErrorMessage = function (msg) {
  const errorHtml = `
  <div class="container error-container text-center">
    <div class="row">
      <div class="col-lg-12">
        <img
        src="${errorImg}"
        class="img-fluid search-list-error"
        />
        <p>${msg}</p>
      </div>
    </div>
  </div>`;

  searchResultList.innerHTML = errorHtml;
  listGroup.style.overflow = "";
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to get Recipe By Id
const getRecipeById = async (recipeID) => {
  try {
    const baseUrl = `${recipeID}`;
    const response = await fetch(baseUrl);
    console.log(response);

    if (!response.ok)
      throw new Error(`Something Went Wrong ${response.status}`);

    const data = await response.json();
    console.log(data);
    console.log(data.recipe);

    if (!data) throw new Error(`No Data Found`);

    generateRecipeDetail(data.recipe);
  } catch (err) {
    console.error(err.message);
    console.log(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    renderErrorRecipeID(`${err.message}, Try Again!`);
  }
};

// Function to Render Recipe Details
const generateRecipeDetail = (result) => {
  recipeResultDisplay.innerHTML = `
  <div class="col-lg-12 recipe-display-list">
  <div class="container border recipe-image-container text-center p-3 mt-4 mb-4">
    <img
      src="${result.image}"
      class="img-fluid recipe-image"
      alt="${result.label}"
    />
    <h5 class="recipe-title">${result.label}</h5>
  </div>
  <!-- Recipe Summary Section -->
  <div class="container recipe-summary-container p-3 mb-4 text-center">
      <div class="row">
        <div class="col-lg-4 col-md-4 col-sm-4 p-2 summary">
          <img src="${cuisineImg}" class="icon" />
          <p>
            Cuisine Type:
            <span class="text-danger">${result.cuisineType}</span>
          </p>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 p-2 summary">
          <img src="${caloriesImg}" class="icon" />
          <p>
            Calories:
            <span class="text-warning">${result.calories.toFixed(2)}</span>
          </p>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 p-2 summary">
          <img src="${servingsImg}" class="icon" />
          <p>
            Servings: <span class="text-primary">${result.yield}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Ingredients Section -->
      <div class="container border ingredients-container p-3 mb-4">
        <div class="row text-center">
          <div class="col-lg-12">
            <img src="${ingredientsImg}" class="icon" />
            <h5>Ingredients</h5>
          </div>
        </div>
        <div class="row">
          ${result.ingredientLines
            .map((ing) => {
              return `
          <div class="col-lg-6 col-md-6">
            <p>${ing}</p>
          </div>
          `;
            })
            .join("")}
        </div>
      </div>
    
      <!-- Health Facts Section -->
      <div class="container border health-facts-container p-3 mb-4">
        <div class="row text-center">
          <div class="col-lg-12">
            <img src="${healthFactsImg}" class="icon" />
            <h5>Health Facts</h5>
          </div>
        </div>
        <div class="row">
          ${result.healthLabels
            .map((health) => {
              return `
          <div class="col-lg-2 col-md-6">
            <p>${health}</p>
          </div>
          `;
            })
            .join("")}
        </div>
      </div>
</div>
  `;

  recipeResultDisplay.style.overflow = "scroll";
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to render Error Message for Recipe by ID
const renderErrorRecipeID = (msg) => {
  const errorHtml = `
  <div class="col-lg-12 text-center mt-4">
      <img
      src="${errorImg}"
      class="img-fluid"
      />
      <p>${msg}</p>
  </div>
  `;

  recipeResultDisplay.innerHTML = errorHtml;
  recipeResultDisplay.style.overflow = "";
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event Listener to get the list of Recipes
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  console.log(searchQuery);

  getRecipes();
});

// Event Listener to get a particular Recipe
searchResultList.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e);

  const recipeInfo = e.target.parentNode;
  let recipeId = recipeInfo.classList.contains("list-group-item")
    ? recipeInfo.getAttribute("recipe-id")
    : "";

  console.log(recipeId);
  getRecipeById(recipeId);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Current year for the Copyright
document.querySelector("#year").innerHTML = new Date().getFullYear();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
