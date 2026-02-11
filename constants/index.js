const navLinks = [
    {
        id: "cocktails",
        title: "Cocktails",
    },
    {
        id: "about",
        title: "About Us",
    },
    {
        id: "art",
        title: "The Art",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const cocktailLists = [
    {
        name: "Chapel Hill Shiraz",
        country: "AU",
        detail: "Battle",
        price: "$10",
    },
    {
        name: "Caten Malbee",
        country: "AU",
        detail: "Battle",
        price: "$49",
    },
    {
        name: "Rhino Pale Ale",
        country: "CA",
        detail: "750 ml",
        price: "$20",
    },
    {
        name: "Irish Guinness",
        country: "IE",
        detail: "600 ml",
        price: "$29",
    },
];

const mockTailLists = [
    {
        name: "Tropical Bloom",
        country: "US",
        detail: "Battle",
        price: "$10",
    },
    {
        name: "Passionfruit Mint",
        country: "US",
        detail: "Battle",
        price: "$49",
    },
    {
        name: "Citrus Glow",
        country: "CA",
        detail: "750 ml",
        price: "$20",
    },
    {
        name: "Lavender Fizz",
        country: "IE",
        detail: "600 ml",
        price: "$29",
    },
];

const profileLists = [
    {
        imgPath: "/images/profile1.png",
    },
    {
        imgPath: "/images/profile2.png",
    },
    {
        imgPath: "/images/profile3.png",
    },
    {
        imgPath: "/images/profile4.png",
    },
];

const featureLists = [
    "Perfectly balanced blends",
    "Garnished to perfection",
    "Ice-cold every time",
    "Expertly shaken & stirred",
];

const goodLists = [
    "Handpicked ingredients",
    "Signature techniques",
    "Bartending artistry in action",
    "Freshly muddled flavors",
];

const companyInfo = {
    name: "Velvet Pour",
    tagline: "Cool. Crisp. Classic",
    slogan: "Sip the spirit of Summer",
    logo: "/images/logo.png",
};

const heroContent = {
    title: "MOJITO",
    tagline: "Cool. Crisp. Classic",
    subtitle: "Sip the spirit of Summer",
    description: "Every cocktail on our menu is a blend of premium ingredients, creative flair, and timeless recipes — designed to delight your senses.",
    ctaText: "View Cocktails",
    ctaLink: "#cocktails",
    backgroundVideo: "/videos/output.mp4",
};

const aboutContent = {
    badge: "Best Cocktails",
    heading: "Where every detail matters - from muddle to garnish",
    description: "Every cocktail we serve is a reflection of our obsession with detail — from the first muddle to the final garnish. That care is what turns a simple drink into something truly memorable.",
    rating: "4.5",
    maxRating: "5",
    customerCount: "More than +1200 customers",
};

const artContent = {
    mainTitle: "The ART",
    revealTitle: "Sip-Worthy Perfection",
    revealSubtitle: "Made with Craft, Poured with Passion",
    revealDescription: "This isn't just a drink. It's a carefully crafted moment made just for you.",
};

const cocktailsContent = {
    popularTitle: "Most popular cocktails:",
    lovedTitle: "Most loved mocktails:",
};

const menuContent = {
    heading: "Cocktail Menu",
    recipeLabel: "Recipe for:",
};

const storeInfo = {
    heading: "Where to Find Us",
    address: "54A, Gandhi Nagar, Jammu, Jammu & Kashmir, India",
    contact: {
        phone: "(91) 9596112777",
        email: "akashcodesharma@gmail.com",
    },
};

const openingHours = [
    { day: "Mon–Thu", time: "11:00am – 12am" },
    { day: "Fri", time: "11:00am – 2am" },
    { day: "Sat", time: "9:00am – 2am" },
    { day: "Sun", time: "9:00am – 1am" },
];

const socials = [
    {
        name: "Instagram",
        icon: "/images/insta.png",
        url: "https://www.instagram.com/codesofakash/",
    },
    {
        name: "X (Twitter)",
        icon: "/images/x.png",
        url: "https://x.com/CodesOfAkash",
    },
];

const seoConfig = {
    title: "Velvet Pour | Premium Cocktails & Mocktails Bar in Los Angeles",
    description: "Experience the art of mixology at Velvet Pour. Premium cocktails, craft mocktails, and timeless recipes in the heart of Los Angeles. Where every detail matters - from muddle to garnish.",
    keywords: "cocktails, mocktails, bar, Los Angeles, mojito, premium drinks, craft cocktails, mixology, cocktail bar",
    author: "Velvet Pour",
    ogImage: "/images/hero-img.png",
    twitterHandle: "@CodesOfAkash",
};

const sliderLists = [
    {
        id: 1,
        name: "Classic Mojito",
        image: "/images/drink1.png",
        title: "Simple Ingredients, Bold Flavor",
        description:
            "Made with tequila, lime juice, and orange liqueur, the Margarita is easy to make and full of character. Add a salted rim for the perfect drink on summer nights.",
    },
    {
        id: 2,
        name: "Raspberry Mojito",
        image: "/images/drink2.png",
        title: "A Zesty Classic That Never Fails",
        description:
            "The Margarita is a classic that balances tangy lime, smooth tequila, and a touch of sweetness. Shaken, frozen, or on the rocks—it’s always crisp & refreshing.",
    },
    {
        id: 3,
        name: "Violet Breeze",
        image: "/images/drink3.png",
        title: "Simple Ingredients, Bold Flavor",
        description:
            "Made with tequila, lime juice, and orange liqueur, the Margarita is easy to make and full of character. Add a salted rim for the perfect drink on summer nights.",
    },
    {
        id: 4,
        name: "Curacao Mojito",
        image: "/images/drink4.png",
        title: "Crafted With Care, Poured With Love",
        description:
            "Each cocktail is made with fresh ingredients and a passion for perfecting every pour, whether you're celebrating or simply relaxing.",
    },
];

export {
    navLinks,
    cocktailLists,
    mockTailLists,
    profileLists,
    featureLists,
    goodLists,
    openingHours,
    storeInfo,
    socials,
    sliderLists,
    companyInfo,
    heroContent,
    aboutContent,
    artContent,
    cocktailsContent,
    menuContent,
    seoConfig,
};