function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
  });
  event.target.classList.add("active");

  window.scrollTo(0, 0);
}

let travelData = [];

async function fetchTravelData() {
  try {
    const response = await fetch("data/travel.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    travelData = data[0];
    console.log("Travel data loaded:", travelData);
  } catch (error) {
    console.error("Error loading travel data:", error);

    travelData = {
      countries: [
        {
          id: 1,
          name: "Australia",
          cities: [
            {
              name: "Sydney, Australia",
              imageUrl:
                "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
              description:
                "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge.",
            },
            {
              name: "Melbourne, Australia",
              imageUrl:
                "https://images.unsplash.com/photo-1545044846-351ba102b6d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
              description:
                "A cultural hub famous for its art, food, and diverse neighborhoods.",
            },
          ],
        },
      ],
      temples: [
        {
          id: 1,
          name: "Angkor Wat, Cambodia",
          imageUrl:
            "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
          description:
            "A UNESCO World Heritage site and the largest religious monument in the world.",
        },
      ],
      beaches: [
        {
          id: 1,
          name: "Bora Bora, French Polynesia",
          imageUrl:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          description:
            "An island known for its stunning turquoise waters and luxurious overwater bungalows.",
        },
      ],
    };
  }
}

document.addEventListener("DOMContentLoaded", fetchTravelData);

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();

  if (query.length > 0) {
    let allResults = [];

    if (travelData.countries) {
      travelData.countries.forEach((country) => {
        if (
          country.name.toLowerCase().includes(query) ||
          "country".includes(query)
        ) {
          allResults.push({
            name: country.name,
            type: "Country",
            description: `Explore beautiful destinations in ${country.name}`,
          });
        }

        if (country.cities) {
          country.cities.forEach((city) => {
            if (
              city.name.toLowerCase().includes(query) ||
              "city".includes(query)
            ) {
              allResults.push({
                name: city.name,
                type: "City",
                description: city.description,
              });
            }
          });
        }
      });
    }

    if (travelData.temples) {
      travelData.temples.forEach((temple) => {
        if (
          temple.name.toLowerCase().includes(query) ||
          "temple".includes(query)
        ) {
          allResults.push({
            name: temple.name,
            type: "Temple",
            description: temple.description,
          });
        }
      });
    }

    if (travelData.beaches) {
      travelData.beaches.forEach((beach) => {
        if (
          beach.name.toLowerCase().includes(query) ||
          "beach".includes(query) ||
          "beaches".includes(query)
        ) {
          allResults.push({
            name: beach.name,
            type: "Beach",
            description: beach.description,
          });
        }
      });
    }

    displaySearchResults(allResults);
  } else {
    hideSearchResults();
  }
});

function displaySearchResults(results) {
  if (results.length === 0) {
    searchResults.innerHTML =
      '<div class="search-result-item">No destinations found</div>';
  } else {
    searchResults.innerHTML = results
      .map(
        (dest) => `
            <div class="search-result-item" onclick="selectDestination('${
              dest.name
            }')">
                <div class="result-icon">${dest.name.charAt(0)}</div>
                <div>
                    <div style="font-weight: 600;">${dest.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">${
                      dest.type
                    } - ${dest.description}</div>
                </div>
            </div>
        `
      )
      .join("");
  }

  searchResults.style.display = "block";
}

function hideSearchResults() {
  searchResults.style.display = "none";
}

