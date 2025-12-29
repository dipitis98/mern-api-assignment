const loader = document.querySelector(".loader")                           // এটা দিয়ে loader ক্লাসকে ধরলাম
const grid = document.getElementById("recipe-grid");                       // এটার মধ্যেই সব খেলা এড হবে dynamically
const search = document.getElementById("search")                           // সার্চ বারে সব ফাংশনালিটি যুক্ত করার জন্য ধরলাম
const searchForm = document.getElementById("searchForm")


// =========== =========== loader function =========== =========== //
function showLoader() {                                                    // loading effect অন করার ফাংশন
  loader.classList.remove("loader-hidden")                                 // এটা হাইড রাখার ক্লাসটাকে ডিলিট করে দিবে, ফলে loading effect চালু হবে
}    
function hideLoader() {                                                    // loading effect অফ করার ফাংশন
  loader.classList.add("loader-hidden")                                    // এটা হাইড রাখার ক্লাসটাকে এড করে দিবে, ফলে loading effect বন্ধ হবে
}    

// =========== =========== Card Showing function =========== =========== //
function showFoods(list) {     
      grid.innerHTML = ""                                                  // প্রথমে ডায়নামিক div এ কিছু থেকে থাকলে তা খালি করে নিবে
      for (const meal of list) {                                           // ডাটা পাওয়া গেলে লুপ চলবে
        const card = document.createElement("div");                        // একটা ভ্যারিয়েবল নিলাম, যা dynamically একটা div তৈরি করবে
        card.className = "card";                                           // ঐ div এর ক্লাস এর নাম সেট করলাম
        card.innerHTML = `     
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">     
        <div class="card-body">    
        <h3>${meal.strMeal}</h3>     
        <p>${meal.strInstructions.substring(0, 100)}...</p>    
        <button class="view-btn" onclick="openModal('${    
          meal.idMeal    
        }')">VIEW DETAILS</button>     
        </div>     
        `;                                                                 // ঐ div এর মধ্যে সিরিয়ালি খাবারের ছবি, নাম, ডিটেইলস আর বাটন dynamically add করবে
        grid.appendChild(card);                                            // পুরো div টা dynamically DOM-এ add করবে
      }    
    }

// =========== =========== API Calling function =========== =========== //
let allFoods = []                                                          // সব খাবারের ডেটা এখানে থাকবে
async function getFoods() {      
  showLoader()                                                             // খেলা শুরুর আগে লোডিং দেখাবে
  
  try {                                                                    // ডাটা পাওয়া গেলে নিচের খেলাগুলো দেখাবে
    const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" // যে সাইটে খেলা দেখাবে, সেটা সেইভ করলাম
    const response = await axios.get(apiUrl)                               // axios দিয়ে ডাটাগুলো dynamically fetch করে নিলাম
    const foodList = response.data.meals                                   // খাবারের ডাটাগুলোর অবজেক্টটা নিলাম, এখানে for...of লুপ চালাতে হবে
    allFoods = foodList                                                    // API থেকে পাওয়া ডাটা এখানে সেইভ রাখলাম
    
    grid.innerHTML = ""    

    if (!foodList || foodList.length === 0) {                              // যদি foodlist জিনিসটাই না থাকে, অথবা foodlist-এ কোন ডাটা না থাকে
      grid.innerHTML = `<h2 style="      
      grid-column: 1 / -1;     
      text-align: center;    
      color: #888;     
      ">     
      ❌ No Data Found     
      </h2>`;                                                              // তবে Warning message দেখাবে        
      return                                                               // সাথে সাথে ফাংশন থেমে যাবে
    }     

    showFoods(foodList) // 
  } catch (err) {                                                          // আর যদি অন্য কোনোরকম error পাওয়া যায়
    grid.innerHTML = ""      
    const errorMsg = document.createElement("p")                           // recipy-grid এর মধ্যে একটা p tag তৈরি করবে
    errorMsg.classList.add("error")                                        // p tag এর ক্লাস নেইম সেট করলাম css effect পাওয়ার জন্য
    errorMsg.innerHTML = "Oops. Something went wrong. Please try again."   // p tag এর মধ্যে error message set করলাম
    grid.appendChild(errorMsg)                                             // পুরো p tag-টা DOM-এ dynamically add হবে
  } finally {                                                              // সবশেষে যা হবে
    hideLoader()                                                           // লোড হওয়া শেষে loading effect সরিয়ে ফেলবে
  }    
}    
getFoods()                                                                 // সাইটে ঢুকা মাত্র এই ফাংশন automatic call হবে


// =========== =========== Search function =========== =========== //
function handleSearch(text) {                                              // এই ফাংশনটা যা যা সার্চ দেওয়া হবে, সেগুলোকেই প্যারামিটার হিসেবে নিয়ে কাজ করবে
  const query = text.toLowerCase().trim()                                  // টেক্সটকে ছোট হাতের পরিণত করবে, শেষে স্পেস থাকলে কেটে দিবে

  if (query === "") {                                                      // যদি ইউজার কোন ইনপুট না দেয়
    showFoods(allFoods)                                                    // API এ লোড হওয়া সব আবার দেখাবে
    return                                                                 // ফাংশন ক্লোজ হয়ে যাবে
  }

  const matched = allFoods.filter (meal => 
    meal.strMeal.toLowerCase().includes(query)                             // এখানে API থেকে আনা সব খাবারের নামগুলো ছোটহাতের করে সেখান থেকে 
    || (meal.strInstructions && meal.strInstructions.toLowerCase().includes(query))
  )                                                                        // ফিল্টারের মাধ্যমে লিস্ট থেকে মিল পাওয়া আইটেমগুলো রেখে দেয়, আর লিস্টে পাওয়া গেলে true রিটার্ন করবে

  if (matched.length > 0) {                                                // matched লিস্টে আইটেম থাকলে
    showFoods (matched)                                                    // ঐ আইটেমগুলোই showFoods ফাংশনের মাধ্যমে কল হবে
  } else {                                                                 // নয়তো ওয়ার্নিং ম্যাসেজ দেখাবে "❌ No Item Found!"
    grid.innerHTML = `<h2 style="
      grid-column:1 / -1;
      text-align:center;
      color:#888;
    ">
      ❌ No Item Found !
    </h2>
    `
  }
}

// =========== =========== Search Input Event =========== =========== //
searchForm.addEventListener("submit", e => {
  e.preventDefault()
  handleSearch(search.value)
})