import { useState } from 'react';
import * as constants from '../constants/CONSTANT';
const authApi = {
    async login(email, password) {
        let response = await fetch(constants.API_BASE_URL + "/api/auth/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const result = await response.json();
        ////.log(response)
        ////.log(result);
        if (result.success) {
            ////.log('permissions', result.permissions)

            localStorage.setItem("token", result.authToken);
           
        }
        return result;
    },

    async fetchMyImage() {
        ////.log("calling my image ");
        const token = localStorage.getItem("token");
        let response = await fetch(
          constants.API_BASE_URL + "/api/auth/myimage",
          {
            method: "GET",
            //mode: "cors",
    
            headers: {
              "Authorization": token
            }
          }
        );
        //.log('response:', response);
        if(response.status === 200){
          const fileBody = await response.blob();
          
          //.log('fileBody:', fileBody);
          return fileBody;
        }else{
          return null;
        }
        
      },


    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        window.location.href='/login';
    },
}

export default authApi