function selectDestination(destinationName) {
  searchInput.value = destinationName;
  hideSearchResults();
}

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    const searchBtn = document.querySelector(".search-btn");
    const originalText = searchBtn.textContent;
    searchBtn.textContent = "Searching...";
    searchBtn.style.background = "linear-gradient(45deg, #4ecdc4, #44a08d)";

    let recommendations = [];
    let categoryTitle = "Recommended Destinations";

    if (query.includes("beach") || query.includes("beaches")) {
      recommendations = travelData.beaches || [];
      categoryTitle = "Beautiful Beaches";
    } else if (query.includes("temple")) {
      recommendations = travelData.temples || [];
      categoryTitle = "Stunning Temples";
    } else {
      if (travelData.countries) {
        travelData.countries.forEach((country) => {
          if (country.name.toLowerCase().includes(query)) {
            recommendations = country.cities || [];
            categoryTitle = `Destinations in ${country.name}`;
          } else if (country.cities) {
            const matchingCities = country.cities.filter((city) =>
              city.name.toLowerCase().includes(query)
            );
            recommendations = recommendations.concat(matchingCities);
            if (matchingCities.length > 0) {
              categoryTitle = "Matching Cities";
            }
          }
        });
      }
    }

    setTimeout(() => {
      searchBtn.textContent = originalText;
      searchBtn.style.background = "linear-gradient(45deg, #ff6b6b, #ff8e8e)";

      if (recommendations.length > 0) {
        displayRecommendations(recommendations, categoryTitle);
      } else {
        alert(
          `No specific recommendations found for "${query}". Showing popular destinations instead.`
        );

        const defaultRecs = [];
        if (travelData.beaches)
          defaultRecs.push(...travelData.beaches.slice(0, 2));
        if (travelData.temples)
          defaultRecs.push(...travelData.temples.slice(0, 2));
        if (travelData.countries && travelData.countries[0]?.cities) {
          defaultRecs.push(...travelData.countries[0].cities.slice(0, 2));
        }
        displayRecommendations(defaultRecs, "Popular Destinations");
      }
    }, 1500);
  } else {
    alert("Please enter a destination to search for.");
  }
}

function displayRecommendations(recommendations, title) {
  const section = document.getElementById("recommendationsSection");
  const grid = document.getElementById("recommendationsGrid");

  section.querySelector("h2").textContent = title;

  grid.innerHTML = "";

  recommendations.forEach((item) => {
    const timeZone = getTimeZoneForDestination(item.name);
    const currentTime = timeZone ? getCurrentTimeForTimeZone(timeZone) : "";

    const card = document.createElement("div");
    card.className = "recommendation-card";
    card.innerHTML = `
            <div class="recommendation-img">
                <img src="${
                  item.imageUrl ||
                  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                }" alt="${item.name}">
            </div>
            <div class="recommendation-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                ${
                  currentTime
                    ? `<p class="recommendation-time">Local time: ${currentTime}</p>`
                    : ""
                }
            </div>
        `;
    grid.appendChild(card);
  });

  section.scrollIntoView({ behavior: "smooth" });
}

function getTimeZoneForDestination(destinationName) {
  const timeZoneMap = {
    Sydney: "Australia/Sydney",
    Melbourne: "Australia/Melbourne",
    Tokyo: "Asia/Tokyo",
    Kyoto: "Asia/Tokyo",
    "Rio de Janeiro": "America/Sao_Paulo",
    "São Paulo": "America/Sao_Paulo",
    "Angkor Wat": "Asia/Phnom_Penh",
    "Bora Bora": "Pacific/Tahiti",
    Copacabana: "America/Sao_Paulo",
    "Taj Mahal": "Asia/Kolkata",
  };

  for (const [key, value] of Object.entries(timeZoneMap)) {
    if (destinationName.includes(key)) {
      return value;
    }
  }
  return null;
}

function getCurrentTimeForTimeZone(timeZone) {
  try {
    const options = {
      timeZone: timeZone,
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date().toLocaleTimeString("en-US", options);
  } catch (e) {
    console.error("Error getting time for timezone:", timeZone, e);
    return "";
  }
}

function clearSearch() {
  searchInput.value = "";
  hideSearchResults();

  document.getElementById("recommendationsGrid").innerHTML = "";
  document
    .getElementById("recommendationsSection")
    .querySelector("h2").textContent = "Recommended Destinations";

  const clearBtn = document.querySelector(".clear-btn");
  clearBtn.style.transform = "scale(0.95)";
  setTimeout(() => {
    clearBtn.style.transform = "scale(1)";
  }, 150);
}

function bookNow() {
  alert(
    "Booking system coming soon! Get ready for amazing travel experiences."
  );
}

document.addEventListener("click", function (event) {
  if (!event.target.closest(".search-container")) {
    hideSearchResults();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(0, 0, 0, 0.95)";
  } else {
    navbar.style.background = "rgba(0, 0, 0, 0.9)";
  }
});
