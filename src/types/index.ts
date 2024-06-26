import React from "react";

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type IRecipe = {
    userId: string;
    name: string;
    file: File[];
    language?: string;
    mealType?: string;
    cuisineType?: string;
    regionOfCuisine?: string;
    ingredients?: string[];
    steps?: string;
  };

  export type IUpdateRecipe = {
    recipeId:string;
    name: string;
    file: File[];
    language?: string;
    mealType?: string;
    cuisineType?: string;
    regionOfCuisine?: string;
    ingredients?: string[];
    steps?: string;
    imageId: string;
    imageUrl: URL;  
    share?:ISharedUsers[]  
  };
  
  export type ISharedUsers = {
    userId: string;
    canEdit:boolean;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IContextType = {
    user:IUser;
    isLoading:boolean;
    setUser:React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated:boolean;
    setIsAuthenticated:React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser:()=>Promise<boolean>;
  }