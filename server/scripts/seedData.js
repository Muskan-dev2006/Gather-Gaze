const seedData = [
  {
    title: "Margherita Pizza", photoQuery: "fresh margherita pizza basil mozzarella", description: "A crisp, simple pizza topped with tomato, mozzarella, and fresh basil.", cuisine: "Italian", diet: "veg", difficulty: "medium", cookTime: 35, servings: 4, tags: ["pizza", "tomato", "weeknight"],
    ingredients: [{ name: "pizza dough", qty: 500, unit: "g" }, { name: "crushed tomatoes", qty: 180, unit: "g" }, { name: "fresh mozzarella", qty: 200, unit: "g" }, { name: "fresh basil", qty: 12, unit: "leaves" }, { name: "olive oil", qty: 1, unit: "tbsp" }],
    steps: [{ order: 1, text: "Heat the oven as hot as it will go and warm a pizza stone or tray." }, { order: 2, text: "Stretch the dough into a thin round and spread on a light layer of tomato." }, { order: 3, text: "Add torn mozzarella and bake until the crust is puffed and browned." }, { order: 4, text: "Finish with basil and a drizzle of olive oil before slicing." }],
  },
  {
    title: "Spaghetti Carbonara", photoQuery: "spaghetti carbonara pecorino guanciale", description: "Silky Roman pasta tossed with eggs, pecorino, black pepper, and crisp pork.", cuisine: "Italian", diet: "non-veg", difficulty: "medium", cookTime: 25, servings: 4, tags: ["pasta", "comfort-food", "quick"],
    ingredients: [{ name: "spaghetti", qty: 400, unit: "g" }, { name: "guanciale", qty: 150, unit: "g" }, { name: "eggs", qty: 3, unit: "large" }, { name: "pecorino romano", qty: 80, unit: "g" }, { name: "black pepper", qty: 1, unit: "tsp" }],
    steps: [{ order: 1, text: "Bring salted water to a boil and cook the spaghetti until just al dente." }, { order: 2, text: "Cook diced guanciale in a skillet until crisp, then turn off the heat." }, { order: 3, text: "Whisk eggs, grated pecorino, and plenty of black pepper in a bowl." }, { order: 4, text: "Toss hot pasta with guanciale, then stir in the egg mixture off the heat with pasta water until glossy." }],
  },
  {
    title: "Mushroom Risotto", photoQuery: "creamy mushroom risotto parmesan", description: "Creamy arborio rice with browned mushrooms, parmesan, and a little patience.", cuisine: "Italian", diet: "veg", difficulty: "medium", cookTime: 45, servings: 4, tags: ["rice", "mushroom", "comfort-food"],
    ingredients: [{ name: "arborio rice", qty: 300, unit: "g" }, { name: "cremini mushrooms", qty: 250, unit: "g" }, { name: "vegetable stock", qty: 1, unit: "L" }, { name: "yellow onion", qty: 1, unit: "medium" }, { name: "parmesan", qty: 60, unit: "g" }, { name: "butter", qty: 2, unit: "tbsp" }],
    steps: [{ order: 1, text: "Warm the stock in a saucepan and keep it at a gentle simmer." }, { order: 2, text: "Brown sliced mushrooms in butter, then set them aside." }, { order: 3, text: "Soften onion, stir in rice, and add warm stock a ladle at a time while stirring." }, { order: 4, text: "When the rice is tender and creamy, fold in mushrooms and parmesan." }],
  },
  {
    title: "Tiramisu", photoQuery: "classic tiramisu cocoa mascarpone dessert", description: "Espresso-soaked ladyfingers layered with light mascarpone cream and cocoa.", cuisine: "Italian", diet: "veg", difficulty: "medium", cookTime: 35, servings: 8, tags: ["dessert", "coffee", "make-ahead"],
    ingredients: [{ name: "ladyfingers", qty: 250, unit: "g" }, { name: "mascarpone", qty: 450, unit: "g" }, { name: "eggs", qty: 4, unit: "large" }, { name: "sugar", qty: 100, unit: "g" }, { name: "espresso", qty: 300, unit: "ml" }, { name: "cocoa powder", qty: 2, unit: "tbsp" }],
    steps: [{ order: 1, text: "Separate the eggs and beat the yolks with sugar until pale and thick." }, { order: 2, text: "Fold mascarpone into the yolks, then fold in softly whipped egg whites." }, { order: 3, text: "Briefly dip ladyfingers in cooled espresso and layer them in a dish with the cream." }, { order: 4, text: "Chill until set and dust generously with cocoa before serving." }],
  },
  {
    title: "Paneer Butter Masala", photoQuery: "paneer butter masala curry tomato cream", description: "Soft paneer cubes in a gently spiced tomato and butter sauce.", cuisine: "Indian", diet: "veg", difficulty: "medium", cookTime: 40, servings: 4, tags: ["paneer", "curry", "vegetarian"],
    ingredients: [{ name: "paneer", qty: 400, unit: "g" }, { name: "tomatoes", qty: 500, unit: "g" }, { name: "butter", qty: 3, unit: "tbsp" }, { name: "heavy cream", qty: 120, unit: "ml" }, { name: "ginger garlic paste", qty: 1, unit: "tbsp" }, { name: "garam masala", qty: 1, unit: "tsp" }],
    steps: [{ order: 1, text: "Cook tomatoes with ginger garlic paste until soft, then blend smooth." }, { order: 2, text: "Melt butter and bloom garam masala with a pinch of chili powder." }, { order: 3, text: "Pour in the tomato puree and simmer until thick and glossy." }, { order: 4, text: "Add paneer and cream, warm gently, and serve with rice or naan." }],
  },
  {
    title: "Chicken Biryani", photoQuery: "chicken biryani basmati rice spices", description: "Fragrant basmati rice layered with spiced chicken, herbs, and fried onions.", cuisine: "Indian", diet: "non-veg", difficulty: "hard", cookTime: 75, servings: 6, tags: ["rice", "chicken", "festive"],
    ingredients: [{ name: "chicken thighs", qty: 800, unit: "g" }, { name: "basmati rice", qty: 400, unit: "g" }, { name: "plain yogurt", qty: 180, unit: "g" }, { name: "onions", qty: 2, unit: "large" }, { name: "biryani masala", qty: 2, unit: "tbsp" }, { name: "fresh cilantro", qty: 20, unit: "g" }],
    steps: [{ order: 1, text: "Marinate chicken with yogurt, biryani masala, salt, and half the herbs." }, { order: 2, text: "Parboil rinsed rice until the grains are just beginning to soften, then drain." }, { order: 3, text: "Brown sliced onions, add the chicken, and cook until nearly done." }, { order: 4, text: "Layer rice over the chicken with herbs and fried onions, cover tightly, and steam until fragrant." }],
  },
  {
    title: "Masala Dosa", photoQuery: "masala dosa potato filling crispy", description: "Crisp fermented rice crepes filled with turmeric potatoes and served with chutney.", cuisine: "Indian", diet: "vegan", difficulty: "medium", cookTime: 50, servings: 4, tags: ["breakfast", "potato", "street-food"],
    ingredients: [{ name: "dosa batter", qty: 700, unit: "g" }, { name: "potatoes", qty: 500, unit: "g" }, { name: "onion", qty: 1, unit: "large" }, { name: "mustard seeds", qty: 1, unit: "tsp" }, { name: "turmeric", qty: 0.5, unit: "tsp" }, { name: "neutral oil", qty: 2, unit: "tbsp" }],
    steps: [{ order: 1, text: "Boil potatoes until tender, then peel and roughly mash them." }, { order: 2, text: "Sizzle mustard seeds in oil, soften onion, and stir in turmeric and potatoes." }, { order: 3, text: "Spread a ladle of dosa batter thinly across a hot oiled skillet." }, { order: 4, text: "Cook until crisp, spoon potato filling down the center, fold, and serve hot." }],
  },
  {
    title: "Palak Paneer", photoQuery: "palak paneer spinach curry paneer cubes", description: "Paneer folded into a vibrant spinach curry seasoned with garlic and warming spices.", cuisine: "Indian", diet: "veg", difficulty: "medium", cookTime: 35, servings: 4, tags: ["spinach", "paneer", "curry"],
    ingredients: [{ name: "spinach", qty: 500, unit: "g" }, { name: "paneer", qty: 350, unit: "g" }, { name: "onion", qty: 1, unit: "medium" }, { name: "tomato", qty: 1, unit: "large" }, { name: "garlic cloves", qty: 4, unit: "pieces" }, { name: "cumin", qty: 1, unit: "tsp" }],
    steps: [{ order: 1, text: "Blanch spinach briefly, cool it quickly, and blend into a smooth puree." }, { order: 2, text: "Sauté cumin, onion, and garlic until fragrant, then add chopped tomato." }, { order: 3, text: "Stir in spinach puree and simmer with salt and garam masala." }, { order: 4, text: "Add paneer cubes and warm through without boiling the sauce." }],
  },
  {
    title: "Chicken Teriyaki", photoQuery: "chicken teriyaki rice glossy sauce", description: "Seared chicken glazed with a savory-sweet soy, ginger, and mirin sauce.", cuisine: "Japanese", diet: "non-veg", difficulty: "easy", cookTime: 30, servings: 4, tags: ["chicken", "quick", "rice-bowl"],
    ingredients: [{ name: "chicken thighs", qty: 600, unit: "g" }, { name: "soy sauce", qty: 80, unit: "ml" }, { name: "mirin", qty: 60, unit: "ml" }, { name: "honey", qty: 1, unit: "tbsp" }, { name: "fresh ginger", qty: 15, unit: "g" }, { name: "sesame seeds", qty: 1, unit: "tsp" }],
    steps: [{ order: 1, text: "Stir soy sauce, mirin, honey, and grated ginger together." }, { order: 2, text: "Sear chicken in a hot skillet until browned on both sides." }, { order: 3, text: "Pour in the sauce and simmer, turning the chicken until cooked through and glazed." }, { order: 4, text: "Slice the chicken, spoon over the glaze, and finish with sesame seeds." }],
  },
  {
    title: "Vegetable Ramen", photoQuery: "vegetable ramen noodles broth mushrooms", description: "A comforting bowl of springy noodles, mushrooms, greens, and savory miso broth.", cuisine: "Japanese", diet: "vegan", difficulty: "medium", cookTime: 40, servings: 4, tags: ["noodles", "miso", "soup"],
    ingredients: [{ name: "ramen noodles", qty: 400, unit: "g" }, { name: "vegetable broth", qty: 1, unit: "L" }, { name: "white miso", qty: 3, unit: "tbsp" }, { name: "shiitake mushrooms", qty: 200, unit: "g" }, { name: "baby bok choy", qty: 250, unit: "g" }, { name: "tofu", qty: 250, unit: "g" }],
    steps: [{ order: 1, text: "Simmer broth with sliced mushrooms until the mushrooms are tender." }, { order: 2, text: "Whisk miso with a little hot broth, then stir it back into the pot off the boil." }, { order: 3, text: "Cook noodles separately and quickly blanch the bok choy." }, { order: 4, text: "Divide noodles, tofu, and greens into bowls, then ladle over the broth." }],
  },
  {
    title: "Chicken Katsu", photoQuery: "japanese chicken katsu panko cutlet", description: "Juicy chicken cutlets coated in crisp panko and served with tangy tonkatsu sauce.", cuisine: "Japanese", diet: "non-veg", difficulty: "medium", cookTime: 35, servings: 4, tags: ["chicken", "crispy", "dinner"],
    ingredients: [{ name: "chicken breasts", qty: 600, unit: "g" }, { name: "all-purpose flour", qty: 80, unit: "g" }, { name: "eggs", qty: 2, unit: "large" }, { name: "panko breadcrumbs", qty: 150, unit: "g" }, { name: "neutral oil", qty: 250, unit: "ml" }, { name: "tonkatsu sauce", qty: 100, unit: "ml" }],
    steps: [{ order: 1, text: "Flatten chicken breasts to an even thickness and season with salt." }, { order: 2, text: "Dredge each piece in flour, dip in beaten egg, and coat with panko." }, { order: 3, text: "Shallow-fry until golden on both sides and cooked through." }, { order: 4, text: "Rest briefly, slice into strips, and serve with tonkatsu sauce." }],
  },
  {
    title: "Miso Salmon", photoQuery: "miso glazed salmon japanese sesame", description: "Rich salmon brushed with a savory miso glaze and broiled until caramelized.", cuisine: "Japanese", diet: "keto", difficulty: "easy", cookTime: 25, servings: 4, tags: ["salmon", "low-carb", "quick"],
    ingredients: [{ name: "salmon fillets", qty: 600, unit: "g" }, { name: "white miso", qty: 2, unit: "tbsp" }, { name: "tamari", qty: 1, unit: "tbsp" }, { name: "rice vinegar", qty: 1, unit: "tsp" }, { name: "sesame oil", qty: 1, unit: "tsp" }, { name: "scallions", qty: 2, unit: "pieces" }],
    steps: [{ order: 1, text: "Heat the broiler and line a tray with parchment." }, { order: 2, text: "Whisk miso, tamari, vinegar, and sesame oil into a smooth glaze." }, { order: 3, text: "Brush salmon with glaze and broil until just cooked and browned at the edges." }, { order: 4, text: "Top with sliced scallions and serve with steamed greens." }],
  },
  {
    title: "Chicken Tacos", photoQuery: "mexican chicken tacos cilantro lime", description: "Warm tortillas filled with smoky spiced chicken, crunchy cabbage, and lime.", cuisine: "Mexican", diet: "non-veg", difficulty: "easy", cookTime: 30, servings: 4, tags: ["tacos", "chicken", "weeknight"],
    ingredients: [{ name: "chicken thighs", qty: 600, unit: "g" }, { name: "corn tortillas", qty: 8, unit: "pieces" }, { name: "chili powder", qty: 1, unit: "tsp" }, { name: "ground cumin", qty: 1, unit: "tsp" }, { name: "cabbage", qty: 150, unit: "g" }, { name: "lime", qty: 2, unit: "pieces" }],
    steps: [{ order: 1, text: "Season chicken with chili powder, cumin, salt, and a little oil." }, { order: 2, text: "Sear chicken until browned and cooked through, then rest and slice." }, { order: 3, text: "Warm tortillas in a dry skillet and shred the cabbage." }, { order: 4, text: "Fill tortillas with chicken and cabbage, then squeeze lime over the top." }],
  },
  {
    title: "Guacamole", photoQuery: "fresh guacamole avocado lime cilantro", description: "Chunky avocado mashed with lime, cilantro, onion, and a little chile.", cuisine: "Mexican", diet: "vegan", difficulty: "easy", cookTime: 15, servings: 6, tags: ["avocado", "dip", "quick"],
    ingredients: [{ name: "ripe avocados", qty: 3, unit: "pieces" }, { name: "lime juice", qty: 2, unit: "tbsp" }, { name: "red onion", qty: 0.5, unit: "small" }, { name: "fresh cilantro", qty: 15, unit: "g" }, { name: "jalapeño", qty: 1, unit: "piece" }, { name: "salt", qty: 0.5, unit: "tsp" }],
    steps: [{ order: 1, text: "Scoop avocado flesh into a bowl and mash it roughly with a fork." }, { order: 2, text: "Fold in lime juice, finely chopped onion, cilantro, and jalapeño." }, { order: 3, text: "Season with salt and taste for more lime or chile." }, { order: 4, text: "Serve right away with tortilla chips or fresh vegetables." }],
  },
  {
    title: "Cheese Enchiladas", photoQuery: "cheese enchiladas red sauce mexican", description: "Corn tortillas rolled around melty cheese and baked under a bright red chile sauce.", cuisine: "Mexican", diet: "veg", difficulty: "easy", cookTime: 40, servings: 4, tags: ["cheese", "baked", "comfort-food"],
    ingredients: [{ name: "corn tortillas", qty: 8, unit: "pieces" }, { name: "cheddar cheese", qty: 250, unit: "g" }, { name: "enchilada sauce", qty: 400, unit: "ml" }, { name: "onion", qty: 1, unit: "small" }, { name: "sour cream", qty: 100, unit: "g" }, { name: "fresh cilantro", qty: 10, unit: "g" }],
    steps: [{ order: 1, text: "Heat the oven and spread a thin layer of enchilada sauce in a baking dish." }, { order: 2, text: "Warm tortillas until pliable and fill each with cheese and chopped onion." }, { order: 3, text: "Roll the tortillas into the dish, cover with remaining sauce, and add cheese." }, { order: 4, text: "Bake until bubbling, then finish with sour cream and cilantro." }],
  },
  {
    title: "Carne Asada Lettuce Wraps", photoQuery: "carne asada lettuce wraps grilled steak", description: "Citrus-marinated grilled steak tucked into cool lettuce leaves with salsa.", cuisine: "Mexican", diet: "keto", difficulty: "medium", cookTime: 35, servings: 4, tags: ["steak", "low-carb", "grill"],
    ingredients: [{ name: "skirt steak", qty: 700, unit: "g" }, { name: "lime juice", qty: 3, unit: "tbsp" }, { name: "garlic cloves", qty: 3, unit: "pieces" }, { name: "ground cumin", qty: 1, unit: "tsp" }, { name: "romaine leaves", qty: 12, unit: "pieces" }, { name: "avocado", qty: 1, unit: "large" }],
    steps: [{ order: 1, text: "Marinate steak with lime, garlic, cumin, salt, and oil." }, { order: 2, text: "Grill or sear over high heat until browned and cooked to your liking." }, { order: 3, text: "Rest the steak, then slice thinly across the grain." }, { order: 4, text: "Serve in romaine leaves with avocado and fresh salsa." }],
  },
  {
    title: "Greek Salad", photoQuery: "traditional greek salad feta olives cucumber", description: "A crisp salad of cucumber, tomato, olives, and feta with oregano dressing.", cuisine: "Mediterranean", diet: "keto", difficulty: "easy", cookTime: 15, servings: 4, tags: ["salad", "fresh", "low-carb"],
    ingredients: [{ name: "cucumber", qty: 1, unit: "large" }, { name: "tomatoes", qty: 300, unit: "g" }, { name: "feta", qty: 180, unit: "g" }, { name: "Kalamata olives", qty: 100, unit: "g" }, { name: "red onion", qty: 0.5, unit: "small" }, { name: "dried oregano", qty: 1, unit: "tsp" }],
    steps: [{ order: 1, text: "Cut cucumber and tomatoes into generous bite-sized pieces." }, { order: 2, text: "Slice the onion thinly and add it with the olives to a serving bowl." }, { order: 3, text: "Whisk olive oil, red wine vinegar, oregano, and salt." }, { order: 4, text: "Dress the vegetables and top with a slab of feta before serving." }],
  },
  {
    title: "Falafel Wrap", photoQuery: "falafel wrap hummus vegetables pita", description: "Herby chickpea falafel wrapped with hummus, crunchy vegetables, and lemon.", cuisine: "Mediterranean", diet: "vegan", difficulty: "medium", cookTime: 45, servings: 4, tags: ["chickpea", "wrap", "lunch"],
    ingredients: [{ name: "dried chickpeas", qty: 250, unit: "g" }, { name: "fresh parsley", qty: 30, unit: "g" }, { name: "garlic cloves", qty: 2, unit: "pieces" }, { name: "ground cumin", qty: 1, unit: "tsp" }, { name: "pita breads", qty: 4, unit: "pieces" }, { name: "hummus", qty: 180, unit: "g" }],
    steps: [{ order: 1, text: "Soak chickpeas overnight, then drain them very well." }, { order: 2, text: "Pulse chickpeas with parsley, garlic, cumin, and salt until finely chopped." }, { order: 3, text: "Shape into small patties and shallow-fry until crisp and cooked through." }, { order: 4, text: "Spread hummus in warm pita and fill with falafel and chopped vegetables." }],
  },
  {
    title: "Spanakopita", photoQuery: "spanakopita spinach feta phyllo pie", description: "Flaky phyllo parcels filled with spinach, feta, dill, and a touch of lemon.", cuisine: "Mediterranean", diet: "veg", difficulty: "medium", cookTime: 55, servings: 6, tags: ["spinach", "feta", "baking"],
    ingredients: [{ name: "phyllo pastry", qty: 250, unit: "g" }, { name: "spinach", qty: 400, unit: "g" }, { name: "feta", qty: 180, unit: "g" }, { name: "eggs", qty: 2, unit: "large" }, { name: "fresh dill", qty: 15, unit: "g" }, { name: "olive oil", qty: 60, unit: "ml" }],
    steps: [{ order: 1, text: "Wilt spinach in a pan, cool it, and squeeze out excess liquid." }, { order: 2, text: "Mix spinach with crumbled feta, eggs, dill, lemon zest, and pepper." }, { order: 3, text: "Layer phyllo sheets with olive oil and spoon the filling into the center." }, { order: 4, text: "Fold into parcels and bake until deeply golden and crisp." }],
  },
  {
    title: "Lemon Herb Chicken", photoQuery: "mediterranean lemon herb roast chicken", description: "Roasted chicken with lemon, garlic, oregano, and tender pan vegetables.", cuisine: "Mediterranean", diet: "non-veg", difficulty: "easy", cookTime: 60, servings: 4, tags: ["chicken", "roast", "lemon"],
    ingredients: [{ name: "chicken thighs", qty: 800, unit: "g" }, { name: "lemons", qty: 2, unit: "pieces" }, { name: "garlic cloves", qty: 5, unit: "pieces" }, { name: "dried oregano", qty: 2, unit: "tsp" }, { name: "red potatoes", qty: 500, unit: "g" }, { name: "olive oil", qty: 2, unit: "tbsp" }],
    steps: [{ order: 1, text: "Heat the oven and toss potato wedges with olive oil, oregano, salt, and pepper." }, { order: 2, text: "Season chicken with lemon zest, crushed garlic, and more oregano." }, { order: 3, text: "Arrange chicken and potatoes in a roasting pan with lemon wedges." }, { order: 4, text: "Roast until the chicken is cooked through and the potatoes are tender." }],
  },
  {
    title: "Pad Thai", photoQuery: "pad thai shrimp rice noodles peanuts", description: "Rice noodles tossed with shrimp, egg, tamarind, peanuts, and fresh lime.", cuisine: "Thai", diet: "non-veg", difficulty: "medium", cookTime: 35, servings: 4, tags: ["noodles", "shrimp", "street-food"],
    ingredients: [{ name: "rice noodles", qty: 250, unit: "g" }, { name: "shrimp", qty: 300, unit: "g" }, { name: "eggs", qty: 2, unit: "large" }, { name: "tamarind paste", qty: 2, unit: "tbsp" }, { name: "fish sauce", qty: 1, unit: "tbsp" }, { name: "roasted peanuts", qty: 50, unit: "g" }],
    steps: [{ order: 1, text: "Soak rice noodles in warm water until pliable, then drain." }, { order: 2, text: "Stir tamarind, fish sauce, and palm sugar together for the sauce." }, { order: 3, text: "Stir-fry shrimp, add noodles and sauce, then push aside and scramble the eggs." }, { order: 4, text: "Toss everything together and serve with peanuts, lime, and bean sprouts." }],
  },
  {
    title: "Tofu Green Curry", photoQuery: "thai green curry tofu vegetables coconut", description: "Fragrant green curry with tofu, vegetables, coconut milk, and Thai basil.", cuisine: "Thai", diet: "vegan", difficulty: "easy", cookTime: 35, servings: 4, tags: ["curry", "tofu", "coconut"],
    ingredients: [{ name: "firm tofu", qty: 350, unit: "g" }, { name: "green curry paste", qty: 3, unit: "tbsp" }, { name: "coconut milk", qty: 400, unit: "ml" }, { name: "eggplant", qty: 250, unit: "g" }, { name: "green beans", qty: 150, unit: "g" }, { name: "Thai basil", qty: 15, unit: "g" }],
    steps: [{ order: 1, text: "Brown tofu cubes in a pan and set them aside." }, { order: 2, text: "Fry green curry paste briefly until fragrant." }, { order: 3, text: "Add coconut milk, eggplant, and green beans; simmer until tender." }, { order: 4, text: "Return tofu to the pan and finish with Thai basil and lime." }],
  },
  {
    title: "Tom Yum Shrimp Soup", photoQuery: "tom yum shrimp soup lemongrass mushrooms", description: "Hot and sour Thai soup with shrimp, lemongrass, lime, and mushrooms.", cuisine: "Thai", diet: "non-veg", difficulty: "medium", cookTime: 30, servings: 4, tags: ["soup", "shrimp", "spicy"],
    ingredients: [{ name: "shrimp", qty: 400, unit: "g" }, { name: "chicken stock", qty: 1, unit: "L" }, { name: "lemongrass", qty: 2, unit: "stalks" }, { name: "galangal", qty: 20, unit: "g" }, { name: "mushrooms", qty: 200, unit: "g" }, { name: "lime juice", qty: 3, unit: "tbsp" }],
    steps: [{ order: 1, text: "Bring stock to a simmer with bruised lemongrass and sliced galangal." }, { order: 2, text: "Add mushrooms and simmer until softened." }, { order: 3, text: "Add shrimp and cook just until pink and opaque." }, { order: 4, text: "Season with lime juice, fish sauce, and chili, then serve hot." }],
  },
  {
    title: "Chicken Larb Lettuce Cups", photoQuery: "thai chicken larb lettuce cups herbs", description: "Bright minced chicken tossed with lime, mint, toasted rice, and crisp lettuce.", cuisine: "Thai", diet: "keto", difficulty: "easy", cookTime: 25, servings: 4, tags: ["chicken", "low-carb", "fresh"],
    ingredients: [{ name: "ground chicken", qty: 500, unit: "g" }, { name: "lime juice", qty: 3, unit: "tbsp" }, { name: "fish sauce", qty: 1, unit: "tbsp" }, { name: "fresh mint", qty: 15, unit: "g" }, { name: "shallot", qty: 2, unit: "pieces" }, { name: "butter lettuce", qty: 12, unit: "leaves" }],
    steps: [{ order: 1, text: "Cook ground chicken in a skillet with a splash of water until fully cooked." }, { order: 2, text: "Stir in sliced shallot, fish sauce, lime juice, and chili flakes." }, { order: 3, text: "Fold through fresh mint and cilantro just before serving." }, { order: 4, text: "Spoon into lettuce leaves and serve with extra lime." }],
  },
  {
    title: "Ratatouille", photoQuery: "provençal ratatouille layered vegetables", description: "A Provençal vegetable stew of eggplant, zucchini, peppers, and tomato.", cuisine: "French", diet: "vegan", difficulty: "medium", cookTime: 60, servings: 6, tags: ["vegetables", "tomato", "slow-cooked"],
    ingredients: [{ name: "eggplant", qty: 1, unit: "large" }, { name: "zucchini", qty: 2, unit: "pieces" }, { name: "red bell pepper", qty: 1, unit: "large" }, { name: "tomatoes", qty: 500, unit: "g" }, { name: "yellow onion", qty: 1, unit: "large" }, { name: "olive oil", qty: 3, unit: "tbsp" }],
    steps: [{ order: 1, text: "Dice onion and pepper, then soften them in olive oil." }, { order: 2, text: "Add chopped tomatoes and simmer into a thick sauce." }, { order: 3, text: "Stir in diced eggplant and zucchini with thyme and salt." }, { order: 4, text: "Cover and cook gently until all vegetables are tender and fragrant." }],
  },
  {
    title: "French Crêpes", photoQuery: "thin french crepes butter berries", description: "Tender, paper-thin crêpes that can be filled with fruit, jam, or chocolate.", cuisine: "French", diet: "veg", difficulty: "easy", cookTime: 30, servings: 6, tags: ["breakfast", "dessert", "quick"],
    ingredients: [{ name: "all-purpose flour", qty: 200, unit: "g" }, { name: "milk", qty: 400, unit: "ml" }, { name: "eggs", qty: 3, unit: "large" }, { name: "melted butter", qty: 30, unit: "g" }, { name: "sugar", qty: 1, unit: "tbsp" }, { name: "salt", qty: 0.25, unit: "tsp" }],
    steps: [{ order: 1, text: "Whisk flour, sugar, salt, eggs, and milk into a smooth thin batter." }, { order: 2, text: "Rest the batter while a lightly buttered skillet heats." }, { order: 3, text: "Pour in a small amount of batter and swirl into a thin round." }, { order: 4, text: "Cook briefly on both sides and stack under a clean towel." }],
  },
  {
    title: "Coq au Vin", photoQuery: "classic coq au vin braised chicken wine", description: "Chicken braised slowly with red wine, mushrooms, pearl onions, and thyme.", cuisine: "French", diet: "non-veg", difficulty: "hard", cookTime: 100, servings: 6, tags: ["chicken", "braised", "classic"],
    ingredients: [{ name: "chicken thighs", qty: 1, unit: "kg" }, { name: "red wine", qty: 500, unit: "ml" }, { name: "bacon", qty: 150, unit: "g" }, { name: "pearl onions", qty: 200, unit: "g" }, { name: "button mushrooms", qty: 250, unit: "g" }, { name: "thyme", qty: 4, unit: "sprigs" }],
    steps: [{ order: 1, text: "Brown bacon in a Dutch oven, then brown chicken in the rendered fat." }, { order: 2, text: "Soften pearl onions and mushrooms, then return chicken to the pot." }, { order: 3, text: "Pour in red wine and stock with thyme, scraping up browned bits." }, { order: 4, text: "Cover and braise gently until chicken is tender and the sauce is rich." }],
  },
  {
    title: "French Omelette", photoQuery: "soft french omelette herbs butter", description: "A soft, tender omelette folded around herbs and creamy cheese.", cuisine: "French", diet: "keto", difficulty: "medium", cookTime: 12, servings: 1, tags: ["eggs", "low-carb", "quick"],
    ingredients: [{ name: "eggs", qty: 3, unit: "large" }, { name: "butter", qty: 1, unit: "tbsp" }, { name: "gruyère", qty: 25, unit: "g" }, { name: "chives", qty: 1, unit: "tbsp" }, { name: "heavy cream", qty: 1, unit: "tbsp" }],
    steps: [{ order: 1, text: "Beat eggs with cream, salt, and pepper until combined." }, { order: 2, text: "Melt butter in a small nonstick skillet over medium-low heat." }, { order: 3, text: "Add eggs and stir gently, tilting the pan until softly set." }, { order: 4, text: "Add cheese and chives, fold into a neat oval, and serve immediately." }],
  },
  {
    title: "Bibimbap", photoQuery: "korean bibimbap vegetables rice fried egg", description: "A colorful Korean rice bowl with seasoned vegetables, egg, and gochujang.", cuisine: "Korean", diet: "veg", difficulty: "medium", cookTime: 45, servings: 4, tags: ["rice-bowl", "vegetables", "korean"],
    ingredients: [{ name: "short-grain rice", qty: 300, unit: "g" }, { name: "spinach", qty: 150, unit: "g" }, { name: "carrots", qty: 2, unit: "pieces" }, { name: "shiitake mushrooms", qty: 150, unit: "g" }, { name: "eggs", qty: 4, unit: "large" }, { name: "gochujang", qty: 3, unit: "tbsp" }],
    steps: [{ order: 1, text: "Cook rice until fluffy and keep it covered." }, { order: 2, text: "Sauté spinach, carrots, and mushrooms separately with a little sesame oil." }, { order: 3, text: "Fry eggs sunny-side up and stir gochujang with sesame oil and water." }, { order: 4, text: "Arrange rice and vegetables in bowls, add an egg, and serve with sauce." }],
  },
  {
    title: "Kimchi Fried Rice", photoQuery: "kimchi fried rice egg sesame korean", description: "Day-old rice stir-fried with tangy kimchi, scallions, sesame, and a fried egg.", cuisine: "Korean", diet: "non-veg", difficulty: "easy", cookTime: 20, servings: 3, tags: ["rice", "kimchi", "quick"],
    ingredients: [{ name: "cooked short-grain rice", qty: 500, unit: "g" }, { name: "kimchi", qty: 200, unit: "g" }, { name: "eggs", qty: 3, unit: "large" }, { name: "gochujang", qty: 1, unit: "tbsp" }, { name: "scallions", qty: 3, unit: "pieces" }, { name: "sesame oil", qty: 1, unit: "tbsp" }],
    steps: [{ order: 1, text: "Chop kimchi and slice scallions, keeping some greens for garnish." }, { order: 2, text: "Stir-fry kimchi and gochujang in sesame oil until aromatic." }, { order: 3, text: "Add rice and toss over high heat until hot and evenly coated." }, { order: 4, text: "Fry eggs separately and serve on top with scallion greens." }],
  },
  {
    title: "Japchae", photoQuery: "korean japchae glass noodles vegetables", description: "Springy sweet potato noodles tossed with vegetables and sesame soy dressing.", cuisine: "Korean", diet: "vegan", difficulty: "medium", cookTime: 40, servings: 4, tags: ["noodles", "vegetables", "sesame"],
    ingredients: [{ name: "sweet potato glass noodles", qty: 250, unit: "g" }, { name: "spinach", qty: 120, unit: "g" }, { name: "carrot", qty: 1, unit: "large" }, { name: "shiitake mushrooms", qty: 150, unit: "g" }, { name: "soy sauce", qty: 3, unit: "tbsp" }, { name: "sesame oil", qty: 1, unit: "tbsp" }],
    steps: [{ order: 1, text: "Soak and boil glass noodles according to the package, then drain." }, { order: 2, text: "Sauté carrots, mushrooms, and spinach separately until just tender." }, { order: 3, text: "Toss noodles and vegetables with soy sauce, sesame oil, and a little sugar." }, { order: 4, text: "Warm everything together and finish with sesame seeds." }],
  },
  {
    title: "Bulgogi Lettuce Wraps", photoQuery: "korean bulgogi beef lettuce wraps sesame", description: "Thinly sliced marinated beef seared quickly and wrapped in crisp lettuce.", cuisine: "Korean", diet: "keto", difficulty: "easy", cookTime: 30, servings: 4, tags: ["beef", "low-carb", "quick"],
    ingredients: [{ name: "thinly sliced beef", qty: 600, unit: "g" }, { name: "soy sauce", qty: 3, unit: "tbsp" }, { name: "sesame oil", qty: 1, unit: "tbsp" }, { name: "garlic cloves", qty: 3, unit: "pieces" }, { name: "romaine leaves", qty: 16, unit: "pieces" }, { name: "sesame seeds", qty: 1, unit: "tsp" }],
    steps: [{ order: 1, text: "Mix soy, sesame oil, garlic, and grated pear, then coat the beef." }, { order: 2, text: "Marinate briefly while heating a wide skillet until very hot." }, { order: 3, text: "Sear beef in batches until browned and just cooked." }, { order: 4, text: "Serve in lettuce leaves with sesame seeds and sliced scallions." }],
  },
];

export default seedData;
