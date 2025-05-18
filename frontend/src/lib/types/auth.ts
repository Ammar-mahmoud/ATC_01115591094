export interface ILoginUser{
   email : string;
   password:string;
}

export interface ICreateUser{
   name:string;
   email:string;
   password:string;
   passwordConfirm:string;
   gender: "Male" | "Female" | ""
}


export interface SignUpResponse {
   token : string;
   data : {
      id:string;
      name : string;
      email:string;
      role:string;
   }
   message : string;
}