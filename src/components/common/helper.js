import jwt_decode from "jwt-decode";

const helper = {
    checkPermission(perm) {
        let userInfo = jwt_decode(localStorage.getItem('token'));

        if(!userInfo.permissions)
            return false;
        return userInfo.permissions.some(function(el) {
            return el.name === perm;
          }); 
    }
}

export default helper