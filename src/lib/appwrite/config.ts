import{Client, Account, Databases, Storage, Avatars} from 'appwrite';

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId:import.meta.env.VITE_APPWRITE_DATABASE,
    storageId:import.meta.env.VITE_APPWRITE_MEDIA,
    userCollectionId:import.meta.env.VITE_APPWRITE_USERS,
    recipeCollectionId:import.meta.env.VITE_APPWRITE_RECIPES,
    savesCollectionId:import.meta.env.VITE_APPWRITE_SAVES,
}

export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1');
client.setProject('65d7fde673ba4a506008');


export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
