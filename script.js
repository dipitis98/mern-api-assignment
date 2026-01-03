const loader = document.querySelector(".loader")                           // এটা দিয়ে loader ক্লাসকে ধরলাম
const grid = document.getElementById("recipe-grid");                       // এটার মধ্যেই সব খেলা এড হবে dynamically
const search = document.getElementById("search")                           // সার্চ বারে সব ফাংশনালিটি যুক্ত করার জন্য ধরলাম
const searchForm = document.getElementById("searchForm")                   // সার্চ দিলে যা যা কাজ হবে
const modalOverlay = document.getElementById("modal-overlay")              // এই div এর মধ্যে মডাল রিলেটেড সব কন্টেন্ট এড হবে
const modalBody = document.getElementById("modal-body-content")            // এই div এ মডালের সব child dynamically এড হবে
const backBtn = document.getElementById("backToTopBtn");                   // back to top বাটনের ফাংশনালিটির জন্য এটাকে ধরলাম

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
    card.dataset.id = meal.idMeal
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
    // console.log(allFoods)
    
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

// =========== =========== Open Modal Function =========== =========== //
async function openModal(id) {             // এই ফাংশনটা নির্দিষ্ট card এর id নিয়ে Modal ওপেন করবে
  
  showLoader()                             // API call শুরু হওয়ার আগে Loader চালু করলাম

  try {                                    // try ব্লকের মধ্যে risky কোড রাখা হয় (API call, JSON read ইত্যাদি)

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}` // যে API থেকে খাবারের ডিটেইলস আনবো, সেখানে dynamic id বসালাম
    const response = await axios.get(apiUrl)                                    // axios দিয়ে API call করলাম (await = data আসা পর্যন্ত কোড থেমে থাকবে
    const meal = response.data.meals[0]                                         // API response থেকে meals array এর প্রথম item টি নিলাম
    console.log(meal) 

    // Modal এর ভিতরের content dynamically সেট করলাম
    modalBody.innerHTML = `
      <img src="${meal.strMealThumb}" class="modal-img">

      <div class="modal-info">
        <h2>${meal.strMeal}</h2>

        <!-- Full instructions text দেখালাম -->
        <p style="margin-top: 15px; text-align:justify">
          ${meal.strInstructions}
        </p>
      </div>
    `

    modalOverlay.style.display = "flex"     // Modal overlay কে visible করলাম
    document.body.style.overflow = "hidden" // Modal ওপেন থাকা অবস্থায় body scroll বন্ধ করলাম


  } catch (err) {                           // API error হলে catch ব্লকে আসবে
    console.error(err)                      // console-এ error দেখাবে (debug করার জন্য)
  
  } finally {                               // try হোক বা catch — finally সবসময়ই চলবে

    hideLoader()                            // Modal load শেষ -> Loader বন্ধ করলাম
  }
}

function closeModal() {                                           // মডাল বন্ধ করার কাজ করবে
  modalBody.innerHTML = ""                                        // প্রথমে মডালের ভেতরের কন্টেন্ট পরিষ্কার করে ফেলবে
  modalOverlay.style.display = "none"                             // মডালকে স্ক্রিন থেকে লুকিয়ে ফেলে
  document.body.style.overflow = "auto"                           // মডাল বন্ধ হলে স্ক্রিনের স্ক্রল আবার চালু হয়
}

getFoods()                                                        // সাইটে ঢুকা মাত্র এই ফাংশন automatic call হবে

// =========== =========== Scrolling - backToTop Button Section =========== =========== //
window.addEventListener("scroll", () => {   // যখন স্ক্রল করবো, তখন নিচের কোড কাজ করবে

    if (window.scrollY > 400) {             // যদি ৪০০ পিক্সেলের বেশি স্ক্রল করি
        backBtn.classList.add("show");      // বাটনে show ক্লাসটা এড হবে
        backBtn.classList.remove("hide");   // বাটন থেকে hide ক্লাসটা রিমুভ হবে
    }   
    else {                                  // নয়তো,
        backBtn.classList.add("hide");      // বাটনে hide ক্লাসটা এড হবে
        backBtn.classList.remove("show");   // বাটন থেকে show ক্লাসটা রিমুভ হবে
    }
});

backBtn.addEventListener("click", (e) => {  // Back button এ ক্লিক করলে ফাংশন রান হবে
    e.preventDefault();                     // বাটনের ডিফল্ট বিহেভিয়ার রিলোড হওয়াকে থামাবে 
    window.scrollTo({
        top: 0,                             // পেইজ একদম টপে স্ক্রল হবে
        behavior: "smooth"                  // স্মুথভাবে স্ক্রল হবে
    });
});