import { StaticImageData } from 'next/image'

import image1 from './margarita/image.png'
import recipe1 from './margarita/recipe.json'
import image2 from './mango-margarita/image.png'
import recipe2 from './mango-margarita/recipe.json'
import image3 from './paloma/image.png'
import recipe3 from './paloma/recipe.json'
import image4 from './tequila-sunrise/image.png'
import recipe4 from './tequila-sunrise/recipe.json'
import image5 from './mexican-mule/image.png'
import recipe5 from './mexican-mule/recipe.json'
import image6 from './dark-n-stormy/image.png'
import recipe6 from './dark-n-stormy/recipe.json'
import image7 from './mojito/image.png'
import recipe7 from './mojito/recipe.json'
import image8 from './pina-colada/image.png'
import recipe8 from './pina-colada/recipe.json'
import image9 from './gin-n-tonic/image.png'
import recipe9 from './gin-n-tonic/recipe.json'
import image10 from './tom-collins/image.png'
import recipe10 from './tom-collins/recipe.json'
import image11 from './moscow-mule/image.png'
import recipe11 from './moscow-mule/recipe.json'
import image12 from './tropical-dream/image.png'
import recipe12 from './tropical-dream/recipe.json'
import image13 from './espresso-martini/image.png'
import recipe13 from './espresso-martini/recipe.json'
import image14 from './mai-tai/image.png'
import recipe14 from './mai-tai/recipe.json'
import image15 from './daiquiri/image.png'
import recipe15 from './daiquiri/recipe.json'
import image16 from './aperol-spritz/image.png'
import recipe16 from './aperol-spritz/recipe.json'
import image17 from './amaretto-sour/image.png'
import recipe17 from './amaretto-sour/recipe.json'
import image18 from './porn-star-martini/image.png'
import recipe18 from './porn-star-martini/recipe.json'
import image19 from './passion-fruit-fizz/image.png'
import recipe19 from './passion-fruit-fizz/recipe.json'

export interface Recipe {
    image: StaticImageData
    data: {
        name: string
        description?: string
        ingredients: Record<string, number>
        instructions: string[]
        tips?: string[]
    }
}

export const recipes: Record<string, Recipe> = {
    margarita: {
        data: recipe1,
        image: image1,
    },
    'mango-margarita': {
        data: recipe2,
        image: image2,
    },
    paloma: {
        data: recipe3,
        image: image3,
    },
    'tequila-sunrise': {
        data: recipe4,
        image: image4,
    },
    'mexican-mule': {
        data: recipe5,
        image: image5,
    },
    'dark-n-stormy': {
        data: recipe6,
        image: image6,
    },
    mojito: {
        data: recipe7,
        image: image7,
    },
    'pina-colada': {
        data: recipe8,
        image: image8,
    },
    'gin-n-tonic': {
        data: recipe9,
        image: image9,
    },
    'tom-collins': {
        data: recipe10,
        image: image10,
    },
    'moscow-mule': {
        data: recipe11,
        image: image11,
    },
    'tropical-dream': {
        data: recipe12,
        image: image12,
    },
    'espresso-martini': {
        data: recipe13,
        image: image13,
    },
    'mai-tai': {
        data: recipe14,
        image: image14,
    },
    daiquiri: {
        data: recipe15,
        image: image15,
    },
    'aperol-spritz': {
        data: recipe16,
        image: image16,
    },
    'amaretto-sour': {
        data: recipe17,
        image: image17,
    },
    'porn-star-martini': {
        data: recipe18,
        image: image18,
    },
    'passion-fruit-fizz': {
        data: recipe19,
        image: image19,
    },
}
