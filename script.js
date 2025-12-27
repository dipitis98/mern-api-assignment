// loader
const loader = document.querySelector(".loader")
function showLoader() {
    loader.classList.remove
}

// api call
const grid = document.getElementById("recipe-grid");
async function getFoods() {
    const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="
    const response = await axios.get(apiUrl)
    const foodList = response.data.meals
    console.log(foodList)
    for (const meal of foodList) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="card-body">
              <h3>${meal.strMeal}</h3>
              <p>${meal.strInstructions.substring(0, 100)}...</p>
              <button class="view-btn" onclick="openModal('${
                meal.idMeal
              }')">VIEW DETAILS</button>
            </div>
          `;
    grid.appendChild(card);
    }
}
getFoods()