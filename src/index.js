document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterBtn = document.getElementById("filter-btn");

    let filterGoodDogs = false;

    // Fetch all dogs and display in the dog bar
    function fetchDogs() {
        fetch("http://localhost:3000/pups")
            .then(response => response.json())
            .then(dogs => renderDogBar(dogs));
    }

    // Render dog names in the dog bar
    function renderDogBar(dogs) {
        dogBar.innerHTML = "";
        const filteredDogs = filterGoodDogs ? dogs.filter(dog => dog.isGoodDog) : dogs;

        filteredDogs.forEach(dog => {
            const dogSpan = document.createElement("span");
            dogSpan.textContent = dog.name;
            dogSpan.addEventListener("click", () => showDogInfo(dog));
            dogBar.appendChild(dogSpan);
        });
    }

    // Show detailed info of a selected dog
    function showDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="good-dog-btn">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;

        const goodDogBtn = document.getElementById("good-dog-btn");
        goodDogBtn.addEventListener("click", () => toggleGoodDog(dog));
    }

    // Toggle dog's good/bad status and update the server
    function toggleGoodDog(dog) {
        dog.isGoodDog = !dog.isGoodDog;

        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isGoodDog: dog.isGoodDog })
        })
        .then(response => response.json())
        .then(() => {
            showDogInfo(dog);  // Update UI
            fetchDogs();  // Refresh dog bar
        });
    }

    // Filter only good dogs
    filterBtn.addEventListener("click", () => {
        filterGoodDogs = !filterGoodDogs;
        filterBtn.textContent = filterGoodDogs ? "Filter Good Dogs: ON" : "Filter Good Dogs: OFF";
        fetchDogs();
    });

    // Initial fetch on page load
    fetchDogs();
});
