// loader
document.addEventListener("load", () => {
    const loader = document.querySelector(".loader")
    loader.classList.add("loader-hidden")

    const loaderParent = document.getElementsByClassName("recipe-container")

    loader.addEventListener("transitionend", () => {
        document.loaderParent.removeChild("loader")
    })
})

// api call
async function getFoods() {
    const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="
    const foodData = await axios.get(apiUrl)
    const food = foodData.data.meals[0].strMealThumb
    console.log(food)
    document.getElementById("box").innerHTML = food
}
getFoods()