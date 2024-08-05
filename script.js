let btn = document.getElementById('btn');
let input = document.getElementById('foodname');
let main = document.getElementById('main');
let main1 = document.getElementById('main1');
const apiurl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

async function generate(data) {
    const response = await fetch(apiurl + `${data}`);
    const food = await response.json();

    // Handle the case where no meals are found
    if (!food.meals) {
        main1.style.display = 'block';
        main1.innerHTML = "<p>No meals found. Please try another search term.</p>";
        main.innerHTML = "";
        return;
    }

    main1.style.display = 'none';
    main.innerHTML = "";

    food.meals.forEach(meal => {
        let foodcart = document.createElement('div');
        foodcart.classList.add('col-md-3', 'mb-4');

        foodcart.innerHTML = `
            <div class="card">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">It is a ${meal.strArea} (${meal.strCategory}) dish</p>
                    <button class="btn btn-outline-danger view-recipe">View recipe</button>
                </div>
            </div>
        `;
        main.appendChild(foodcart);

        // Attach event listener to the dynamically created button
        foodcart.querySelector('.view-recipe').addEventListener('click', () => {
            let inst = document.createElement('div');
            inst.classList.add('inst');

            inst.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <h2>${meal.strMeal}</h2>
                                <h3>Ingredients:</h3>
                                <ul class="ingredients list-group list-group-flush"></ul>
                                <h3>Instructions:</h3>
                                <p>${meal.strInstructions}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            main.appendChild(inst);

            let ingredients = inst.querySelector('.ingredients');
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    let li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.textContent = `${meal[`strIngredient${i}`]} (${meal[`strMeasure${i}`]})`;
                    ingredients.appendChild(li);
                }
            }

            // Close modal when clicking outside of it
            document.querySelector('.modal-overlay').addEventListener('click', () => {
                inst.remove();
            });
        });
    });
}

btn.addEventListener('click', () => {
    generate(input.value);
});
