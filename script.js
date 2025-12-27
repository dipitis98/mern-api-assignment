// loader
const loader = document.querySelector(".loader") // এটা দিয়ে loader ক্লাসকে ধরলাম
function showLoader() { // loading effect অন করার ফাংশন
    loader.classList.remove("loader-hidden") // এটা হাইড রাখার ক্লাসটাকে ডিলিট করে দিবে, ফলে loading effect চালু হবে
}
function hideLoader() { // loading effect অফ করার ফাংশন
    loader.classList.add("loader-hidden") // // এটা হাইড রাখার ক্লাসটাকে এড করে দিবে, ফলে loading effect বন্ধ হবে
}

// api call
const grid = document.getElementById("recipe-grid"); // এটার মধ্যেই সব খেলা এড হবে dynamically
async function getFoods() { 
    showLoader() // খেলা শুরুর আগে লোডিং দেখাবে

    try {
      const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" // যে সাইটে খেলা দেখাবে, সেটা সেইভ করলাম
      const response = await axios.get(apiUrl) // axios দিয়ে ডাটাগুলো dynamically fetch করে নিলাম
      const foodList = response.data.meals // খাবারের ডাটাগুলোর অবজেক্টটা নিলাম, এখানে for...of লুপ চালাতে হবে
      // console.log(foodList)

      grid.innerHTML = ""
      if (!foodList || foodList.length === 0) {
        grid.innerHTML = `<h2 style="
          grid-column: 1 / -1;
          text-align: center;
          color: #888;
        ">
          ❌ No Data Found
        </h2>`;
        
        hideLoader()
        return
      }
      
      for (const meal of foodList) { // চালাই দিলাম
        const card = document.createElement("div"); // একটা ভ্যারিয়েবল নিলাম, যা dynamically একটা div তৈরি করবে
        card.className = "card"; // ঐ div এর ক্লাস এর নাম সেট করলাম
        card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-body">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strInstructions.substring(0, 100)}...</p>
        <button class="view-btn" onclick="openModal('${
          meal.idMeal
          }')">VIEW DETAILS</button>
          </div>
          `; // ঐ div এর মধ্যে সিরিয়ালি খাবারের ছবি, নাম, ডিটেইলস আর বাটন dynamically add করবে
          grid.appendChild(card); // পুরো div টা dynamically DOM-এ add করবে
        }
      } catch (err) {
        // grid.innerHTML = "<p>Oops. Something went wrong. Please try again.</p>"
        const errorMsg = document.createElement("p")
        errorMsg.classList.add("error")
        errorMsg.innerHTML = "Oops. Something went wrong. Please try again."
        grid.appendChild(errorMsg)
        hideLoader()
      } finally {
        hideLoader() // লোড হওয়া শেষে loading effect সরিয়ে ফেলবে
      }
}
getFoods()